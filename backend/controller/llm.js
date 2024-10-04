import openAI from "../utils/openAI.js";
import CharacterModel from "../models/character.js";
import { JournalEntry, CommentThread } from "../models/journal.js";
import { extractAllValuesAndKeys, updateConnectedCharacterKnowledge, cleanCharacterData, getCommentHistory } from "../utils/dataPreprocesing.js";

const llmController = {
    onCreateJournalEntries: async (req, res) => {
        try {
            const { characterUUIDs, journalTitle } = req.body;
            const journalEntries = [];


            // Fetch characters and generate journal entries concurrently
            const characterPromises = characterUUIDs.map(async (uuid) => {
                try {
                    const character = await CharacterModel.getCharacterByUUID(uuid);
                    // console.log(JSON.stringify(character))
                    if (character) {
                        const { extractedValues, allKeys } = extractAllValuesAndKeys(character.personaAttributes);
                        // console.log('extractedValues', extractedValues)
                        const updatedConnectedCharacters = await updateConnectedCharacterKnowledge(character.connectedCharacters, 'journal');
                        console.log(updatedConnectedCharacters)
                        const systemPrompt = `
                       You are an actor, brilliant at method acting. Especially, you have mastered the role of ${character.name}. 
                       
                       **Roleplaying Rules**:
                       1. Stay in character as ${character.name} throughout the writing process.
                       2. Use the character description as well as as a blueprint to guide your writing, but do not copy or paraphrase them directly.
                       3. Use the information provided to inform your role, but do not break character to explain details.

                        `;
                        // console.log('systemPrompt', systemPrompt)

                        let userPrompt = `\nCharacter Description: 
                        You are ${character.name}
                       ${JSON.stringify(extractedValues)}`

                        if (updatedConnectedCharacters) {
                            const cleanedConnections = cleanCharacterData(updatedConnectedCharacters);
                            console.log('here!!', cleanedConnections)
                            userPrompt += `\nCharacter Network:`
                            cleanedConnections?.forEach((connectedCharacter, index) => {
                                userPrompt += `\n${index += 1}.${connectedCharacter.name}`
                                if (connectedCharacter?.description) {
                                    userPrompt += `Relationship between ${character.name} and ${connectedCharacter.name} from ${character.name}'s perspective:
                                    ${connectedCharacter?.description}`;
                                }
                                if (connectedCharacter?.knowledge) {
                                    userPrompt += `
                                    The Description for ${connectedCharacter.name}:
                                    ${JSON.stringify(connectedCharacter.knowledge)}
                                    `
                                }
                            });
                        }

                        userPrompt += `

                      **Rules For Journaling**:
                      1. The content and style of the journal should be written from the perspective of fictional story charcter. 
                      2. Write as if you were talking to another person. 
                      3. Start with '친애하는 일기장에게' to set up the following "conversation" for sharing your inner thoughts to "someone".
                      4. The events that occur in the journal post must be rich in diversity and explained in detail, rather than being  and superficial summarizations.The character remembers every detail. 
                      5. There should be no moral lessions learnt at the end of the journal, rather it should be a raw record of your emotions, and thoughts.The character remembers every detail.
                      6. Regardless of what the theme of journal is, you must write about it. 
                      7. Do not include any information from the 'Character Network' if there is no direct connection betwen the data in the 'Character Network' and the provided theme for the journal.
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
            const generatedComments = [];

            // Fetch the journal entry
            const journalEntry = await JournalEntry.findOne({ uuid: journalEntryUUID });
            if (!journalEntry) {
                return res.status(404).json({ error: 'Journal entry not found.' });
            }
            console.log(journalEntry)

            // Fetch comment history if commentThreadUUID exists
            const comments = commentThreadUUID ? await getCommentHistory(commentThreadUUID) : null;
            let replyingToConnection

            // Fetch the journal writer's character
            const journalWriterCharacter = await CharacterModel.getCharacterByUUID(journalEntry.ownerUUID);
            if (!journalWriterCharacter) {
                return res.status(404).json({ error: 'Journal writer character not found.' });
            }

            // Process each character for comment generation
            const characterPromises = characterUUIDs.map(async (characterUUID) => {
                try {
                    const character = await CharacterModel.getCharacterByUUID(characterUUID);
                    if (character) {
                        // Update knowledge for connected characters
                        const updatedConnectedCharacters = await updateConnectedCharacterKnowledge(character.connectedCharacters);
                        const { extractedValues } = extractAllValuesAndKeys(character.personaAttributes);

                        // Build the systemPrompt with character details
                        let systemPrompt = `You are an actor, brilliant at method acting. You have mastered the role of ${character.name}. 
                        
                    \n<My Character Description>
                      You are ${character.name}
                    
                    ${JSON.stringify(extractedValues)}`;

                        // Add connected character relationships if they exist
                        if (updatedConnectedCharacters && updatedConnectedCharacters.length > 0) {
                            const cleanedConnections = cleanCharacterData(updatedConnectedCharacters);
                            systemPrompt += `\n\n<Character Network>`;
                            cleanedConnections.forEach((connectedCharacter, index) => {
                                systemPrompt += `\n${index + 1}. ${connectedCharacter.name}`;
                                // if (connectedCharacter?.description) {
                                //     systemPrompt += `\nRelationship between ${character.name} and ${connectedCharacter.name} from ${character.name}'s perspective: ${connectedCharacter?.description}`;
                                // }
                                // if (connectedCharacter?.knowledge) {
                                //     systemPrompt += `\The Description for ${connectedCharacter.name}:${JSON.stringify(connectedCharacter.knowledge)}`
                                // }
                                if (comments?.previousCommentCharacterUUID) {
                                    if (connectedCharacter.uuid === comments.previousCommentCharacterUUID) {
                                        systemPrompt += `\nThe Knowledge ${character.name} has of ${connectedCharacter.name}:${JSON.stringify(connectedCharacter.knowledge)}
                                        The Relationship between ${character.name} and ${connectedCharacter.name} from ${character.name}'s perspective: ${connectedCharacter?.description}`;
                                        replyingToConnection = connectedCharacter
                                    }
                                }
                                else if (connectedCharacter.uuid === journalWriterCharacter.uuid) {
                                    systemPrompt += `\nThe Knowledge ${character.name} has of ${connectedCharacter.name}:${JSON.stringify(connectedCharacter.knowledge)}
 The Relationship between ${character.name} and ${connectedCharacter.name} from ${character.name}'s perspective: ${connectedCharacter?.description}`;
                                    replyingToConnection = connectedCharacter
                                }

                                //here how do i know if this connectedCharacter is the one i should be responding to next. 
                            });
                        }
                        systemPrompt += `
                        \n**Roleplaying Rules**:
                        1. You must consistantly stay in character as ${character.name} throughout the entire conversation.
                        2. Use your <My Character Description> and specifically the relationship and knoweldge within the <Character Network> to guide your writing, but do not copy or paraphrase directly.
                        3. Do not break character to explain details.
                     
                        **General Response Rules**
                        1. The response should be written in Korean and Korean only. It should not feel like an Enlgish translation.
                        2. You should not be unnwcessarily polite, or encouraging if it is not defined in your <character description>.
                        3. Your response should be always be a direct manifestation of your character ${character.name}.
                        4. If the relationship is provided,your response should also always manifest your perspective of the relationship you have with the character you are responding to.
                        5. You can use the knoweldge you have of the character you are responding to in order to further express the relationship you percieve to have with that character.
                        

                        `
                        // Build the userPrompt with journal and comment context
                        let userPrompt = `${journalWriterCharacter.name} wrote the journal entry "${journalEntry.title}" with the following content: "${journalEntry.content}"`;

                        if (!commentThreadUUID) {
                            userPrompt += `
                            ** Specific Comment Rules **
                                1. You must respond by thinking of how ${character.name} would react to this journal. 
                                2. Rather than addressing this as a journal, adrress this the personal expression of ${character.name}.
                                3. Think of specific parts of the journal that ${character.name} would be of most interest to ${character.name}.
                                4. The response should be not be superficial but strongly reflect your own unique identity as ${character.name}.
                                5. In addition, your response should strongly reflect your relationship with ${journalWriterCharacter.name} which is ${replyingToConnection?.description}.
                                6. Do not write your own name at the end of the comment.
                                7. The final remarks should not be encouragi
`;
                        } else {
                            userPrompt +=
                                `\n\nPast comment history: ${JSON.stringify(comments.commentHistory)} \

                            ** Specific Comment Rules **
                            1. Think of specific parts of the journal and the past conversation with ${comments.previousCommentCharacterName} to respond.
                            2. You must respond as ${character.name}, and reflect this character's unique identity. 
                            3. Regardless of what ${comments.previousCommentCharacterName} has said in the prevous comments before, your response must always reflect the relationship you percieve to have with ${comments.previousCommentCharacterName}.
                            4. This relationship you have with ${comments.previousCommentCharacterName} must never waver and should always remain consistant. 
                            5. Do not write your own name at the end of the comment.
                     


`;
                        }

                        // Log prompts for debugging purposes
                        console.log('systemPrompt:', systemPrompt);
                        console.log('userPrompt:', userPrompt);

                        // Make the request to OpenAI's GPT model
                        const response = await openAI.chat.completions.create({
                            messages: [
                                { role: "system", content: systemPrompt },
                                { role: "user", content: userPrompt },
                            ],
                            model: "gpt-4o",
                        });

                        const generation = response.choices[0].message.content.trim();
                        console.log('Generated comment:', generation);

                        // Push the generated comment into the result array
                        generatedComments.push({
                            characterUUID: characterUUID,
                            generation: generation
                        });

                    } else {
                        console.error(`No character found for characterUUID: ${characterUUID} `);
                    }

                } catch (error) {
                    console.error(`Error generating comment for characterUUID ${characterUUID}: `, error);
                }
            });

            // Wait for all character comment generation to complete
            await Promise.all(characterPromises);

            // Return the batch of generated comments
            res.status(200).json({ success: true, comments: generatedComments });

        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, error: 'Failed to generate comments.' });
        }
    },


    onCreateStranger: async (req, res) => {
        const { characterUUID, content } = req.body;
        try {
            const character = await CharacterModel.getCharacterByUUID(characterUUID);
            const { extractedValues, allKeys } = extractAllValuesAndKeys(character.personaAttributes);
            console.log(extractedValues)

            let systemPrompt = `You are a professional story writer, brilliant at creating new characters.

            ** Objective **:
1. Create 3 new fictional story characters that each have a clear association with ${character.name}  based on the following theme: ${content}.
2. However, this association ${content} must manifest through the new characters in a wide range of ways to ensure each character is fresh and compelling.
            3. All 3 characters must be clearly distinct from each other, and each must be unique and orginal. `

            let userPrompt = `
            This is ${character.name}.
        ${JSON.stringify(extractedValues)}

** Rules for Formatting **:
    1. Each of the 3 characters should have a name, introduction, backstory, and a relationship with ${character.name}. The relationship should be split into two parts:
- "my_relationship": which describes the relationship from the new character's perspective.
    - "your_relationship": which describes the relationship from ${character.name} 's perspective
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
