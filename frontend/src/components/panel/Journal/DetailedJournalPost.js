import React, { useRef, useState, useEffect } from 'react';
import CharacterButton from "../../CharacterButton";
import openNewPanel from "../../openNewPanel";
import TextArea from "../../TextArea";
import ToggleButton from "../../ToggleButton"; // Import the ToggleButton
import apiRequest from '../../../utility/apiRequest';
import { useTranslation } from 'react-i18next';
import DeleteConfirmationModal from '../../DeleteConfirmationModal';

const DetailedJournalPost = (props) => {
    const { t } = useTranslation();
    const { panels, setPanels, createdCharacter, selectedBookAndJournalEntry, setSelectedBookAndJournalEntry, dispatchCreatedJournalBooks } = props;
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(selectedBookAndJournalEntry.journalEntry.content);
    const { bookInfo, journalEntry } = selectedBookAndJournalEntry;
    const [showDelete, setShowDelete] = useState(false);
    const journalTextRef = useRef(null); // Reference for the journal text container
    const textAreaRef = useRef(null); // Ref for the TextArea to focus when editing starts
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    // Constants to control functionality
    const isClickableToEdit = false // Set to true to allow clicking to edit
    const isClickableToSave = true; // Set to true to allow clicking outside to save

    // Handle edit/save logic
    const onEditButtonClick = async () => {

        if (editedContent !== '') {

            if (editedContent !== journalEntry.content) {
                try {
                    dispatchCreatedJournalBooks({
                        type: 'EDIT_JOURNAL_ENTRY',
                        payload: {
                            journalBookUUID: selectedBookAndJournalEntry.bookInfo.uuid,
                            journalEntryUUID: journalEntry.uuid,
                            newValue: editedContent
                        }
                    })
                    const response = await apiRequest(`/editJournalEntry/${journalEntry.uuid}`, 'PUT', { newValue: editedContent });
                    console.log(response);


                } catch (error) {
                    console.log(error);
                }
            }
            setIsEditing(!isEditing);
        }
        else {
            alert(t('journalempty'))
        }
    };

    // Handle delete logic
    const onDeleteButtonClick = async () => {
        setShowDeleteConfirmation(true);
    };

    const confirmDelete = async () => {
        setSelectedBookAndJournalEntry(null);

        dispatchCreatedJournalBooks({
            type: 'DELETE_JOURNAL_ENTRY', payload: {
                journalBookUUID: bookInfo.uuid,
                journalEntryUUID: journalEntry.uuid
            }
        })
        try {
            const response = await apiRequest(`/deleteJournalEntry/${journalEntry.uuid}`, 'DELETE');
            console.log(response);

        } catch (error) {
            console.log(error);
        }
    };


    const onReturnClick = () => {
        setSelectedBookAndJournalEntry(null);
    };

    // Auto-focus TextArea when entering edit mode
    useEffect(() => {
        if (isEditing && textAreaRef.current) {
            textAreaRef.current.focus();
        }
    }, [isEditing]);

    // Handle click outside to save the journal entry
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (journalTextRef.current && !journalTextRef.current.contains(event.target)) {
                if (isClickableToSave && isEditing) {
                    setTimeout(() => {
                        onEditButtonClick(); // Delay the save to ensure state has updated
                    }, 100); // Short delay to ensure state synchronization
                }
            }
        };

        if (isClickableToSave) {
            document.addEventListener('mousedown', handleClickOutside); // Attach the event listener
        }

        return () => {
            if (isClickableToSave) {
                document.removeEventListener('mousedown', handleClickOutside); // Clean up on component unmount
            }
        };
    }, [isClickableToSave, isEditing, editedContent]);

    return (
        <>
            <div style={styles.characterSection}>
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
                    key={createdCharacter?.uuid}
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

                {/* Edit button */}
                <button style={styles.editButton} onClick={onEditButtonClick}>
                    {isEditing ? "💾" : "✎"}
                </button>

                {/* More button */}
                <button style={styles.moreButton} onClick={() => setShowDelete(!showDelete)}>
                    ...
                </button>

                {/* Conditionally show delete button */}
                {showDelete && (
                    <button style={styles.deleteButton} onClick={onDeleteButtonClick}>
                        {t('delete')}
                    </button>
                )}

                {showDeleteConfirmation && (
                    <DeleteConfirmationModal
                        title={t('confirmDeletion')}
                        setShowModal={setShowDeleteConfirmation}
                    >
                        <p style={{ marginBottom: '20px' }}>{t('areYouSureDelete')}</p>
                        <div style={styles.modalButtonContainer}>
                            <button onClick={() => setShowDeleteConfirmation(false)} style={styles.cancelButton}>
                                {t('cancel')}
                            </button>
                            <button onClick={confirmDelete} style={styles.deleteButton}>
                                {t('delete')}
                            </button>
                        </div>
                    </DeleteConfirmationModal>
                )}
            </div>

            <div
                ref={journalTextRef}  // Attach the reference to the journal text container
                style={styles.journalText}
                onClick={() => {
                    if (isClickableToEdit && !isEditing) {
                        setIsEditing(true);  // Enable editing when clicking on the journal text
                    }
                }}
            >
                {isEditing ? (
                    <TextArea
                        ref={textAreaRef} // Attach the ref to the TextArea
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
    );
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
    moreButton: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: 'var(--font-medium)',
        marginLeft: '3px',
        transform: 'translateY(-3px)',
    },
    deleteButton: {
        backgroundColor: 'red',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '6px 10px',
        cursor: 'pointer',
        marginLeft: '5px',
    },
    journalText: {
        backgroundColor: 'var(--color-bg-grey)',
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
        // cursor: 'pointer'  // Indicate that the text is clickable
    },
    textArea: {
        width: '100%',
        padding: '10px',
        fontSize: 'var(--font-small)',
        borderRadius: '8px',
        border: '1px solid #ccc',
    },
    modalButtonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginTop: '20px',
    },
    cancelButton: {
        padding: '8px 16px',
        backgroundColor: '#ccc',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    deleteButton: {
        padding: '8px 16px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default DetailedJournalPost;
