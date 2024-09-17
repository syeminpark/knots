import { v4 as uuidv4 } from 'uuid';

const journalBookReducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_JOURNAL_BOOK':
            const newJournalBook = {
                uuid: uuidv4(),
                journalBookPrompt: action.payload.journalBookPrompt,
                selectedMode: action.payload.selectedMode,
                createdAt: Date.now(),
                journalEntries: action.payload.selectedCharacters.map(character => ({
                    uuid: uuidv4(),
                    ownerUUID: character.uuid,
                    content: action.payload.journalBookPrompt,
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
                    if (book.uuid === action.payload.journalBookUUID) {
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
                    if (book.uuid === action.payload.journalBookUUID) {
                        return {
                            ...book,
                            journalEntries: book.journalEntries.filter(entry => entry.uuid !== action.payload.journalEntryUUID)
                        };
                    }
                    return book;
                })
            };
        default:
            return state;
    }
};

// Selectors
export const getJournalBookById = (state, journalBookUUID) =>
    state.journalBooks.find((book) => book.uuid === journalBookUUID) || null;

export const getJournalEntryByIds = (state, journalBookUUID, journalEntryUUID) => {
    const journalBook = state.journalBooks.find((book) => book.uuid === journalBookUUID);
    if (journalBook) {
        const journalEntry = journalBook.journalEntries.find((entry) => entry.uuid === journalEntryUUID);
        return journalEntry || null;
    }
    return null;
};

export const getJournalEntryFullData = (state, journalBookUUID, journalEntryUUID) => {
    const journalBook = state.journalBooks.find((book) => book.uuid === journalBookUUID);
    if (journalBook) {
        const journalEntry = journalBook.journalEntries.find((entry) => entry.uuid === journalEntryUUID);
        if (journalEntry) {
            // Return the full data
            return {
                journalBookPrompt: journalBook.journalBookPrompt,
                selectedMode: journalBook.selectedMode,
                createdAt: journalBook.createdAt,
                journalEntryContent: journalEntry.content,
            };
        }
    }
    return null; // Return null if not found
};

export default journalBookReducer;
