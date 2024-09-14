import BasePanel from '../BasePanel';
import { useState } from 'react';
import CreateJournalModal from './CreateJournalModal';

const JournalPanel = (props) => {
    const { id, panels, setPanels, createdCharacters } = props;
    const [showModal, setShowModal] = useState(false)

    const onCreateNewJournal = () => {
        setShowModal(true)
    }

    return (
        <BasePanel
            id={id}
            panels={panels}
            setPanels={setPanels}
            title="Journal"
        >
            {/* Create New Journal Button */}
            <button style={styles.createJournalBtn} onClick={onCreateNewJournal}>
                <i className="icon">+</i> Create New Journal
            </button>

            {/* Conditionally render the modal */}
            {showModal && (
                <CreateJournalModal
                    setShowModal={setShowModal}
                    createdCharacters={createdCharacters}
                />
            )}

            {/* Feed Section */}
            <h2 style={styles.feedHeader}>Feed</h2>
            <div style={styles.journalFeed}>
                {/* Journal Entry 1 */}
                <div style={styles.journalEntry}>
                    <div style={styles.entryHeader}>
                        <strong style={styles.entryTitle}>What was your dream yesterday?</strong>
                        <span style={styles.entryTime}>1h</span>
                    </div>
                    <div >
                        <span style={{ ...styles.entryTag, ...styles.systemGenerated }}>System Generated</span>
                    </div>
                    <button style={styles.entryToggle}>v</button>
                </div>


                {/* Journal Entry 3 */}
                <div style={styles.journalEntry}>
                    <div style={styles.entryHeader}>
                        <strong style={styles.entryTitle}>Today I went to...</strong>
                        <span style={styles.entryTime}>15h</span>
                    </div>
                    <div >
                        <span style={{ ...styles.entryTag, ...styles.manual }}>Manual</span>
                    </div>
                    <button style={styles.entryToggle}>v</button>
                </div>
            </div>
        </BasePanel>
    );
};

const styles = {
    createJournalBtn: {
        display: 'block',
        backgroundColor: '#6c63ff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '14px 0', // Ensure padding on top and bottom

        fontSize: '16px',
        cursor: 'pointer',
        textAlign: 'center',
        width: '100%',
        fontWeight: 'bold', // Bold font as in the reference
        marginBottom: '40px',
    },
    feedHeader: {
        fontSize: '18px',
        color: '#3838ff',
        marginBottom: '20px',
        textAlign: 'left', // Aligns header to the left
        fontWeight: 'bold',
    },
    journalFeed: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    journalEntry: {
        backgroundColor: '#f7f7ff',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        textAlign: 'center',
        position: 'relative', // Position relative to allow for toggle button alignment
    },
    entryHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    entryTitle: {
        fontWeight: 'bold',
        fontSize: '16px',
        flexGrow: 1, // Pushes the title to take up available space
    },
    entryTime: {
        color: '#9b9b9b',
        fontSize: '12px',
        marginLeft: '10px',
    },

    entryTag: {
        padding: '5px 10px',
        borderRadius: '8px',
        fontSize: '12px',
        marginBottom: '10px',
        alignItems: 'center',

    },
    systemGenerated: {
        backgroundColor: '#f0eaff',
        color: '#6c63ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    manual: {
        backgroundColor: '#e0eaff',
        color: '#6c63ff',
        alignItems: 'center',
        justifyContent: 'center',

    },
    entryToggle: {
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '18px',
        color: 'gray',
        cursor: 'pointer',
        marginTop: '10px'

    }
};

export default JournalPanel;
