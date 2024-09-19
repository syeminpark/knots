import React, { useRef, useEffect } from 'react';
import JournalContent from './JournalContent';
import TimeAgo from '../../TimeAgo';
import ToggleButton from '../../ToggleButton';

const Feed = (props) => {
    const {
        createdJournalBooks,
        createdCharacters,
        panels,
        setPanels,
        setSelectedBookAndJournalEntry,
        expandedGroup,
        setExpandedGroup,
        trackingJournalEntry,
        setTrackingJournalEntry,
    } = props;

    const journalEntryRefs = useRef({});  // Ref to store journal elements

    useEffect(() => {
        if (trackingJournalEntry && journalEntryRefs.current[trackingJournalEntry]) {
            journalEntryRefs.current[trackingJournalEntry].scrollIntoView({ behavior: 'instant' });
        }
    }, [trackingJournalEntry]);

    const toggleEntry = (entryId) => {
        setExpandedGroup(prev => ({
            ...prev,
            [entryId]: !prev[entryId]
        }));
    };

    return (
        <div style={styles.journalFeed}>
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
                                ref={el => journalEntryRefs.current[journalEntry.uuid] = el}
                                panels={panels}
                                setPanels={setPanels}
                                createdCharacter={createdCharacters.characters.find(character => character.uuid === journalEntry.ownerUUID)}
                                content={journalEntry.content}
                                journalBookUUID={journalBook.bookInfo.uuid}
                                journalEntryUUID={journalEntry.uuid}
                                setSelectedBookAndJournalEntry={setSelectedBookAndJournalEntry}
                                createdJournalBooks={createdJournalBooks}
                                setTrackingJournalEntry={setTrackingJournalEntry}
                            />
                        ))
                    )}
                </div>
            ))}
        </div>
    );
};

const styles = {
    journalFeed: {},
    journalEntry: {
        backgroundColor: '#f7f7ff',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: '8px',
        boxShadow: '0 4px 4px rgba(196, 196, 196, 0.25)',
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
        fontSize: '18px',
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
        fontWeight: '400',
        fontSize: '12px',
        position: 'absolute',
        right: '0',
        bottom: '0',
        whiteSpace: 'nowrap',
    },
    entryTag: {
        padding: '5px 10px',
        borderRadius: '8px',
        fontSize: '14px',
        marginBottom: '10px',
        fontWeight: 'bold',
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
