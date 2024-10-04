import CharacterModel from '../models/character.js';
import { Comment, CommentThread } from '../models/journal.js';

// turn the format {name: 백스토리. description: 모시기} intro 백스토리: 모시기
export const extractAllValuesAndKeys = (arr) => {
    const extractedValues = {};
    const allKeys = arr
        .filter(item => !item.deleted) // Exclude soft-deleted items
        .map(item => item.name.trim()); // Extract all keys

    arr.forEach((item) => {
        if (!item.isDeleted && item.description && item.description.trim()) { // Exclude soft-deleted items and empty descriptions
            extractedValues[item.name.trim()] = item.description.trim(); // Extract key-value pairs if description is not empty
        }
    });

    return { extractedValues, allKeys };
};


export const cleanCharacterData = (characters) => {
    // Function to clean an individual character object
    const cleanSingleCharacter = (char) => {
        const cleanedChar = { ...char }; // Create a copy of the connected character

        // Remove uuid key
        delete cleanedChar.uuid;

        // Remove description if it's empty
        if (!cleanedChar.description || cleanedChar.description.trim() === "") {
            delete cleanedChar.description;
        }

        // Process the knowledge array if it exists and is not empty
        if (Array.isArray(cleanedChar.knowledge) && cleanedChar.knowledge.length > 0) {
            const { extractedValues, allKeys } = extractAllValuesAndKeys(cleanedChar.knowledge);
            cleanedChar.knowledge = extractedValues // Replace knowledge array with processed values
        } else {
            delete cleanedChar.knowledge; // Remove knowledge if empty
        }

        return cleanedChar;
    };

    // If the input is an array of characters, clean each one
    if (Array.isArray(characters)) {
        return characters.map(cleanSingleCharacter);
    }

    // If it's a single character object, clean it directly
    return cleanSingleCharacter(characters);
};
export const updateConnectedCharacterKnowledge = async (connectedCharacters) => {
    const updatedConnectedCharacters = [];

    for (let connectedCharacter of connectedCharacters) {
        if (connectedCharacter !== '') {
            // Check if includeInJournal is true before proceeding with knowledge update
            if (connectedCharacter.includeInJournal) {
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
            } else {
                updatedConnectedCharacters.push(connectedCharacter); // If includeInJournal is false, keep the original
            }
        }
    }

    return updatedConnectedCharacters; // Optionally return the updated connected characters
};



export const getCommentHistory = async (commentThreadUUID) => {
    try {
        // Step 1: Find the comment thread by UUID
        const commentThread = await CommentThread.findOne({ uuid: commentThreadUUID, isDeleted: false });

        if (!commentThread) {
            return { error: 'Comment thread not found.' };
        }

        // Step 2: Find all comments associated with the comment thread, sorted by createdAt, excluding soft-deleted comments
        const comments = await Comment.find({ commentThreadUUID, isDeleted: false }).sort({ createdAt: 1 });

        if (comments.length === 0) {
            return { error: 'No comments found for this thread.' };
        }

        // Step 3: Find the name for each comment's ownerUUID
        const commentHistory = await Promise.all(
            comments.map(async (comment) => {
                // Find the character by ownerUUID (assuming it maps to a Character)
                const character = await CharacterModel.findOne({ uuid: comment.ownerUUID });

                // Return the name and content only
                return {
                    name: character ? character.name : 'Unknown',
                    content: comment.content,
                };
            })
        );

        // Step 4: Get the last comment's ownerUUID and find their character name
        const lastComment = comments[comments.length - 1];
        const lastCharacter = await CharacterModel.findOne({ uuid: lastComment.ownerUUID });

        // Return the comment history and the name of the character who made the last comment
        return {
            commentHistory,
            previousCommentCharacterName: lastCharacter ? lastCharacter.name : 'Unknown'
        };

    } catch (error) {
        console.error('Error fetching comment history:', error);
        throw new Error('An error occurred while fetching comment history.');
    }
};

export default getCommentHistory;
