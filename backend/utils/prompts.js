import CharacterModel from "../models/character.js";

export const getAttributesString = (attributes) => {

    const attributeString = Object.keys(attributes)
        .map(attr => `
    <attribute>
        <name>${attr}</name>
        <description>${personaAttributes[attr]}</description>
    </attribute>
`)
        .join('');
    return attributeString
}




export const getConnections = (character, connectedCharacters) => {


    const connections = Object.keys(connectedCharacters)
        .map(async (object) => {
            const connectedCharacter = await CharacterModel.getCharacterByUUID(object.uuid);
            if (connectedCharacter) {
                res.status(200).json(connectedCharacter);
                `
                <character_name> ${connectedCharacter.name} </character_name> 
                ${getAttributesString(connectedCharacter.personaAttributes)}
                  <relationship> 
                  <my_POV> ${object.description} </my_POV>
                    </relationship> 
                `
            } else {
                res.status(404).json({ error: 'Character not found.' });
            }


        })

        `
    <character_name>  </character_name> 
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
                `


        .join('');
    return attributeString
}

