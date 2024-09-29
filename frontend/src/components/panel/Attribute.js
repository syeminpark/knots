import React, { useState, useEffect, useRef } from 'react';
import TextArea from '../TextArea';
import CharacterButton from '../CharacterButton';
import openNewPanel from '../openNewPanel';

const Attribute = (props) => {
    const { panels, setPanels, title, placeholder, deleteFunction, list, setter, onChange, connectedCharacter, currentCharacter } = props;
    const attribute = list.find(attr => attr.name === title);


    const [isEditing, setIsEditing] = useState(!attribute?.description); // Set to edit mode if description is empty
    const [editedContent, setEditedContent] = useState(attribute ? attribute.description : ""); // Track the edited content
    const [showDelete, setShowDelete] = useState(false); // Track if the delete button should be shown

    const containerRef = useRef(null); // Create a ref for the container
    const textAreaRef = useRef(null); // Create a ref for the TextArea

    // Constants to toggle functionality
    const isClickableToEdit = true; // Set to true to enable clicking to edit
    const isClickableToSave = true; // Set to true to enable auto-save when clicking outside

    // Automatically set to edit mode if description is empty (on component mount)
    useEffect(() => {
        if (!attribute || !attribute.description) {
            setIsEditing(true);
        }
    }, [attribute]);

    // Save function that updates the description and exits edit mode
    const handleSave = () => {
        if (isEditing && editedContent !== attribute?.description) {
            onChange({ target: { value: editedContent } });
        }
        if (editedContent !== '')
            setIsEditing(false); // Exit edit mode after saving
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isClickableToSave && containerRef.current && !containerRef.current.contains(event.target)) {
                if (isEditing) {
                    handleSave(); // Auto-save when clicking outside the container
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside); // Attach the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside); // Clean up on component unmount
        };
    }, [isClickableToSave, isEditing, editedContent]); // Re-run when constants or states change

    // Handle click inside the container to enter edit mode and focus TextArea
    const handleContainerClick = (e) => {
        e.stopPropagation(); // Prevent event propagation
        if (isClickableToEdit && !isEditing) {
            setIsEditing(true); // Enter edit mode when clicking inside the container
            setTimeout(() => {
                if (textAreaRef.current) {
                    textAreaRef.current.focus(); // Automatically focus the TextArea when editing starts
                }
            }, 0);
        }
    };

    // Toggle delete button visibility
    const toggleDeleteButton = (e) => {
        e.stopPropagation(); // Prevent propagation to parent click event
        setShowDelete(prevState => !prevState);
    };

    return (
        <div ref={containerRef} style={styles.attributeContainer} onClick={handleContainerClick}>
            <div style={styles.sectionHeader}>
                {connectedCharacter ? (
                    <div>
                        <div style={styles.characterProfiles}>

                            <CharacterButton createdCharacter={currentCharacter}></CharacterButton>

                            →
                            <button
                                style={styles.profileButtonContainer}
                                key={connectedCharacter.uuid}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering edit mode when clicking on buttons

                                    openNewPanel(panels, setPanels, "character-profile", connectedCharacter);

                                }}
                            >
                                <CharacterButton createdCharacter={connectedCharacter}></CharacterButton>
                            </button>
                        </div>
                        <label style={styles.sectionHeaderLabel}>{'Relationship'}</label>
                    </div>
                ) : (
                    <label style={styles.sectionHeaderLabel}>{title}</label>
                )}

                {/* Edit and Toggle Button */}
                <div style={styles.buttonsContainer}>
                    <button
                        style={styles.editButton}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent container click from triggering
                            handleSave()
                            setIsEditing(!isEditing); // Toggle between edit and save modes
                        }}
                    >
                        {isEditing ? "💾" : "✎"}
                    </button>

                    {/* More Options Button */}
                    <button style={styles.moreButton} onClick={toggleDeleteButton}>
                        ...
                    </button>

                    {/* Conditionally Render Delete Button */}
                    {showDelete && (
                        <button
                            style={styles.deleteButton}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent container click from triggering
                                deleteFunction(title, list, setter);
                            }}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>

            {/* Text Area or static text depending on edit mode */}
            {isEditing ? (
                <TextArea
                    ref={textAreaRef} // Attach the ref to the TextArea
                    attribute={{ description: editedContent }}
                    placeholder={placeholder}
                    onChange={(e) => setEditedContent(e.target.value)} // Update local state
                    styles={styles}
                />
            ) : (
                <div
                    style={{
                        ...styles.description,
                        backgroundColor: 'var(--color-bg-grey)', // Set background to gray when not editing
                        border: 'none', // Remove border when not editing
                    }}
                >
                    {attribute ? attribute.description : placeholder}
                </div>
            )}
        </div>
    );
};

const styles = {
    attributeContainer: {
        backgroundColor: 'var(--color-bg-grey)',
        padding: '15px',
        borderRadius: '10px',
        marginTop: '10px',
        marginBottom: '12px',
        boxShadow: '0 4px 4px rgba(196, 196, 196, 0.25)',
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    characterProfiles: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '10px',
        width: '100%',
    },
    sectionHeaderLabel: {
        color: '#6d6dff',
        fontSize: 'var(--font-medium)',
        fontWeight: 'var(--font-bold)',
    },
    buttonsContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px', // Adjust spacing between the buttons
    },
    moreButton: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: 'var(--font-medium)',
        color: '#333',
    },
    deleteButton: {
        backgroundColor: 'red',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '6px 10px',
        cursor: 'pointer',
    },
    editButton: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: 'var(--font-medium)',
    },
    description: {
        width: '100%',
        minHeight: '100px', // Start with a base height
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: 'white', // Default background for edit mode
        fontSize: 'var(--font-small)',
        resize: 'vertical', // Allows the user to manually resize vertically
        overflow: 'hidden', // Hides overflow to prevent the scroll bar
        whiteSpace: 'pre-wrap', // Preserves spaces, line breaks, and tabs
        border: '1px solid #b8b8f3'
    },
    profileButtonContainer: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
    },
};

export default Attribute;
