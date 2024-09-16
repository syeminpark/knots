import JournalGroup from './JournalGroup';
import JournalContent from './JournalContent';

const Feed = (props) => {
    const { createdJournalBooks, createdCharacters, panels, setPanels, setSelectedJournal } = props

    return (
        <div style={styles.journalFeed}>
            {/* Feed Section */}
            <h2 style={styles.feedHeader}>Feed</h2>
            {createdJournalBooks.length === 0 && (
                'No Journals yet...'
            )}
            {createdJournalBooks.slice().reverse().map((journalBook, index) => (  // Reverse the order of journals
                <JournalGroup
                    key={index}
                    selectedMode={journalBook.selectedMode}
                    journalBookPrompt={journalBook.journalBookPrompt}
                    createdAt={journalBook.createdAt}
                >
                    {journalBook.journalEntries.map((journalEntry, id) => (
                        <JournalContent
                            key={id}
                            panels={panels}
                            setPanels={setPanels}
                            createdCharacter={createdCharacters.find(character => character.name === journalEntry.ownerName)}
                            content={journalEntry.content}
                            journalBookID={journalBook.id}
                            journalEntryID={journalEntry.id}
                            setSelectedJournal={setSelectedJournal}
                        />
                    ))}
                </JournalGroup>
            ))}
        </div>
    )
}

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

export default Feed