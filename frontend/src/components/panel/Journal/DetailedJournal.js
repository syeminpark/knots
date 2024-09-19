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
                                selectedMode={comment.selectedMode}
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
        flexDirection: 'column', // Add flexbox to the container
        position: 'relative',
        borderRadius: '8px',
        boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.3)',
        flexGrow: 1, // Allow the journal entry section to take the remaining space
        overflowY: 'auto', // Enable scrolling if the content is too long

    },
    journalEntry: {

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
        padding: '10px 15px',
        borderRadius: '8px 8px 0 0',
        fontSize: '16px',
        backgroundColor: '#f0f0ff',  // 배경색을 부모와 맞추기
        padding: '20px 15px',  // padding으로 간격 조절
    },
 
    titleContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
    },
    entryTitle: {
        fontWeight: 'bold',
        fontSize: '16px',
        whiteSpace: 'normal',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textAlign: 'center',
        width: '100%',  
        padding: '0 50px', 
    },
    entryTime: {
        color: '#9b9b9b',
        fontSize: '12px',
        position: 'absolute',
        right: '15px',
        top: '50%',  // 제목과 같은 높이로 설정
        transform: 'translateY(-50%)',  // 수직 중앙 정렬 제거
        whiteSpace: 'nowrap',
    },
    
    entryTag: {
        padding: '5px 10px',
        borderRadius: '8px',
        fontSize: '12px',
        marginBottom: '10px',
        alignItems: 'center',
        fontWeight: 'bold',
    },
    
    systemGenerated: {
        backgroundColor: '#f0eaff',
        color: '#6c63ff',
    },

    commentIcon: {
        marginTop: '15px',
        marginLeft: '15px',
        fontSize: '14px',
        textAlign: 'left',
        fontWeight: 'bold',
    },

    commentContainer: {
        paddingLeft: "15px",
        paddingRight: "15px",
        marginBottom: '300px'
        
    },
    bottom: {
        backgroundColor: '#f7f7ff',
        padding: '10px',
        width: '100%',
        position: 'sticky',
        bottom: 0, // Position at the bottom of the container
    },

};

export default DetailedJournal;
