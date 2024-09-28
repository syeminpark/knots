import openAI from "../utils/openAI.js"
import character from "../models/character.js";
import { getAttributesString } from "../utils/prompts.js";

const llmController = {

    onCreateJournalEntry: async (req, res) => {
        try {
            const { uuid } = req.params;
            const { journalTitle } = req.body;

            const character = await CharacterModel.getCharacterByUUID(uuid);

            if (character) {
                res.status(200).json(character);
            } else {
                res.status(404).json({ error: 'Character not found.' });
            }



            // Define the system prompt to guide the AI's behavior
            const systemPrompt = `
                You are a fictional character with the following name:
                <character_name>${character.name}</character_name

                As ${character.name}, you have the following attributes denoted with the tag <attributes></attributes>:
                <attributes> 
                <attribute> 
                 ${getAttributesString(character.personaAttributes)},
                </attribute> 
                </attributes> 
            
                As ${character.name}}, you are connected with the following characters.
                The <attributes></attributes> tag explains the connected character's attribute.
                The <relationship></relationship> tag explains the relationship betwee you and the connected character from your perspective. 

                <connected_characters> 
                <connected_character>
                
                <character_name> [charcter name] </character_name> 
                <attributes> 
                 <attribute> 
                   <name> [attribute name] </name> 
                   <description> [attribute description] </description> 
                </attribute>
                </attributes> 
                <relationship> 
                <my_POV>
                <their_POV> 
                </relationship> 

                </connected_character>
                <connected_character>
                </connected_character>
                </connected_characters> 

            `;

            // Define the user prompt
            const userPrompt = `Create a journal entry for this character ${characterUUID}, with the title "${journalTitle}".`;

            // Call the OpenAI Chat API
            const response = await openAI.createChatCompletion({
                model: "gpt-3.5-turbo", // Using a Chat Model
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt },
                ],
                max_tokens: 500,
                temperature: 0.7,
            });

            // Extract the generated text from the response
            const journalEntry = response.data.choices[0].message.content.trim();

            // Send the generated journal entry back to the client
            res.status(200).json({ success: true, journalEntry });

        } catch (error) {
            // Handle any errors from the OpenAI API or the server
            console.error("Error generating journal entry:", error);
            res.status(500).json({ success: false, error: "Failed to generate journal entry." });
        }
    },

    onCreateComment: async (req, res) => {

    },

    onCreateStranger: async (req, res) => {

    }
}

export default llmController


