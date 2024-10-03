import CharacterButton from "../../CharacterButton";
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import apiRequest from "../../../utility/apiRequest";

const MiniProfile = (props) => {
    const { generatedCharacters, setGeneratedCharacters, currentCharacter, setConnectedCharacters, currentCharacterTempConnection,
        dispatchCreatedCharacters,
    } = props

    const { t } = useTranslation();
    const [showAttributes, setShowAttributes] = useState({});
    const [addedCharacters, setAddedCharacters] = useState({});

    const createCharacters = async (character) => {

        const payload = {
            name: character?.name,
            personaAttributes: character.personaAttributes,
            connectedCharacters: character.connectedCharacters,
            uuid: character.uuid,
        };

        dispatchCreatedCharacters({
            type: 'CREATE_CHARACTER',
            payload: payload,
        })
        try {
            await apiRequest("/createCharacter", 'POST', payload);
        }
        catch (error) {
            console.log(error)
        }
        finally {
            const connection = currentCharacterTempConnection.find(connection => connection.uuid === character.uuid)
            setConnectedCharacters((prevCharacters) => [...prevCharacters, connection]);
        }
    }

    const toggleAttributes = (index) => {
        setShowAttributes((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    return (
        <>
            {generatedCharacters?.map((character, index) => {
                const attributeLabelMap = {

                    my_relationship: `${character.name} → ${currentCharacter.name}`,
                    your_relationship: `${currentCharacter.name} → ${character.name}`,
                };

                // Access the first connected character's description (my_relationship)
                const myRelationshipDescription = character.connectedCharacters?.[0]?.description || 'N/A';

                // Access the your_relationship value from currentCharacterTempConnection
                const yourRelationshipDescription = currentCharacterTempConnection?.[index]?.description || 'N/A';

                return (
                    <div key={index} style={styles.characterCard}>
                        <div style={styles.sectionHeader}>
                            <CharacterButton createdCharacter={character} />
                            <button
                                style={addedCharacters[index] ? styles.plusButtonDisabled : styles.plusButton}
                                onClick={() => {
                                    createCharacters(character);
                                    setAddedCharacters((prev) => ({ ...prev, [index]: true }));
                                    console.log(`Character ${character.name} added`);
                                }}
                                disabled={addedCharacters[index]}
                            >
                                {addedCharacters[index] ? t('added') : t('add')}
                            </button>
                        </div>

                        {/* Toggle button */}
                        <button
                            style={styles.toggleButton}
                            onClick={() => toggleAttributes(index)}
                        >
                            {showAttributes[index] ? t('collapse') : t('expand')}
                        </button>

                        {/* 속성 리스트 */}
                        {showAttributes[index] && (
                            <div style={styles.characterInfo}>
                                {character.personaAttributes.length > 0 ? (
                                    <ul style={styles.personaAttributesList}>
                                        {character.personaAttributes.map(({ name, description }, idx) => (
                                            <li key={idx} style={styles.personaAttributeItem}>
                                                <strong>
                                                    {attributeLabelMap[name] || name}: {/* Map to label or use name */}
                                                </strong>
                                                {description || 'N/A'}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>{t('noAttributesFound')}</p>
                                )}

                                {/* Render my_relationship and your_relationship after personaAttributes */}
                                <ul style={styles.personaAttributesList}>
                                    <li style={styles.personaAttributeItem}>
                                        <strong>{attributeLabelMap.my_relationship}:</strong> {myRelationshipDescription}
                                    </li>
                                    <li style={styles.personaAttributeItem}>
                                        <strong>{attributeLabelMap.your_relationship}:</strong> {yourRelationshipDescription}
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                );
            })}
        </>
    );

}

export default MiniProfile

const styles = {
    sectionHeader: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: '10px',
    },
    plusButton: {
        fontSize: '16px', // Adjust font size
        padding: '8px 16px', // Add padding to make it button-like
        cursor: 'pointer',
        color: 'white', // Text color
        backgroundColor: '#6d6dff', // Background color of the button
        border: 'none', // Remove default border
        borderRadius: '5px', // Slightly round the corners
        marginLeft: '10px',
        transition: 'background-color 0.3s ease', // Add a hover transition
    },
    plusButtonHover: {
        backgroundColor: '#5757d1', // Darken the color on hover
    },
    plusButtonDisabled: {
        fontSize: '16px',
        padding: '8px 16px',
        color: 'gray',
        backgroundColor: '#e0e0e0',
        border: 'none',
        borderRadius: '5px',
        marginLeft: '10px',
        transition: 'background-color 0.3s ease',
    },
    characterCard: {
        backgroundColor: 'var(--color-bg-grey)', // Match the background color of Attribute
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '12px',
        boxShadow: '0 4px 4px rgba(196, 196, 196, 0.25)',
        marginTop: '20px',
    },
    toggleButton: {
        padding: '5px 10px',
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    characterInfo: {
        display: 'block',
        paddingLeft: '10px',
    },
    personaAttributesList: {
        listStyleType: 'none',
        padding: 0,
    },
    personaAttributeItem: {
        marginBottom: '10px',
    }


}