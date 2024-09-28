import React, { useEffect, useRef, forwardRef } from 'react';

const TextArea = forwardRef((props, forwardedRef) => {
    const { attribute, placeholder, onChange, styles } = props;
    const textareaRef = useRef(null); // Internal ref for the autoGrow functionality

    // Function to adjust the height of the text area
    const autoGrow = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset the height
            textarea.style.height = textarea.scrollHeight + 'px'; // Set the height based on scrollHeight
        }
    };

    // Adjust height on mount and when the value changes
    useEffect(() => {
        autoGrow();
    }, [attribute]);

    // Use both refs: the forwarded ref for focus, and the internal ref for height adjustment
    const combinedRef = (element) => {
        textareaRef.current = element; // Assign to internal ref
        if (forwardedRef) {
            if (typeof forwardedRef === 'function') {
                forwardedRef(element); // Support callback refs
            } else {
                forwardedRef.current = element; // Support object refs
            }
        }
    };

    return (
        <textarea
            ref={combinedRef} // Attach both refs
            style={styles.description}
            placeholder={placeholder || "Describe details"}
            onChange={(e) => {
                onChange(e); // Handle change event
                autoGrow();  // Adjust the height when text changes
            }}
            value={attribute ? attribute.description : ""}
        />
    );
});

export default TextArea;
