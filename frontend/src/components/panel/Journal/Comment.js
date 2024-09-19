import TimeAgo from '../../TimeAgo';
import CharacterButton from "../../CharacterButton";
import EntryTag from '../../EntryTag';

const Comment = (props) => {
    const { createdCharacter, content, createdAt, selectedMode } = props;
    return (
        <>
            <div style={styles.comment}>
                <div style={styles.commentHeader}>
                    <div style={styles.commentInfo}>
                        {/* Use CharacterButton here */}
                        <CharacterButton
                            createdCharacter={createdCharacter}
                            iconStyle={styles.characterButtonIconStyle}
                            textStyle={styles.characterButtonTextStyle}
                        />
                        <div style={styles.headerInfo}>
                            <EntryTag selectedMode={selectedMode} size='small' hasBackground={false}> </EntryTag>
                            <span style={styles.commentTime}><TimeAgo createdAt={createdAt} /></span>
                        </div>

                    </div>
                </div>
                <div style={styles.commentText}>
                    {content}
                </div>
            </div >
            <div style={styles.commentActions}>
                <span style={styles.commentAction}>Manual Reply</span>
                <span style={styles.commentAction}>Generate Reply</span>
                <span style={styles.commentAction}>Edit</span>
                <span style={styles.commentAction}>Delete</span>
            </div>
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
        marginLeft: '5px',

    },
    commentInfo: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentTime: {
        fontSize: '10px',
        color: '#9b9b9b',
        marginLeft: '5px',
    },
    commentText: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        fontSize: '16px',
        color: '#333',
        padding: '5px',
        whiteSpace: "pre-line",
        lineHeight: '1.4',
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
        fontSize: '12px',
        color: '#9b9b9b',
        fontWeight: '500',
    },
    // Styles for CharacterButton integration
    characterButtonIconStyle: {
        width: '30px',
        height: '30px',
    },
    characterButtonTextStyle: {
        fontSize: '14px',
        fontWeight: 'bold',

    },
};

export default Comment;

