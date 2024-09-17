import BasePanel from '../BasePanel';
import { useEffect, useState } from 'react';
import CreateJournalModal from './CreateJournalModal';
import Feed from './Feed';
import JournalGroup from './JournalGroup';

const JournalPanel = (props) => {
    const { id, panels, setPanels, createdCharacters, dispatchCreatedCharacters, createdJournalBooks, dispatchCreatedJournalBooks } = props;
    const [showModal, setShowModal] = useState(false);
    const [selectedJournal, setSelectedJournal] = useState(null)
    const onCreateNewJournalBook = () => {
        setShowModal(true);
    };

    return (
        <BasePanel
            id={id}
            panels={panels}
            setPanels={setPanels}
            title="Journal"
            iconStyles="journal-icon"
        >
            {/* Create New Journal Book Button */}
            <div style={styles.stickyButtonContainer}>
                <button className="create-journal-btn" onClick={() => setShowModal(true)}>
                    + Create New Journal
                </button>

                {/* <button style={styles.createJournalBtn} onClick={onCreateNewJournalBook}>
                    <i className="icon">+</i> Create New Journal
                </button> */}
            </div>

            {showModal && (
                <CreateJournalModal
                    setShowModal={setShowModal}
                    createdJournalBooks={createdJournalBooks}
                    dispatchCreatedJournalBooks={dispatchCreatedJournalBooks}
                    createdCharacters={createdCharacters}
                    dispatchCreatedCharacters={dispatchCreatedCharacters}
                />
            )}

            {selectedJournal === null ? (
                <Feed
                    createdJournalBooks={createdJournalBooks}
                    createdCharacters={createdCharacters}
                    panels={panels}
                    setPanels={setPanels}
                    setSelectedJournal={setSelectedJournal}
                ></Feed>
            ) : (
                <div>
                    {console.log(selectedJournal)}
                    <JournalGroup
                        key={0}
                        id={0}


                    ></JournalGroup>

                </div>
            )}
        </BasePanel>
    );
};

//new JournalHistory
/*
let newJournalBook = {
id: uuidv4(),
journalBookPrompt: journalBookPrompt,
selectedMode: selectedMode,
createdAt: Date.now(),
selectedCharacters: selectedCharacters,
journalEntries: selectedCharacters.map(characterName => (
    {id: uuidv4(), 
     ownerName:
     content: journalEntry,
     commentThreads:[{
        index: 
        createdAt: Date.now(),
        conversationHistory:[{ 
            index:
            characterName:
            text:
            type:
            createdAt: Date.now(),
            },
            { 
            index:
            text:
            type:
            characterName:
            createdAt: Date.now(),
            },
            ]
        }]
    }))
};

``
*/



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
};

export default JournalPanel;
