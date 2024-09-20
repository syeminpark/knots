import React, { useState, useEffect } from "react";
import TimeAgo from '../../TimeAgo';
import Comment from "./Comment";
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
                        {thread.comments.map(comment => (
                            <div key={comment.uuid}>
                                <Comment
                                    panels={panels}
                                    setPanels={setPanels}
                                    createdCharacter={createdCharacters.characters.find(createdCharacter => createdCharacter.uuid === comment.ownerUUID)}
                                    content={comment.content}
                                    createdAt={comment.createdAt}
                                    selectedMode={comment.selectedMode}
                                    selectedBookAndJournalEntry={selectedBookAndJournalEntry}
                                    commentUUID={comment.uuid}
                                    threadUUID={thread.uuid}
                                    dispatchCreatedJournalBooks={dispatchCreatedJournalBooks}
                                ></Comment>


                            </div>
                        ))}
                    </div>
                ))}
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
        flexGrow: 1,
        overflowY: 'auto',
    },
    journalEntry: {
        flexGrow: 1,
    },
    entryHeader: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '10px',
        backgroundColor: '#f7f7ff',
        padding: '20px 15px',
    },
    entryTitle: {
        fontWeight: 'var(--font-bold)',
        fontSize: 'var(--font-large)',
        textAlign: 'center',
        width: '100%',
        padding: '0 50px',
    },
    entryTime: {
        color: '#9b9b9b',
        fontSize: 'var(--font-xs)',
        position: 'absolute',
        top: '0',
        right: '0',
        transform: 'translate(-50%,50%)',
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
        marginBottom: '100px',
    },

    bottom: {
        backgroundColor: '#f7f7ff',
        padding: '10px',
        width: '100%',
        position: 'sticky',
        bottom: 0,
    },
};

export default DetailedJournal;
