// models/character.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const characterSchema = new mongoose.Schema(
    {
        uuid: {
            type: String,
            required: true,
            unique: true,
        },
        userUUID: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        personaAttributes: {
            type: mongoose.Schema.Types.Mixed,
            required: false,
        },
        connectedCharacters: [
            {
                type: mongoose.Schema.Types.Mixed,
                required: false,
            },
        ],
        imageSrc: {
            type: mongoose.Schema.Types.Mixed,
            required: false,
        },
        order: {
            type: Number,  // New field for tracking character's position
            required: true,
            default: 0,
        },
        createdAt: { type: Date, default: Date.now },
        isDeleted: {
            type: Boolean,  // New field for soft delete
            required: true,
            default: false,
        },
        history: [
            {
                field: { type: String, required: true },
                oldValue: mongoose.Schema.Types.Mixed,
                newValue: mongoose.Schema.Types.Mixed,
                updatedAt: { type: Date, default: Date.now },
            },
        ],

        // naturalPersonaA: { type: String, default: null },  // name + personaAttributes
        // naturalPersonaB: { type: String, default: null },  // name + personaAttributes + connectedCharacters
        // lastGeneratedPersonaA: { type: Date, default: null },
        // lastGeneratedPersonaB: { type: Date, default: null },
        // lastUpdated: { type: Date, default: Date.now },


    },
    {
        collection: 'characters',
    }
);


// Static Methods

characterSchema.statics.createCharacter = async function (
    userUUID, // Add userUUID to associate the character with a user
    uuid,
    name,
    personaAttributes,
    connectedCharacters,
    imageSrc,
    order
) {
    try {
        const character = await this.create({
            userUUID, // Save userUUID in the character document
            uuid,
            name,
            personaAttributes,
            connectedCharacters,
            imageSrc,
            order
        });
        return character;
    } catch (error) {
        throw error;
    }
};
characterSchema.statics.updateCharacter = async function (uuid, update) {
    try {
        const character = await this.findOne({ uuid });

        if (!character) {
            throw new Error('Character not found.');
        }

        const historyEntries = [];

        // Compare and log changes for each field
        for (const field in update) {
            if (character[field] !== update[field]) {
                historyEntries.push({
                    field: field,
                    oldValue: character[field],
                    newValue: update[field],
                    updatedAt: Date.now(),
                });
            }
        }

        // if (update.name || update.personaAttributes) {
        //     character.lastUpdated = Date.now(),
        //         shouldUpdatePersonaA = true;
        // }
        // if (update.name || update.personaAttributes || update.connectedCharacters) {
        //     character.lastUpdated = Date.now(),
        //         shouldUpdatePersonaB = true;
        // }


        // Add the changes to the character's history if there are any
        if (historyEntries.length > 0) {
            character.history.push(...historyEntries);
        }

        // Update the character with new values
        Object.assign(character, update);

        await character.save();
        return character;
    } catch (error) {
        throw error;
    }
};


characterSchema.statics.getCharacterByUUID = async function (uuid) {
    try {
        // Find the character by UUID but ensure it's not soft-deleted
        const character = await this.findOne({ uuid, isDeleted: false });
        return character;
    } catch (error) {
        throw error;
    }
};

characterSchema.statics.getAllCharactersByUserUUID = async function (userUUID) {
    try {
        // Fetch characters for the user and exclude soft-deleted characters
        const characters = await this.find({ userUUID, isDeleted: false }).sort({ order: 1 });
        return characters;
    } catch (error) {
        throw error;
    }
};

characterSchema.statics.deleteCharacterByUUID = async function (uuid) {
    try {
        // Perform a soft delete by setting the isDeleted flag to true
        const character = await this.findOneAndUpdate(
            { uuid },
            { isDeleted: true },
            { new: true }
        );
        return character;
    } catch (error) {
        throw error;
    }
};

// Soft delete all characters for a specific user
characterSchema.statics.deleteAllCharactersByUserUUID = async function (userUUID) {
    try {
        await this.updateMany({ userUUID }, { isDeleted: true });
    } catch (error) {
        throw error;
    }
};

characterSchema.statics.reorderCharacters = async function (characters) {
    const bulkOperations = [];

    for (let index = 0; index < characters.length; index++) {
        const uuid = characters[index];
        const character = await this.findOne({ uuid, isDeleted: false });  // Exclude soft-deleted characters

        if (!character) {
            throw new Error(`Character with UUID ${uuid} not found or has been deleted.`);
        }

        // Log the order change if the order has changed
        if (character.order !== index) {
            character.history.push({
                field: 'order',
                oldValue: character.order,
                newValue: index,
                updatedAt: Date.now(),
            });

            character.order = index;

            // Bulk operation for updating the order in the database
            bulkOperations.push({
                updateOne: {
                    filter: { uuid },
                    update: { order: index, history: character.history },
                },
            });
        }
    }

    try {
        if (bulkOperations.length > 0) {
            // Perform bulk update to save the new order and history in the database
            await this.bulkWrite(bulkOperations);
        }

        // Fetch and return the newly ordered characters
        const reorderedCharacters = await this.find({ uuid: { $in: characters }, isDeleted: false }).sort({ order: 1 });
        return reorderedCharacters;

    } catch (error) {
        throw error;
    }
};


export default mongoose.model('Character', characterSchema);
