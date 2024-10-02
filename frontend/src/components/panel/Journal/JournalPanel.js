import BasePanel from '../BasePanel';
import { useEffect, useState } from 'react';
import CreateJournalModal from './CreateJournalModal';
import Feed from './Feed';
import DetailedJournal from './DetailedJournal';
import { getJournalBookInfoAndEntryByIds } from './journalBookReducer';
import { useTranslation } from 'react-i18next';


const JournalPanel = (props) => {
    const { t } = useTranslation();
    const { id, panels, setPanels, createdCharacters, dispatchCreatedCharacters, createdJournalBooks, dispatchCreatedJournalBooks, reference } = props;
    const [showModal, setShowModal] = useState(false);
    const [selectedBookAndJournalEntry, setSelectedBookAndJournalEntry] = useState(null);
    const [expandedGroup, setExpandedGroup] = useState({});
    const [trackingJournalEntry, setTrackingJournalEntry] = useState(null);
    const [trackingCommentThread, setTrackingCommentThread] = useState(null);

    useEffect(() => {
        if (reference) {
            setTrackingJournalEntry(reference.entryUUID);
            setExpandedGroup({ [reference.bookUUID]: true });
            setTrackingCommentThread(reference.commentThreadUUID);

            if (reference.type === 'comment') {
                setSelectedBookAndJournalEntry(getJournalBookInfoAndEntryByIds
                    (createdJournalBooks, reference.bookUUID, reference.entryUUID));
            }
        }
    }, [createdJournalBooks, reference]);

    return (
        <BasePanel
            id={id}
            panels={panels}
            setPanels={setPanels}
            title={t('journalPanel')}
            iconStyles="journal-icon"
        >
            {/* CreateJournalModal component to show the modal when showModal is true */}
            {showModal && (
                <CreateJournalModal
                    setShowModal={setShowModal}
                    createdJournalBooks={createdJournalBooks}
                    dispatchCreatedJournalBooks={dispatchCreatedJournalBooks}
                    createdCharacters={createdCharacters}
                    dispatchCreatedCharacters={dispatchCreatedCharacters}

                />
            )}


            {/* Render content conditionally based on selectedBookAndJournalEntry */}
            {selectedBookAndJournalEntry === null ? (
                <>
                    {/* Create New Journal Book Button */}
                    <div style={styles.stickyButtonContainer}>
                        <button className="create-new-btn" onClick={() => setShowModal(true)}>
                            {t('createNewJournal')}
                        </button>
                    </div>

                    {/* Feed component */}
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
                    />
                </>
            ) : (
                <>
                    {/* Detailed Journal View */}
                    <DetailedJournal
                        key={0}
                        panelID={id}
                        panels={panels}
                        setPanels={setPanels}
                        selectedBookAndJournalEntry={selectedBookAndJournalEntry}
                        setSelectedBookAndJournalEntry={setSelectedBookAndJournalEntry}
                        createdCharacters={createdCharacters}
                        dispatchCreatedCharacters={dispatchCreatedCharacters}
                        createdJournalBooks={createdJournalBooks}
                        dispatchCreatedJournalBooks={dispatchCreatedJournalBooks}
                        trackingCommentThread={trackingCommentThread}
                        setTrackingCommentThread={setTrackingCommentThread}
                    />
                </>
            )}
        </BasePanel>
    );
};

const styles = {
    stickyButtonContainer: {
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: 'white',
        padding: '10px',
    },

};

export default JournalPanel;
