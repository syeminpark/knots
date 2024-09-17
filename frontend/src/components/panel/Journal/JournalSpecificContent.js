import React, { useState } from "react";
import CharacterButton from "../../CharacterButton";
import openNewPanel from "../../openNewPanel";
import SelectBox from "../../SelectBox";
import TextArea from "../../TextArea";

const JournalSpecificContent = (props) => {
    const {
        panels,
        setPanels,
        journalBookInfo,
        journalEntry,
        createdCharacter,
        createdCharacters,
    } = props;

    const [selectedCharacters, setSelectedCharacters] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(journalEntry.content);


    const onEditButtonClick = () => {
        setIsEditing(!isEditing);
    };

    const onReturnClick = () => {
        console.log("Return button clicked");
    };

    const saveEditedContent = () => {
        setIsEditing(false);
    };

    return (
        <div style={styles.container}>
            {/* Journal Entry Section */}
            <div style={styles.journalEntry}>
                <div style={styles.entryHeader}>
                    <button style={styles.returnButton} onClick={onReturnClick}>
                        {"<"}
                    </button>
                    <div>
                        <strong style={styles.entryTitle}>{'What was your dream yesterday?'}</strong>
                        <span style={styles.entryTime}>{'1h'}</span>
                    </div>
                    <div>
                        <span style={{ ...styles.entryTag, ...styles.systemGenerated }}>{'Manual Post'}</span>
                    </div>
                </div>
                <div style={styles.characterSection}>
                    <button
                        style={styles.profileButtonContainer}
                        key={createdCharacter.uuid}
                        onClick={() => {
                            openNewPanel(panels, setPanels, "character-profile", createdCharacter);
                        }}
                    >
                        <CharacterButton
                            panels={panels}
                            setPanels={setPanels}
                            createdCharacter={createdCharacter}
                        />
                    </button>
                    <button style={styles.editButton} onClick={onEditButtonClick}>
                        {isEditing ? "💾" : "✎"} {/* Show Save icon when editing, Pen icon otherwise */}
                    </button>
                </div>

                <div style={styles.journalText}>
                    {isEditing ? (
                        <TextArea
                            attribute={{ description: editedContent }}
                            placeholder="Edit your content"
                            onChange={(e) => setEditedContent(e.target.value)}
                            styles={{ description: styles.textArea }}
                        />
                    ) : (
                        <div onClick={onEditButtonClick}>
                            {journalEntry.content || '"Lorem ipsum dolor sit amet, consectetur adipiscing elit...'}
                        </div>
                    )}
                </div>

                <div style={styles.comments}>
                    <p> 💬 Comments</p>
                </div>
            </div>

            {/* Bottom Section with Character Selection and Comment Input */}
            <div style={styles.bottom}>
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
                        placeholder="Write a comment as a character"
                        style={styles.commentInput}
                    />
                    <button style={styles.sendCommentButton}>✈️ Send</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        borderRadius: '8px 8px 0 0',
    },
    journalEntry: {
        marginBottom: '300px',
    },
    entryHeader: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: '10px',
        backgroundColor: '#f7f7ff',
        padding: '20px 15px',
        borderRadius: '8px 8px 0 0',
        fontSize: '16px',
        fontWeight: 'bold',
    },
    entryTitle: {
        fontWeight: 'bold',
        fontSize: '16px',
        whiteSpace: 'normal',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        textOverflow: 'ellipsis',
        textAlign: 'center',
        maxWidth: '100%',
    },
    entryTime: {
        color: '#9b9b9b',
        fontSize: '12px',
        position: 'absolute',
        right: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        whiteSpace: 'nowrap',
    },
    entryTag: {
        padding: '5px 10px',
        borderRadius: '8px',
        fontSize: '12px',
        marginBottom: '10px',
        alignItems: 'center',
    },
    systemGenerated: {
        backgroundColor: '#f0eaff',
        color: '#6c63ff',
    },
    characterSection: {
        padding: '10px 15px',
        display: 'flex',
        alignItems: 'center',
        marginTop: '10px',
    },
    profileButtonContainer: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
    },
    returnButton: {
        position: 'absolute',
        left: '15px', // Position the button on the left side of the header
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#333',
        fontWeight: 'bold'
    },
    editButton: {
        marginLeft: 'auto',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: '#333',
        fontSize: '16px',
    },
    journalText: {
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        padding: '15px',
        marginLeft: '15px',
        marginRight: '15px',
        fontSize: '14px',
        lineHeight: '1.5',
        color: '#333',
        textAlign: 'left',
        whiteSpace: "pre-line",
    },
    textArea: {
        width: '100%',
        padding: '10px',
        fontSize: '14px',
        borderRadius: '8px',
        border: '1px solid #ccc',
    },
    comments: {
        marginTop: '15px',
        marginLeft: '15px',
        fontSize: '14px',
        textAlign: 'left',
        fontWeight: 'bold',
    },
    bottom: {
        backgroundColor: '#f7f7ff',
        padding: '5px 10px',
        borderRadius: '8px 8px 0 0',
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

export default JournalSpecificContent;
