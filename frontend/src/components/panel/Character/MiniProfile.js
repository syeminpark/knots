import CharacterButton from "../../CharacterButton";
import { useTranslation } from 'react-i18next';

import apiRequest from "../../../utility/apiRequest";
import { useState, useRef, useEffect } from 'react';
import { debounce } from 'lodash';

const MiniProfile = (props) => {
    const { generatedCharacters, currentCharacter, setConnectedCharacters, currentCharacterTempConnection, dispatchCreatedCharacters } = props;
    const { t } = useTranslation();
    const [showAttributes, setShowAttributes] = useState({});
    const [addedCharacters, setAddedCharacters] = useState({});
    const connectedCharactersRef = useRef(currentCharacter.connectedCharacters || []);

    // Initialize the ref when the component mounts
    useEffect(() => {
        connectedCharactersRef.current = currentCharacter.connectedCharacters || [];
    }, [currentCharacter.connectedCharacters]);

    // Debounced version of the `createCharacters` function to prevent rapid state updates
    const createCharacters = debounce(async (character) => {
        const payload = {
            name: character?.name,
            personaAttributes: character.personaAttributes,
            connectedCharacters: character.connectedCharacters,
            uuid: character.uuid,
            includeInJournal: true,
            type: character.type

        };

        dispatchCreatedCharacters({
            type: 'CREATE_CHARACTER',
            payload: payload,
        });

        try {
            await apiRequest("/createCharacter", 'POST', payload);
        } catch (error) {
            console.log(error);
        } finally {
            const connection = currentCharacterTempConnection.find(connection => connection.uuid === character.uuid);

            // Batch update using the latest state from the ref
            setConnectedCharacters((prevCharacters) => {
                const newCharacters = [...connectedCharactersRef.current, connection];
                connectedCharactersRef.current = newCharacters; // Ensure ref is up to date
                return newCharacters;
            });

            console.log('Character added:', character.name);
        }
    }, 300); // Debounce with a 300ms delay


    const toggleAttributes = (uuid) => {
        setShowAttributes((prev) => ({
            ...prev,
            [uuid]: !prev[uuid],
        }));
    };

    return (
        <>
            {generatedCharacters?.map((character) => {
                const attributeLabelMap = {
                    my_relationship: `${character.name} → ${currentCharacter.name}`,
                    your_relationship: `${currentCharacter.name} → ${character.name}`,
                };

                // Access the first connected character's description (my_relationship)
                const myRelationshipDescription = character.connectedCharacters?.[0]?.description || 'N/A';

                // Access the your_relationship value from currentCharacterTempConnection
                const yourRelationshipDescription = currentCharacterTempConnection?.find(
                    (connection) => connection.uuid === character.uuid
                )?.description || 'N/A';

                return (
                    <div key={character.uuid} style={styles.characterCard}>
                        <div style={styles.sectionHeader}>
                            <CharacterButton createdCharacter={character} />
                            <button
                                style={addedCharacters[character.uuid] ? styles.plusButtonDisabled : styles.plusButton}
                                onClick={() => {
                                    createCharacters(character);
                                    setAddedCharacters((prev) => ({ ...prev, [character.uuid]: true }));
                                    console.log(`Character ${character.name} added`);
                                }}
                                disabled={addedCharacters[character.uuid]} // Use uuid to track if added
                            >
                                {addedCharacters[character.uuid] ? t('added') : t('add')}
                            </button>
                        </div>

                        {/* Toggle button */}
                        <button
                            style={styles.toggleButton}
                            onClick={() => toggleAttributes(character.uuid)}
                        >
                            {showAttributes[character.uuid] ? t('collapse') : t('expand')}
                        </button>

                        {/* 속성 리스트 */}
                        {showAttributes[character.uuid] && (
                            <div style={styles.characterInfo}>
                                {character.personaAttributes.length > 0 ? (
                                    <ul style={styles.personaAttributesList}>
                                        {character.personaAttributes.map(({ name, description }, idx) => (
                                            <li key={idx} style={styles.personaAttributeItem}>
                                                <strong>
                                                    {attributeLabelMap[name] || name} {/* Map to label or use name */}
                                                </strong>
                                                <br></br>
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
                                        <strong>{attributeLabelMap.my_relationship}</strong>  <br></br> {myRelationshipDescription}
                                    </li>
                                    <li style={styles.personaAttributeItem}>
                                        <strong>{attributeLabelMap.your_relationship}</strong>  <br></br> {yourRelationshipDescription}
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

export default MiniProfile;

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
        fontSize: 'var(--font-small)',
        fontWeight: 'var(--font-regular)',
        lineHeight: 'var(--line-height)',

    },
    personaAttributesList: {
        listStyleType: 'none',
        padding: 0,
    },
    personaAttributeItem: {
        marginBottom: '10px',
    }


}