import React, { useEffect, useRef } from 'react';
const TextArea = (props) => {

    const { attribute, placeholder, onChange,styles} = props
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

export default TextArea


