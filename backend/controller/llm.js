import openAI from "../utils/openAI.js";
import CharacterModel from "../models/character.js";
import { JournalEntry, CommentThread } from "../models/journal.js";
import { extractAllValuesAndKeys, updateConnectedCharacterKnowledge, cleanCharacterData, getCommentHistory } from "../utils/jsonprompts.js";

const llmController = {
    onCreateJournalEntries: async (req, res) => {
        try {
            const { characterUUIDs, journalTitle } = req.body;
            const journalEntries = [];


            // Fetch characters and generate journal entries concurrently
            const characterPromises = characterUUIDs.map(async (uuid) => {
                try {
                    const character = await CharacterModel.getCharacterByUUID(uuid);
                    console.log(JSON.stringify(character))
                    if (character) {
                        const { extractedValues, allKeys } = extractAllValuesAndKeys(character.personaAttributes);
                        // console.log('extractedValues', extractedValues)
                        const updatedConnectedCharacters = await updateConnectedCharacterKnowledge(character.connectedCharacters);
                        console.log(updatedConnectedCharacters)
                        const systemPrompt = `
                       You are an actor, brilliant at method acting. Especially, you have mastered the role of ${character.name}. 
                       
                       Roleplaying Rules:
                       1. Stay in character as ${character.name} throughout the writing process.
                       2. Use the character description as a blueprint to guide your writing, but do not copy or paraphrase them directly.
                       3. Use the information provided to inform your role, but do not break character to explain details.
                        `;
                        // console.log('systemPrompt', systemPrompt)

                        let userPrompt = `\nCharacter Description: 
                      name: ${character.name}
                       ${JSON.stringify(extractedValues)}`

                        if (updatedConnectedCharacters) {
                            const cleanedConnections = cleanCharacterData(updatedConnectedCharacters);
                            userPrompt += `\nCharacter Network:`
                            cleanedConnections?.forEach((connectedCharacter, index) => {
                                userPrompt += `\n${index += 1}.${connectedCharacter.name}`
                                if (connectedCharacter?.description) {
                                    userPrompt += `Relationship between ${character.name} and ${connectedCharacter.name} from ${character.name}'s perspective:
                                    ${connectedCharacter?.description}`;


                                }
                                if (connectedCharacter?.knowledge) {
                                    userPrompt += `
                                     2. The Description for ${connectedCharacter.name}:
                                    ${JSON.stringify(connectedCharacter.knowledge)}
                                    `
                                }


                            });
                        }

                        userPrompt += `

                       Rules For Journaling:
                      1. The content and style of the journal should be written from the perspective of fictional story charcter. 
                      2. Write as if you were talking to another person. 
                      3. Start with '친애하는 일기장에게' to set up the following "conversation" for sharing your inner thoughts to "someone".
                      4. The events that occur in the journal post must be rich in diversity and explained in detail, rather than being  and superficial summarizations.The character remembers every detail. 
                      5. There should be no moral lessions learnt at the end of the journal, rather it should be a raw record of your emotions, and thoughts.The character remembers every detail.
                      6. Regardless of what the theme of journal is, you must write about it. 
                      7. Do not include any information from the 'Character Network' if there is no direct connection betwen the data in the 'Character Network' and the provided theme for the journal.
                      8. Do not write any the 'Character Description' if there is no direct connection betwen them and the theme of the journal.  
                      8. The journal must be in Korean and Korean only. 
                      9. The final format should be the journal only. 

                      The theme of the journal is ${journalTitle}.`
                        console.log('userPrompt', userPrompt)
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
                    console.error(`Error generating entry for character ${uuid}: `, openAIError);
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
        const { journalEntryUUID, characterUUIDs, commentThreadUUID } = req.body;
        try {
            // Step 1: Find the journal entry
            const journalEntry = await JournalEntry.findOne({ uuid: journalEntryUUID });
            if (!journalEntry) {
                return res.status(404).json({ error: 'Journal entry not found.' });
            }

            let commentHistory
            let previousCommentCharacterName
            if (commentThreadUUID) {
                const result = await getCommentHistory(commentThreadUUID);
                commentHistory = result.commentHistory;
                previousCommentCharacterName = result.previousCharacterName;
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
                        let systemPrompt = `You are an actor, brilliant at method acting. Especially, you have mastered the role of ${character.name}. 
        
                        Character Description:
        ${JSON.stringify(character.personaAttributes)}
`;

                        // If connected characters exist, add each of their relationships to the prompt
                        if (updatedConnectedCharacters.length > 0) {
                            updatedConnectedCharacters.forEach(connectedCharacter => {
                                const cleanedConnectedCharacter = cleanCharacterData(connectedCharacter)

                                if (cleanedConnectedCharacter.description) {
                                    systemPrompt += `   
                                    ${character.name} has the following relationship with ${cleanedConnectedCharacter.name}:
                                      ${JSON.stringify(cleanedConnectedCharacter.description)}
`
                                }

                                if (cleanedConnectedCharacter.knowledge) {
                                    systemPrompt += `   
                                    ${character.name} knows the following about ${cleanedConnectedCharacter.name} 's atributes: 
                                      ${JSON.stringify(cleanedConnectedCharacter.knowledge)}
`
                                }

                                // console.log(cleanedConnectedCharacter)
                            });
                        }

                        systemPrompt += `
                        ${character.name}의 특성과 스타일을 과장해서 너의 생각과 감정을 솔직하게 코멘트의 형식으로 적어줘.
    코멘트는 1인칭 시점으로 대화체, 한국어로 작성해주고 내용만 출력해줘.누가 보냈다라는 말은 하지말아줘.
                        `;

                        console.log(systemPrompt);

                        let userPrompt = `${journalWriterCharacter.name}이 작성한 저널의 주제는 ${journalEntry.title} 이고,
    그 내용은 다음과 같아: ${journalEntry.content} `;

                        if (!commentThreadUUID) {
                            userPrompt += `
                            ${journalWriterCharacter.name}한테 보낼 코멘트를 작성해줘.
                            `
                        }
                        else {

                            userPrompt += `
                        그리고 이전 대화 기록은 이거야: ${JSON.stringify(commentHistory)}. 
                        이제 마지막 코멘트를 적은 캐릭터한테 보낼 답변을 작성해줘.답변을 보낼때, ${character.name}의 페르소나를 유지하고 
                       ${journalWriterCharacter.name}와의 관계를 유지해줘.
                        그리고 맥락에 맞을 수 있는, 둘 사이에 생길 수 있는 새로운 상황들을 창의적으로 생각해서 초롱이랑 대화를 해줘.
                        `
                        }
                        console.log('userPrompt', userPrompt)


                        const response = await openAI.chat.completions.create({
                            messages: [
                                { role: "system", content: systemPrompt },
                                { role: "user", content: userPrompt },
                            ],
                            model: "gpt-4o",
                        });
                        console.log(response);

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
                    console.error(`Error generating comment for character ${characterUUID}: `, openAIError);
                    // generatedComments.push({ characterUUID: characterUUID, comment: 'Error generating comment.' });
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
        const { characterUUID, content } = req.body;
        try {
            const character = await CharacterModel.getCharacterByUUID(characterUUID);
            const { extractedValues, allKeys } = extractAllValuesAndKeys(character.personaAttributes);
            console.log(extractedValues)

            let systemPrompt = `You are a professional story writer, brilliant at creating new characters.

            Objective:
            1. Create 3 new fictional story characters that each have a clear association with ${character.name}  based on the following theme: ${content}.
            2. However, this association ${content} must manifest through the new characters in a wide range of ways to ensure each character is fresh and compelling.
            3. All 3 characters must be clearly distinct from each other, and each must be unique and orginal. `

            let userPrompt = `
            This is ${character.name}.
            ${JSON.stringify(extractedValues)}

Rules for Formatting:
   1. Each of the 3 characters should have a name, introduction, backstory, and a relationship with ${character.name}. The relationship should be split into two parts:
   - "my_relationship": which describes the relationship from the new character's perspective.
   - "your_relationship": which describes the relationship from ${character.name}'s perspective
2. Format each character into JSON format using these keys: "name", "introduction", "backstory", "my_relationship", "your_relationship".
    - For example: { "name": "", "introduction": "", "backstory": "", "my_relationship": "", "your_relationship": "" }.
3. The decriptions for each of the keys must have be in vivid detail, and not be superficial summarizations. 
            4. Whenever applicable ensure that the descriptons are at least 5 sentences long. 
            5. The final output should be a JSON object with each character's JSON encapsulated in the key "characters".
    - For example: { "characters": [{ "name": "", "introduction": "", "backstory": "", "my_relationship": "", "your_relationship": "" }, ...] }.
6. The keys should be in English, but the values should be in Korean.
            7. The output should only contain the final JSON object.`;


            console.log('userPrompt', userPrompt)

            const response = await openAI.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt },
                ],
                model: "gpt-4o",
                response_format: { "type": "json_object" }
            });
            console.log(response);

            const generation = response.choices[0].message.content.trim();
            console.log(generation);

            res.status(200).json({ success: true, generation: generation });
        }
        catch (openAIError) {
            console.error(`Error generating new character`, openAIError);
        }
    }
};

export default llmController;
