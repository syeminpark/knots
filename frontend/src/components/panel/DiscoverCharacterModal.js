import { useState, useEffect } from 'react';
import ModalOverlay from '../ModalOverlay';
import TextArea from '../TextArea';
import CharacterButton from '../CharacterButton'; // Import CharacterButton
import { useTranslation } from 'react-i18next';
import ToggleButton from '../ToggleButton';

const DiscoverCharacterModal = ({ setShowModal, onDiscover, currentCharacter }) => {
    const { t } = useTranslation();
    const [textDescription, setTextDescription] = useState('');
    const [stage, setStage] = useState(0); // Stage controls the flow

    const handleDiscover = () => {
        onDiscover({ description: textDescription });
        setStage(1); // Move to stage 1 after the discovery process
    };

    const backArrowClick = () => {
        setStage(0);
    };

    const footerButtonLabel = stage === 0 ? t('find') : t('close');
    const onFooterButtonClick = stage === 0 ? handleDiscover : () => setShowModal(false)

    return (
        <ModalOverlay
            title={t('discoverCharacter')}
            setShowModal={setShowModal}
            footerButtonLabel={footerButtonLabel}
            onFooterButtonClick={onFooterButtonClick}
        >
            {/* Control what is displayed based on the stage */}
            {stage === 0 && (

                <TextArea
                    attribute={{ description: textDescription }}
                    placeholder={t('relationships')}
                    onChange={(e) => setTextDescription(e.target.value)}
                    styles={styles}
                />

            )}

            {stage === 1 && (
                <>
                    <ToggleButton direction='left' onClick={backArrowClick}></ToggleButton>
                    <div style={styles.resultsContainer}>
                        <div style={styles.resultBox}>
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
                                            profilePicture: null, // Will render default purple circle
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
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
    },
    characterProfiles: {
        display: 'flex',
        alignItems: 'center',  // Vertically center the buttons and the arrow
        justifyContent: 'center',  // Horizontally center the buttons and the arrow
        gap: '20px',  // Space between buttons and arrow
    },
    arrow: {
        fontSize: '24px',
        color: '#333',
        // Removed the negative margin
        marginRight: '5px', // Adjust as needed for the arrow spacing
    },

    resultBox: {
        border: '1px solid #ccc', // Gray border
        borderRadius: '6px',
        padding: '10px',
        textAlign: 'center',  // Center the content within the box
    },
};


export default DiscoverCharacterModal;
