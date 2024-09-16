import { v4 as uuidv4 } from 'uuid';

const journalBookReducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_JOURNAL_BOOK':
            const newJournalBook = {
                id: uuidv4(),
                journalBookPrompt: action.payload.journalBookPrompt,
                selectedMode: action.payload.selectedMode,
                createdAt: Date.now(),
                selectedCharacters: action.payload.selectedCharacters,
                journalEntries: action.payload.selectedCharacters.map(characterName => ({
                    id: uuidv4(),
                    ownerName: characterName,
                    content: action.payload.journalBookPrompt,
                    commentThreads: [],
                })),
            };
            return {
                ...state,
                journalBooks: [...state.journalBooks, newJournalBook],
            };

        case 'EDIT_JOURNAL_ENTRY':
            return {
                ...state,
                journalBooks: state.journalBooks.map(book => {
                    if (book.id === action.payload.journalBookID) {
                        return {
                            ...book,
                            journalEntries: book.journalEntries.map(entry => {
                                if (entry.id === action.payload.journalEntryID) {
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
                    if (book.id === action.payload.journalBookID) {
                        return {
                            ...book,
                            journalEntries: book.journalEntries.filter(entry => entry.id !== action.payload.journalEntryID)
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
export const getJournalBookById = (state, journalBookID) =>
    state.journalBooks.find((book) => book.id === journalBookID) || null;

export const getJournalEntryByIds = (state, journalBookID, journalEntryID) => {
    const journalBook = state.journalBooks.find((book) => book.id === journalBookID);
    if (journalBook) {
        const journalEntry = journalBook.journalEntries.find((entry) => entry.id === journalEntryID);
        return journalEntry || null;
    }
    return null;
};

export const getJournalEntryFullData = (state, journalBookID, journalEntryID) => {
    const journalBook = state.journalBooks.find((book) => book.id === journalBookID);
    if (journalBook) {
        const journalEntry = journalBook.journalEntries.find((entry) => entry.id === journalEntryID);
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
