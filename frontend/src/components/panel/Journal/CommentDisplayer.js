/*
So a comment can be two types

Type 1. Normal Comment 
This has two states 'repliedTo' and 'firstInTheThread'

[State: repliedTo]
Replied To===False
- This means that the Normal Comment has no other Normal Comments underneath the same thread, thus is not replied to. 
- This has the following action items: generate reply, manual reply, edit, delete

Replied To===True
- This means that the Normal Comment has other Normal Comments underneath the same thread, thus is relied to. 
    => This has the following action items:  edit, delete

The 'repliedTo' state of a Normal Comment changes from False to True when replied to using the 'Replying Comment'. 

[State: firstInTheThread]
firstInTheThread===True
- This means that it is the first Normal comment in the thread 
- It does not have the arrow on the left.

firstInTheThread===False
- This means that it is not the first Normal comment in the thread 
- It has the arrow on the left. 


Type 2. Currently Replying Comment 
- A Currently Replying Comment is shown underneath a Normal Comment, when clicked on 'the manual reply action item 
- A currently replying comment does not have any of the action items
- When the tcontent of the currenly replying comment is sent, it changes the Normal Comment is underneath of (parent) into replied to True

*/

import React, { useState, useEffect } from 'react';
import TimeAgo from '../../TimeAgo';
import CharacterButton from "../../CharacterButton";
import EntryTag from '../../EntryTag';
import WriteCommentInput from './WriteCommentInput';
import openNewPanel from '../../openNewPanel';
import Comment from './Comment';
import CommentActions from './CommentActions';


const CommentDisplayer = (props) => {
    const { createdCharacter, content, createdAt, selectedMode, selectedBookAndJournalEntry, commentThreadUUID, commentUUID, dispatchCreatedJournalBooks,
        panels, setPanels, repliedTo, firstInTheThread
    } = props;
    const [isEditing, setIsEditing] = useState(false); //
    const [editContent, setEditContent] = useState(content);
    const [isManualReplying, setIsManualReplying] = useState(false);
    const [replyContent, setReplyContent] = useState(''); // State to manage reply content
    const { bookInfo, journalEntry } = selectedBookAndJournalEntry

    useEffect(() => {
        setIsManualReplying(false)
    }, [editContent])

    const onReplySend = (selectedReplyMode) => {
        if (replyContent === '' && selectedReplyMode == "Manaul Post") {
            alert('Write Something');
        }
        else {
            dispatchCreatedJournalBooks({
                type: 'CREATE_COMMENT',
                payload: {
                    journalBookUUID: bookInfo.uuid,
                    journalEntryUUID: journalEntry.uuid,
                    ownerUUID: createdCharacter.uuid,
                    content: replyContent,
                    selectedMode: selectedReplyMode,
                    commentThreadUUID: commentThreadUUID

                },
            });
            setIsManualReplying(false)
        }
    }


    // Handle edit save
    const onEditSave = () => {
        dispatchCreatedJournalBooks({
            type: 'EDIT_COMMENT',
            payload: {
                journalBookUUID: bookInfo.uuid,
                journalEntryUUID: journalEntry.uuid,
                commentThreadUUID: commentThreadUUID,
                commentUUID: commentUUID,
                newContent: editContent,
            },
        });
        setIsEditing(false); // Close the edit mode
    };

    const onDelete = () => {
        dispatchCreatedJournalBooks({
            type: 'DELETE_COMMENT',
            payload: {
                journalBookUUID: bookInfo.uuid,
                journalEntryUUID: journalEntry.uuid,
                commentThreadUUID: commentThreadUUID,
                commentUUID: commentUUID,
            },
        });
    };


    return (
        <>
            {firstInTheThread ? (
                <div style={styles.comment}>
                    <Comment
                        panels={panels}
                        setPanels={setPanels}
                        createdCharacter={createdCharacter}
                        selectedMode={selectedMode}
                        createdAt={createdAt}
                        isEditing={isEditing}
                        editContent={editContent}
                        setEditContent={setEditContent}
                        onEditSave={onEditSave}
                        content={content}
                    ></Comment>

                </div>
            ) :
                < div style={styles.replyContainer}>
                    <div style={styles.replyArrow}>
                        ↳
                    </div>
                    <div style={styles.replyCommentContainer}>
                        <Comment
                            panels={panels}
                            setPanels={setPanels}
                            createdCharacter={createdCharacter}
                            selectedMode={selectedMode}
                            createdAt={createdAt}
                            isEditing={isEditing}
                            editContent={editContent}
                            setEditContent={setEditContent}
                            onEditSave={onEditSave}
                            content={content}
                        ></Comment>
                    </div>
                </div>
            }
            <CommentActions
                isManualReplying={isManualReplying}
                setIsManualReplying={setIsManualReplying}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                onReplySend={onReplySend}
                onEditSave={onEditSave}
                onDelete={onDelete}
                repliedTo={repliedTo}
            ></CommentActions>


            {
                isManualReplying && (
                    <>
                        {/* Render reply input only if replying to this specific comment */}
                        < div style={styles.replyContainer}>
                            <div style={styles.replyArrow}>
                                ↳
                            </div>
                            <div style={styles.replyCommentContainer}>
                                <Comment
                                    panels={panels}
                                    setPanels={setPanels}
                                    createdCharacter={createdCharacter}
                                    selectedMode={selectedMode}
                                ></Comment>
                                <div style={styles.replyInputContainer}>
                                    <WriteCommentInput
                                        placeholder={`Reply as ${createdCharacter.name}`}
                                        commentValue={replyContent}
                                        setCommentValue={setReplyContent}
                                        sendButtonCallback={() => { onReplySend('Manual Post') }}
                                    ></WriteCommentInput>
                                </div>
                            </div>
                        </div>
                        <CommentActions
                            isManualReplying={isManualReplying}
                            setIsManualReplying={setIsManualReplying}
                            type={"Replying"}
                        ></CommentActions>
                    </>
                )
            }
        </>
    );
};

const styles = {
    comment: {
        backgroundColor: 'var(--color-bg-grey)',
        borderRadius: '8px',
        padding: '10px 10px',
        marginBottom: '10px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },

    replyContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    },
    replyArrow: {
        width: '5%',
        alignItems: 'center',
        fontSize: '30px',
        color: 'gray',
        marginLeft: '10px'
    },
    replyCommentContainer: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f0f0f0',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '5px',
        width: '100%',
    },
    replyInputContainer: {
        marginTop: '10px',
        position: 'relative',
    },
};

export default CommentDisplayer;
