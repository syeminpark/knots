import { useState, useEffect } from 'react';
import { getJournalsByCharacterUUID } from '../Journal/journalBookReducer';
import JournalCard from '../Journal/JournalCard';

const JournalsTab = (props) => {
    const { caller, createdJournalBooks } = props;
    const [journalData, setJournalData] = useState([]); // Update to handle an array of journals

    useEffect(() => {
        const result = getJournalsByCharacterUUID(createdJournalBooks, caller.uuid);
        setJournalData(result);
    }, [createdJournalBooks, caller.uuid]);

    const sortByLatest = (journals) => {
        return journals.sort((a, b) => new Date(b.bookInfo.createdAt) - new Date(a.bookInfo.createdAt));
    };
    const onClick = () => {
    }

    return (
        <>
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
                    onClick={() => onClick()}
                />
            ))}
        </>
    );
};

export default JournalsTab;
