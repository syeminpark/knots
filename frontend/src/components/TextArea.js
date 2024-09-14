import React, { useEffect, useRef } from 'react';
const TextArea = (props) => {

    const { attribute, placeholder, onChange } = props
    const textareaRef = useRef(null); // Create a ref for the text area
    // Function to adjust the height of the text area
    const autoGrow = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset the height
            textarea.style.height = textarea.scrollHeight + 'px'; // Set the height based on scrollHeight
        }
    };

    useEffect(() => {
        autoGrow(); // Adjust height on component mount
    }, [attribute]);

    return (
        <textarea
            ref={textareaRef} // Attach the ref to the text area
            style={styles.description}
            placeholder={placeholder || "Add description"}
            onChange={(e) => {
                onChange(e); // Handle change event
                autoGrow();  // Adjust the height when text changes
            }}
            value={attribute ? attribute.description : ""}
        />
    )
}
const styles = {
    description: {
        width: '100%',
        minHeight: '10px', // Start with a base height
        padding: '10px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: 'white',
        fontSize: '14px',
        resize: 'vertical', // Allows the user to manually resize vertically
        overflow: 'hidden', // Hides overflow to prevent the scroll bar
    },
}
export default TextArea


