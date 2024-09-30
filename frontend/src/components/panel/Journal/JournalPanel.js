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
    const [selectedBookAndJournalEntry, setSelectedBookAndJournalEntry] = useState(null)
    const [expandedGroup, setExpandedGroup] = useState({});
    const [trackingJournalEntry, setTrackingJournalEntry] = useState(null);
    const [trackingCommentThread, setTrackingCommentThread] = useState(null);

    useEffect(() => {
        if (reference) {
            setTrackingJournalEntry(reference.entryUUID);
            setExpandedGroup({ [reference.bookUUID]: true })
            setTrackingCommentThread(reference.commentThreadUUID)

            if (reference.type == 'comment') {
                setSelectedBookAndJournalEntry(getJournalBookInfoAndEntryByIds
                    (createdJournalBooks, reference.bookUUID, reference.entryUUID))
            }
        }

    }, [reference]);

    return (
        <BasePanel
            id={id}
            panels={panels}
            setPanels={setPanels}
            title={t('journalPanel')}
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
                        {t('createNewJournal')}
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
    }
};

export default JournalPanel;
