import openAI from "../utils/openAI.js";
import CharacterModel from "../models/character.js";
import { getAttributes, getConnections, getBasePrompt } from "../utils/xmlPrompts.js";
import { JournalEntry, CommentThread } from "../models/journal.js";
import updateConnectedCharacterKnowledge from "../utils/updateConnectedChracterKnowledge.js";
import { cleanCharacterData } from "../utils/cleanCharacterData.js";
import getCommentHistory from "../utils/getCommentHistory";
import { cp } from "fs";

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
                    
                       너는 ${character.name}의 생각, 감정, 해동, 가치관, 말투, 등의 전반적인 스타일과 특성들을 더 풍부하고 개성있게 과장해서솔직하고 자세하게 저널의 형태로 적어줘.
                       저널은 1인칭 시점으로, 대화체, 그리고 한국어로 작성해주고 '날짜'는 제외해줘. 저널의 주제는 밑에 <저널_주제></저널_주제>에서 제공될 거야. 
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
                        let systemPrompt = `You are an actor, brilliant at method acting. 
                        Especially, you have mastered the role of ${character.name}. 
        
                        ${character.name} has the following attributes.
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
                                    ${character.name} knows the following about ${cleanedConnectedCharacter.name}'s atributes: 
                                      ${JSON.stringify(cleanedConnectedCharacter.knowledge)}
                                      `
                                }

                                // console.log(cleanedConnectedCharacter)
                            });
                        }

                        systemPrompt += `
                        ${character.name}의 특성과 스타일을 과장해서 너의 생각과 감정을 솔직하게 코멘트의 형식으로 적어줘.
                        코멘트는 1인칭 시점으로 대화체, 한국어로 작성해주고 내용만 출력해줘. 누가 보냈다라는 말은 하지말아줘.
                        `;

                        console.log(systemPrompt);

                        let userPrompt = `${journalWriterCharacter.name}이 작성한 저널의 주제는 ${journalEntry.title}이고, 
                            그 내용은 다음과 같아: ${journalEntry.content}`;

                        if (!commentThreadUUID) {
                            userPrompt += `
                            ${journalWriterCharacter.name}한테 보낼 코멘트를 작성해줘.
                            `
                        }
                        else {

                            userPrompt += `
                        그리고 이전 대화 기록은 이거야: ${JSON.stringify(commentHistory)}. 
                        이제 마지막 코멘트를 적은 캐릭터한테 보낼 답변을 작성해줘. 답변을 보낼때,  ${character.name}의 페르소나를 유지하고 
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
                    console.error(`Error generating comment for character ${characterUUID}:`, openAIError);
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
            console.log(character.personaAttributes)

            let systemPrompt = `You are a creative story writer, brilliant at creating unique and orignal characters.`

            let userPrompt = `

            This is ${character.name}. 
            ${JSON.stringify(character.personaAttributes)}


            Creatively brainstorm 3 charcters that are associated with ${character.name} in the following way: 
            ${content}.  


            1. Creatively brainstorm 3 characters that are clearly unique, orginal, and distinct from each other but most importantly, are all associated with Bingu as [적대적인 관계]. 
2. Structure each character as a JSON object with detailed descriptions for each key, such as:
"Character1": { "name": "value", "key1": { "description": "..." }, "key2": { "description": "..." } }
3. Each key should include a detailed description object with rich, descriptive text for the new character. 
4. Use the following keys for each character: 백스토리, 나이, 목표, 성격, 직업, myPOV_relationship, yourPOV_relationship.
5. The my_relationship key describethe relationship between the new character’ and Bingu from the new character's perspective, while the your_relationship key describes the relationship betwen them from Bingu's perspective. The rest of the keys should  reflect  the new character's perspective. 
6. Write the character descriptions in Korean only.
7. Follow a consistent structure in JSON format for each character, making sure all keys are properly nested.
    

             
            `;


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
