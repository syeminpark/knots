

import { v4 as uuidv4 } from 'uuid';
import { JournalBook, JournalEntry, CommentThread, Comment } from '../models/journal.js';
import { io } from '../app.js';


const journalController = {
    /**
     * Create a new journal book along with its entries.
     */
    createJournalBook: async (req, res) => {
        try {
            const { uuid, journalBookTitle, journalBookContent, selectedMode, selectedCharacters, createdAt } = req.body;
            const userUUID = req.user.ID; // Assuming you have user authentication

            if (!journalBookTitle || !selectedCharacters || !journalBookContent) {
                // console.log(journalBookTitle, selectedCharacters, journalBookContent)
                return res.status(400).json({ error: 'Missing required fields' });

            }

            // Create JournalBook
            const journalBook = new JournalBook({
                uuid: uuid,
                title: journalBookTitle,
                selectedMode,
                createdAt: createdAt,
                userUUID: userUUID, // Set userUUID to the current user's UUID
            });
            await journalBook.save();

            // Create JournalEntries for each character
            const journalEntries = selectedCharacters.map((character) => ({
                uuid: character.journalEntryUUID,
                journalBookUUID: uuid,
                ownerUUID: character.uuid,
                userUUID: userUUID,
                content: journalBookContent,

            }));
            await JournalEntry.insertMany(journalEntries);

            io.emit('journalBookCreated', { journalBook, journalEntries });

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

            const journalEntry = await JournalEntry.findOne({ uuid: journalEntryUUID });

            if (!journalEntry) {
                return res.status(404).json({ error: 'Journal entry not found.' });
            }

            // Add previous content to the history array
            journalEntry.history.push({
                previousContent: journalEntry.content,
                editedAt: journalEntry.createdAt,
            });

            // Update the journal entry
            journalEntry.content = newValue;
            await journalEntry.save();

            io.emit('journalEntryUpdated', journalEntry);

            res.status(200).json({ message: 'Journal entry updated successfully.', journalEntry });
        } catch (error) {
            console.error('Error editing journal entry:', error);
            res.status(500).json({ error: 'An error occurred while editing the journal entry.' });
        }
    },


    deleteJournalEntry: async (req, res) => {
        try {
            const { journalEntryUUID } = req.params;

            // Step 1: Find the journal entry by its UUID
            const journalEntry = await JournalEntry.findOne({ uuid: journalEntryUUID });

            if (!journalEntry) {
                return res.status(404).json({ error: 'Journal entry not found.' });
            }

            // Step 2: Soft delete the journal entry
            journalEntry.isDeleted = true;
            await journalEntry.save();

            // Step 3: Soft delete related comment threads and comments
            await CommentThread.updateMany({ journalEntryUUID }, { isDeleted: true });
            await Comment.updateMany({ commentThreadUUID: { $in: journalEntryUUID } }, { isDeleted: true });

            // Step 4: Check if the related JournalBook has any remaining non-deleted entries
            const journalBookUUID = journalEntry.journalBookUUID;
            const remainingEntries = await JournalEntry.find({ journalBookUUID: journalBookUUID, isDeleted: false });

            // Step 5: If no remaining non-deleted entries, soft delete the JournalBook
            if (remainingEntries.length === 0) {
                await JournalBook.findOneAndUpdate(
                    { uuid: journalBookUUID },
                    { isDeleted: true }
                );
            }

            io.emit('journalEntryDeleted', { journalEntryUUID, journalBookUUID });

            res.status(200).json({ message: 'Journal entry, related comments, and possibly journal book soft deleted successfully.' });
        } catch (error) {
            console.error('Error deleting journal entry:', error);
            res.status(500).json({ error: 'An error occurred while deleting the journal entry.' });
        }
    },


    deleteAllJournalEntriesByOwnerUUID: async (req, res) => {
        try {
            const { ownerUUID } = req.params;


            // Step 1: Find all journal entries belonging to the ownerUUID that are not soft-deleted
            const journalEntries = await JournalEntry.find({ ownerUUID: ownerUUID, isDeleted: false });

            // Step 2: Soft delete all journal entries for the ownerUUID
            if (journalEntries.length > 0) {
                await JournalEntry.updateMany({ ownerUUID: ownerUUID }, { isDeleted: true });

                // Step 3: Soft delete all associated comment threads and comments
                const journalEntryUUIDs = journalEntries.map(entry => entry.uuid);

                // Soft delete related comment threads
                await CommentThread.updateMany({ journalEntryUUID: { $in: journalEntryUUIDs } }, { isDeleted: true });

                // Soft delete related comments in those threads
                const commentThreads = await CommentThread.find({ journalEntryUUID: { $in: journalEntryUUIDs }, isDeleted: false });
                const commentThreadUUIDs = commentThreads.map(thread => thread.uuid);
                await Comment.updateMany({ commentThreadUUID: { $in: commentThreadUUIDs } }, { isDeleted: true });

                io.emit('journalEntriesDeleted', { ownerUUID });

                // Step 5: Check if any journal books associated with the journal entries should also be soft deleted
                const journalBooks = await JournalBook.find({ uuid: { $in: journalEntries.map(entry => entry.journalBookUUID) }, isDeleted: false });

                for (let journalBook of journalBooks) {
                    const activeEntries = await JournalEntry.find({ journalBookUUID: journalBook.uuid, isDeleted: false });

                    // If no active entries remain, soft delete the journal book
                    if (activeEntries.length === 0) {
                        journalBook.isDeleted = true;
                        await journalBook.save();
                    }
                }
            }

            // Step 4: Soft delete all comments authored by the ownerUUID (character) across all threads
            await Comment.updateMany({ ownerUUID: ownerUUID }, { isDeleted: true });

            res.status(200).json({ message: 'All journal entries, comments authored by the character, related comments, and empty journal books soft deleted successfully.' });
        } catch (error) {
            console.error('Error deleting journal entries by ownerUUID:', error);
            res.status(500).json({ error: 'An error occurred while deleting journal entries and comments.' });
        }
    },

    createComment: async (req, res) => {
        try {
            const {
                journalEntryUUID,
                ownerUUID,
                content,
                selectedMode,
                commentThreadUUID,
                commentUUID,
                createdAt,
            } = req.body;
            const userUUID = req.user.ID;

            // Fetch the journal entry to retrieve the journalBookUUID
            const journalEntry = await JournalEntry.findOne({ uuid: journalEntryUUID });
            if (!journalEntry) {
                return res.status(404).json({ error: 'Journal entry not found.' });
            }
            const journalBookUUID = journalEntry.journalBookUUID;

            let commentThread;
            let isNewThread = false; // Flag to check if a new thread was created

            // Check if the comment thread already exists
            commentThread = await CommentThread.findOne({ uuid: commentThreadUUID });
            if (!commentThread) {
                // If the thread doesn't exist, create a new thread
                commentThread = new CommentThread({
                    uuid: commentThreadUUID,
                    journalEntryUUID,
                    userUUID,
                    createdAt,
                });
                await commentThread.save();
                isNewThread = true; // Mark as a new thread
            }

            // Create the comment
            const newComment = new Comment({
                uuid: commentUUID,
                commentThreadUUID: commentThread.uuid, // Use the full thread's UUID
                userUUID,
                ownerUUID,
                content,
                selectedMode,
                createdAt,
            });
            await newComment.save();

            // If a new thread was created, emit the thread along with the comment

            // Emit the full commentThread object along with the new comment
            io.emit('commentCreated', { journalEntry, newComment });


            res.status(201).json({ message: 'Comment created successfully.', comment: newComment });
        } catch (error) {
            console.error('Error creating comment:', error);
            res.status(500).json({ error: 'An error occurred while creating the comment.' });
        }
    },


    editComment: async (req, res) => {
        try {
            const { commentUUID } = req.params;
            const { newContent } = req.body;
            const userUUID = req.user.ID; // Assuming you have the user ID from authentication

            const comment = await Comment.findOne({ uuid: commentUUID });

            if (!comment) {
                return res.status(404).json({ error: 'Comment not found.' });
            }

            // Add previous content to the history array
            comment.history.push({
                previousContent: comment.content,
                editedAt: comment.createdAt,
            });

            // Update the comment
            comment.content = newContent;
            await comment.save();

            // Fetch the journal entry to retrieve the journalBookUUID
            const commentThread = await CommentThread.findOne({ uuid: comment.commentThreadUUID });
            const journalEntry = await JournalEntry.findOne({ uuid: commentThread.journalEntryUUID });

            io.emit('commentUpdated', { journalEntry, comment });

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
            const comment = await Comment.findOne({ uuid: commentUUID });

            if (!comment) {
                return res.status(404).json({ error: 'Comment not found.' });
            }

            // Soft delete the comment
            comment.isDeleted = true;
            await comment.save();

            // Fetch the journal entry to retrieve the journalBookUUID
            const commentThread = await CommentThread.findOne({ uuid: comment.commentThreadUUID });
            const journalEntry = await JournalEntry.findOne({ uuid: commentThread.journalEntryUUID });

            io.emit('commentDeleted', { journalEntry, comment });

            // Check if the thread has any other comments that are not soft-deleted
            const remainingComments = await Comment.find({ commentThreadUUID: comment.commentThreadUUID, isDeleted: false });

            if (remainingComments.length === 0) {
                // Soft delete the thread if no active comments
                await CommentThread.findOneAndUpdate({ uuid: comment.commentThreadUUID }, { isDeleted: true });
            }

            res.status(200).json({ message: 'Comment soft deleted successfully.' });
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
            const userUUID = req.user.ID; // Get the user's UUID from the authentication middleware

            // Step 1: Fetch all JournalBooks owned by the user and not soft-deleted
            const journalBooks = await JournalBook.find({ userUUID: userUUID, isDeleted: false });

            // Extract JournalBook UUIDs
            const journalBookUUIDs = journalBooks.map((book) => book.uuid);

            // Step 2: Fetch JournalEntries related to these JournalBooks and not soft-deleted
            const journalEntries = await JournalEntry.find({ journalBookUUID: { $in: journalBookUUIDs }, isDeleted: false });

            // Extract JournalEntry UUIDs
            const journalEntryUUIDs = journalEntries.map((entry) => entry.uuid);

            // Step 3: Fetch CommentThreads related to these JournalEntries and not soft-deleted
            const commentThreads = await CommentThread.find({ journalEntryUUID: { $in: journalEntryUUIDs }, isDeleted: false });

            // Extract CommentThread UUIDs
            const commentThreadUUIDs = commentThreads.map((thread) => thread.uuid);

            // Step 4: Fetch Comments related to these CommentThreads and not soft-deleted
            const comments = await Comment.find({ commentThreadUUID: { $in: commentThreadUUIDs }, isDeleted: false });

            // Step 5: Organize Comments by their CommentThread UUID
            const commentsByThreadUUID = comments.reduce((acc, comment) => {
                if (!acc[comment.commentThreadUUID]) {
                    acc[comment.commentThreadUUID] = [];
                }
                acc[comment.commentThreadUUID].push(comment);
                return acc;
            }, {});

            // Step 6: Attach Comments to their respective CommentThreads
            const threadsWithComments = commentThreads.map((thread) => ({
                ...thread.toObject(),
                comments: commentsByThreadUUID[thread.uuid] || [], // Attach comments to threads
            }));

            // Step 7: Organize CommentThreads by their JournalEntry UUID
            const threadsByEntryUUID = threadsWithComments.reduce((acc, thread) => {
                if (!acc[thread.journalEntryUUID]) {
                    acc[thread.journalEntryUUID] = [];
                }
                acc[thread.journalEntryUUID].push(thread);
                return acc;
            }, {});

            // Step 8: Attach CommentThreads to their respective JournalEntries
            const entriesWithThreads = journalEntries.map((entry) => ({
                ...entry.toObject(),
                commentThreads: threadsByEntryUUID[entry.uuid] || [], // Attach threads to entries
            }));

            // Step 9: Organize JournalEntries by their JournalBook UUID
            const entriesByBookUUID = entriesWithThreads.reduce((acc, entry) => {
                if (!acc[entry.journalBookUUID]) {
                    acc[entry.journalBookUUID] = [];
                }
                acc[entry.journalBookUUID].push(entry);
                return acc;
            }, {});

            // Step 10: Attach JournalEntries to their respective JournalBooks
            const booksWithEntries = journalBooks.map((book) => ({
                bookInfo: {
                    uuid: book.uuid,
                    title: book.title,
                    selectedMode: book.selectedMode,
                    createdAt: book.createdAt,
                },
                journalEntries: entriesByBookUUID[book.uuid] || [], // Attach entries to books
            }));

            // Return the final structure of journal books
            res.status(200).json({ journalBooks: booksWithEntries });
        } catch (error) {
            console.error('Error fetching all data:', error);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        }
    }


};

export default journalController;
