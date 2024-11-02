import { useState } from 'react';
import ModalOverlay from '../ModalOverlay';
import TextArea from '../TextArea';
import CharacterButton from '../CharacterButton';
import { useTranslation } from 'react-i18next';
import apiRequest from '../../utility/apiRequest';
import Loading from '../Loading';
import { v4 as uuidv4 } from 'uuid';
import MiniProfile from './Character/MiniProfile';

const DiscoverCharacterModal = ({ setShowModal, onDiscover, currentCharacter, setConnectedCharacters, dispatchCreatedCharacters }) => {
    const { t } = useTranslation();
    const [textDescription, setTextDescription] = useState('');
    const [stage, setStage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [generatedCharacters, setGeneratedCharacters] = useState([]);
    const [currentCharacterTempConnection, setCurrentCharacterTempConnection] = useState([]);

    const transformToAttributes = (characters) => {
        console.log('responseCharacter', characters);
        const tempCharacters = []

        characters.forEach(character => {
            const object = {
                createdAt: Date.now(),
                connectedCharacters: [],
                uuid: uuidv4(),
                personaAttributes: [],
                name: character?.name || null,
                type: { type: "SYSTEMGENERATE", prompt: textDescription },


            };
            const keyMap = {
                introduction: "소개",
                backstory: "백스토리"
            };
            console.log(object)

            for (const key in character) {
                if (character.hasOwnProperty(key) && character[key]) {
                    if (keyMap[key]) {
                        object.personaAttributes.push({
                            name: keyMap[key],
                            description: character[key],
                            uuid: uuidv4()
                        });
                    } else if (key === "my_relationship") {
                        object.connectedCharacters.push({
                            name: currentCharacter.name,
                            uuid: currentCharacter.uuid,
                            description: character[key],
                            includeInJournal: true,
                        });
                    } else if (key === "your_relationship") {
                        setCurrentCharacterTempConnection((prev) => [
                            ...prev,
                            {
                                name: object?.name,
                                uuid: object.uuid,
                                description: character[key],
                                includeInJournal: true,
                            }
                        ]);
                    }
                }
            }
            tempCharacters.push(object)
        });
        return tempCharacters
    };


    // console.log('currentCharacter', currentCharacter)

    const handleDiscover = async () => {

        if (textDescription == '') {
            alert(t('pleaseWriteContent'))
            return
        }
        setLoading(true);
        setCurrentCharacterTempConnection([])

        try {

            const payload = {
                characterUUID: currentCharacter?.uuid,
                content: textDescription,
            };
            const LLMResponse = await apiRequest("/createLLMStranger", 'POST', payload);
            const characterObject = JSON.parse(LLMResponse?.generation);

            const tempCharacters = transformToAttributes(characterObject.characters)
            setGeneratedCharacters(tempCharacters);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setStage(1);
        }
    };

    const footerButtonLabel = t('find');
    const onFooterButtonClick = loading ? null : handleDiscover;

    return (
        <ModalOverlay
            title={t('discoverCharacter')}
            setShowModal={setShowModal}
        >
            {/* TextArea 및 CharacterButton 부분 */}
            {(stage === 0 || stage === 1) && (
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

                    <div style={styles.modalFooter}>
                        <button
                            style={styles.footerButton}
                            onClick={onFooterButtonClick}
                            disabled={loading}
                        >
                            {footerButtonLabel}
                        </button>
                    </div>
                    <div>
                        {loading && <Loading text={t("findingText")} />}
                    </div>
                </>
            )}

            {/* 생성된 캐릭터 목록 */}
            {stage === 1 && generatedCharacters?.length > 0 && (

                <MiniProfile
                    generatedCharacters={generatedCharacters}
                    setGeneratedCharacters={setGeneratedCharacters}
                    currentCharacter={currentCharacter}
                    setConnectedCharacters={setConnectedCharacters}
                    currentCharacterTempConnection={currentCharacterTempConnection}

                    styles={styles} // Pass the styles object here
                    dispatchCreatedCharacters={dispatchCreatedCharacters}
                />
            )}
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

    sectionHeaderLabel: {
        color: '#6d6dff',
        fontSize: 'var(--font-medium)',
        fontWeight: 'var(--font-bold)',
        marginLeft: '10px', // Ensure some spacing between the character button and the name
    },

    footerButton: {
        backgroundColor: 'black',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: 'var(--font-medium)',
    },
    modalFooter: {
        textAlign: 'center',
        margin: '10px',
    },

};

export default DiscoverCharacterModal;

