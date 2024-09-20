import { v4 as uuidv4 } from 'uuid';

const journalBookReducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_JOURNAL_BOOK':
            const newJournalBook = {
                bookInfo: {
                    uuid: uuidv4(),
                    title: action.payload.journalBookTitle,
                    selectedMode: action.payload.selectedMode,
                    createdAt: Date.now(),
                },
                journalEntries: action.payload.selectedCharacters.map(character => ({
                    uuid: uuidv4(),
                    ownerUUID: character.uuid,
                    content: action.payload.journalBookContent,
                    commentThreads: [],
                })),
            };
            return {
                ...state,
                journalBooks: [...state.journalBooks, newJournalBook],
                lastCreatedJournalBook: newJournalBook,
            };
        case 'EDIT_JOURNAL_ENTRY':
            return {
                ...state,
                journalBooks: state.journalBooks.map(book => {
                    if (book.bookInfo.uuid === action.payload.journalBookUUID) {
                        return {
                            ...book,
                            journalEntries: book.journalEntries.map(entry => {
                                if (entry.uuid === action.payload.journalEntryUUID) {
                                    return {
                                        ...entry,
                                        content: action.payload.newValue
                                    };
                                }
                                return entry;
                            })
                        };
                    }
                    return book;
                })
            };

        case 'DELETE_JOURNAL_ENTRY':
            return {
                ...state,
                journalBooks: state.journalBooks.map(book => {
                    if (book.bookInfo.uuid === action.payload.journalBookUUID) {
                        return {
                            ...book,
                            journalEntries: book.journalEntries.filter(entry => entry.uuid !== action.payload.journalEntryUUID)
                        };
                    }
                    return book;
                })
            };
        case 'CREATE_COMMENT': {
            let newComment = null;
            let commentThreadUUID = null;

            return {
                ...state,
                journalBooks: state.journalBooks.map((book) => {
                    if (book.bookInfo.uuid === action.payload.journalBookUUID) {
                        return {
                            ...book,
                            journalEntries: book.journalEntries.map((entry) => {
                                if (entry.uuid === action.payload.journalEntryUUID) {
                                    let updatedCommentThreads = entry.commentThreads;

                                    if (action.payload.commentThreadUUID) {
                                        // Add a new comment to the existing thread
                                        updatedCommentThreads = entry.commentThreads.map(thread => {
                                            if (thread.uuid === action.payload.commentThreadUUID) {
                                                const newThreadComment = {
                                                    uuid: uuidv4(),
                                                    ownerUUID: action.payload.ownerUUID,
                                                    content: action.payload.content,
                                                    createdAt: Date.now(),
                                                    selectedMode: action.payload.selectedMode,
                                                };
                                                newComment = {
                                                    ...newThreadComment,
                                                    commentThreadUUID: thread.uuid, // Set commentThreadUUID here
                                                };
                                                return {
                                                    ...thread,
                                                    comments: [...thread.comments, newThreadComment],
                                                };
                                            }
                                            return thread;
                                        });
                                    } else {
                                        // Create a new comment thread
                                        const newThreadUUID = uuidv4();
                                        const newThread = {
                                            uuid: newThreadUUID,
                                            createdAt: Date.now(),
                                            comments: [
                                                {
                                                    uuid: uuidv4(),
                                                    ownerUUID: action.payload.ownerUUID,
                                                    content: action.payload.content,
                                                    createdAt: Date.now(),
                                                    selectedMode: action.payload.selectedMode,
                                                },
                                            ],
                                        };
                                        newComment = {
                                            ...newThread.comments[0],
                                            commentThreadUUID: newThreadUUID, // Set commentThreadUUID here
                                        };
                                        updatedCommentThreads = [...entry.commentThreads, newThread];
                                    }

                                    return {
                                        ...entry,
                                        commentThreads: updatedCommentThreads,
                                    };
                                }
                                return entry;
                            }),
                        };
                    }
                    return book;
                }),
                newComment, // The updated comment with commentThreadUUID
            };
        }
        case 'EDIT_COMMENT': {
            return {
                ...state,
                journalBooks: state.journalBooks.map(book => {
                    if (book.bookInfo.uuid === action.payload.journalBookUUID) {
                        return {
                            ...book,
                            journalEntries: book.journalEntries.map(entry => {
                                if (entry.uuid === action.payload.journalEntryUUID) {
                                    return {
                                        ...entry,
                                        commentThreads: entry.commentThreads.map(thread => {
                                            if (thread.uuid === action.payload.commentThreadUUID) {
                                                return {
                                                    ...thread,
                                                    comments: thread.comments.map(comment => {
                                                        if (comment.uuid === action.payload.commentUUID) {
                                                            return {
                                                                ...comment,
                                                                content: action.payload.newContent,
                                                                editedAt: Date.now(), // Track when the comment was edited
                                                            };
                                                        }
                                                        return comment;
                                                    }),
                                                };
                                            }
                                            return thread;
                                        }),
                                    };
                                }
                                return entry;
                            }),
                        };
                    }
                    return book;
                }),
            };
        }

        case 'DELETE_COMMENT': {
            return {
                ...state,
                journalBooks: state.journalBooks.map(book => {
                    if (book.bookInfo.uuid === action.payload.journalBookUUID) {
                        return {
                            ...book,
                            journalEntries: book.journalEntries.map(entry => {
                                if (entry.uuid === action.payload.journalEntryUUID) {
                                    return {
                                        ...entry,
                                        commentThreads: entry.commentThreads.map(thread => {
                                            if (thread.uuid === action.payload.commentThreadUUID) {
                                                return {
                                                    ...thread,
                                                    comments: thread.comments.filter(comment => comment.uuid !== action.payload.commentUUID),
                                                };
                                            }
                                            return thread;
                                        }),
                                    };
                                }
                                return entry;
                            }),
                        };
                    }
                    return book;
                }),
            };
        }

        default:
            return state;
    }
};

// Selectors

export const getJournalBookById = (state, journalBookUUID) =>
    state.journalBooks.find((book) => book.bookInfo.uuid === journalBookUUID) || null;

export const getJournalEntryByIds = (state, journalBookUUID, journalEntryUUID) => {
    const journalBook = state.journalBooks.find((book) => book.bookInfo.uuid === journalBookUUID);
    if (journalBook) {
        const journalEntry = journalBook.journalEntries.find((entry) => entry.uuid === journalEntryUUID);
        return journalEntry || null;
    }
    return null;
};

export const getJournalBookInfoAndEntryByIds = (state, journalBookUUID, journalEntryUUID) => {
    const journalBook = state.journalBooks.find((book) => book.bookInfo.uuid === journalBookUUID);
    if (journalBook) {
        const journalEntry = journalBook.journalEntries.find((entry) => entry.uuid === journalEntryUUID);
        if (journalEntry) {
            return {
                bookInfo: journalBook.bookInfo,
                journalEntry: journalEntry,
            };
        }
    }
    return null;
};

export const getJournalsByCharacterUUID = (state, characterUUID) => {
    const result = [];
    state.journalBooks.forEach((journalBook) => {
        const characterJournalEntries = journalBook.journalEntries.filter(
            (entry) => entry.ownerUUID === characterUUID
        );
        characterJournalEntries.forEach((journalEntry) => {
            result.push({
                bookInfo: journalBook.bookInfo,
                journalEntry: journalEntry,
            });
        });
    });
    return result;
};

export const getCommentsByThread = (state, journalBookUUID, journalEntryUUID) => {
    const journalBook = state.journalBooks.find((book) => book.bookInfo.uuid === journalBookUUID);
    if (journalBook) {
        const journalEntry = journalBook.journalEntries.find((entry) => entry.uuid === journalEntryUUID);
        if (journalEntry) {
            const organizedComments = {};
            journalEntry.commentThreads.forEach((thread) => {
                organizedComments[thread.uuid] = thread.comments;
            });
            return organizedComments;
        }
    }
    return null;
};

export const getCommentThreadById = (state, journalBookUUID, journalEntryUUID, commentThreadUUID) => {
    const journalBook = state.journalBooks.find((book) => book.bookInfo.uuid === journalBookUUID);
    if (journalBook) {
        const journalEntry = journalBook.journalEntries.find((entry) => entry.uuid === journalEntryUUID);
        if (journalEntry) {
            return journalEntry.commentThreads.find(thread => thread.uuid === commentThreadUUID) || null;
        }
    }
    return null;
};

export default journalBookReducer;