import BasePanel from '../BasePanel';
import { useEffect, useState } from 'react';
import CreateJournalModal from './CreateJournalModal';
import Feed from './Feed';
import JournalSpecificContent from './JournalSpecificContent';

const JournalPanel = (props) => {
    const { id, panels, setPanels, createdCharacters, dispatchCreatedCharacters, createdJournalBooks, dispatchCreatedJournalBooks } = props;
    const [showModal, setShowModal] = useState(false);
    const [selectedBookAndJournalEntry, setSelectedBookAndJournalEntry] = useState(null)
    const [expandedGroup, setExpandedGroup] = useState({});

    return (
        <BasePanel
            id={id}
            panels={panels}
            setPanels={setPanels}
            title="📑 Journal"
            iconStyles="journal-icon"
        >
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
                        <button className="create-journal-btn" onClick={() => setShowModal(true)}>
                            + Create New Journal
                        </button>
                    </div>

                    <Feed
                        createdJournalBooks={createdJournalBooks}
                        createdCharacters={createdCharacters}
                        panels={panels}
                        setPanels={setPanels}
                        setSelectedBookAndJournalEntry={setSelectedBookAndJournalEntry}
                        expandedGroup={expandedGroup}
                        setExpandedGroup={setExpandedGroup}
                    ></Feed>
                </>
            ) : (
                <div>
                    <JournalSpecificContent
                        key={0}
                        panels={panels}
                        setPanels={setPanels}
                        selectedBookAndJournalEntry={selectedBookAndJournalEntry}
                        setSelectedBookAndJournalEntry={setSelectedBookAndJournalEntry}
                        createdCharacters={createdCharacters}
                        dispatchCreatedCharacters={dispatchCreatedCharacters}
                        dispatchCreatedJournalBooks={dispatchCreatedJournalBooks}
                    >
                    </JournalSpecificContent>
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
