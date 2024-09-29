async function generateNaturalPersonaA(name, personaAttributes) {
    const systemPrompt = `
    Create a persona for ${name}. The persona should be written in Korean and should not alter any  
    words or phrases of the original text. The attributes of ${name} will be provided below`;

    const userPrompt = personaAttributes

    // Step 5: Get the LLM response for the comment
    const response = await openAI.createChatCompletion({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ],
        model: "gpt-4o",
    });
    console.log(response)
    const data = response.choices[0].message.content;

    return data
}


async function checkAndGeneratePersona(character, shouldUpdatePersonaA, shouldUpdatePersonaB) {
    const now = Date.now();

    // Regenerate Persona A if necessary, otherwise use the existing one
    let naturalPersonaA = character.naturalPersonaA;
    if (shouldUpdatePersonaA) {
        naturalPersonaA = await generateNaturalPersonaA(character.name, character.personaAttributes);
        character.naturalPersonaA = naturalPersonaA;
        character.lastGeneratedPersonaA = now;
    }

    // Regenerate Persona B if necessary, otherwise use the existing one
    let naturalPersonaB = character.naturalPersonaB;
    if (shouldUpdatePersonaB) {
        naturalPersonaB = await generateNaturalPersonaB(character.name, character.personaAttributes, character.connectedCharacters);
        character.naturalPersonaB = naturalPersonaB;
        character.lastGeneratedPersonaB = now;
    }

    // Save only if any persona was regenerated
    if (shouldUpdatePersonaA || shouldUpdatePersonaB) {
        await character.save();
    }

    // Return up-to-date personas, whether they were regenerated or not
    return {
        naturalPersonaA: character.naturalPersonaA,
        naturalPersonaB: character.naturalPersonaB,
    };
}