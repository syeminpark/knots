import React, { useState, useEffect } from "react";
import TimeAgo from '../../TimeAgo';
import CommentDisplayer from "./CommentDisplayer";
import BottomActions from "./BottomActions";
import DetailedJournalPost from "./DetailedJournalPost";
import { getJournalEntryByIds } from "./journalBookReducer";
import EntryTag from "../../EntryTag";
import { getJournalBookInfoAndEntryByIds } from "./journalBookReducer";

const DetailedJournal = (props) => {
    const {
        panels,
        setPanels,
        selectedBookAndJournalEntry,
        setSelectedBookAndJournalEntry,
        createdCharacters,
        dispatchCreatedCharacters,
        createdJournalBooks,
        dispatchCreatedJournalBooks,
    } = props;

    const [selectedCharacters, setSelectedCharacters] = useState([]);


    const createdCharacter = createdCharacters.characters.find(character => character.uuid === selectedBookAndJournalEntry.journalEntry.ownerUUID);
    const { bookInfo, journalEntry } = selectedBookAndJournalEntry;

    const { commentActionStatus, setCommentActionStatus } = useState()

    // Fetch comment threads from the updated journal entry
    useEffect(() => {
        const NewJournalBookInfoandEntry = getJournalBookInfoAndEntryByIds(createdJournalBooks, bookInfo.uuid, journalEntry.uuid)
        if (NewJournalBookInfoandEntry.journalEntry) {
            //update old seletecBookandjournalentry
            setSelectedBookAndJournalEntry(NewJournalBookInfoandEntry)
        }
    }, [createdJournalBooks]);



    return (
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
                        <p> 💬 Comments</p>
                    </div>
                </div>

                {/* Render comments */}
                <div style={styles.commentContainer}>
                    {journalEntry.commentThreads.map(thread => (
                        <div key={thread.uuid} style={styles.commentThread}>
                            {thread.comments.map((comment, index) => (
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

                                        // Compute firstInTheThread and repliedTo dynamically
                                        firstInTheThread={index === 0}
                                        repliedTo={index < thread.comments.length - 1}
                                    />
                                </div>
                            ))}
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
                />
            </div>
        </div>
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
        paddingBottom: '10px',
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
