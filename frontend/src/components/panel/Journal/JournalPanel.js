import BasePanel from '../BasePanel';
import { useEffect, useState } from 'react';
import CreateJournalModal from './CreateJournalModal';
import Feed from './Feed';
import JournalGroup from './JournalGroup';
import JournalSpecificContent from './JournalSpecificContent';

const JournalPanel = (props) => {
    const { id, panels, setPanels, createdCharacters, dispatchCreatedCharacters, createdJournalBooks, dispatchCreatedJournalBooks } = props;
    const [showModal, setShowModal] = useState(false);
    const [selectedBookAndJournalEntry, setSelectedBookAndJournalEntry] = useState(null)
    const onCreateNewJournalBook = () => {
        setShowModal(true);
    };

    return (
        <BasePanel
            id={id}
            panels={panels}
            setPanels={setPanels}
            title="📑 Journal"
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

            {selectedBookAndJournalEntry === null ? (
                <>
                    {/* Create New Journal Book Button */}
                    <div style={styles.stickyButtonContainer}>
                        <button style={styles.createJournalBtn} onClick={onCreateNewJournalBook}>
                            <i className="icon">+</i> Create New Journal
                        </button>
                    </div>

                    <Feed
                        createdJournalBooks={createdJournalBooks}
                        createdCharacters={createdCharacters}
                        panels={panels}
                        setPanels={setPanels}
                        setSelectedBookAndJournalEntry={setSelectedBookAndJournalEntry}
                    ></Feed>
                </>
            ) : (
                <div>
                    {console.log(selectedBookAndJournalEntry)}
                    {/* <JournalGroup
                        key={0}
                        id='specific'
                        selectedMode={selectedBookAndJournalEntry.bookInfo.selectedMode}
                        journalBookPrompt={selectedBookAndJournalEntry.bookInfo.prompt}
                        createdAt={selectedBookAndJournalEntry.bookInfo.createdAt}

                    > */}
                    <JournalSpecificContent
                        key={0}
                        panels={panels}
                        setPanels={setPanels}
                        jouranlBookInfo={selectedBookAndJournalEntry.bookInfo}
                        journalEntry={selectedBookAndJournalEntry.journalEntry}
                        createdCharacter={createdCharacters.characters.find(character => character.uuid === selectedBookAndJournalEntry.journalEntry.ownerUUID)}
                        createdCharacters={createdCharacters}
                    >

                    </JournalSpecificContent>
                    {/* </JournalGroup> */}

                </div>
            )
            }
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
};

export default JournalPanel;
