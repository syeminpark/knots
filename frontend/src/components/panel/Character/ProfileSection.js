import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const ProfileSection = (props) => {
    const { t } = useTranslation();
    const { id, imageSrc, setImageSrc, name, setName, preview, setPreview, createdCharacters } = props;

    const [isEditing, setIsEditing] = useState(!name); // Automatically enter edit mode if name is empty
    const [editedName, setEditedName] = useState(name || ''); // Track the edited name or default to an empty string
    const containerRef = useRef(null); // Reference for the container
    const inputRef = useRef(null); // Reference for the input field

    // Constants to control the behavior
    const isClickableToEdit = true
    const isClickableToSave = true

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(file);
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle name change
    const handleNameChange = (e) => {
        setEditedName(e.target.value); // Update the local edited name
    };

    // Handle save functionality
    const handleSave = () => {

        if (createdCharacters?.characters.find(character => character.name.trim() == editedName.trim())) {
            alert(t("nameExists"))
            return
        }
        if (editedName !== '') {
            setIsEditing(false); // Exit edit mode after saving
            setName(editedName)
        }

        else {
            alert(t('nameRequired'))
        }
    }



    // Detect click outside and trigger save
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isClickableToSave && containerRef.current && !containerRef.current.contains(event.target)) {
                if (isEditing) {
                    handleSave(); // Auto-save when clicking outside
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside); // Attach the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside); // Clean up the event listener
        };
    }, [isClickableToSave, isEditing, editedName, handleSave]); // Only run when constants, isEditing, or editedName changes

    // Automatically set to edit mode if no name is present
    useEffect(() => {
        if (!name) {
            setIsEditing(true); // Auto-edit mode when name is empty
        }
    }, [name]);

    // Focus input field when entering edit mode
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus(); // Automatically focus the input when editing starts
        }
    }, [isEditing]);

    return (
        <div
            ref={containerRef}
            className="profile-section"
            onClick={() => {
                if (isClickableToEdit && !isEditing) {
                    setIsEditing(true); // Enter edit mode when clicking inside if allowed
                    setTimeout(() => {
                        if (inputRef.current) {
                            inputRef.current.focus(); // Focus the input after state update
                        }
                    }, 0);
                }
            }}
        >
            <label htmlFor={`image-upload-${id}`} className="profile-image-label">
                {imageSrc ? (
                    preview !== null ? (
                        <div className="profile-image-container">
                            <img src={preview} alt="Uploaded" className="profile-image-preview" />
                        </div>
                    ) : (
                        <div className="profile-image-container">
                            <img src={imageSrc} alt="Uploaded" className="profile-image-preview" />
                        </div>
                    )
                ) : (
                    <div className="profile-image-placeholder">{t('uploadimage')}</div>
                )}
            </label>
            <input
                id={`image-upload-${id}`}
                type="file"
                accept="image/*"
                className="image-upload-input"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
            />

            <div className="name-input-container">
                {isEditing ? (
                    <input
                        ref={inputRef} // Attach the ref to the input
                        type="text"
                        className="name-input"
                        placeholder={t('entername')}
                        value={editedName}             // Set the current edited name value
                        onChange={handleNameChange}     // Call handleNameChange on input change
                    />
                ) : (
                    <div className="name-display">{name || 'Enter Name'}</div>  // Show 'Enter Name' if name is blank
                )}

                <button
                    className="edit-save-button"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent the container click from triggering
                        isEditing ? handleSave() : setIsEditing(true);
                    }}
                >
                    {isEditing ? "💾" : "✎"} {/* Toggle between save and edit icon */}
                </button>
            </div>
        </div>
    );
};

export default ProfileSection;
