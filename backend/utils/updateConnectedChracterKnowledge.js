import CharacterModel from '../models/character.js';

const updateConnectedCharacterKnowledge = async (connectedCharacters) => {
    const updatedConnectedCharacters = [];

    for (let connectedCharacter of connectedCharacters) {
        if (connectedCharacter !== '') {
            // Find the corresponding original character from createdCharacters
            const originalCharacter = await CharacterModel.getCharacterByUUID(connectedCharacter.uuid);

            // If the corresponding character is found, update the knowledge

            if (originalCharacter && connectedCharacter.knowledge) {
                const updatedKnowledge = connectedCharacter.knowledge
                    .filter(knowledgeItem =>
                        // Filter out knowledge items that do not exist in the original character's personaAttributes
                        originalCharacter.personaAttributes.some(attr => attr.name === knowledgeItem.name)
                    )
                    .map(knowledgeItem => {
                        // Find the matching attribute in the original character's personaAttributes
                        const matchingAttribute = originalCharacter.personaAttributes.find(attr => attr.name === knowledgeItem.name);

                        // If a matching attribute is found, update the knowledge with the new data
                        return {
                            ...knowledgeItem,
                            description: matchingAttribute.description || knowledgeItem.description,
                        };
                    });

                // Update the connected character with the updated knowledge
                connectedCharacter.knowledge = updatedKnowledge;

                // Save the updated connected character to the database
                await CharacterModel.updateCharacter(connectedCharacter.uuid, { knowledge: updatedKnowledge });

                updatedConnectedCharacters.push(connectedCharacter); // Track updated characters
            } else {
                updatedConnectedCharacters.push(connectedCharacter); // If no match, keep the original
            }
        }
    }

    return updatedConnectedCharacters; // Optionally return the updated connected characters
};

export default updateConnectedCharacterKnowledge;
