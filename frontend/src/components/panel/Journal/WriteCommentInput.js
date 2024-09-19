
const WriteCommentInput = (props) => {

    const { placeholder, commentValue, setCommentValue, sendButtonCallback } = props

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && commentValue.trim()) {
            e.preventDefault(); // Prevent default Enter key behavior
            sendButtonCallback()
        }
    };
    return (
        <>
            <input
                type="text"
                placeholder={placeholder}
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
                style={styles.commentInput}
                onKeyDown={(e) => handleKeyDown(e)} // Listen for Enter key press
            />
            <button style={styles.sendCommentButton} onClick={sendButtonCallback}>
                {'⩥'}
            </button>
        </>

    )
}
const styles = {
    commentInput: {
        width: '100%',
        flex: 1,
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        paddingRight: '40px',

    },
    sendCommentButton: {

        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '5px',
        fontSize: "16px",

    },
}

export default WriteCommentInput