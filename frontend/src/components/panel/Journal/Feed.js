import React, { useRef, useEffect } from 'react';
import JournalContent from './JournalContent';
import TimeAgo from '../../TimeAgo';
import ToggleButton from '../../ToggleButton';
import EntryTag from '../../EntryTag';
import { AnimatePresence, motion } from 'framer-motion';

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
        <>
            <h2 style={styles.feedHeader}>Feed</h2>

            <div style={styles.journalFeedWrapper}>
                {createdJournalBooks.journalBooks.length === 0 && (
                    <p>No Journals yet...</p>
                )}
                {createdJournalBooks.journalBooks.slice().reverse().map((journalBook, index) => (
                    <AnimatePresence key={journalBook.bookInfo.uuid}>
                        <motion.div
                            key={journalBook.bookInfo.uuid}
                            initial={{ opacity: 0, scale: 0.8 }}

                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.1 }}>
                            <div key={journalBook.bookInfo.uuid} style={styles.journalEntry}>
                                <div style={styles.entryTime}>
                                    <TimeAgo createdAt={journalBook.bookInfo.createdAt} />
                                </div>
                                <div style={styles.entryHeader}>
                                    <strong style={styles.entryTitle}>{journalBook.bookInfo.title}</strong>
                                    <EntryTag selectedMode={journalBook.bookInfo.selectedMode} size='large'> </EntryTag>
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
                                    journalBook.journalEntries.map((journalEntry, index) => (


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
                        </motion.div>
                    </AnimatePresence >
                ))}

            </div >
        </>
    );
};

const styles = {
    journalFeedWrapper: {
        maxHeight: 'calc(100vh - 300px)',
        overflowY: 'auto',
    },

    journalEntry: {
        backgroundColor: 'var(--color-bg-lightpurple)',
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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        paddingLeft: '30px',
        paddingRight: '30px',
    },
    entryTitle: {
        fontWeight: 'var(--font-bold)',
        fontSize: 'var(--font-large)',
        whiteSpace: 'normal',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        textOverflow: 'ellipsis',
        textAlign: 'center',
        maxWidth: '100%',
        resize: 'vertical',
        marginBottom: '10px'
    },
    entryTime: {
        color: '#9b9b9b',
        fontWeight: 'var(--font-regular)',
        fontSize: 'var(--font-xs)',
        position: 'absolute',
        right: '0',
        top: '0',
        transform: 'translate(-50%,50%)',
        whiteSpace: 'nowrap',

    },

    toggleButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: '10px',
        position: 'relative',
    },
    manual: {
        backgroundColor: 'var(--color-bg-grey)',
        color: '#6c63ff',
    },
    stickyButtonContainer: {
        position: 'sticky',
        zIndex: 10,
        backgroundColor: 'white',
    },
    createJournalBtn: {
        display: 'block',
        backgroundColor: 'var(--color-secondary)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '14px 0',
        fontSize: 'var(--font-medium)',
        cursor: 'pointer',
        textAlign: 'center',
        width: '100%',
        fontWeight: 'var(--font-bold)',
        marginBottom: '10px',
    },
};

export default Feed;
