
const CommentActions = (props) => {

    const { isManualReplying, setIsManualReplying, onReplySend, onEditSave, onDelete, isEditing, setIsEditing, repliedTo, type = "Normal"
    } = props


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
            {type === "Normal" && (
                <>
                    {!isEditing ? (
                        !repliedTo ? (
                            <>
                                <div style={styles.commentActions}>
                                    <span style={styles.commentAction} onClick={() => { onReplySend('System Generate') }}>Generate Reply</span>
                                    <span style={styles.commentAction} onClick={handleManualReplyToggle}>
                                        Manual Reply
                                    </span>
                                    <span style={styles.commentAction} onClick={() => setIsEditing(true)}>Edit</span>
                                    <span style={styles.commentAction} onClick={onDelete}>Delete</span>
                                </div>
                            </>
                        ) : (
                            <div style={styles.commentActions}>
                                <span style={styles.commentAction} onClick={() => setIsEditing(true)}>Edit</span>
                                <span style={styles.commentAction} onClick={onDelete}>Delete</span>
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
                        Cancel
                    </span>
                </div>
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
}