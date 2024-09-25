import { v4 as uuidv4 } from 'uuid';

const characterReducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_CHARACTER':
            const newCharacter = {
                uuid: action.payload.uuid,
                name: action.payload.name,
                personaAttributes: action.payload.personaAttributes,
                connectedCharacters: action.payload.connectedCharacters,
                imageSrc: action.payload.imageSrc,
            };
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
        case 'INITIALIZE_CHARACTERS': // New action to initialize characters
            return {
                ...state,
                characters: action.payload.characters,  // Set the initial characters from the payload
            };

        case 'REORDER_CHARACTERS':
            return {
                ...state,
                characters: action.payload,
            };

        case 'DELETE_CHARACTER': {
            const characterUUIDToDelete = action.payload.uuid;

            // Remove the character itself
            const updatedCharacters = state.characters.filter(
                (character) => character.uuid !== characterUUIDToDelete
            );

            // Traverse through the remaining characters to remove the deleted character from their connectedCharacters
            const charactersWithUpdatedConnections = updatedCharacters.map((character) => {
                const updatedConnectedCharacters = character.connectedCharacters.filter(
                    (connectedCharacter) => connectedCharacter.uuid !== characterUUIDToDelete
                );

                return {
                    ...character,
                    connectedCharacters: updatedConnectedCharacters,
                };
            });

            return {
                ...state,
                characters: charactersWithUpdatedConnections,
            };
        }

        default:
            return state;
    }
};

export default characterReducer;
