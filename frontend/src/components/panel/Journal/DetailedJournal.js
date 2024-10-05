// DetailedJournal.js
import React, { useRef, useState, useEffect } from "react";
import TimeAgo from '../../TimeAgo';
import CommentDisplayer from "./CommentDisplayer";
import BottomActions from "./BottomActions";
import DetailedJournalPost from "./DetailedJournalPost";
import EntryTag from "../../EntryTag";
import { getJournalBookInfoAndEntryByIds } from "./journalBookReducer";
import { useTranslation } from 'react-i18next';
import Loading from "../../Loading";

const DetailedJournal = (props) => {
    const { t } = useTranslation();
    const {
        panels,
        setPanels,
        selectedBookAndJournalEntry,
        setSelectedBookAndJournalEntry,
        createdCharacters,
        createdJournalBooks,
        dispatchCreatedJournalBooks,
        trackingCommentThread,
        setTrackingCommentThread,
    } = props;

    const [selectedCharacters, setSelectedCharacters] = useState([]);
    const commentThreadRefs = useRef({});

    const createdCharacter = createdCharacters.characters.find(character => character.uuid === selectedBookAndJournalEntry.journalEntry.ownerUUID);
    const { bookInfo, journalEntry } = selectedBookAndJournalEntry;

    const lastCommentRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [scrollDown, setScrollDown] = useState(false);
    const isInitialMount = useRef(true); // Track initial mount

    // Fetch comment threads from the updated journal entry
    useEffect(() => {
        const NewJournalBookInfoandEntry = getJournalBookInfoAndEntryByIds(createdJournalBooks, bookInfo.uuid, journalEntry.uuid);
        if (NewJournalBookInfoandEntry?.journalEntry) {
            // Update selectedBookAndJournalEntry
            setSelectedBookAndJournalEntry(NewJournalBookInfoandEntry);

            if (!isInitialMount.current) {
                setScrollDown(true);
            }
        }
        else {
            setSelectedBookAndJournalEntry(null);
        }

        if (isInitialMount.current) {
            isInitialMount.current = false; // Set to false after the first render
        }

    }, [createdJournalBooks]);

    // Scroll to the specific comment thread being tracked, unique to this panel
    useEffect(() => {
        if (trackingCommentThread && commentThreadRefs.current[trackingCommentThread]) {
            commentThreadRefs.current[trackingCommentThread].scrollIntoView({ behavior: 'instant', block: 'start' });
            setTrackingCommentThread(null);
        }
    }, [trackingCommentThread]);

    return (
        <>
            {loading && (
                <Loading></Loading>
            )}
            <div style={styles.container}>
                {/* Scrollable Content Container */}
                <div style={styles.scrollableContent}>
                    {/* Journal Entry Section */}
                    <div style={styles.journalEntry}>
                        <div style={styles.entryHeader}>
                            <div>
                                <strong style={styles.entryTitle}>{bookInfo.title}</strong>
                                <span style={styles.entryTime}><TimeAgo createdAt={bookInfo.createdAt} /></span>
                            </div>
                            <div>
                                <EntryTag selectedMode={bookInfo.selectedMode} size='large'> </EntryTag>
                            </div>
                        </div>

                        <DetailedJournalPost
                            panels={panels}
                            setPanels={setPanels}
                            createdCharacter={createdCharacter}
                            selectedBookAndJournalEntry={selectedBookAndJournalEntry}
                            setSelectedBookAndJournalEntry={setSelectedBookAndJournalEntry}
                            dispatchCreatedJournalBooks={dispatchCreatedJournalBooks}
                        />

                        <div style={styles.commentIcon}>
                            <p> 💬 {t('comments')}</p>
                        </div>
                    </div>

                    {/* Render comments */}
                    <div style={styles.commentContainer}>
                        {journalEntry.commentThreads.map((thread, threadIndex) => (
                            <div key={thread.uuid} style={styles.commentThread} ref={(el) => {
                                commentThreadRefs.current[thread.uuid] = el;
                            }}>
                                {thread.comments.map((comment, index) => {

                                    const isLastThread = threadIndex === journalEntry.commentThreads.length - 1;
                                    const isFirstCommentInThread = index === 0; // First comment in this thread
                                    const isLastCommentInThread = index === thread.comments.length - 1;
                                    const isLastCommentOverall = isLastThread && isLastCommentInThread;
                                    const isFirstInLastThread = isLastThread && isFirstCommentInThread; // New flag

                                    const previousCharacterUUID = index === 0
                                        ? journalEntry.ownerUUID
                                        : thread.comments[index - 1].ownerUUID;
                                    return (
                                        <div key={comment.uuid}>
                                            <CommentDisplayer
                                                panels={panels}
                                                setPanels={setPanels}
                                                createdCharacter={createdCharacters.characters.find(createdCharacter => createdCharacter.uuid === comment.ownerUUID)}
                                                content={comment.content}
                                                createdAt={comment.createdAt}
                                                selectedMode={comment.selectedMode}
                                                selectedBookAndJournalEntry={selectedBookAndJournalEntry}
                                                commentUUID={comment.uuid}
                                                commentThreadUUID={thread.uuid}
                                                dispatchCreatedJournalBooks={dispatchCreatedJournalBooks}
                                                previousCharacter={createdCharacters.characters.find(character => character.uuid === previousCharacterUUID)}
                                                firstInTheThread={index === 0}
                                                repliedTo={index < thread.comments.length - 1}
                                                isLastComment={isLastCommentOverall}
                                                isFirstInLastThread={isFirstInLastThread}
                                                setLoading={setLoading}
                                                scrollDown={scrollDown}
                                                setScrollDown={setScrollDown}
                                                isLastCommentInThread={isLastCommentInThread}
                                            />
                                            {isLastCommentOverall && (
                                                <div ref={lastCommentRef}></div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ))}

                    </div>

                </div>

                {/* Bottom Section with Character Selection and Comment Input */}
                <div style={styles.bottom}>
                    <BottomActions
                        selectedCharacters={selectedCharacters}
                        setSelectedCharacters={setSelectedCharacters}
                        createdCharacters={createdCharacters}
                        dispatchCreatedJournalBooks={dispatchCreatedJournalBooks}
                        selectedBookAndJournalEntry={selectedBookAndJournalEntry}
                        setLoading={setLoading}
                    />
                </div>
            </div>
        </>
    );

};

const styles = {
    container: {
        backgroundColor: '#ffffff',
        width: '100%',
        height: '98%',
        marginTop: '10px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: '8px',
        boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.3)',
    },
    scrollableContent: {
        flexGrow: 1,
        overflowY: 'auto',
        paddingBottom: '30px',
    },
    journalEntry: {
        paddingBottom: '15px',
    },
    entryHeader: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: '10px',
        backgroundColor: 'var(--color-bg-lightpurple)',
        padding: '20px 15px',
    },
    entryTitle: {
        fontWeight: 'var(--font-bold)',
        fontSize: 'var(--font-large)',
        textAlign: 'center',
        width: '100%',
    },
    entryTime: {
        color: '#9b9b9b',
        fontSize: 'var(--font-xs)',
        position: 'absolute',
        top: '10px',
        right: '15px',
        whiteSpace: 'nowrap',
    },

    commentIcon: {
        marginTop: '15px',
        marginLeft: '15px',
        fontSize: 'var(--font-small)',
        textAlign: 'left',
        fontWeight: 'var(--font-bold)',
    },
    commentContainer: {
        paddingLeft: "15px",
        paddingRight: "15px",
        paddingBottom: "15px",
    },

    bottom: {
        backgroundColor: 'var(--color-bg-lightpurple)',
        padding: '10px',
        width: '100%',
        position: 'sticky',
        bottom: 0,
    },
};

export default DetailedJournal;
