// controllers/characterController.js

import CharacterModel from '../models/character.js';

export default {

    /**
     * Get all characters for the logged-in user.
     */
    onGetAllCharactersByUser: async (req, res) => {
        try {
            const userUUID = req.user.ID; // Get userUUID from the authenticated user
            const characters = await CharacterModel.getAllCharactersByUserUUID(userUUID); // Fetch characters by userUUID
            res.status(200).json(characters);
        } catch (error) {
            console.error('Error fetching characters for the user:', error);
            res.status(500).json({ error: 'An error occurred while fetching characters.' });
        }
    },

    /**
     * Retrieve a character by UUID.
     */
    onGetCharacterByUUID: async (req, res) => {
        try {
            const { uuid } = req.params;
            const character = await CharacterModel.getCharacterByUUID(uuid);

            if (character) {
                res.status(200).json(character);
            } else {
                res.status(404).json({ error: 'Character not found.' });
            }
        } catch (error) {
            console.error(`Error fetching character with UUID ${req.params.uuid}:`, error);
            res.status(500).json({ error: 'An error occurred while fetching the character.' });
        }
    },

    /**
     * Create a new character for the logged-in user.
     */
    onCreateCharacter: async (req, res) => {
        try {
            const userUUID = req.user.ID; // Get userUUID from the authenticated user
            const { uuid, name, personaAttributes, connectedCharacters, imageSrc } = req.body;

            const existingCharacters = await CharacterModel.getAllCharactersByUserUUID(userUUID);
            const nextOrderValue = existingCharacters.length; // New character should be at the end of the list

            const character = await CharacterModel.createCharacter(

                userUUID, // Associate the character with the user
                uuid,
                name,
                personaAttributes,
                connectedCharacters,
                imageSrc,
                nextOrderValue,
            );

            res.status(201).json(character);
        } catch (error) {
            console.error('Error creating character:', error);
            res.status(500).json({ error: 'An error occurred while creating the character.' });
        }
    },

    /**
     * Update an existing character.
     */
    onUpdateCharacter: async (req, res) => {
        try {
            const updateData = req.body;
            const { uuid } = req.params
            console.log(uuid)
            const character = await CharacterModel.updateCharacter(uuid, updateData);
            if (character) {
                res.status(200).json(character);
            } else {
                res.status(404).json({ error: 'Character not found.' });
            }
        } catch (error) {
            console.error(`Error updating character with UUID ${req.body.uuid}:`, error);
            res.status(500).json({ error: 'An error occurred while updating the character.' });
        }
    },

    /**
     * Delete a character by UUID.
     */
    onDeleteCharacterByUUID: async (req, res) => {
        try {
            const { uuid } = req.params;
            const userUUID = req.user.uuid; // Get the user UUID

            // Step 1: Delete the character by its UUID
            const character = await CharacterModel.deleteCharacterByUUID(uuid);

            if (character) {
                // Step 2: Fetch the remaining characters for the user
                const remainingCharacters = await CharacterModel.getAllCharactersByUserUUID(userUUID);

                // Step 3: Reorder the remaining characters based on their current position
                await CharacterModel.reorderCharacters(remainingCharacters.map(char => char.uuid));

                res.status(200).json({ message: 'Character deleted and reordered successfully.' });
            } else {
                res.status(404).json({ error: 'Character not found.' });
            }
        } catch (error) {
            console.error(`Error deleting character with UUID ${req.params.uuid}:`, error);
            res.status(500).json({ error: 'An error occurred while deleting the character.' });
        }
    },


    /**
     * Delete all characters for the logged-in user.
     */
    onDeleteAllCharactersByUser: async (req, res) => {
        try {
            const userUUID = req.user.uuid; // Get userUUID from the authenticated user
            await CharacterModel.deleteAllCharactersByUserUUID(userUUID); // Delete characters by userUUID
            res.status(200).json({ message: 'All characters for the user deleted successfully.' });
        } catch (error) {
            console.error('Error deleting all characters for the user:', error);
            res.status(500).json({ error: 'An error occurred while deleting all characters.' });
        }
    },
    onReorderCharacters: async (req, res) => {
        try {
            const { characters } = req.body; // This will be an array of character UUIDs in the new order

            if (!characters || !Array.isArray(characters)) {
                return res.status(400).json({ error: 'Invalid character data' });
            }

            // Call the model to reorder characters
            await CharacterModel.reorderCharacters(characters);

            res.status(200).json({ message: 'Characters reordered successfully.' });
        } catch (error) {
            console.error('Error reordering characters:', error);
            res.status(500).json({ error: 'An error occurred while reordering characters.' });
        }
    },
}
