import React, { useState, useEffect } from 'react';
const ProfileSection = (props) => {
    const { id, imageSrc, setImageSrc, name, setName } = props
    const [preview, setPreview] = useState(null)

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(file)
                setPreview(reader.result)
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle name change
    const handleNameChange = (e) => {
        setName(e.target.value);  // Update the name in the parent via setName
    };

    return (
        < div className="profile-section" >
            <label htmlFor={`image-upload-${id}`} className="profile-image-label">
                {imageSrc ? (
                    preview !== null ? (
                        <div className="profile-image-container">
                            <img src={preview
                            } alt="Uploaded" className="profile-image-preview" />
                        </div>) : (
                        <div className="profile-image-container">
                            <img src={imageSrc
                            } alt="Uploaded" className="profile-image-preview" />
                        </div>)
                )
                    : (
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
        </div >
    )
}

export default ProfileSection