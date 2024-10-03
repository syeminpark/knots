const journalBookReducer = (state, action) => {
    switch (action.type) {

        case 'INITIALIZE_JOURNALBOOKS':
            return {
                ...state,
                journalBooks: action.payload.journalBooks
            };

        case 'CREATE_JOURNAL_BOOK':
            const newJournalBook = {
                bookInfo: {
                    uuid: action.payload.uuid,
                    title: action.payload.journalBookTitle,
                    selectedMode: action.payload.selectedMode,
                    createdAt: action.payload.createdAt,
                },
                journalEntries: action.payload.selectedCharacters.map(character => ({
                    uuid: character.journalEntryUUID,
                    ownerUUID: character.uuid,
                    content: character.content,
                    commentThreads: [],
                })),
                // journalEntries: action.payload.journalEntries.map(journalEntry => ({
                //     uuid: journalEntry.uuid,
                //     ownerUUID: journalEntry.ownerUUID,
                //     content: journalEntry.content,
                //     commentThreads: [],
                // })),
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
                journalBooks: state.journalBooks.map((book) => {
                    if (book.bookInfo.uuid === action.payload.journalBookUUID) {
                        const updatedJournalEntries = book.journalEntries.filter(
                            (entry) => entry.uuid !== action.payload.journalEntryUUID
                        );

                        // If the updatedJournalEntries is empty, we can skip updating this book (keep it or not)
                        if (updatedJournalEntries.length === 0) {
                            return null; // We'll handle this case later in filter
                        }

                        return {
                            ...book,
                            journalEntries: updatedJournalEntries,
                        };
                    }
                    return book;
                }).filter(book => book !== null), // Remove books with no entries
            };

        case 'DELETE_JOURNAL_ENTRY_OWNER_UUID': {
            const ownerUUID = action.payload.ownerUUID;

            const updatedJournalBooks = state.journalBooks.map((book) => {
                const updatedJournalEntries = book.journalEntries.map((entry) => {
                    // Remove commentThreads where the ownerUUID participated
                    const updatedCommentThreads = entry.commentThreads.filter((thread) => {
                        // Check if the ownerUUID participated in this thread
                        const ownerParticipated = thread.comments.some(
                            (comment) => comment.ownerUUID === ownerUUID
                        );

                        // Include the thread only if the owner did not participate
                        return !ownerParticipated;
                    });

                    // If the journal entry itself belongs to the ownerUUID, remove the entry
                    if (entry.ownerUUID === ownerUUID) {
                        return null; // Mark this entry for removal
                    }

                    return {
                        ...entry,
                        commentThreads: updatedCommentThreads,
                    };
                }).filter(entry => entry !== null); // Remove journal entries that are null

                // If no journal entries remain in the book, remove the book
                if (updatedJournalEntries.length === 0) {
                    return null; // Mark this book for removal
                }

                return {
                    ...book,
                    journalEntries: updatedJournalEntries,
                };
            }).filter(book => book !== null); // Remove books that have no entries left

            return {
                ...state,
                journalBooks: updatedJournalBooks,
            };
        }


        case 'CREATE_COMMENT': {
            let newComment = null;
            const ownerUUID = action.payload.ownerUUID;

            const updatedJournalBooks = state.journalBooks.map((book) => {
                if (book.bookInfo.uuid === action.payload.journalBookUUID) {
                    return {
                        ...book,
                        journalEntries: book.journalEntries.map((entry) => {
                            let updatedCommentThreads = entry.commentThreads;

                            if (entry.uuid === action.payload.journalEntryUUID) {
                                // Check if the comment with the same UUID already exists
                                const commentExists = entry.commentThreads.some(thread =>
                                    thread.comments.some(comment => comment.uuid === action.payload.commentUUID)
                                );

                                if (!commentExists) {
                                    // Add a new comment to the existing thread
                                    const existingThread = entry.commentThreads.find(thread => thread.uuid === action.payload.commentThreadUUID);

                                    if (existingThread) {
                                        updatedCommentThreads = entry.commentThreads.map((thread) => {
                                            if (thread.uuid === action.payload.commentThreadUUID) {
                                                const newThreadComment = {
                                                    uuid: action.payload.commentUUID,
                                                    ownerUUID: ownerUUID,
                                                    content: action.payload.content,
                                                    createdAt: action.payload.createdAt,
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
                                        const newThreadUUID = action.payload.commentThreadUUID;
                                        const newThread = {
                                            uuid: neewThreadUUID,
                                            createdAt: action.payload.createdAt,
                                            comments: [
                                                {
                                                    uuid: action.payload.commentUUID,
                                                    ownerUUID: ownerUUID,
                                                    content: action.payload.content,
                                                    createdAt: action.payload.createdAt,
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
                                }
                            }

                            return {
                                ...entry,
                                commentThreads: updatedCommentThreads,
                            };
                        })
                    };
                }
                return book;
            });

            return {
                ...state,
                journalBooks: updatedJournalBooks,
                newComment, // The updated comment with commentThreadUUID
            };
        }

        case 'CREATE_COMMENT_BATCH': {
            const updatedJournalBooks = state.journalBooks.map((book) => {
                if (book.bookInfo.uuid === action.payload.journalBookUUID) {
                    return {
                        ...book,
                        journalEntries: book.journalEntries.map((entry) => {
                            if (entry.uuid === action.payload.journalEntryUUID) {
                                // Add the new batch of comments to the appropriate threads
                                let updatedCommentThreads = entry.commentThreads;

                                action.payload.comments.forEach((newComment) => {
                                    const existingThread = updatedCommentThreads.find(thread => thread.uuid === newComment.commentThreadUUID);

                                    if (existingThread) {
                                        updatedCommentThreads = updatedCommentThreads.map((thread) => {
                                            if (thread.uuid === newComment.commentThreadUUID) {
                                                // Check if the comment already exists
                                                const commentExists = thread.comments.some(comment => comment.uuid === newComment.commentUUID);

                                                if (!commentExists) {
                                                    return {
                                                        ...thread,
                                                        comments: [...thread.comments, newComment],
                                                    };
                                                }
                                            }
                                            return thread;
                                        });
                                    } else {
                                        // Create a new comment thread if it doesn't exist
                                        const newThread = {
                                            uuid: newComment.commentThreadUUID,
                                            createdAt: newComment.createdAt,
                                            comments: [newComment],
                                        };
                                        updatedCommentThreads = [...updatedCommentThreads, newThread];
                                    }
                                });

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
            });

            return {
                ...state,
                journalBooks: updatedJournalBooks,
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
            const updatedJournalBooks = state.journalBooks.map((book) => {
                if (book.bookInfo.uuid === action.payload.journalBookUUID) {
                    return {
                        ...book,
                        journalEntries: book.journalEntries.map((entry) => {
                            if (entry.uuid === action.payload.journalEntryUUID) {
                                const updatedCommentThreads = entry.commentThreads
                                    .map((thread) => {
                                        if (thread.uuid === action.payload.commentThreadUUID) {
                                            const updatedComments = thread.comments.filter(
                                                (comment) => comment.uuid !== action.payload.commentUUID
                                            );

                                            // If no comments remain, remove the thread
                                            if (updatedComments.length === 0) {
                                                return null; // Indicate that this thread should be removed
                                            } else {
                                                return {
                                                    ...thread,
                                                    comments: updatedComments,
                                                };
                                            }
                                        }
                                        return thread;
                                    })
                                    .filter((thread) => thread !== null); // Remove threads that are null

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
            });

            return {
                ...state,
                journalBooks: updatedJournalBooks,
            };
        }

        default:
            return state;
    }
};

// Selectors
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



export const getInteractedCharactersWithPosts = (state, characterUUID) => {
    const interactedCharacters = new Set();

    // Iterate through all journal books
    state.journalBooks.forEach((journalBook) => {
        journalBook.journalEntries.forEach((journalEntry) => {

            // 1. Check if the current character is the owner of the post (received comments).
            if (journalEntry.ownerUUID === characterUUID) {
                journalEntry.commentThreads.forEach((thread) => {
                    thread.comments.forEach((comment) => {
                        // Add all commenters who commented on this character's post.
                        if (comment.ownerUUID !== characterUUID) {
                            interactedCharacters.add(comment.ownerUUID);
                        }
                    });
                });
            }

            // 2. Check if the character has commented on other posts (sent comments).
            journalEntry.commentThreads.forEach((thread) => {
                thread.comments.forEach((comment) => {
                    if (comment.ownerUUID === characterUUID) {
                        // Add the post owner (journalEntry.ownerUUID) if they are not the commenter.
                        if (journalEntry.ownerUUID !== characterUUID) {
                            interactedCharacters.add(journalEntry.ownerUUID);
                        }

                        // Also add any other participants in the same thread who have commented.
                        thread.comments.forEach((threadComment) => {
                            if (threadComment.ownerUUID !== characterUUID) {
                                interactedCharacters.add(threadComment.ownerUUID);
                            }
                        });
                    }
                });
            });
        });
    });

    // Convert set to an array to return
    return Array.from(interactedCharacters);


};

export const getCommentExchangeCount = (state, characterUUID1, characterUUID2) => {
    const result = {
        sentComments: [], // Comments sent by characterUUID1 to characterUUID2
        receivedComments: [], // Comments received by characterUUID1 from characterUUID2
    };

    // Iterate through all journal books
    state.journalBooks.forEach((journalBook) => {
        journalBook.journalEntries.forEach((journalEntry) => {
            const isCharacter1Owner = journalEntry.ownerUUID === characterUUID1;
            const isCharacter2Owner = journalEntry.ownerUUID === characterUUID2;

            journalEntry.commentThreads.forEach((thread) => {
                let sentComments = [];
                let receivedComments = [];

                // Case 1: characterUUID1 owns the journal entry (A's post)
                if (isCharacter1Owner) {
                    thread.comments.forEach((comment) => {
                        // A received a comment from B
                        if (comment.ownerUUID === characterUUID2) {
                            receivedComments.push(comment);
                        }
                        // A sent a reply to B's comment in A's post
                        if (comment.ownerUUID === characterUUID1 && thread.comments.some(c => c.ownerUUID === characterUUID2)) {
                            sentComments.push(comment);
                        }
                    });
                }

                // Case 2: characterUUID2 owns the journal entry (B's post)
                if (isCharacter2Owner) {
                    thread.comments.forEach((comment) => {
                        // A sent a comment on B's post
                        if (comment.ownerUUID === characterUUID1) {
                            sentComments.push(comment);
                        }
                        // A received a reply from B in B's post
                        if (comment.ownerUUID === characterUUID2 && thread.comments.some(c => c.ownerUUID === characterUUID1)) {
                            receivedComments.push(comment);
                        }
                    });
                }

                // If relevant comments were found, add them to the result
                if (sentComments.length > 0 || receivedComments.length > 0) {
                    result.sentComments.push(...sentComments);
                    result.receivedComments.push(...receivedComments);
                }
            });
        });
    });

    return result;
};

export const getCommentsBetweenCharacters = (state, characterUUID1, characterUUID2) => {
    const result = [];

    // Iterate through all journal books
    state.journalBooks.forEach((journalBook) => {
        journalBook.journalEntries.forEach((journalEntry) => {
            const isCharacter1Owner = journalEntry.ownerUUID === characterUUID1;
            const isCharacter2Owner = journalEntry.ownerUUID === characterUUID2;

            journalEntry.commentThreads.forEach((thread) => {
                if (isCharacter1Owner || isCharacter2Owner) {
                    // Check if the thread includes comments from the other character
                    if (
                        (isCharacter1Owner && thread.comments.some(comment => comment.ownerUUID === characterUUID2)) ||
                        (isCharacter2Owner && thread.comments.some(comment => comment.ownerUUID === characterUUID1))
                    ) {
                        // Collect relevant comments
                        const relevantComments = thread.comments.filter(
                            comment => comment.ownerUUID === characterUUID1 || comment.ownerUUID === characterUUID2
                        );

                        // Initialize journalEntryGroups if not already
                        let journalEntryGroup = result.find(group => group.journalEntry.uuid === journalEntry.uuid);
                        if (!journalEntryGroup) {
                            journalEntryGroup = {
                                journalBookInfo: journalBook.bookInfo,
                                journalEntry: journalEntry,
                                commentThreads: []
                            };
                            result.push(journalEntryGroup);
                        }

                        // Add the thread with relevant comments
                        journalEntryGroup.commentThreads.push({
                            commentThreadUUID: thread.uuid,
                            createdAt: thread.createdAt,
                            comments: relevantComments
                        });
                    }
                }
            });
        });
    });
    console.log(result)
    return result;
};

export default journalBookReducer;
