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

        default:
            return state;
    }
};

export default characterReducer;
