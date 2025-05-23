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
                       You are a highly creative actor, brilliant at method acting. Especially, you have mastered the role of ${character.name}. Your goal is to maintain your characteristics while introducing creative responses based on the context provided. 
                       
                       **Roleplaying Rules**:
                        1. Character Consistency: Always stay true to the attributes of ${character.name} within <My Character Description> </My Character Description>. Maintain their established voice, behaviors, and emotional responses.
                        2. Creative Responses: While being consistent with ${character.name}'s traits, respond to the context in unexpected, yet plausible ways. Introduce fresh ideas, and events that bring out the depth of the characters.
                        3 Novel Ideas: Embrace creativity! Allow ${character.name} to think outside the box or make surprising decisions that still fit within their personality, relationship and context.
                        4. Context Adaptability: Allow ${character.name} to react to the context by thinking of new challenges, environments, and situations in a way that feels natural yet inventive. Find opportunities for growth, conflict, humor, or tension based on the characters’ goals and the situation at hand.
                        5. Relationship Dynamics: Pay close attention to the relationship between ${character.name} and other characters defined within the <Character Network></Character Network>.. Explore how their shared histories, conflicts, or alliances affect their behavior. Use these dynamics to create deeper, more layered interactions.
                   
                        `;
                        // console.log('systemPrompt', systemPrompt)

                        let userPrompt = `\n<My Character Description> 
                        You are ${character.name}
                       ${JSON.stringify(extractedValues)}
                       </My Character Description> 
                       `

                        if (updatedConnectedCharacters) {
                            const cleanedConnections = cleanCharacterData(updatedConnectedCharacters);
                            console.log('here!!', cleanedConnections)
                            userPrompt += `\n<Character Network>`
                            cleanedConnections?.forEach((connectedCharacter, index) => {
                                userPrompt += `\n${index += 1}.${connectedCharacter.name}\n`
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
                            userPrompt += `\n</Character Network>`
                        }

                        userPrompt += `

                     **Rules For Journaling**:
1. ${character.name} should write the content of the journal from ${character.name}'s own perspective and style.
2. Start with '친애하는 일기장에게' to set up the following "conversation" for sharing your inner self to "someone".
3. The events that occur in the journal must be rich in diversity and explained in detail, rather than being superficial summarizations.The character remembers every detail of the events that occured.
4. There should be no moral lessions learnt at the end of the journal, rather it should be a raw record of your own experience. The character remembers every detail of that experience.
5. Regardless of what the theme of journal is, you must write about it. 
6. When provided with a theme that is not described or defined in your <My Character Description> </My Character Description> do not avoid the theme but see this as an opportunity to improvise rich details that ${character.name} would plausbily know of.
6. Never write about other characters from the <Character Network> </Character Network> if the theme of the journal has little or no relevance with the information within the <Character Network> </Character Network>.
7  If other characters from the <Character Network> </Character Network> are included in the journal's content, ensure that they play a major role within the events that occur in the journal. 
8. In addition, use <My Character Description>  </My Character Description> for acting as the character, rather than to fill up the content of the journal with unnessary details from the <My Character Description> </My Character Description>. 
9. Avoid politeness or encouragement unless explicitly defined in <My Character Description> </My Character Description>/
10. The journal should be written in Korean and Korean only. It should not feel like an English translation.
11.The final format should be the journal only. 

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
                        const generation = response.choices[0].message.content.trim();


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
                        let systemPrompt = `    You are a highly creative actor, brilliant at method acting. Especially, you have mastered the role of ${character.name}. Your goal is to maintain your characteristics while introducing creative interactions based on the context provided. 
                        
                    \n<My Character Description>
                      You are ${character.name}
                    ${JSON.stringify(extractedValues)}
                    </My Character Description>`;

                        // Add connected character relationships if they exist
                        if (updatedConnectedCharacters && updatedConnectedCharacters.length > 0) {
                            const cleanedConnections = cleanCharacterData(updatedConnectedCharacters);
                            console.log('cleanedConnections!', cleanedConnections)
                            systemPrompt += `\n\n<Character Network>`;
                            cleanedConnections.forEach((connectedCharacter, index) => {
                                systemPrompt += `\n${index + 1}. ${connectedCharacter.name}\n`;
                                if (connectedCharacter?.description) {
                                    systemPrompt += `\nRelationship between ${character.name} and ${connectedCharacter.name} from ${character.name}'s perspective: ${connectedCharacter?.description}`;
                                }
                                if (connectedCharacter?.knowledge) {
                                    systemPrompt += `\The Description for ${connectedCharacter.name}:${JSON.stringify(connectedCharacter?.knowledge)}`
                                }
                                if (comments?.previousCommentCharacterUUID) {
                                    if (connectedCharacter.uuid === comments.previousCommentCharacterUUID) {
                                        systemPrompt += `\nRelationship between ${character.name} and ${connectedCharacter.name} from ${character.name}'s perspective: ${connectedCharacter?.description}`;
                                        replyingToConnection = connectedCharacter
                                    }
                                }
                                else if (connectedCharacter.uuid === journalWriterCharacter.uuid) {
                                    replyingToConnection = connectedCharacter
                                }

                                //here how do i know if this connectedCharacter is the one i should be responding to next. 
                            });
                        }
                        systemPrompt += `
                        \n**Roleplaying Rules**:
                        1. Character Consistency: Always stay true to the attributes of ${character.name} within <My Character Description> </My Character Description>. Maintain their established voice, behaviors, and emotional responses.
                        2. Creative Responses: While being consistent with ${character.name}'s traits, respond to the context in unexpected, yet plausible ways. Introduce fresh ideas, and events that bring out the depth of the characters.
                        3. Novel Ideas: Embrace creativity! Allow ${character.name} to think outside the box or make surprising decisions that still fit within their personality, relationship and context.
                        4. Context Adaptability: As the context changes, allow ${character.name} to react to the context by thinking of new challenges, environments, and situationss in a way that feels natural yet inventive. Find opportunities for growth, conflict, humor, or tension based on the characters’ goals and the situation at hand.
                        5. Relationship Dynamics: Pay close attention to the relationships between ${character.name} and other characters defined in the <Character Network>. Explore how their shared histories, conflicts, or alliances with you affect your behavior. Use these dynamics to create deeper, more layered interactions.
                     
                        **General Comment Rules**
                       
                        1. Absoultely avoid giving advice nor polite, moral, hopeful, positive, comforting, encouraging, or overly agreeable responses unless defined in the <My Character Description> </My Character Description>. Respond as ${character.name} truly would, without needing to smooth over disagreements or maintain peace.
                        2. The comment should be not be superficial nor generic but strongly reflect your own unique identity as ${character.name} in a way that feels natural and not scripted.
                        3. Your response should also always manifest ${character.name}'s perspective of the relationship between ${replyingToConnection?.name}, which is ${replyingToConnection?.description}.
                        4. To further express the relationship ${character.name} percieves to have with ${replyingToConnection?.name}, you may use the following description of ${replyingToConnection?.name} which is ${JSON.stringify(replyingToConnection?.knowledge)} when appropriate.
                        5. When responding to information not defined in your <My Character Description> </My Character Description> do not avoid responding but see this as an opportunity to improvise rich details that ${character.name} would plausbily know of.
                        6. The length of the comment should be under concise, but ensure your response feels unique and meaningful as ${character.name}.
                        7. The comment should be written in Korean and Korean only. It should not feel like an English translation.
                        8. Do not write your own name at the end of the response.
                        `

                        let userPrompt = `${journalWriterCharacter.name} wrote the journal entry "${journalEntry.title}" with the following content: <Journal Entry Content> ${journalEntry.content} </Journal Entry Content> "`;

                        if (!commentThreadUUID) {
                            userPrompt += `
                            ** First Comment Rules **

                                 1. Focus on one specific section of the <Journal Entry Content> </Journal Entry Content> that would capture ${character.name}'s attention the most and respond by exploring the section's implication for ${character.name}. Avoid summarizing or responding to the entire entry.
                                 2. Do not explicitly state what caught your interest; instead, let it show through your natural reaction. 
                                 3. The response should be directed towards ${journalWriterCharacter.name}.
                                 4. Your response should also always manifest ${character.name}'s perspective of the relationship between ${replyingToConnection?.name}, which is ${replyingToConnection?.description}.
`;
                        } else {
                            userPrompt +=
                                `\n\n<Past Comment History>: ${JSON.stringify(comments.commentHistory)}<Past Comment History> \n

                            ** Extended Comment Rules **
                            1. You must respond by thinking of how ${character.name} would respond towards only one specific part of the last response in the <Past Comment History> </Past Comment History>. 
                            2. Focus on the thematic shifts in the comment thread, and express your fresh perspectives from ${character.name}'s viewpoint. 
                            3. Avoid simply agreeing or repeating; instead, challenge, question, or deepen the comment thread based on ${character.name}'s unique traits and motivations.
                            4. When the comment thread becomes repetitive, introduce new details from the <Journal Entry Content> </Journal Entry Content>or draw on ${character.name}'s memories or future goals to steer the comments in a novel direction.
                            5. Never repeat the same words, expressions, phrases, sentiments, and ideas from previous comments. Push the conversation forward by reflecting on new information.
                            6. Regardless of what ${comments.previousCommentCharacterName} has said in the past conversation, your response must constistantly reflect the relationship you percieve to have with ${comments.previousCommentCharacterName} which is ${replyingToConnection?.description}.
                            
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
            console.error('Error:', error); https://platform.openai.com/playground/chat
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
1. Create three distinct characters who are directly connected to ${character.name} through realistic, strong, and tangible relationships.
2. Each character must be connected through the following relationship: "${content}", which must come from shared past experiences, significant events in their lives, or realistic future scenarios.
3. If the relationship "${content}" is a specific type of relationship(friend, mother, father, sister, etc), ensure that all the new characters follow this type of relationship(friend, mother, father, sister etc)
4. This relationship must always be "${content}".  Showcase different interpretations of the following relationship: "${content}" 
 `

            let userPrompt = `
            This is ${character.name}.
        ${JSON.stringify(extractedValues)}

** Rules for Formatting **:
    1. Each of the 3 characters should have a name, introduction, backstory, and a relationship with ${character.name}. The relationship should be split into two parts:
- "my_relationship": which describes the relationship from the new character's perspective.
    - "your_relationship": which describes the relationship from ${character.name} 's perspective
2. Format each character into JSON format using these keys: "name", "introduction", "backstory", "my_relationship", "your_relationship".
    - For example: { "name": "", "introduction": "", "backstory": "", "my_relationship": "", "your_relationship": "" }.
3. The "name" should  be a name that reflects their descriptons in a memorizable way.
4. The descriptions for each of the keys must have be in vivid detail, and not be superficial summarizations. 
            5. Whenever applicable ensure that the descriptons are at least 5 sentences long. 
           
            6. The final output should be a JSON object with each character's JSON encapsulated in the key "characters".
    - For example: { "characters": [{ "name": "", "introduction": "", "backstory": "", "my_relationship": "", "your_relationship": "" }, ...] }.
7. The keys should be in English, but the values should be in Korean.
            8. The output should only contain the final JSON object.`;


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
