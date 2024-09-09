import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

const BasePanel = (props) => {
    const { id, panels, setPanels, children, title, saveFunction, imageSrc, setImageSrc, name, setName } = props;
    const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({ id });

    const panelStyle = {
        transform: CSS.Transform.toString(transform),
        boxShadow: isDragging ? '0px 0px 20px rgba(0, 0, 0, 0.1)' : '-3px 10px 10px rgba(0, 0, 0, 0.05)',
        opacity: isDragging ? 0.8 : 1,
    };

    const onCloseButtonClick = () => {
        const newPanels = panels.filter(panel => panel.id !== id);
        setPanels(newPanels);
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);  // Use the setImageSrc passed as a prop
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle name change
    const handleNameChange = (e) => {
        setName(e.target.value);  // Update the name in the parent via setName
    };

    return (
        <div ref={setNodeRef} className="panel" style={panelStyle}>
            {/* Panel Header */}
            <div className="panel-header" {...listeners} {...attributes}>
                <h2 className="header-title">{title}</h2>
            </div>
            <div className="x-more-button-container">
                <button className="more-btn">...</button>
                <button className="close-btn" onClick={onCloseButtonClick}>✖</button>
            </div>

            {/* Profile Section */}
            <div className="profile-section">
                <label htmlFor={`image-upload-${id}`} className="profile-image-label">
                    {imageSrc ? (
                        <div className="profile-image-container">
                            <img src={imageSrc} alt="Uploaded" className="profile-image-preview" />
                        </div>
                    ) : (
                        <div className="profile-image-placeholder">Upload Image</div>
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
                <input
                    type="text"
                    className="name-input"
                    placeholder="Name"
                    value={name}             // Set the current name value
                    onChange={handleNameChange} // Call handleNameChange on input change
                />
            </div>

            {/* Panel Content */}
            <div className="panel-content">
                {children}
            </div>

            {/* Save Button outside of BasePanel */}
            <div className="save-btn-container">
                <button className="save-btn" onClick={saveFunction}>
                    Save
                </button>
            </div>
        </div>
    );
};

export default BasePanel;
