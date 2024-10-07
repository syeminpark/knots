import React, { useState, useEffect, useRef } from 'react';
import TextArea from '../TextArea';
import { useTranslation } from 'react-i18next';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Attribute = (props) => {
    const { t } = useTranslation();
    const {
        uuid,
        title,
        placeholder,
        deleteFunction,
        list,
        setter,
        onChange,
        onTitleChange,
    } = props;

    const attribute = list.find((attr) => attr.uuid === uuid);

    const [isEditing, setIsEditing] = useState(!attribute?.description);
    const [editedContent, setEditedContent] = useState(attribute ? attribute.description : '');
    const [showDelete, setShowDelete] = useState(false);
    const [editedTitle, setEditedTitle] = useState(attribute ? attribute.name : '');

    const containerRef = useRef(null);

    // useSortable setup
    const {
        attributes: dragAttributes,
        listeners: dragListeners,
        setActivatorNodeRef,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: uuid });

    const dragStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    useEffect(() => {
        if (!isEditing) {
            setEditedContent(attribute?.description || '');
            setEditedTitle(attribute?.name || '');
        }
    }, [attribute?.description, attribute?.name, isEditing]);

    const handleSave = () => {
        if (isEditing) {
            if (editedTitle !== attribute?.name) {
                onTitleChange(editedTitle); // Correct: Pass only the new title

            }
            if (editedContent !== attribute?.description) {
                onChange(editedContent); // Correct: Pass only the new content

            }
        }
    };
    // Toggle delete button visibility
    const toggleDeleteButton = (e) => {
        e.stopPropagation(); // Prevent propagation to parent click event
        setShowDelete((prevState) => !prevState);
    };

    return (
        <div
            ref={(node) => {
                containerRef.current = node;
                setNodeRef(node);
            }}
            style={{
                ...styles.attributeContainer,
                ...dragStyle,
            }}
        >
            <div style={styles.sectionHeader}>
                <div
                    ref={setActivatorNodeRef}
                    {...dragAttributes}
                    {...dragListeners}
                    style={styles.dragHandle}
                >
                    <span style={styles.dragIcon}>☰</span>
                </div>
                {isEditing ? (
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        style={styles.sectionHeaderInput}
                    />
                ) : (
                    <label style={styles.sectionHeaderLabel}>{title}</label>
                )}

                {/* Edit and More Buttons */}
                <div style={styles.buttonsContainer}>
                    <button
                        style={styles.editButton}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent container click from triggering
                            if (isEditing) {
                                handleSave();
                                setIsEditing(false); // Exit edit mode after saving
                            } else {
                                setIsEditing(true); // Enter edit mode
                            }
                        }}
                    >
                        {isEditing ? '💾' : '✎'}
                    </button>

                    <button
                        style={styles.moreButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleDeleteButton(e);
                        }}
                    >
                        ...
                    </button>

                    {showDelete && (
                        <button
                            style={styles.deleteButton}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent container click from triggering
                                deleteFunction(uuid);
                            }}
                        >
                            {t('delete')}
                        </button>
                    )}
                </div>
            </div>

            {/* Text Area or static text depending on edit mode */}
            {isEditing ? (
                <TextArea
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

// Styles specific to Attribute
const styles = {
    attributeContainer: {
        backgroundColor: 'var(--color-bg-grey)',
        padding: '12px',
        borderRadius: '10px',
        marginBottom: '20px',
        boxShadow: '0 4px 4px rgba(196, 196, 196, 0.25)',
    },
    sectionHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        userSelect: 'none',
        overflowX: 'hidden',
    },
    dragHandle: {
        cursor: 'grab',
        padding: '4px',
        marginRight: '8px',
    },
    dragIcon: {
        fontSize: '16px',
    },
    sectionHeaderLabel: {
        color: '#6d6dff',
        fontSize: 'var(--font-medium)',
        fontWeight: 'var(--font-bold)',
        marginLeft: '10px',
        flexGrow: 1,
    },
    sectionHeaderInput: {
        fontSize: 'var(--font-medium)',
        fontWeight: 'var(--font-bold)',
        marginLeft: '10px',
        flexGrow: 1,
    },
    buttonsContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        marginLeft: 'auto',
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
        minHeight: '50px',
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: 'white',
        fontSize: 'var(--font-small)',
        resize: 'vertical',
        overflow: 'hidden',
        whiteSpace: 'pre-wrap',
        border: '1px solid #b8b8f3',
    },
};

export default Attribute;
