import { useState } from 'react';
import ModalOverlay from '../ModalOverlay';
import TextArea from '../TextArea';
import CharacterButton from '../CharacterButton';
import { useTranslation } from 'react-i18next';
import ToggleButton from '../ToggleButton';
import apiRequest from '../../utility/apiRequest';
import Loading from '../Loading';
import { v4 as uuidv4 } from 'uuid';
import { connected } from 'process';

const DiscoverCharacterModal = ({ setShowModal, onDiscover, currentCharacter, setConnectedCharacters }) => {
    const { t } = useTranslation();
    const [textDescription, setTextDescription] = useState('');
    const [stage, setStage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [generatedCharacters, setGeneratedCharacters] = useState([]); 
    const [personaAttributes, setPersonaAttributes] = useState([]);

    const transformToAttributes = (character) => {
        const personaAttributes = [];
        const connectedCharacters = [];
        let your_relationship;

        for (const attribute in character?.attributes) {
            const attrValue = character.attributes[attribute];

            if (attrValue && typeof attrValue === 'object' && attrValue?.description) {
                if (attribute === "my_relationship") {
                    connectedCharacters.push({
                        name: currentCharacter.name,
                        description: attrValue.description,
                        uuid: currentCharacter.uuid,
                    });
                } else if (attribute === "your_relationship") {
                    your_relationship = attrValue.description;
                    // You may want to use this `your_relationship` to create the relationship
                } else {
                    personaAttributes.push({
                        name: attribute,
                        description: attrValue.description,
                    });
                }
            }
        }

        return { personaAttributes, connectedCharacters, your_relationship };
    };
    console.log(currentCharacter)

    const handleDiscover = async () => {
        setLoading(true);
        setStage(1);
        let tempConnectedCharacters = [];

        try {
            const payload = {
                characterUUID: currentCharacter?.uuid,
                content: textDescription,
            };

            const LLMResponse = await apiRequest("/createLLMStranger", 'POST', payload);
            const characterObject = JSON.parse(LLMResponse?.generation);

            // 캐릭터 정보 저장 및 personaAttributes 업데이트
            setGeneratedCharacters(characterObject?.characters);

            // Persona Attributes 상태 업데이트
            const { personaAttributes } = transformToAttributes(characterObject?.characters?.[0]);
            setPersonaAttributes(personaAttributes);

            await Promise.all(
                characterObject?.characters?.map(async (character) => {
                    const { connectedCharacters, your_relationship } = transformToAttributes(character);
                    const uuid = uuidv4();

                    const createPayload = {
                        uuid: uuid,
                        name: character?.name,
                        personaAttributes: personaAttributes,
                        connectedCharacters: connectedCharacters,
                    };

                    await apiRequest("/createCharacter", 'POST', createPayload);

                // Collect connected characters
                    if (your_relationship) {
                        tempConnectedCharacters.push({
                            name: character?.name,
                            description: your_relationship,
                            uuid: uuid,
                        });
                    }
                })
            );

            // Update connected characters once all async operations are done
            setConnectedCharacters((prevCharacters) => [...prevCharacters, ...tempConnectedCharacters]);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const backArrowClick = () => {
        setStage(0);
    };

    const footerButtonLabel = stage === 0 ? t('find') : null;
    const onFooterButtonClick = stage === 0 ? handleDiscover : () => setShowModal(false);

    return (
        <ModalOverlay
            title={t('discoverCharacter')}
            setShowModal={setShowModal}
            footerButtonLabel={footerButtonLabel}
            onFooterButtonClick={onFooterButtonClick}
        >
            {stage === 0 && (
                <>
                    <div style={styles.resultsContainer}>
                        <div style={styles.characterProfiles}>
                            <div>
                                <CharacterButton createdCharacter={currentCharacter} />
                            </div>
                            <div>
                                <span style={styles.arrow}>⇄</span>
                            </div>
                            <div>
                                <CharacterButton
                                    createdCharacter={{
                                        name: '?',
                                        profilePicture: null,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <TextArea
                        attribute={{ description: textDescription }}
                        placeholder={t('relationships')}
                        onChange={(e) => setTextDescription(e.target.value)}
                        styles={styles}
                        label={t('association')}
                    />
                </>
            )}

{stage === 1 && generatedCharacters.length > 0 && (
    <>
        <ToggleButton direction="left" onClick={backArrowClick} />

        {generatedCharacters.map((character, index) => (
            <div key={index} style={styles.characterCard}>

                <div style={styles.sectionHeader}>
                    <CharacterButton createdCharacter={character} />
                    <button 
                        style={styles.plusButton} 
                        onClick={() => {
                            // Add your functionality here for what happens when you add the character
                            console.log(`Character ${character.name} added`);
                        }}
                    >
                        + 추가
                    </button>
                </div>

                <div style={styles.characterInfo}>
                    {/* Persona Attributes */}
                    {personaAttributes.length > 0 ? (
                        <ul style={styles.personaAttributesList}>
                            {personaAttributes.map((attr, index) => (
                                <li key={index} style={styles.personaAttributeItem}>
                                    <strong>{attr.name}:</strong> {attr.description}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>{t('noAttributesFound')}</p>
                    )}
                    <p><strong>{t('relationship')}:</strong> {character?.attributes?.my_relationship?.description || 'N/A'}</p>
                </div>
            </div>
        ))}
    </>
)}





            {loading && <Loading />}
        </ModalOverlay>
    );
};

const styles = {
    description: {
        width: '100%',
        minHeight: '70px',
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: 'white',
        fontSize: 'var(--font-small)',
        resize: 'vertical',
        overflow: 'hidden',
        whiteSpace: 'pre-wrap',
        border: '1px solid #b8b8f3',
    },
    resultsContainer: {
        marginTop: '20px',
        marginBottom: '20px',
    },
    personaAttributesList: {
        listStyleType: 'none',
        padding: 0,
    },
    personaAttributeItem: {
        marginBottom: '10px',
    },
    characterProfiles: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
    },
    arrow: {
        fontSize: '24px',
        color: '#333',
        marginRight: '5px',
    },
    resultBox: {
        marginTop: '20px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        padding: '10px',
        textAlign: 'center',
    },
    textAreaContainer: {},
    textAreaLabel: {
        display: 'block',
        color: '#6d6dff',
        fontSize: 'var(--font-medium)',
        fontWeight: 'var(--font-bold)',
        marginBottom: '10px',
    },
    regenerateButtonContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px', // Optional: Add margin to separate from other elements
    },
    regenerateButton: {
        // backgroundColor: 'var(--color-secondary)',
        backgroundColor: 'black',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: 'var(--font-medium)',
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: '10px',
    },
    sectionHeaderLabel: {
        color: '#6d6dff',
        fontSize: 'var(--font-medium)',
        fontWeight: 'var(--font-bold)',
        marginLeft: '10px', // Ensure some spacing between the character button and the name
    },
    characterCard: {
        backgroundColor: 'var(--color-bg-grey)', // Match the background color of Attribute
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '12px',
        boxShadow: '0 4px 4px rgba(196, 196, 196, 0.25)',
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
};

export default DiscoverCharacterModal;

