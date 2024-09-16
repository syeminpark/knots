import BasePanel from '../BasePanel';
import { useState } from 'react';
import CreateJournalModal from './CreateJournalModal';
import JournalGroup from './JournalGroup';
import JournalContent from './JournalContent';

const JournalPanel = (props) => {
    const { id, panels, setPanels, createdCharacters, setCreatedCharacters, createdJournals, setCreatedJournals } = props;
    const [showModal, setShowModal] = useState(false);

    const onCreateNewJournal = () => {
        setShowModal(true);
    };

    const finishJournalEntry = (selectedMode, _journalEntry, selectedCharacters) => {
        console.log('hey', _journalEntry)
        console.log(selectedCharacters, _journalEntry, selectedMode);
        let newJournal = {
            journalEntry: _journalEntry,
            selectedMode: selectedMode,
            createdAt: Date.now(),
            selectedCharacters: selectedCharacters,
            generatedJournal: selectedCharacters.map(characterName => ({ characterName: characterName, content: _journalEntry }))
        };
        console.log('new Journal', newJournal)
        if (selectedMode === "System Generate") {
            //나중에 LLM Generate으로 변경 
        }
        setCreatedJournals([...createdJournals, newJournal]);
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
                {createdJournals.length === 0 && (
                    'No Journals yet...'
                )}
                {createdJournals.slice().reverse().map((journal, index) => (  // Reverse the order of journals
                    <JournalGroup
                        key={index}
                        selectedMode={journal.selectedMode}
                        journalEntry={journal.journalEntry}
                        createdAt={journal.createdAt}
                    >
                        {journal.generatedJournal.map((generatedJournal, index) => (
                            <JournalContent
                                key={index}
                                panels={panels}
                                setPanels={setPanels}
                                createdCharacter={createdCharacters.find(character => character.name === generatedJournal.characterName)}
                                content={generatedJournal.content}
                            />
                        ))}
                    </JournalGroup>
                ))}
            </div>
        </BasePanel >
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