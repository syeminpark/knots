import openAI from "../utils/openAI.js";
import CharacterModel from "../models/character.js";
import { getAttributes, getConnections, getBasePrompt } from "../utils/prompts.js";
import JournalModel from "../models/journal.js"

const llmController = {
    onCreateJournalEntries: async (req, res) => {
        try {
            const { characterUUIDs, journalTitle } = req.body;
            const journalEntries = [];


            // Fetch characters and generate journal entries concurrently
            const characterPromises = characterUUIDs.map(async (uuid) => {
                try {
                    const character = await CharacterModel.getCharacterByUUID(uuid);
                    if (character) {
                        console.log(character.connectedCharacters)
                        const systemPrompt = `
                            ${getBasePrompt(character)}
                            ${getAttributes(character)}
                            ${getConnections(character.name, character.connectedCharacters)},

                            Show your brillance at method acting by writing a journal with the persona and style of ${character.name}. The topic of journal will be provided within the <topic></topic> tag. The journal
                            should be in Korean and not include dates. 
                        `;

                        console.log(systemPrompt)

                        const userPrompt = `<topic> ${journalTitle}</topic>
                        `
                        const response = await openAI.chat.completions.create({
                            messages: [
                                { role: "system", content: systemPrompt },
                                { role: "user", content: userPrompt },
                            ],
                            model: "gpt-4o",
                        });
                        console.log(response)

                        // Extract the generated journal entry
                        const journalEntry = response.choices[0].message.content;


                        journalEntries.push({ characterUUID: uuid, journalEntry });
                    } else {
                        journalEntries.push({ characterUUID: uuid, journalEntry: 'Character not found.' });
                    }
                } catch (openAIError) {
                    console.error(`Error generating entry for character ${uuid}:`, openAIError);
                    journalEntries.push({ character: uuid, journalEntry: 'Error generating journal entry.' });
                }
            });

            await Promise.all(characterPromises);
            res.status(200).json({ success: true, journalEntries });
            console.log(journalEntries)

        } catch (error) {
            // Handle any errors from the OpenAI API or the server
            console.error("Error generating journal entries:", error);
            res.status(500).json({ success: false, error: "Failed to generate journal entries." });
        }
    },

    onCreateComment: async (req, res) => {
        const { journalEntryUUID, characterUUIDs } = req.body;

        try {

        }
        catch (error) {
            console.error("Error generating comemnts:", error);
        }

    },

    onCreateStranger: async (req, res) => {
        // Placeholder for onCreateStranger functionality
    }
};

export default llmController;
