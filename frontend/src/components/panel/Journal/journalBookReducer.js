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
                    if (book.bookinfo.uuid === action.payload.journalBookUUID) {
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
                journalEntry: journalEntry
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



export default journalBookReducer;
