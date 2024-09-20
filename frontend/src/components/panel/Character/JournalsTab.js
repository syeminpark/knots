import { useState, useEffect } from 'react';
import { getJournalsByCharacterUUID } from '../Journal/journalBookReducer';
import JournalCard from '../Journal/JournalCard';
import openNewPanel from '../../openNewPanel';

const JournalsTab = (props) => {
    const { panels, setPanels, caller, createdJournalBooks } = props;
    const [journalData, setJournalData] = useState([]); // Update to handle an array of journals

    useEffect(() => {
        const result = getJournalsByCharacterUUID(createdJournalBooks, caller.uuid);
        setJournalData(result);
    }, [createdJournalBooks, caller.uuid]);

    const sortByLatest = (journals) => {
        return journals.sort((a, b) => new Date(b.bookInfo.createdAt) - new Date(a.bookInfo.createdAt));
    };
    const onClick = (bookUUID, entryUUID) => {
        openNewPanel(panels, setPanels, 'journal', null, { type: "journal", bookUUID: bookUUID, entryUUID: entryUUID })
    }

    return (
        <div style={styles.journalsTabWrapper}>
            {journalData.length === 0 && (
                <div>
                    0 Journals
                </div>
            )}
            {journalData.length > 0 && sortByLatest(journalData).map((journal) => (
                <JournalCard
                    key={journal.bookInfo.uuid}
                    title={journal.bookInfo.title}
                    content={journal.journalEntry.content}
                    createdAt={journal.bookInfo.createdAt}
                    entryTag={journal.bookInfo.selectedMode}
                    onClick={() => onClick(journal.bookInfo.uuid, journal.journalEntry.uuid)}
                />
            ))}
        </div>
    );
};

const styles = {
    journalsTabWrapper: {
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 400px)',
        width: '100%',
    },
}

export default JournalsTab;
