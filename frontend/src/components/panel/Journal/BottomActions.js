import { useEffect, useState } from "react";
import SelectBox from "../../SelectBox";
import TabNavigation from "../Character/TabNavigation";
import ToggleButton from "../../ToggleButton";

const BottomActions = ({ selectedCharacters, setSelectedCharacters, createdCharacters, onCreateComment, }) => {
    const [commentValue, setCommentValue] = useState("");
    const [activeTab, setActiveTab] = useState('System Generate');
    const [isMultipleSelect, setIsMultipleSelect] = useState(true);
    const [commentPlaceholder, setCommentPlaceholder] = useState(true);
    const [isExpanded, setIsExpanded] = useState(true);

    const onInputChange = (e) => {
        setCommentValue(e.target.value);
    };

    const onSendButtonClick = () => {
        if (selectedCharacters.length < 1) {
            alert('Select A Character');
        } else if (!commentValue && activeTab == "Manual Post") {
            alert('Write Something');
        } else {
            console.log("Comment:", commentValue);
            console.log("Selected Character:", selectedCharacters);

            selectedCharacters.forEach(selectedCharacter => {
                //if activeTab is SystemGenerate, run the API CALL HERE
                //also use Set(CommentValue here after the api call)
                onCreateComment(selectedCharacter.uuid, commentValue, activeTab)
            })
            setCommentValue('');
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && commentValue.trim()) {
            e.preventDefault(); // Prevent default Enter key behavior
            onSendButtonClick();
        }
    };

    useEffect(() => {
        if (activeTab === "Manual Post") {
            setIsMultipleSelect(false);
        } else {
            setIsMultipleSelect(true);
        }
    }, [activeTab]);

    useEffect(() => {
        if (selectedCharacters.length > 0) {
            setCommentPlaceholder(`Write comment as '${selectedCharacters[0].name}'`)
        }

    }, [selectedCharacters]);

    const toggleExpand = () => {
        setIsExpanded((prev) => !prev);
    };

    return (
        <div>
            {/* Clickable Header */}
            <div style={styles.headerContainer} onClick={toggleExpand}>
                <div style={styles.commentTitle}>
                    + Create New Comment Thread
                </div>
                <ToggleButton
                    expandable={true}
                    expanded={isExpanded}
                    direction={isExpanded ? "up" : "down"}
                    size="small"
                />
            </div>

            {/* Show content only when expanded */}
            {isExpanded && (
                <>
                    {/* Tab Navigation */}
                    <TabNavigation tabs={['System Generate', 'Manual Post']} activeTab={activeTab} setActiveTab={setActiveTab} />

                    {/* Character Select - Always visible */}
                    <div style={styles.characterSelect}>
                        <SelectBox
                            selectedCharacters={selectedCharacters}
                            setSelectedCharacters={setSelectedCharacters}
                            availableCharacters={createdCharacters.characters}
                            multipleSelect={isMultipleSelect}
                        />
                    </div>

                    {/* Only render Generate button or Comment input if characters are selected */}
                    {selectedCharacters.length > 0 && (
                        <>
                            {/* Generate Mode */}
                            {activeTab === "System Generate" && (
                                <div style={styles.generateButtonContainer}>
                                    <button style={styles.generateButton} onClick={onSendButtonClick}>✨ Generate</button>
                                </div>
                            )}

                            {/* Manual Mode */}
                            {activeTab === "Manual Post" && (
                                <div style={styles.commentInputContainer}>
                                    <input
                                        type="text"
                                        placeholder={commentPlaceholder}
                                        value={commentValue}
                                        onChange={onInputChange}
                                        style={styles.commentInput}
                                        onKeyDown={handleKeyDown} // Listen for Enter key press
                                    />
                                    <button style={styles.sendCommentButton} onClick={onSendButtonClick}>
                                        {'⩥'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

const styles = {
    headerContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        cursor: 'pointer',
        marginBottom: '5px',

    },
    commentTitle: {
        fontSize: '14px',
        fontWeight: 'bold',
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
        padding: 0,
    },
};

export default BottomActions;
