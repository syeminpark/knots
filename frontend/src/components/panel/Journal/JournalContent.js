

const JournalContent = (props) => {

    const { characterName, content } = props
    return (
        <div style={styles.expandedContent}>
            {/* Expanded content UI based on your image */}
            <div style={styles.expandedHeader}>
                <div style={styles.avatar}></div>
                <div>
                    <strong>{characterName}</strong>
                </div>
            </div>
            <p style={styles.journalText}>
                {content}
                <span style={styles.moreLink}>more</span>
            </p>
        </div>
    )
}
const styles = {
    expandedContent: {
        marginTop: '15px',
        backgroundColor: '#ffffff',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        textAlign: 'left',
    },
    expandedHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
    },
    journalText: {
        color: '#333',
        fontSize: '14px',
        marginTop: '10px',
        backgroundColor: '#f0f0f0',
        padding: '10px',
        borderRadius: '5px',
    },
    moreLink: {
        color: '#9b9b9b',
        cursor: 'pointer',
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#b3b3ff',
        marginRight: '10px',
    },
}
export default JournalContent