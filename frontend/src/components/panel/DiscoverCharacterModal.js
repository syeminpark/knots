import { useState } from 'react';
import ModalOverlay from '../ModalOverlay';
import TextArea from '../TextArea'; 

const DiscoverCharacterModal = ({ setShowModal, onDiscover }) => {
    const [textDescription, setTextDescription] = useState(''); 
    const [results, setResults] = useState([]); 

    const handleDiscover = () => {
        onDiscover({ description: textDescription });
        // setShowModal(false);
        // result test
        setResults([
            { name: 'Snape' },
            { name: 'Dobby' },
            { name: 'Luna' },
            { name: 'Dumbledore' }
        ]);
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
        {results.length > 0 && (
        <div style={styles.resultsContainer}>
            <h3>Results</h3>
            <ul style={styles.resultList}>
                {results.map((result, index) => (
                    <li key={index} style={styles.resultItem}>
                        <div style={styles.resultContent}>
                            <div style={styles.icon}></div>
                            <span style={styles.resultText}>{result.name}</span>
                        </div>
                    </li>
                ))}
            </ul>
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
        border: '1px solid #b8b8f3'
    },
    resultsContainer: {
        marginTop: '20px',
    },
    resultList: {
        listStyleType: 'none',
        padding: 0,
    },
    resultItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        marginBottom: '10px',
    },
    resultContent: {
        display: 'flex',
        alignItems: 'center',
    },
    resultText: {
        fontFamily: 'var(--font-secondary)',
        fontSize: 'var(--font-small)', 
        fontWeight: 'var(--font-semibold)',
        color: '#333', 
    },
    icon: {
        width: '30px',
        height: '30px',
        backgroundColor: 'var(--color-primary)',
        borderRadius: '50%',
        marginRight: '10px',
    }
};

export default DiscoverCharacterModal;
