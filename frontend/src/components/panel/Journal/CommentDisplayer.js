// CommentDisplayer.js
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import WriteCommentInput from './WriteCommentInput';
import { v4 as uuidv4 } from 'uuid';
import Comment from './Comment';
import CommentActions from './CommentActions';
import apiRequest from '../../../utility/apiRequest';
import { useTranslation } from 'react-i18next';

const CommentDisplayer = (props) => {
    const { t } = useTranslation();
    const {
        createdCharacter,
        content,
        createdAt,
        selectedMode,
        selectedBookAndJournalEntry,
        commentThreadUUID,
        commentUUID,
        dispatchCreatedJournalBooks,
        panels,
        setPanels,
        repliedTo,
        firstInTheThread,
        previousCharacter,
        isLastComment,
        isFirstInLastThread,
        setLoading
    } = props;


    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(content);
    const [isManualReplying, setIsManualReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const { bookInfo, journalEntry } = selectedBookAndJournalEntry;

    const replyInputRef = useRef(null); // Ref for the reply input
    const firstCommentInLastThreadRef = useRef(null); // Ref for the first comment in the last thread
    // Set the manual reply state
    useLayoutEffect(() => {
        setIsManualReplying(false);
    }, [editContent]);

    // Scroll to the reply input if it's the last comment and manual reply is open
    useLayoutEffect(() => {
        if (isManualReplying && replyInputRef.current && isLastComment) {
            replyInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [isManualReplying, isLastComment]);

    useLayoutEffect(() => {
        if (isFirstInLastThread && firstCommentInLastThreadRef.current) {
            setTimeout(() => {
                firstCommentInLastThreadRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [isFirstInLastThread]);

    const onReplySend = async (selectedReplyMode, character = createdCharacter) => {
        if (replyContent.trim() === '' && selectedReplyMode === "Manual Post") {
            alert(t('writeReply'));
        } else {

            let content
            if (selectedReplyMode === "Manual Post") {
                content = replyContent.trim()
            }
            else {
                setLoading()
                console.log('uuid', commentThreadUUID)
                const response = await apiRequest('/createLLMComments', 'POST', {
                    journalEntryUUID: journalEntry.uuid,
                    characterUUIDs: [character.uuid],
                    commentThreadUUID: commentThreadUUID

                });
                console.log(response)
                content = response.comments[0].generation

            }

            const payload = {
                journalBookUUID: bookInfo.uuid,
                journalEntryUUID: journalEntry.uuid,
                ownerUUID: character.uuid,
                content: content,
                selectedMode: selectedReplyMode,
                commentThreadUUID: commentThreadUUID,
                commentUUID: uuidv4(),
                createdAt: Date.now()
            };

            dispatchCreatedJournalBooks({
                type: 'CREATE_COMMENT',
                payload: payload
            });

            setIsManualReplying(false);

            try {
                const response = await apiRequest('/createComment', 'POST', payload);
                console.log(response);
            } catch (error) {
                console.error('Error creating comment:', error);
            }
            finally {
                setLoading(false)
            }
        }
    };

    const onEditSave = async () => {
        setIsEditing(false);

        if (content !== editContent) {
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
            try {
                const response = await apiRequest(`/editComment/${commentUUID}`, 'PUT', { newContent: editContent });
                console.log(response);
            } catch (error) {
                console.error('Error editing comment:', error);
            }
        }
    };

    const onDelete = async () => {
        dispatchCreatedJournalBooks({
            type: 'DELETE_COMMENT',
            payload: {
                journalBookUUID: bookInfo.uuid,
                journalEntryUUID: journalEntry.uuid,
                commentThreadUUID: commentThreadUUID,
                commentUUID: commentUUID,
            },
        });

        try {
            const response = await apiRequest(`/deleteComment/${commentUUID}`, 'DELETE');
            console.log(response);
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <>
            <AnimatePresence>
                <motion.div
                    key={commentUUID}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.1 }}
                    transition={{ duration: 0.1 }}
                    ref={firstInTheThread && isFirstInLastThread ? firstCommentInLastThreadRef : null}
                >

                    {/* Render the Comment */}
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
                            />
                        </div>
                    ) : (
                        <div style={styles.replyContainer}>
                            <div style={styles.replyArrow}>↳</div>
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
                                />
                            </div>
                        </div>
                    )}

                    {/* Comment Actions */}
                    <CommentActions
                        isManualReplying={isManualReplying}
                        setIsManualReplying={setIsManualReplying}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        onReplySend={onReplySend}
                        onDelete={onDelete}
                        repliedTo={repliedTo}
                        previousCharacter={previousCharacter}
                    />

                    {/* Render Reply Input Below the Comment */}
                    {isManualReplying && (
                        <>
                            <div style={styles.replyContainer} ref={replyInputRef}>
                                <div style={styles.replyArrow}>↳</div>
                                <div style={styles.replyCommentContainer}>
                                    <Comment
                                        panels={panels}
                                        setPanels={setPanels}
                                        createdCharacter={previousCharacter}
                                        selectedMode={selectedMode}
                                    />
                                    <AnimatePresence>
                                        <motion.div
                                            key={`${commentUUID}-reply-input`}
                                            initial={{ opacity: 0, scale: 1 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.1 }}>
                                            <div style={styles.replyInputContainer}>
                                                <WriteCommentInput
                                                    placeholder={`Reply as ${previousCharacter.name}`}
                                                    commentValue={replyContent}
                                                    setCommentValue={setReplyContent}
                                                    sendButtonCallback={() => { onReplySend('Manual Post', previousCharacter) }}
                                                />
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                            <CommentActions
                                isManualReplying={isManualReplying}
                                setIsManualReplying={setIsManualReplying}
                                type={"Replying"}
                            />
                        </>
                    )}
                </motion.div>
            </AnimatePresence>
        </>
    );
};

const styles = {
    comment: {
        backgroundColor: 'var(--color-bg-darkgrey)',
        borderRadius: '8px',
        padding: '10px 10px',
        marginBottom: '10px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    replyContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        marginTop: '10px', // Add spacing between comment and reply input
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
