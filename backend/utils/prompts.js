


export const getBasePrompt = (character) => {
    return `You are an actor, brilliant at method acting. You have mastered and fully internalized the role of a fictional character with the following name:
    <character_name>${character.name}</character_name>`
}

export const getAttributes = (character) => {
    const attributes = character.personaAttributes;
    console.log(attributes)

    if (!attributes || attributes.length === 0) {
        return '';
    }

    const validAttributes = attributes.filter(attribute => attribute.name?.trim() || attribute.description?.trim());

    if (validAttributes.length === 0) {
        return '';
    }

    const attributesString = validAttributes
        .map(attribute => `
    <attribute>
        <name>${attribute.name || ''}</name>
        <description>${attribute.description || ''}</description>
    </attribute>
    `).join('');

    return `
    The role of ${character.name}, has the following attributes denoted with the tag <attribute></attribute>:
    <attributes>
        ${attributesString}
    </attributes>
    `;
};


export const getConnections = (characterName, connectedCharacters) => {
    if (!connectedCharacters || connectedCharacters.length === 0) {
        return '';
    }
    let hasValidAttributes = false;
    let hasValidDescriptions = false;

    const validConnections = connectedCharacters.filter(connectedCharacter => {
        const validAttributes = connectedCharacter.attributes?.length > 0 &&
            connectedCharacter.attributes.some(attr => attr.name?.trim() || attr.description?.trim());
        if (validAttributes) {
            hasValidAttributes = true;
        }
        if (connectedCharacter.description?.trim()) {
            hasValidDescriptions = true;
        }
        return connectedCharacter.name && (connectedCharacter.description?.trim() || validAttributes);
    });

    if (validConnections.length === 0) {
        return '';
    }

    let connectionIntroduction = `The character ${characterName}, is connected with the following characters.`;
    if (hasValidAttributes) {
        connectionIntroduction += `
        The <attributes></attributes> tag explains the attributes of the connected characters that ${characterName} is aware of.`;
    }
    if (hasValidDescriptions) {
        connectionIntroduction += `
        The <relationship></relationship> tag explains the relationship between ${characterName}, and the connected character from ${characterName}'s perspective.`;
    }

    const connections = validConnections
        .map(connectedCharacter => {
            const relationshipString = connectedCharacter.description
                ? `<relationship>${connectedCharacter.description}</relationship>`
                : '';

            const attributesString = connectedCharacter.attributes && connectedCharacter.attributes.length > 0
                ? `<attributes>${connectedCharacter.attributes
                    .filter(attr => attr.name?.trim() || attr.description?.trim())
                    .map(attr => `
                        <attribute>
                            <name>${attr.name || ''}</name>
                            <description>${attr.description || ''}</description>
                        </attribute>
                    `).join('')}</attributes>`
                : '';

            return `
                <connected_character>
                    <character_name>${connectedCharacter.name}</character_name>
                    ${relationshipString}
                    ${attributesString}
                </connected_character>`;
        })
        .join('');

    // Return the dynamically built introduction and the connections
    return `${connectionIntroduction}${connections}`;
};
