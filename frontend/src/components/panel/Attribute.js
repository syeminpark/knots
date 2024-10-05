import React, { useState, useEffect, useRef } from 'react';
import TextArea from '../TextArea';
import CharacterButton from '../CharacterButton';
import openNewPanel from '../openNewPanel';
import { useTranslation } from 'react-i18next';

const Attribute = (props) => {
    const { t } = useTranslation();
    const { panels, setPanels, title, placeholder, deleteFunction, list, setter, onChange, connectedCharacter, currentCharacter, isConnectionsTab } = props;

    const attribute = list.find(attr => attr.name === title);

    const [isEditing, setIsEditing] = useState(!attribute?.description);
    const [editedContent, setEditedContent] = useState(attribute ? attribute.description : "");
    const [showDelete, setShowDelete] = useState(false);
    const [selectedChips, setSelectedChips] = useState(() => {
        return attribute && attribute.knowledge ? attribute.knowledge.map(item => item.name) : [];
    });

    const [includeInJournal, setIncludeInJournal] = useState(attribute ? attribute.includeInJournal : false)
    // console.log(includeInJournal)

    const containerRef = useRef(null);
    const textAreaRef = useRef(null);
    const isClickableToEdit = true;
    const isClickableToSave = true;


    useEffect(() => {
        setEditedContent(attribute?.description);

    }, [attribute?.description]);

    useEffect(() => {
        setIncludeInJournal(attribute?.includeInJournal)
    }, [attribute?.includeInJournal]);

    useEffect(() => {
        setSelectedChips(attribute && attribute?.knowledge ? attribute?.knowledge.map(item => item?.name) : []); // Update selectedChips when attribute changes
    }, [attribute?.knowledge]);

    useEffect(() => {
        if (!attribute || !attribute.description) {
            setIsEditing(true);
        }
    }, [attribute]);

    const handleSave = () => {
        if (isEditing && editedContent !== attribute?.description) {
            if (!isConnectionsTab) {
                onChange({ target: { value: editedContent } });
            } else {
                onChange('description', { target: { value: editedContent } });
            }
        }
        if (editedContent !== '') setIsEditing(false); // Exit edit mode after saving
    };

    const handleChipClick = (name, e) => {
        e.stopPropagation();
        const updatedKnowledge = selectedChips.includes(name)
            ? selectedChips.filter(chip => chip !== name)
            : [...selectedChips, name];

        const selectedChipsData = updatedKnowledge.map(chip => {
            const description = '';
            return { name: chip, description: description };
        });

        onChange('knowledge', { target: { value: selectedChipsData } });
        setSelectedChips(updatedKnowledge);
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
        setShowDelete((prevState) => !prevState);
    };

    // Toggle includeInJournal state
    const handleToggleIncludeInJournal = (e) => {
        e.stopPropagation(); // Prevent container click from triggering
        setIncludeInJournal((prevValue) => !prevValue); // Toggle the value
        onChange('includeInJournal', { target: { value: !includeInJournal } }); // Pass the change to the parent (if needed)
    };

    return (
        <>
            {/* Move toggleContainer outside of attributeContainer */}
            {isConnectionsTab && (
                <div style={styles.toggleContainer}>
                    <label
                        style={{
                            ...styles.checkboxwrapper,
                            backgroundColor: includeInJournal ? '#f0eaff' : 'var(--color-bg-grey)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <input
                            type="checkbox"
                            checked={includeInJournal}
                            onChange={handleToggleIncludeInJournal}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                ...styles.customCheckbox,
                                backgroundColor: includeInJournal ? 'var(--color-secondary)' : 'white',
                            }}
                        />
                        <span style={styles.checkboxLabel}>
                            {includeInJournal ? '저널에 반영됨' : '저널에 제외됨'}
                        </span>
                    </label>
                </div>
            )}

            <div ref={containerRef} style={styles.attributeContainer} onClick={handleContainerClick}>
                <div style={styles.sectionHeader}>
                    {connectedCharacter ? (
                        <div>
                            <div style={styles.characterProfilesContainer}>
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
                            </div>
                            <label style={styles.sectionHeaderLabel}>{t('relationshipsAttribute')}</label>
                        </div>
                    ) : (
                        <label style={styles.sectionHeaderLabel}>{title}</label>
                    )}

                    {/* Edit and More Buttons */}

                    <div style={styles.buttonsContainer}>
                        <button
                            style={styles.editButton}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent container click from triggering
                                handleSave();
                                setIsEditing(!isEditing); // Toggle between edit and save modes
                            }}
                        >
                            {isEditing ? '💾' : '✎'}
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
                                {t('delete')}
                            </button>
                        )}
                    </div>

                </div>
                {/* Text Area or static text depending on edit mode */}
                {
                    isEditing ? (
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
                    )
                }

                {/* Additional Knowledge Section for Connections */}
                {
                    isConnectionsTab && (
                        <>
                            <br />

                            <div style={styles.sectionHeaderLabel}>{t('knowledge')}</div>
                            {/* Include In Journal Button (Positioned Below Edit and More Buttons) */}


                            <div style={styles.knowledgeExplanation}>
                                {t('knowsAbout', {
                                    currentCharacterName: currentCharacter?.name,
                                    connectedCharacterName: connectedCharacter?.name,
                                })}
                            </div>
                            <div style={styles.chipsContainer}>
                                {connectedCharacter?.personaAttributes.map((attr, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            ...styles.chip,
                                            ...(selectedChips.includes(attr.name) ? styles.selectedChip : {}),
                                        }}
                                        onClick={(e) => handleChipClick(attr.name, e)} // Pass the event to the handler
                                    >
                                        {selectedChips.includes(attr.name) ? '✔ ' : ''}
                                        {attr.name}
                                    </div>
                                ))}
                            </div>
                        </>
                    )
                }
            </div >
        </>
    );
};

// Connection-specific styles
const styles = {
    attributeContainer: {
        backgroundColor: 'var(--color-bg-grey)',
        padding: '12px',
        borderRadius: '10px',
        // marginTop: '10px',
        marginBottom: '20px',
        boxShadow: '0 4px 4px rgba(196, 196, 196, 0.25)',
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '10px',

    },
    characterProfilesContainer: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between', // This pushes the toggleContainer to the right
        marginBottom: '10px',
        marginLeft: '10px',
    },
    characterProfiles: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '10px',
        width: '100%',
        fontSize: '14px',
    },
    profileButtonContainer: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '14px',
    },
    toggleContainer: {
        marginBottom: '1px',
    },
    sectionHeaderLabel: {
        color: '#6d6dff',
        fontSize: 'var(--font-medium)',
        fontWeight: 'var(--font-bold)',
        marginLeft: '10px',

    },
    buttonsContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px', // Spacing between the buttons
        alignSelf: 'flex-end', // Moves the buttons to the bottom within their container
        marginTop: '10px', // Adjust this to move the buttons further down
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
        minHeight: '50px', // Start with a base height
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: 'white', // Default background for edit mode
        fontSize: 'var(--font-small)',
        resize: 'vertical', // Allows the user to manually resize vertically
        overflow: 'hidden', // Hides overflow to prevent the scroll bar
        whiteSpace: 'pre-wrap', // Preserves spaces, line breaks, and tabs
        border: '1px solid #b8b8f3'
    },
    chipsContainer: {
        marginTop: '10px',
        marginLeft: '10px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
    },
    chip: {
        backgroundColor: '#f0f0f0',
        color: '#333',
        padding: '5px 10px',
        borderRadius: '15px',
        fontSize: '14px',
        cursor: 'pointer',
    },
    selectedChip: {
        backgroundColor: '#f0eaff',
        borderColor: 'var(--color-secondary)',
        borderWidth: '1px',
        borderStyle: 'solid',
    },
    knowledgeExplanation: {
        padding: '5px 0px',
        color: '#333',
        fontSize: 'var(--font-xs)',
        marginLeft: '10px',
    },
    knowledgeHeader: {
        display: 'flex',
        justifyContent: 'space-between', // Ensures space between the label and the button
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'transparent',
        border: 'none',
        marginLeft: '10px',
        paddingBottom: '10px', // Add some spacing for visual clarity
    },
    checkboxwrapper: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: 'var(--color-bg-grey)',
        borderRadius: '8px',
        padding: '5px 10px 5px 5px',
    },
    customCheckbox: {
        appearance: 'none',
        width: '18px',
        height: '18px',
        border: '2px solid #ccc',
        borderRadius: '4px',
        marginRight: '8px',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
    },
    checkboxLabel: {
        fontSize: 'var(--font-small)',
        fontWeight: 'var(--font-semibold)',
        color: '#333',
        whiteSpace: 'nowrap',
    },
};

export default Attribute;
