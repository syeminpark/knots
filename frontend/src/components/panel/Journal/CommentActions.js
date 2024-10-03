import React, { useState } from 'react';
import DeleteConfirmationModal from '../../DeleteConfirmationModal';
import { useTranslation } from 'react-i18next';

const CommentActions = (props) => {

    const { t } = useTranslation();
    const { isManualReplying, setIsManualReplying, onReplySend, onDelete, isEditing, setIsEditing, repliedTo, type = "Normal", previousCharacter
    } = props


    // Handle manual reply toggle
    const handleManualReplyToggle = () => {
        if (isManualReplying) {
            setIsManualReplying(false); // Cancel manual reply
        } else {
            setIsManualReplying(true); // Enter manual reply mode
        }
    };

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const onDeleteClick = () => {
        setShowDeleteConfirmation(true);
    };

    const confirmDelete = () => {
        setShowDeleteConfirmation(false);
        onDelete();
    };



    return (
        <>
            {type === "Normal" && (
                <>
                    {!isEditing ? (
                        !repliedTo ? (
                            <>
                                <div style={styles.commentActions}>
                                    <span style={styles.commentAction} onClick={() => { onReplySend('SYSTEMGENERATE', previousCharacter) }}>{t('generateReply')}</span>
                                    <span style={styles.commentAction} onClick={handleManualReplyToggle}>
                                        {t('manualReply')}
                                    </span>
                                    <span style={styles.commentAction} onClick={() => setIsEditing(true)}>{t('edit')}</span>
                                    <span style={styles.commentAction} onClick={onDeleteClick}>{t('delete')}</span>
                                    {/* <span style={styles.commentAction} onClick={onDelete}>Delete</span> */}
                                </div>
                            </>
                        ) : (
                            <div style={styles.commentActions}>
                                {/* <span style={styles.commentAction} onClick={() => setIsEditing(true)}>Edit</span> */}
                                {/* <span style={styles.commentAction} onClick={onDelete}>Delete</span> */}
                            </div>
                        )
                    ) : (
                        <div style={styles.commentActions}>
                            <span style={styles.commentAction} onClick={() => setIsEditing(false)}>Cancel</span>
                        </div>
                    )}
                </>
            )}

            {type === "Replying" && (
                <div style={styles.commentActions}>
                    <span style={styles.commentAction} onClick={handleManualReplyToggle}>
                        {t('cancel')}
                    </span>
                </div>
            )}

            {showDeleteConfirmation && (
                <DeleteConfirmationModal
                    title={t('confirmDeletion')}
                    setShowModal={setShowDeleteConfirmation}
                >
                    <p style={{ marginBottom: '20px' }}>{t('areYouSureDelete')}</p>
                    <div style={styles.modalButtonContainer}>
                        <button onClick={() => setShowDeleteConfirmation(false)} style={styles.cancelButton}>
                            {t('cancel')}
                        </button>
                        <button onClick={confirmDelete} style={styles.deleteButton}>
                            {t('delete')}
                        </button>
                    </div>
                </DeleteConfirmationModal>
            )}
        </>
    );
}


export default CommentActions

const styles = {

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
    modalButtonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginTop: '20px',
    },
    cancelButton: {
        padding: '8px 16px',
        backgroundColor: '#ccc',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    deleteButton: {
        padding: '8px 16px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
}