import { act, useEffect, useState } from "react";
import SelectBox from "../../SelectBox";
import TabNavigation from "../Character/TabNavigation";
import ToggleButton from "../../ToggleButton"
import WriteCommentInput from "./WriteCommentInput";
import apiRequest from "../../../utility/apiRequest";
import { v4 as uuidv4 } from 'uuid';

const BottomActions = (props) => {
    const { selectedCharacters, setSelectedCharacters, createdCharacters, dispatchCreatedJournalBooks, selectedBookAndJournalEntry } = props
    const [commentValue, setCommentValue] = useState("");
    const [activeTab, setActiveTab] = useState('System Generate');
    const [isMultipleSelect, setIsMultipleSelect] = useState(true);
    const [commentPlaceholder, setCommentPlaceholder] = useState("");
    const [isExpanded, setIsExpanded] = useState(true);
    const { bookInfo, journalEntry } = selectedBookAndJournalEntry;

    const onSendButtonClick = () => {
        if (selectedCharacters.length < 1) {
            alert('Select A Character');
        } else if (!commentValue && activeTab == "Manual Post") {
            alert('Write Something');
        } else {

            selectedCharacters.forEach(async (selectedCharacter) => {
                const payload = {
                    journalBookUUID: bookInfo.uuid,
                    journalEntryUUID: journalEntry.uuid,
                    ownerUUID: selectedCharacter.uuid,
                    content: commentValue,
                    selectedMode: activeTab,
                    commentThreadUUID: uuidv4(),
                    commentUUID: uuidv4(),
                    createdAt: Date.now()
                }
                dispatchCreatedJournalBooks({
                    type: 'CREATE_COMMENT',
                    payload: payload
                });
                try {
                    const response = await apiRequest('/createComment', 'POST', payload);
                    console.log(response)
                }
                catch (error) {
                    console.log(error)
                }

            })

        }
    };

    // useEffect(() => {
    //     if (activeTab === "Manual Post") {
    //         setIsMultipleSelect(false);
    //     } else {
    //         setIsMultipleSelect(true);
    //     }
    // }, [activeTab]);

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
                            availableCharacters={createdCharacters.characters.filter(character => character.uuid !== journalEntry.ownerUUID)}
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
                                    <WriteCommentInput
                                        placeholder={commentPlaceholder}
                                        commentValue={commentValue}
                                        setCommentValue={setCommentValue}
                                        sendButtonCallback={onSendButtonClick}
                                    >
                                    </WriteCommentInput>
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
        fontSize: 'var(--font-small)',
        fontWeight: 'var(--font-bold)',
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

};

export default BottomActions;
