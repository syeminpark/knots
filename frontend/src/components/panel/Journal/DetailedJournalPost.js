import React, { useRef, useState, useEffect } from 'react';
import CharacterButton from "../../CharacterButton";
import openNewPanel from "../../openNewPanel";
import TextArea from "../../TextArea";
import ToggleButton from "../../ToggleButton"; // Import the ToggleButton

const DetailedJournalPost = (props) => {
    const { panels, setPanels, createdCharacter, selectedBookAndJournalEntry, setSelectedBookAndJournalEntry, dispatchCreatedJournalBooks } = props
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(selectedBookAndJournalEntry.journalEntry.content);
    const { bookInfo, journalEntry } = selectedBookAndJournalEntry;

    const onEditButtonClick = () => {
        console.log(bookInfo, journalEntry)
        if (isEditing) {
            journalEntry.content = editedContent;
            dispatchCreatedJournalBooks({
                type: 'EDIT_JOURNAL_ENTRY',
                payload: {
                    journalBookUUID: bookInfo.uuid,
                    journalEntryUUID: journalEntry.uuid,
                    newValue: journalEntry.content
                }
            })

        }
        setIsEditing(!isEditing);
    };
    useEffect(() => {

    })

    const onReturnClick = () => {
        setSelectedBookAndJournalEntry(null);
    };

    return (
        <>
            < div style={styles.characterSection} >
                <div style={styles.toggleButtonContainer}>
                    <ToggleButton
                        expandable={false}
                        direction="left" // Set to left for the back arrow
                        size="large" // Set the size as you prefer
                        onClick={onReturnClick}
                        text
                    />
                </div>
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
                        isButton={true}
                        onClick={() => { openNewPanel(panels, setPanels, "character-profile", createdCharacter) }}

                    />
                </button>
                <button style={styles.editButton} onClick={onEditButtonClick}>
                    {isEditing ? "💾" : "✎"}
                </button>
            </div >

            <div style={styles.journalText}>
                {isEditing ? (
                    <TextArea
                        attribute={{ description: editedContent }}
                        placeholder="Edit content"
                        onChange={(e) => setEditedContent(e.target.value)}
                        styles={{ description: styles.textArea }}
                    />
                ) : (
                    <div>
                        {journalEntry.content || '"Lorem ipsum dolor sit amet, consectetur adipiscing elit...'}
                    </div>
                )}
            </div>

        </>
    )
}
const styles = {
    characterSection: {
        padding: '10px 15px',
        display: 'flex',
        alignItems: 'center',
        marginTop: '10px',

    },
    toggleButtonContainer: {
        marginRight: '10px',
    },
    profileButtonContainer: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
    },
    editButton: {
        marginLeft: 'auto',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: '#333',
        fontSize: 'var(--font-medium)',
    },
    journalText: {
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        padding: '15px',
        marginLeft: '15px',
        marginRight: '15px',
        fontSize: 'var(--font-medium)',
        lineHeight: 'var(--line-height)',
        color: '#333',
        textAlign: 'left',
        whiteSpace: "pre-line",
        wordBreak: "break-word",
    },
    textArea: {
        width: '100%',
        padding: '10px',
        fontSize: 'var(--font-small)',
        borderRadius: '8px',
        border: '1px solid #ccc',
    },
}
export default DetailedJournalPost;