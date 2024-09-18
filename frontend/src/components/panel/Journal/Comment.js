
import TimeAgo from '../../TimeAgo';
import CharacterButton from "../../CharacterButton";

const Comment = (props) => {

    const { createdCharacter, commentText, createdAt } = props
    return (
        <>
            <div style={styles.comment}>
                <div style={styles.commentHeader}>
                    <div style={styles.commentInfo}>
                        <div style={styles.avatar}></div>
                        <span style={styles.commentAuthor}>Stranger 1</span>
                        <span style={styles.commentTime}><TimeAgo createdAt={'text'} /></span>
                    </div>
                </div>
                <div style={styles.commentText}>
                    Come to our store to buy magic potions!
                </div>
            </div>
            <div style={styles.commentActions}>
                <span style={styles.commentAction}>Manual Reply</span>
                <span style={styles.commentAction}>Generate Reply</span>
                <span style={styles.commentAction}>Edit</span>
                <span style={styles.commentAction}>Delete</span>
            </div>

        </>
    )
}
const styles = {
    comment: {
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        padding: '10px',
        marginBottom: '5px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    commentHeader: {
        display: 'flex',
        alignItems: 'center',
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#d8d8d8',
        marginRight: '10px',
    },
    commentInfo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: '10px',
        alignItems: 'center'
    },

    commentAuthor: {
        fontWeight: 'bold',
        fontSize: '14px',
    },
    commentTime: {
        fontSize: '12px',
        color: '#9b9b9b',
    },
    commentText: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        fontSize: '14px',
        color: '#333',
        marginLeft: '50px',
        marginBottom: '5px',
    },

    commentActions: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: '10px',
        marginBottom: '20px',
    },
    commentAction: {
        cursor: 'pointer',
        fontSize: '12px',
        color: '#9b9b9b',
        fontWeight: 'bold'
    },
}
export default Comment