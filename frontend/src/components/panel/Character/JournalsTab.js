import { useState, useEffect } from 'react';
import { getJournalsByCharacterUUID } from '../Journal/journalBookReducer';
import JournalCard from '../Journal/JournalCard';
import openNewPanel from '../../openNewPanel';
import { useTranslation } from 'react-i18next';

const JournalsTab = (props) => {
    const { t } = useTranslation();
    const { panels, setPanels, caller, createdJournalBooks } = props;
    const initialJournals = getJournalsByCharacterUUID(createdJournalBooks, caller.uuid);
    const [journalData, setJournalData] = useState(initialJournals); // Start with existing journal data

    useEffect(() => {
        const result = getJournalsByCharacterUUID(createdJournalBooks, caller.uuid);
        setJournalData(result);
        console.log('hey')
    }, [createdJournalBooks, caller.uuid]);

    const sortByLatest = (journals) => {
        return journals.sort((a, b) => new Date(b.bookInfo.createdAt) - new Date(a.bookInfo.createdAt));
    };
    const onClick = (bookUUID, entryUUID) => {
        openNewPanel(panels, setPanels, 'journal', null, { type: "journal", bookUUID: bookUUID, entryUUID: entryUUID })
    }


    return (
        <>
            {t(
                journalData.length < 2
                    ? 'journalCount_singular'
                    : 'journalCount_plural',
                { count: journalData.length }
            )}


            <div style={styles.journalsTabWrapper}>
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
        </>
    );
};

const styles = {
    journalsTabWrapper: {
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 350px)',
        width: '100%',
        marginTop: '10px'
    },
}

export default JournalsTab;
