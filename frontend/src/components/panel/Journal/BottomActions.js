import { useState } from "react";
import SelectBox from "../../SelectBox";
import TabNavigation from "../Character/TabNavigation";

const BottomActions = ({ selectedCharacters, setSelectedCharacters, createdCharacters }) => {
    const [commentValue, setCommentValue] = useState("");
    const [activeTab, setActiveTab] = useState('Generate Mode'); // State for active tab

    const onInputChange = (e) => {
        setCommentValue(e.target.value);
    };

    const onSendButtonClick = () => {
        if (selectedCharacters.length < 1) {
            alert('Select A Character');
        } else if (!commentValue) {
            alert('Write Something');
        } else {
            console.log("Comment:", commentValue);
            console.log("Selected Character:", selectedCharacters);
            setCommentValue('');
        }
    };

    return (
        <div>
            <div style={styles.commentTitle}>
                Create New Comment Thread
            </div>

            {/* Tab Navigation */}
            <TabNavigation tabs={['Generate Mode', 'Manual Mode']} activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Character Select - Always visible */}
            <div style={styles.characterSelect}>
                <SelectBox
                    selectedCharacters={selectedCharacters}
                    setSelectedCharacters={setSelectedCharacters}
                    availableCharacters={createdCharacters.characters}
                    multipleSelect={false}
                />
            </div>

            {/* Generate Mode */}
            {activeTab === "Generate Mode" && (
                <div style={styles.generateButtonContainer}>
                    <button style={styles.generateButton}>✨ Generate</button>
                </div>
            )}

            {/* Manual Mode */}
            {activeTab === "Manual Mode" && (
                <div style={styles.commentInputContainer}>
                    <input
                        type="text"
                        placeholder="Write a comment as a character"
                        value={commentValue}
                        onChange={onInputChange}
                        style={styles.commentInput}
                    />
                    <button style={styles.sendCommentButton} onClick={onSendButtonClick}>
                        {'⩥'}
                    </button>
                </div>
            )}
        </div>
    );
};

const styles = {
    commentTitle: {
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    characterSelect: {
        marginBottom: '10px',
    },
    generateButtonContainer: {
        textAlign: 'center',
    },
    generateButton: {
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 15px',
        cursor: 'pointer',
        width: '100%',
    },
    commentInputContainer: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        marginTop: '10px',
        width: '100%',
    },
    commentInput: {
        flex: 1,
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        paddingRight: '40px', // Add padding for the send button space
    },
    sendCommentButton: {
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
    },
};

export default BottomActions;
