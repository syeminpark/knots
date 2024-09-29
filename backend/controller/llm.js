import openAI from "../utils/openAI.js";
import CharacterModel from "../models/character.js";
import { getAttributes, getConnections, getBasePrompt } from "../utils/xmlPrompts.js";
import { JournalEntry } from "../models/journal.js";
import updateConnectedCharacterKnowledge from "../utils/updateConnectedChracterKnowledge.js";

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
                       너는 메소드 연기를 완벽하게 구사할 수 있는 배우야. 특히나 ${character.name}이라는 이름을 가진 이의 역할을 완벽하게 연기할 수 있어.
                       ${character.name}은 다음과 같은 특성들을 가지고 있어: 
                       ${JSON.stringify(character.personaAttributes)}
                    
                       ${character.name}의 특성과 스타일을 과장해서 ${character.name}의 생각과, 감정을 솔직하고 자세하게 저널의 형태로 적어줘.
                       저널은 1인칭 시점으로 한국어로 작성해주고 '날짜'는 제외해줘. 저널의 주제는 밑에 <저널_주제></저널_주제>에서 제공될 거야. 
                        `;
                        console.log(systemPrompt)

                        const userPrompt = `<저널_주제> ${journalTitle}</저널_주제>
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
                        const generation = response.choices[0].message.content;


                        journalEntries.push({ characterUUID: uuid, generation });
                    } else {
                        journalEntries.push({ characterUUID: uuid, generation: 'Character not found.' });
                    }
                } catch (openAIError) {
                    console.error(`Error generating entry for character ${uuid}:`, openAIError);
                    journalEntries.push({ character: uuid, generation: 'Error generating journal entry.' });
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



    onCreateComments: async (req, res) => {
        const { journalEntryUUID, characterUUIDs } = req.body;
        try {
            // Step 1: Find the journal entry
            const journalEntry = await JournalEntry.findOne({ uuid: journalEntryUUID });
            if (!journalEntry) {
                return res.status(404).json({ error: 'Journal entry not found.' });
            }

            const generatedComments = [];
            // Step 2: Fetch characters and generate comments concurrently
            const journalWriterCharacter = await CharacterModel.getCharacterByUUID(journalEntry.ownerUUID);

            const characterPromises = characterUUIDs.map(async (characterUUID) => {
                try {
                    const character = await CharacterModel.getCharacterByUUID(characterUUID);
                    if (character) {
                        const updatedConnectedCharacters = await updateConnectedCharacterKnowledge(character.connectedCharacters);

                        // Build systemPrompt with all connected characters
                        let systemPrompt = `너는 메소드 연기를 완벽하게 구사할 수 있는 배우야. 
                        특히나 ${character.name}이라는 이름을 가진 이의 역할을 완벽하게 연기할 수 있어.
        
                        ${character.name}은 다음과 같은 특성들을 가지고 있어: 
                        ${JSON.stringify(character.personaAttributes)}
                        `;

                        // If connected characters exist, add each of their relationships to the prompt
                        if (updatedConnectedCharacters.length > 0) {
                            updatedConnectedCharacters.forEach(connectedCharacter => {
                                systemPrompt += `
                                ${character.name} 입장에서는 ${connectedCharacter.name}와 다음과 같은 관계를 가지고 있어:
                                ${JSON.stringify(connectedCharacter)}
                                `;
                            });
                        }

                        systemPrompt += `
                        ${character.name}의 특성과 스타일을 과장해서 너의 생각과 감정을 솔직하게 코멘트의 형식으로 적어줘.
                        코멘트는 ${journalWriterCharacter.name}한테 보내는 거니까 1인칭 시점으로 대화체로 적어줘.
                        코멘트는 한국어로 작성해줘.
                        `;

                        console.log(systemPrompt);

                        const userPrompt = `${journalWriterCharacter.name}이 작성한 저널의 주제는 ${journalEntry.title}이고, 
                            그 내용은 다음과 같아: ${journalEntry.content}`;

                        // Step 5: Get the LLM response for the comment
                        const response = await openAI.chat.completions.create({
                            messages: [
                                { role: "system", content: systemPrompt },
                                { role: "user", content: userPrompt },
                            ],
                            model: "gpt-4o",
                        });
                        console.log(response);

                        // Extract the generated comment
                        const generation = response.choices[0].message.content.trim();
                        console.log(generation);

                        // Push the generated comment into the result array
                        generatedComments.push({
                            characterUUID: characterUUID,
                            generation: generation
                        });

                    } else {
                        console.error(`No character found for character ${character.name}`);
                    }

                } catch (openAIError) {
                    console.error(`Error generating comment for character ${characterUUID}:`, openAIError);
                    generatedComments.push({ characterUUID: characterUUID, comment: 'Error generating comment.' });
                }
            });

            // Wait for all character comment generation to complete
            await Promise.all(characterPromises);
            // Step 6: Return the batch of generated comments
            res.status(200).json({ success: true, comments: generatedComments });

        } catch (error) {
            console.error('Error:', error);
        }

    },


    onCreateStranger: async (req, res) => {
        // Placeholder for onCreateStranger functionality
    }
};

export default llmController;
