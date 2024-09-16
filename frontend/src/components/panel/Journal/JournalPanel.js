import BasePanel from '../BasePanel';
import { useState } from 'react';
import CreateJournalModal from './CreateJournalModal';
import JournalGroup from './JournalGroup';

const JournalPanel = (props) => {
    const { id, panels, setPanels, createdCharacters } = props;
    const [showModal, setShowModal] = useState(false);

    const onCreateNewJournal = () => {
        setShowModal(true);
    };

    const finishJournalEntry = (selectedMode, journalEntry, selectedCharacters) => {
        console.log(selectedCharacters, journalEntry, selectedMode);
    };

    return (
        <BasePanel
            id={id}
            panels={panels}
            setPanels={setPanels}
            title="Journal"
            iconStyles="journal-icon"
        >
            {/* Create New Journal Button */}
            <div style={styles.stickyButtonContainer}>
                <button style={styles.createJournalBtn} onClick={onCreateNewJournal}>
                    <i className="icon">+</i> Create New Journal
                </button>
            </div>

            {/* Conditionally render the modal */}
            {showModal && (
                <CreateJournalModal
                    setShowModal={setShowModal}
                    createdCharacters={createdCharacters}
                    finishJournalEntry={finishJournalEntry}
                />
            )}

            <div style={styles.journalFeed}>
                {/* Feed Section */}
                <h2 style={styles.feedHeader}>Feed</h2>
                <JournalGroup
                    type={'System Generated'}
                    journalEntry={'What was your dream yesterday?'} 
                />
                <JournalGroup
                    type={'Manual Post'}
                    journalEntry={'Today I went to the shopping mall and?'} 
                />
        
            </div>
        </BasePanel>
    );
};

const styles = {
    stickyButtonContainer: {
        position: 'sticky',
        zIndex: 10, 
        backgroundColor: 'white', 

    },
    createJournalBtn: {
        display: 'block',
        backgroundColor: '#6c63ff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '14px 0',
        fontSize: '16px',
        cursor: 'pointer',
        textAlign: 'center',
        width: '100%',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    feedHeader: {
        fontSize: '18px',
        color: '#3838ff',
        textAlign: 'left',
        fontWeight: 'bold',
    },
    journalFeed: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
};

export default JournalPanel;