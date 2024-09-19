import React, { useState, useEffect } from "react";
import TimeAgo from '../../TimeAgo';
import Comment from "./Comment";
import BottomActions from "./BottomActions";
import DetailedJournalPost from "./DetailedJournalPost";
import { getJournalEntryByIds } from "./journalBookReducer";
import EntryTag from "../../EntryTag";

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
    const [commentThreads, setCommentThreads] = useState([]); // State to hold comments by thread

    const createdCharacter = createdCharacters.characters.find(character => character.uuid === selectedBookAndJournalEntry.journalEntry.ownerUUID);
    const { bookInfo, journalEntry } = selectedBookAndJournalEntry;

    // Handle comment creation
    const onCreateComment = (characterUUID, commentValue, selectedMode, commentThreadUUID) => {
        dispatchCreatedJournalBooks({
            type: 'CREATE_COMMENT',
            payload: {
                journalBookUUID: bookInfo.uuid,
                journalEntryUUID: journalEntry.uuid,
                ownerUUID: characterUUID,
                content: commentValue,
                selectedMode: selectedMode,
                commentThreadUUID: commentThreadUUID, // Thread UUID if replying to an existing thread
            },
        });
    };
    useEffect(() => {
        const updatedJournalEntry = getJournalEntryByIds(createdJournalBooks, bookInfo.uuid, journalEntry.uuid,)
        if (updatedJournalEntry) {
            setCommentThreads(updatedJournalEntry.commentThreads);
            console.log(updatedJournalEntry.commentThreads)
        }
    }, [createdJournalBooks])


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
                    dispatchCreatedJournalBooks={dispatchCreatedCharacters}
                />

                <div style={styles.commentIcon}>
                    <p> 💬 Comments</p>
                </div>
            </div>

            {/* Render comments */}
            <div style={styles.commentContainer}>
                {commentThreads.map(thread => (
                    <div key={thread.uuid} style={styles.commentThread}>
                        {/* <h4>Thread {thread.uuid}</h4> */}
                        {thread.comments.map(comment => (
                            <Comment
                                key={comment.uuid}
                                createdCharacter={createdCharacters.characters.find(createdCharacter => createdCharacter.uuid === comment.ownerUUID)}
                                content={comment.content}
                                createdAt={comment.createdAt}
                                selectedMode={comment}
                            />
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
                    onCreateComment={onCreateComment}
                />
            </div>
        </div >
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
        overflowX: 'hidden',
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
        position: 'relative',
        marginBottom: '10px',
        backgroundColor: '#f7f7ff',
        padding: '25px',
        borderRadius: '8px 8px 0 0',
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
        marginBottom: '10px',
    },
    entryTime: {
        color: '#9b9b9b',
        fontSize: '12px',
        position: 'absolute',

        top: '0',
        right: '0',
        transform: 'translate(-50%,50%)',
        whiteSpace: 'nowrap',
    },

    commentIcon: {
        marginTop: '15px',
        marginLeft: '15px',
        fontSize: '14px',
        textAlign: 'left',
        fontWeight: 'bold',
    },
    commentContainer: {
        paddingLeft: "20px",
        paddingRight: "20px",
        marginBottom: '300px',
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
