import React, { useState } from 'react';
import TimeAgo from '../../TimeAgo';
import CharacterButton from "../../CharacterButton";
import EntryTag from '../../EntryTag';
import WriteCommentInput from './WriteCommentInput';
import openNewPanel from '../../openNewPanel';

const Comment = (props) => {
    const { createdCharacter, content, createdAt, selectedMode, selectedBookAndJournalEntry, threadUUID, commentUUID, dispatchCreatedJournalBooks,
        panels, setPanels, onGenerateReply,
    } = props;
    const [isEditing, setIsEditing] = useState(false); //
    const [editContent, setEditContent] = useState(content);
    const [isManualReplying, setIsManualReplying] = useState(false);
    const [replyContent, setReplyContent] = useState(''); // State to manage reply content


    const { bookInfo, journalEntry } = selectedBookAndJournalEntry

    // Handle edit save
    const handleEditSave = () => {
        dispatchCreatedJournalBooks({
            type: 'EDIT_COMMENT',
            payload: {
                journalBookUUID: bookInfo.uuid,
                journalEntryUUID: journalEntry.uuid,
                threadUUID: threadUUID,
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
                threadUUID: threadUUID,
                commentUUID: commentUUID,
            },
        });
    };


    // Handle manual reply toggle
    const handleManualReplyToggle = () => {
        if (isManualReplying) {
            setIsManualReplying(false); // Cancel manual reply
        } else {

            setIsManualReplying(true); // Enter manual reply mode
        }
    };

    return (
        <>
            <div style={styles.comment}>
                <div style={styles.commentHeader}>
                    <div style={styles.commentInfo}>
                        {/* Use CharacterButton here */}
                        <button
                            style={styles.profileButtonContainer}
                            key={createdCharacter.uuid}
                            onClick={() => {
                                openNewPanel(panels, setPanels, "character-profile", createdCharacter);
                            }}
                        >
                            <CharacterButton
                                createdCharacter={createdCharacter}
                                iconStyle={styles.characterButtonIconStyle}
                                textStyle={styles.characterButtonTextStyle}
                            />
                        </button>
                        <div style={styles.headerInfo}>
                            <EntryTag selectedMode={selectedMode} size='small' hasBackground={false}> </EntryTag>
                            <span style={styles.commentTime}><TimeAgo createdAt={createdAt} /></span>
                        </div>
                    </div>
                </div>
                <div style={styles.commentText}>
                    {isEditing ? (
                        <input
                            type="text"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            style={styles.editInput}
                        />
                    ) : (
                        content
                    )}
                </div>
            </div>
            <div style={styles.commentActions}>
                <span style={styles.commentAction} onClick={handleManualReplyToggle}>
                    {isManualReplying ? 'Cancel' : 'Manual Reply'}
                </span>
                <span style={styles.commentAction} onClick={onGenerateReply}>Generate Reply</span>
                {isEditing ? (
                    <span style={styles.commentAction} onClick={handleEditSave}>Save</span>
                ) : (
                    <span style={styles.commentAction} onClick={() => setIsEditing(true)}>Edit</span>
                )}
                <span style={styles.commentAction} onClick={onDelete}>Delete</span>
            </div>
            {isManualReplying && (
                <>
                    {/* Render reply input only if replying to this specific comment */}
                    <div style={styles.replyContainer}>
                        <div style={styles.commentHeader}>
                            <div style={styles.commentInfo}>
                                <button
                                    style={styles.profileButtonContainer}
                                    key={createdCharacter.uuid}
                                    onClick={() => {
                                        openNewPanel(panels, setPanels, "character-profile", createdCharacter);
                                    }}
                                >
                                    <CharacterButton
                                        createdCharacter={createdCharacter}
                                        iconStyle={styles.characterButtonIconStyle}
                                        textStyle={styles.characterButtonTextStyle}
                                    />
                                </button>
                                <div style={styles.headerInfo}>
                                    <EntryTag selectedMode={selectedMode} size='small' hasBackground={false}> </EntryTag>
                                </div>
                            </div>
                        </div>
                        <div style={styles.replyInputContainer}>
                            <WriteCommentInput
                                placeholder={`Reply as ${createdCharacter.name}`}
                                commentValue={replyContent}
                                setCommentValue={setReplyContent}
                                sendButtonCallback={null}
                            ></WriteCommentInput>
                        </div>


                    </div>
                </>
            )}
        </>
    );
};

const styles = {
    comment: {
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        padding: '10px 10px',
        marginBottom: '10px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    commentHeader: {
        display: 'flex',
        alignItems: 'center',

    },
    headerInfo: {

    },
    commentInfo: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentTime: {
        fontSize: '10px',
        color: '#9b9b9b',
        marginLeft: '10px',
    },
    commentText: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        fontSize: 'var(--font-medium)',
        color: '#333',
        padding: '5px',
        whiteSpace: "pre-line",
        lineHeight: 'var(--line-height)',
    },
    profileButtonContainer: {
        display: 'flex', // Keep flex alignment
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
    },

    commentActions: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: '10px',
        marginBottom: '15px',
        marginRight: '6px',
    },
    commentAction: {
        cursor: 'pointer',
        fontSize: 'var(--font-xs)',
        color: '#9b9b9b',
        fontWeight: 'var(--font-semibold)',
    },
    editInput: {
        width: '100%',
        padding: '5px',
        fontSize: 'var(--font-small)',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    // Styles for CharacterButton integration
    characterButtonIconStyle: {
        width: '30px',
        height: '30px',

    },
    characterButtonTextStyle: {
        fontSize: 'var(--font-small)',
        fontWeight: 'var(--font-bold)',
        marginRight: '10px',
    },
    replyContainer: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f0f0f0',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '30px',
    },
    replyInputContainer: {
        marginTop: '10px',
        position: 'relative',
    },
};

export default Comment;
