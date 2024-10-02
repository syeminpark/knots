import { useState } from 'react';
import ModalOverlay from '../ModalOverlay';
import TextArea from '../TextArea';
import CharacterButton from '../CharacterButton';
import { useTranslation } from 'react-i18next';
import ToggleButton from '../ToggleButton';
import apiRequest from '../../utility/apiRequest';
import Loading from '../Loading';

const DiscoverCharacterModal = ({ setShowModal, onDiscover, currentCharacter }) => {
    const { t } = useTranslation();
    const [textDescription, setTextDescription] = useState('');
    const [stage, setStage] = useState(0);
    const [loading, setLoading] = useState(false)

    const handleDiscover = async () => {
        // onDiscover({ description: textDescription });
        // setStage(1);

        setLoading(true)


        const payload = {
            characterUUID: currentCharacter?.uuid,
            content: textDescription
        }
        try {
            const response = await apiRequest("/createLLMStranger", 'POST', payload)
            console.log(response)
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setShowModal(false)
            setLoading(false)
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

            {stage === 1 && (
                <>
                    {/* <ToggleButton direction="left" onClick={backArrowClick} />
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
                    /> */}

                    {/* Move the button inside the container */}
                    {/* <div style={styles.regenerateButtonContainer}>
                        <button style={styles.regenerateButton}>
                            {t('findAgain')}
                        </button>
                    </div> */}

                    {/* <div style={styles.resultBox}>
                        <TextArea
                            attribute={{ description: `` }}
                            placeholder={t('relationships')}
                            onChange={(e) => setTextDescription(e.target.value)}
                            styles={styles}
                        />
                        <TextArea
                            attribute={{ description: textDescription }}
                            placeholder={t('relationships')}
                            onChange={(e) => setTextDescription(e.target.value)}
                            styles={styles}
                        />
                        <TextArea
                            attribute={{ description: textDescription }}
                            placeholder={t('relationships')}
                            onChange={(e) => setTextDescription(e.target.value)}
                            styles={styles}
                        />
                    </div> */}
                </>
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
};

export default DiscoverCharacterModal;
