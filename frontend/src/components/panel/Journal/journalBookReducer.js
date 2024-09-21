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
            const ownerUUID = action.payload.ownerUUID;
            const participantIndex = { ...state.participantIndex }; // Clone the participantIndex

            // Ensure participantIndex[ownerUUID] is initialized as a Set
            if (!participantIndex[ownerUUID]) {
                participantIndex[ownerUUID] = new Set();
            }

            const updatedJournalBooks = state.journalBooks.map((book) => {
                if (book.bookInfo.uuid === action.payload.journalBookUUID) {
                    return {
                        ...book,
                        journalEntries: book.journalEntries.map((entry) => {
                            if (entry.uuid === action.payload.journalEntryUUID) {
                                let updatedCommentThreads = entry.commentThreads;

                                if (action.payload.commentThreadUUID) {
                                    // Add a new comment to the existing thread
                                    updatedCommentThreads = entry.commentThreads.map((thread) => {
                                        if (thread.uuid === action.payload.commentThreadUUID) {
                                            const newThreadComment = {
                                                uuid: uuidv4(),
                                                ownerUUID: ownerUUID,
                                                content: action.payload.content,
                                                createdAt: Date.now(),
                                                selectedMode: action.payload.selectedMode,
                                            };
                                            newComment = {
                                                ...newThreadComment,
                                                commentThreadUUID: thread.uuid, // Set commentThreadUUID here
                                            };

                                            // Update participantIndex
                                            participantIndex[ownerUUID].add(thread.uuid);

                                            const updatedParticipantUUIDs = new Set(thread.participantUUIDs || []);
                                            updatedParticipantUUIDs.add(ownerUUID);

                                            return {
                                                ...thread,
                                                comments: [...thread.comments, newThreadComment],
                                                participantUUIDs: Array.from(updatedParticipantUUIDs),
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
                                        participantUUIDs: [ownerUUID], // Initialize participantUUIDs with ownerUUID
                                        comments: [
                                            {
                                                uuid: uuidv4(),
                                                ownerUUID: ownerUUID,
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

                                    // Update participantIndex
                                    participantIndex[ownerUUID].add(newThreadUUID);
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
            });

            return {
                ...state,
                journalBooks: updatedJournalBooks,
                participantIndex, // Update participantIndex in the state
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
            const participantIndex = { ...state.participantIndex }; // Clone the participantIndex

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

                                            // Update participantUUIDs
                                            const updatedParticipantUUIDs = new Set();
                                            updatedComments.forEach((comment) => {
                                                updatedParticipantUUIDs.add(comment.ownerUUID);
                                            });

                                            // If no comments remain, remove the thread
                                            if (updatedComments.length === 0) {
                                                // Remove thread from participantIndex for all participants
                                                Object.keys(participantIndex).forEach((participantUUID) => {
                                                    participantIndex[participantUUID].delete(thread.uuid);
                                                    // If the participant has no other threads, remove them from the index
                                                    if (participantIndex[participantUUID].size === 0) {
                                                        delete participantIndex[participantUUID];
                                                    }
                                                });
                                                return null; // Indicate that this thread should be removed
                                            } else {
                                                // Update participantIndex for participants who no longer have comments in this thread
                                                const previousParticipants = new Set(thread.participantUUIDs);
                                                updatedParticipantUUIDs.forEach((uuid) => previousParticipants.delete(uuid));
                                                previousParticipants.forEach((participantUUID) => {
                                                    participantIndex[participantUUID].delete(thread.uuid);
                                                    if (participantIndex[participantUUID].size === 0) {
                                                        delete participantIndex[participantUUID];
                                                    }
                                                });

                                                return {
                                                    ...thread,
                                                    comments: updatedComments,
                                                    participantUUIDs: Array.from(updatedParticipantUUIDs),
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
                participantIndex, // Update participantIndex in the state
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
    const journalBook = state.journalBooks.find(
        (book) => book.bookInfo.uuid === journalBookUUID
    );
    return journalBook?.journalEntries.find((entry) => entry.uuid === journalEntryUUID) || null;
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
    const journalEntry = getJournalEntryByIds(state, journalBookUUID, journalEntryUUID);
    if (journalEntry) {
        const organizedComments = {};
        journalEntry.commentThreads.forEach((thread) => {
            organizedComments[thread.uuid] = thread.comments;
        });
        return organizedComments;
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

const createThreadIndex = (state) => {
    const threadIndex = {};
    state.journalBooks.forEach((journalBook) => {
        journalBook.journalEntries.forEach((journalEntry) => {
            journalEntry.commentThreads.forEach((thread) => {
                threadIndex[thread.uuid] = {
                    thread,
                    journalEntry,
                    journalBookInfo: journalBook.bookInfo,
                };
            });
        });
    });
    return threadIndex;
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
export const getCommentsBetweenCharacters = (state, characterUUID1, characterUUID2) => {
    const result = [];
    const participantIndex = state.participantIndex;

    // Get the sets of thread UUIDs for each character
    const threadsForChar1 = participantIndex[characterUUID1] || new Set();
    const threadsForChar2 = participantIndex[characterUUID2] || new Set();

    // Create a thread index for efficient access
    const threadIndex = createThreadIndex(state);

    // Combine both sets of threads to include both characters' threads
    const combinedThreads = new Set([...threadsForChar1, ...threadsForChar2]);

    // Create an intermediate structure to group by journalEntryUUID
    const journalEntryGroups = {};

    // For each thread, retrieve the comments where either character has commented
    combinedThreads.forEach((threadUUID) => {
        const threadData = threadIndex[threadUUID];
        if (threadData) {
            const { thread, journalEntry, journalBookInfo } = threadData;

            // Collect comments from both characters
            const commentsBetweenCharacters = thread.comments.filter(
                (comment) =>
                    comment.ownerUUID === characterUUID1 || comment.ownerUUID === characterUUID2
            );

            if (commentsBetweenCharacters.length > 0) {
                // If this journal entry has not been added to the result yet, initialize it
                if (!journalEntryGroups[journalEntry.uuid]) {
                    journalEntryGroups[journalEntry.uuid] = {
                        journalEntryInfo: journalEntry,
                        journalBookInfo: journalBookInfo,
                        commentThreads: []
                    };
                }

                // Add this thread and its comments to the grouped entry
                journalEntryGroups[journalEntry.uuid].commentThreads.push({
                    commentThreadUUID: thread.uuid,
                    createdAt: thread.createdAt,
                    comments: commentsBetweenCharacters
                });
            }
        }
    });

    // Convert the grouped journal entries into an array of results
    return Object.values(journalEntryGroups);
};



export const getCommentExchangeHistory = (state, characterUUID, otherCharacterUUID) => {
    const result = [];
    const participantIndex = state.participantIndex;


    // Get the set of thread UUIDs for the given character
    const threadsForChar = participantIndex[characterUUID] || new Set();
    console.log(threadsForChar)

    // Create a thread index for efficient access
    const threadIndex = createThreadIndex(state);

    // For each thread that the character has participated in
    threadsForChar.forEach((threadUUID) => {
        const threadData = threadIndex[threadUUID];
        if (threadData) {
            const { thread, journalEntry, journalBookInfo } = threadData;

            // Check if the other character is also a participant in this thread or has commented
            const hasOtherCharacterCommented = thread.comments.some(
                (comment) => comment.ownerUUID === otherCharacterUUID
            );

            if (hasOtherCharacterCommented) {
                // Collect comments from both characters
                const commentsBetweenCharacters = thread.comments.filter(
                    (comment) =>
                        comment.ownerUUID === characterUUID || comment.ownerUUID === otherCharacterUUID
                );

                if (commentsBetweenCharacters.length > 0) {
                    result.push({
                        journalBookInfo,
                        journalEntryInfo: journalEntry,
                        commentThreadUUID: thread.uuid,
                        comments: commentsBetweenCharacters,
                    });
                }
            }
        }
    });

    return result;
};




export default journalBookReducer;