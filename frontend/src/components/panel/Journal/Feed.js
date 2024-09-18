import React from 'react';
import JournalContent from './JournalContent';
import TimeAgo from './TimeAgo';
import ToggleButton from '../../ToggleButton';

const Feed = (props) => {
    const { createdJournalBooks, createdCharacters, panels, setPanels, setSelectedBookAndJournalEntry, expandedGroup, setExpandedGroup } = props;

    const toggleEntry = (entryId) => {
        setExpandedGroup(prev => ({
            ...prev,
            [entryId]: !prev[entryId]
        }));
    };

    return (
        <div style={styles.journalFeed}>
            {/* Feed Section */}
            <h2 style={styles.feedHeader}>Feed</h2>
            {createdJournalBooks.journalBooks.length === 0 && (
                <p>No Journals yet...</p>
            )}
            {createdJournalBooks.journalBooks.slice().reverse().map((journalBook) => (
                <div key={journalBook.bookInfo.uuid} style={styles.journalEntry}>
                    <div style={styles.entryHeader}>
                        <span style={styles.entryTime}>
                            <TimeAgo createdAt={journalBook.bookInfo.createdAt} />
                        </span>
                        <strong style={styles.entryTitle}>{journalBook.bookInfo.title}</strong>
                    </div>
                    <div>
                        <span style={{ ...styles.entryTag, ...styles.systemGenerated }}>{journalBook.bookInfo.selectedMode}</span>
                    </div>

                    {/* Toggle Button */}
                    <div style={styles.toggleButtonContainer}>
                        <ToggleButton
                            expandable={true}
                            expanded={expandedGroup[journalBook.bookInfo.uuid]}
                            onClick={() => toggleEntry(journalBook.bookInfo.uuid)}
                            size="medium"
                        />
                    </div>

                    {expandedGroup[journalBook.bookInfo.uuid] && (
                        journalBook.journalEntries.map((journalEntry) => (
                            <JournalContent
                                key={journalEntry.uuid}
                                panels={panels}
                                setPanels={setPanels}
                                createdCharacter={createdCharacters.characters.find(character => character.uuid === journalEntry.ownerUUID)}
                                content={journalEntry.content}
                                journalBookUUID={journalBook.bookInfo.uuid}
                                journalEntryUUID={journalEntry.uuid}
                                setSelectedBookAndJournalEntry={setSelectedBookAndJournalEntry}
                                createdJournalBooks={createdJournalBooks}
                            />
                        ))
                    )}
                </div>
            ))}
        </div>
    );
};

const styles = {
    journalFeed: {

    },
    journalEntry: {
        backgroundColor: '#f7f7ff',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        position: 'relative',
        marginBottom: '20px',
    },
    entryHeader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: '10px',
        paddingLeft: '30px',
        paddingRight: '30px',
    },
    entryTitle: {
        fontWeight: 'bold',
        fontSize: '16px',
        whiteSpace: 'normal',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        textOverflow: 'ellipsis',
        textAlign: 'left',
        maxWidth: '100%',
        resize: 'vertical',
    },
    entryTime: {
        color: '#9b9b9b',
        fontSize: '10px',
        position: 'absolute',
        right: '0',
        bottom: '0',
        whiteSpace: 'nowrap',
    },
    entryTag: {
        padding: '5px 10px',
        borderRadius: '8px',
        fontSize: '12px',
        marginBottom: '10px',
        alignItems: 'center',
    },
    systemGenerated: {
        backgroundColor: '#f0eaff',
        color: '#6c63ff',
    },
    toggleButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: '10px',
        position: 'relative',
    },
    manual: {
        backgroundColor: '#e0eaff',
        color: '#6c63ff',
    },
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

export default Feed;
