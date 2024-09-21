

import { v4 as uuidv4 } from 'uuid';
import { JournalBook, JournalEntry, CommentThread, Comment } from '../models/journal.js';

const journalController = {
    /**
     * Create a new journal book along with its entries.
     */
    createJournalBook: async (req, res) => {
        try {
            const { journalBookTitle, selectedMode, selectedCharacters, journalBookContent } = req.body;
            const userUUID = req.user.uuid; // Assuming you have user authentication

            if (!journalBookTitle || !selectedCharacters || !journalBookContent) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Create JournalBook
            const bookUUID = uuidv4();
            const journalBook = new JournalBook({
                uuid: bookUUID,
                title: journalBookTitle,
                selectedMode,
                createdAt: Date.now(),
                userUUID: userUUID, // Set userUUID to the current user's UUID
            });
            await journalBook.save();

            // Create JournalEntries for each character
            const journalEntries = selectedCharacters.map((characterUUID) => ({
                uuid: uuidv4(),
                journalBookUUID: bookUUID,
                userUUID: characterUUID,
                content: journalBookContent,
            }));
            await JournalEntry.insertMany(journalEntries);

            res.status(201).json({ message: 'Journal book created successfully', journalBook });
        } catch (error) {
            console.error('Error creating journal book:', error);
            res.status(500).json({ error: 'An error occurred while creating the journal book.' });
        }
    },

    /**
     * Edit a journal entry's content.
     */
    editJournalEntry: async (req, res) => {
        try {
            const { journalEntryUUID } = req.params;
            const { newValue } = req.body;
            const userUUID = req.user.uuid;

            // Find the journal entry
            const journalEntry = await JournalEntry.findOne({ uuid: journalEntryUUID });

            if (!journalEntry) {
                return res.status(404).json({ error: 'Journal entry not found.' });
            }

            // Verify ownership
            if (journalEntry.userUUID !== userUUID) {
                return res.status(403).json({ error: 'You are not authorized to edit this journal entry.' });
            }

            // Update the journal entry
            journalEntry.content = newValue;
            await journalEntry.save();

            res.status(200).json({ message: 'Journal entry updated successfully.', journalEntry });
        } catch (error) {
            console.error('Error editing journal entry:', error);
            res.status(500).json({ error: 'An error occurred while editing the journal entry.' });
        }
    },

    /**
     * Delete a journal entry and its related comment threads and comments.
     */
    deleteJournalEntry: async (req, res) => {
        try {
            const { journalEntryUUID } = req.params;
            const userUUID = req.user.uuid;

            const journalEntry = await JournalEntry.findOne({ uuid: journalEntryUUID });

            if (!journalEntry) {
                return res.status(404).json({ error: 'Journal entry not found.' });
            }

            // Verify ownership
            if (journalEntry.userUUID !== userUUID) {
                return res.status(403).json({ error: 'You are not authorized to delete this journal entry.' });
            }

            // Delete the journal entry
            await JournalEntry.deleteOne({ uuid: journalEntryUUID });

            // Delete related comment threads and comments
            const commentThreads = await CommentThread.find({ journalEntryUUID });
            const threadUUIDs = commentThreads.map((thread) => thread.uuid);

            await Comment.deleteMany({ commentThreadUUID: { $in: threadUUIDs } });
            await CommentThread.deleteMany({ journalEntryUUID });

            res.status(200).json({ message: 'Journal entry and related comments deleted successfully.' });
        } catch (error) {
            console.error('Error deleting journal entry:', error);
            res.status(500).json({ error: 'An error occurred while deleting the journal entry.' });
        }
    },

    /**
     * Create a new comment (either in a new thread or existing thread).
     */
    createComment: async (req, res) => {
        try {
            const {
                journalBookUUID,
                journalEntryUUID,
                userUUID, // Replaced ownerUUID with userUUID
                content,
                selectedMode,
                commentThreadUUID,
            } = req.body;

            if (!journalEntryUUID || !userUUID || !content) {
                return res.status(400).json({ error: 'Missing required fields.' });
            }

            let threadUUID = commentThreadUUID;

            if (commentThreadUUID) {
                // Existing thread
                const commentThread = await CommentThread.findOne({ uuid: commentThreadUUID });

                if (!commentThread) {
                    return res.status(404).json({ error: 'Comment thread not found.' });
                }

                // Update participantUUIDs
                if (!commentThread.participantUUIDs.includes(userUUID)) {
                    commentThread.participantUUIDs.push(userUUID);
                    await commentThread.save();
                }
            } else {
                // New thread
                threadUUID = uuidv4();
                const newCommentThread = new CommentThread({
                    uuid: threadUUID,
                    journalEntryUUID,
                    createdAt: Date.now(),
                    participantUUIDs: [userUUID],
                });
                await newCommentThread.save();
            }

            // Create the comment
            const newComment = new Comment({
                uuid: uuidv4(),
                commentThreadUUID: threadUUID,
                userUUID,
                content,
                selectedMode,
                createdAt: Date.now(),
            });
            await newComment.save();

            res.status(201).json({ message: 'Comment created successfully.', comment: newComment });
        } catch (error) {
            console.error('Error creating comment:', error);
            res.status(500).json({ error: 'An error occurred while creating the comment.' });
        }
    },

    /**
     * Edit a comment.
     */
    editComment: async (req, res) => {
        try {
            const { commentUUID } = req.params;
            const { newContent } = req.body;
            const userUUID = req.user.uuid;

            const comment = await Comment.findOne({ uuid: commentUUID });

            if (!comment) {
                return res.status(404).json({ error: 'Comment not found.' });
            }

            // Verify ownership
            if (comment.userUUID !== userUUID) {
                return res.status(403).json({ error: 'You are not authorized to edit this comment.' });
            }

            // Update the comment
            comment.content = newContent;
            comment.editedAt = Date.now();
            await comment.save();

            res.status(200).json({ message: 'Comment updated successfully.', comment });
        } catch (error) {
            console.error('Error editing comment:', error);
            res.status(500).json({ error: 'An error occurred while editing the comment.' });
        }
    },

    /**
     * Delete a comment and possibly its thread if empty.
     */
    deleteComment: async (req, res) => {
        try {
            const { commentUUID } = req.params;
            const userUUID = req.user.uuid;

            const comment = await Comment.findOne({ uuid: commentUUID });

            if (!comment) {
                return res.status(404).json({ error: 'Comment not found.' });
            }

            // Verify ownership
            if (comment.userUUID !== userUUID) {
                return res.status(403).json({ error: 'You are not authorized to delete this comment.' });
            }

            // Delete the comment
            await Comment.deleteOne({ uuid: commentUUID });

            // Check if the thread has any other comments
            const remainingComments = await Comment.find({ commentThreadUUID: comment.commentThreadUUID });

            if (remainingComments.length === 0) {
                // Delete the thread if empty
                await CommentThread.findOneAndDelete({ uuid: comment.commentThreadUUID });
            }

            res.status(200).json({ message: 'Comment deleted successfully.' });
        } catch (error) {
            console.error('Error deleting comment:', error);
            res.status(500).json({ error: 'An error occurred while deleting the comment.' });
        }
    },

    /**
     * Get all data (JournalBooks, JournalEntries, CommentThreads, Comments) for the user.
     */
    getAllData: async (req, res) => {
        try {
            const userUUID = req.user.uuid; // Get the user's UUID from the authentication middleware

            // Fetch all JournalBooks owned by the user
            const journalBooks = await JournalBook.find({ userUUID: userUUID });

            // Extract JournalBook UUIDs
            const journalBookUUIDs = journalBooks.map((book) => book.uuid);

            // Fetch JournalEntries related to these JournalBooks
            const journalEntries = await JournalEntry.find({ journalBookUUID: { $in: journalBookUUIDs } });

            // Extract JournalEntry UUIDs
            const journalEntryUUIDs = journalEntries.map((entry) => entry.uuid);

            // Fetch CommentThreads related to these JournalEntries
            const commentThreads = await CommentThread.find({ journalEntryUUID: { $in: journalEntryUUIDs } });

            // Extract CommentThread UUIDs
            const commentThreadUUIDs = commentThreads.map((thread) => thread.uuid);

            // Fetch Comments related to these CommentThreads
            const comments = await Comment.find({ commentThreadUUID: { $in: commentThreadUUIDs } });

            // Organize Comments by their CommentThread UUID
            const commentsByThreadUUID = comments.reduce((acc, comment) => {
                if (!acc[comment.commentThreadUUID]) {
                    acc[comment.commentThreadUUID] = [];
                }
                acc[comment.commentThreadUUID].push(comment);
                return acc;
            }, {});

            // Attach Comments to their respective CommentThreads
            const threadsWithComments = commentThreads.map((thread) => ({
                ...thread.toObject(),
                comments: commentsByThreadUUID[thread.uuid] || [],
            }));

            // Organize CommentThreads by their JournalEntry UUID
            const threadsByEntryUUID = threadsWithComments.reduce((acc, thread) => {
                if (!acc[thread.journalEntryUUID]) {
                    acc[thread.journalEntryUUID] = [];
                }
                acc[thread.journalEntryUUID].push(thread);
                return acc;
            }, {});

            // Attach CommentThreads to their respective JournalEntries
            const entriesWithThreads = journalEntries.map((entry) => ({
                ...entry.toObject(),
                commentThreads: threadsByEntryUUID[entry.uuid] || [],
            }));

            // Organize JournalEntries by their JournalBook UUID
            const entriesByBookUUID = entriesWithThreads.reduce((acc, entry) => {
                if (!acc[entry.journalBookUUID]) {
                    acc[entry.journalBookUUID] = [];
                }
                acc[entry.journalBookUUID].push(entry);
                return acc;
            }, {});

            // Attach JournalEntries to their respective JournalBooks
            const booksWithEntries = journalBooks.map((book) => ({
                ...book.toObject(),
                journalEntries: entriesByBookUUID[book.uuid] || [],
            }));

            res.status(200).json({ journalBooks: booksWithEntries });
        } catch (error) {
            console.error('Error fetching all data:', error);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        }
    },
};

export default journalController;