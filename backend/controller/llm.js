import openAI from "../utils/openAI.js";
import CharacterModel from "../models/character.js";
import { getAttributes, getConnections, getBasePrompt } from "../utils/prompts.js";
import { JournalEntry } from "../models/journal.js";

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
                        // ${getConnections(character.name, character.connectedCharacters)},
                        const systemPrompt = `
                            ${getBasePrompt(character)}
                            ${getAttributes(character)}

                            Show your brillance at method acting by writing a journal with the persona and style of ${character.name}. 
                            The topic of journal will be provided within the <topic></topic> tag The journal should be written in Korean and not include dates. 
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
            // Step 1: Find the journal entry
            const journalEntry = await JournalEntry.findOne({ uuid: journalEntryUUID });
            if (!journalEntry) {
                return res.status(404).json({ error: 'Journal entry not found.' });
            }

            const generatedComments = [];

            // Step 2: Fetch characters and generate comments concurrently
            const characterPromises = characterUUIDs.map(async (uuid) => {
                try {
                    const character = await CharacterModel.getCharacterByUUID(uuid);
                    if (character) {
                        const systemPrompt = `
                            ${getBasePrompt(character)}
                            ${getAttributes(character)}
                            ${getConnections(character.name, character.connectedCharacters)},
                            
                            You are ${character.name}, and you're responding to a journal entry. 
                            Please write a comment from the perspective of ${character.name}, expressing thoughts on the entry provided. The comment should be in the style of ${character.name}.
                        `;

                        // Step 4: Create the user prompt
                        const userPrompt = `Journal Entry: ${journalEntry.content}`;

                        // Step 5: Get the LLM response for the comment
                        const response = await openAI.createChatCompletion({
                            messages: [
                                { role: "system", content: systemPrompt },
                                { role: "user", content: userPrompt },
                            ],
                            model: "gpt-4",
                        });

                        // Extract the generated comment
                        const commentContent = response.data.choices[0].message.content.trim();

                        // Push the generated comment into the result array
                        generatedComments.push({
                            characterUUID: uuid,
                            comment: commentContent,
                        });

                    } else {
                        generatedComments.push({ characterUUID: uuid, comment: 'Character not found.' });
                    }
                } catch (openAIError) {
                    console.error(`Error generating comment for character ${uuid}:`, openAIError);
                    generatedComments.push({ characterUUID: uuid, comment: 'Error generating comment.' });
                }
            });

            // Wait for all character comment generation to complete
            await Promise.all(characterPromises);

            // Step 6: Return the batch of generated comments
            res.status(200).json({ success: true, comments: generatedComments });
        } catch (error) {
            console.error("Error generating comments:", error);
            res.status(500).json({ success: false, error: "Failed to generate comments." });
        }
    },


    onCreateStranger: async (req, res) => {
        // Placeholder for onCreateStranger functionality
    }
};

export default llmController;
