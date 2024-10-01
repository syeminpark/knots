export function cleanCharacterData(character) {
    const cleanedCharacter = { ...character }; // Create a copy of the character object

    // Remove uuid key
    delete cleanedCharacter.uuid;

    // Remove description if it's empty
    if (!cleanedCharacter.description) {
        delete cleanedCharacter.description;
    }

    // Remove knowledge if it's empty
    if (Array.isArray(cleanedCharacter.knowledge) && cleanedCharacter.knowledge.length === 0) {
        delete cleanedCharacter.knowledge;
    }

    return cleanedCharacter;
}

// Example usage:
const character = {
    name: "빙구",
    uuid: "1c12a320-7ba0-4607-9b95-02b682ba97d8",
    description: "초롱이는 빙구를매우 싫어한다!!",
    knowledge: []
};

const cleanedCharacter = cleanCharacterData(character);
console.log(cleanedCharacter);