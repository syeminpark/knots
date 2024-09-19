import BasePanel from '../BasePanel';
import { useEffect, useState } from 'react';
import CreateJournalModal from './CreateJournalModal';
import Feed from './Feed';
import DetailedJournal from './DetailedJournal';

const JournalPanel = (props) => {
    const { id, panels, setPanels, createdCharacters, dispatchCreatedCharacters, createdJournalBooks, dispatchCreatedJournalBooks, reference } = props;
    const [showModal, setShowModal] = useState(false);
    const [selectedBookAndJournalEntry, setSelectedBookAndJournalEntry] = useState(null)
    const [expandedGroup, setExpandedGroup] = useState({});
    const [trackingJournalEntry, setTrackingJournalEntry] = useState(null);

    useEffect(() => {
        if (reference) {
            setTrackingJournalEntry(reference.entryUUID);
            setExpandedGroup({ [reference.bookUUID]: true })
        }
    }, [reference]);

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
                        <button className="create-new-btn" onClick={() => setShowModal(true)}>
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
                        trackingJournalEntry={trackingJournalEntry}  // Pass the selected UUID
                        setTrackingJournalEntry={setTrackingJournalEntry}
                    ></Feed>
                </>
            ) : (
                <>
                    <DetailedJournal
                        key={0}
                        panels={panels}
                        setPanels={setPanels}
                        selectedBookAndJournalEntry={selectedBookAndJournalEntry}
                        setSelectedBookAndJournalEntry={setSelectedBookAndJournalEntry}
                        createdCharacters={createdCharacters}
                        dispatchCreatedCharacters={dispatchCreatedCharacters}
                        dispatchCreatedJournalBooks={dispatchCreatedJournalBooks}
                    >
                    </DetailedJournal>
                </>

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
