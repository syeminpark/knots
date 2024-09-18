import { useState } from "react";
import SelectBox from "../../SelectBox";

const BottomActions = ({ selectedCharacters, setSelectedCharacters, createdCharacters }) => {
    const [commentValue, setCommentValue] = useState("");

    const onInputChange = (e) => {
        setCommentValue(e.target.value);
    };

    const onSendButtonClick = () => {
        if (selectedCharacters.length < 1) {
            alert('Select A Character')
        }
        else if (!commentValue) {
            alert('Write Something')
        }
        console.log("Comment:", commentValue);
        console.log("Selected Character:", selectedCharacters);
        setCommentValue('');

    };

    return (
        <div >
            <div style={styles.commentTitle}>
                Create New Comment Thread
            </div>
            <div style={styles.actionContainer}>
                {/* Character Selection */}
                <div style={styles.characterSelect}>
                    <SelectBox
                        selectedCharacters={selectedCharacters}
                        setSelectedCharacters={setSelectedCharacters}
                        availableCharacters={createdCharacters.characters}
                        multipleSelect={false}
                    />
                </div>
                <button style={styles.generateButton}>✨ Generate</button>
            </div>
            {/* Comment Input */}
            <div style={styles.commentInputContainer}>
                <input
                    type="text"
                    placeholder="Write a new comment as a character"
                    value={commentValue}
                    onChange={onInputChange}
                    style={styles.commentInput}
                />
                <button style={styles.sendCommentButton} onClick={onSendButtonClick}>✈️ Send</button>
            </div>
        </div>
    );
};

const styles = {
    commentTitle: {
        fontSize: '14px',
        fontWeight: 'bold'
    },
    actionContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '15px',
    },
    characterSelect: {
        flex: 1,
        marginRight: '10px',
        fontSize: '14px',
    },
    generateButton: {
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 15px',
        cursor: 'pointer',
    },
    commentInputContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '10px',
        marginBottom: '15px',
    },
    commentInput: {
        flex: 1,
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        marginRight: '10px',
    },
    sendCommentButton: {
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 15px',
        cursor: 'pointer',
    },
};

export default BottomActions;
