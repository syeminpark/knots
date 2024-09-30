import { useState } from 'react';
import ModalOverlay from '../ModalOverlay';
import TextArea from '../TextArea';
import CharacterButton from '../CharacterButton'; // Import CharacterButton

const DiscoverCharacterModal = ({ setShowModal, onDiscover, currentCharacter }) => {
    const [textDescription, setTextDescription] = useState('');
    const [results, setResults] = useState(null);

    const handleDiscover = () => {
        onDiscover({ description: textDescription });
        setResults({
            fromCharacter: currentCharacter,
            toCharacter: {
                name: '?',
                profilePicture: null, // Will render default purple circle
            },
        });
    };

    return (
        <ModalOverlay
            title="Discover Character"
            setShowModal={setShowModal}
            footerButtonLabel="Find"
            onFooterButtonClick={handleDiscover}
        >
            <TextArea
                attribute={{ description: textDescription }}
                placeholder="Relationships"
                onChange={(e) => setTextDescription(e.target.value)}
                styles={styles}
            />
            {results && (
                <div style={styles.resultsContainer}>
                    <div style={styles.resultBox}>
                        <div style={styles.characterProfiles}>
                            <CharacterButton createdCharacter={results.fromCharacter} />
                            <span style={styles.arrow}>→</span>
                            <CharacterButton createdCharacter={results.toCharacter} />
                        </div>
                    </div>
                </div>
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
        alignItems: 'center',
        gap: '20px',
    },
    arrow: {
        fontSize: '24px',
        color: '#333',
        marginLeft: '-300px', // Negative margin to move the arrow left
        marginRight: '5px',  // Adjust as needed
    },

    resultBox: {
        border: '1px solid #ccc', // Gray border
        borderRadius: '6px',
        padding: '10px',
    },
    
};

export default DiscoverCharacterModal;
