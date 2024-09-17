import { v4 as uuidv4 } from 'uuid';

const characterReducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_CHARACTER':
            const newCharacter = {
                uuid: uuidv4(),
                name: action.payload.name,
                personaAttributes: action.payload.personaAttributes,
                connectedCharacters: action.payload.connectedCharacters,
                imageSrc: action.payload.imageSrc,
                createdJournals: [],
                createdComments: [],
            }
            return {
                ...state,
                characters: [...state.characters, newCharacter],
            };

        case 'EDIT_CREATED_CHARACTER':
            return {
                ...state,
                characters: state.characters.map((character) =>
                    character.uuid === action.payload.uuid
                        ? {
                            ...character,
                            name: action.payload.name || character.name,
                            personaAttributes: action.payload.personaAttributes || character.personaAttributes,
                            connectedCharacters: action.payload.connectedCharacters || character.connectedCharacters,
                            imageSrc: action.payload.imageSrc || character.imageSrc
                        }
                        : character
                ),
            };
        case 'CREATE_NEW_JOURNAL':
            return {
                ...state,
                characters: state.characters.map((character) => {
                    if (character.uuid === action.payload.characterUUID) {
                        const newJournal = {
                            journalBookUUID: action.payload.ournalBookUUID,
                            journalBookPrompt: action.payload.journalBookPrompt,
                            selectedMode: action.payload.selectedMode,
                            createdAt: action.payload.createdAt,
                            journalEntryUUID: action.payload.journalEntryUUID,
                            journalEntryContent: action.payload.journalBookPrompt,
                        };

                        // Add the new journal to the character's createdJournals array
                        return {
                            ...character,
                            createdJournals: [...character.createdJournals, newJournal],
                        };
                    }
                    return character;
                }),
            };

        default:
            return state;
    }


}
export default characterReducer