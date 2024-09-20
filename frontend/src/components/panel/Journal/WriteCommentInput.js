
const WriteCommentInput = (props) => {

    const { placeholder, commentValue, setCommentValue, sendButtonCallback } = props

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && commentValue.trim()) {
            e.preventDefault(); // Prevent default Enter key behavior
            sendButtonCallback()
        }
    };



    return (
        <div style={styles.replyInputWrapper}>
            <input
                type="text"
                placeholder={placeholder}
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
                style={styles.replyInput}
                onKeyDown={(e) => handleKeyDown(e)} // Listen for Enter key press
            />
            <button
                onClick={sendButtonCallback}
                style={styles.sendButton}
                disabled={!commentValue.trim()} // Disable the button if there's no content
            >
                ⩥ {/* Arrow icon (or you can use a library like FontAwesome for a more stylish arrow) */}
            </button>
        </div>
    );
};

const styles = {
    replyInputWrapper: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        padding: '5px 10px',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    },
    replyInput: {
        flexGrow: 1,
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '10px',
        fontSize: 'var(--font-small)',
        outline: 'none',
    },
    sendButton: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: 'var(--font-large)',
        marginLeft: '10px',
        color: '#333',
    },
};

export default WriteCommentInput;
