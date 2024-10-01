import React, { useEffect, useRef, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

const TextArea = forwardRef((props, forwardedRef) => {
    const { t } = useTranslation();
    const {
        attribute,
        placeholder,
        onChange,
        styles,
        label,
        readOnly, // Accept the readOnly prop
    } = props;
    const textareaRef = useRef(null);

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
        textareaRef.current = element;
        if (forwardedRef) {
            if (typeof forwardedRef === 'function') {
                forwardedRef(element);
            } else {
                forwardedRef.current = element;
            }
        }
    };

    return (
        <div style={styles.textAreaContainer}>
            {label && <label style={styles.textAreaLabel}>{label}</label>}
            <textarea
                ref={combinedRef}
                style={styles.description}
                placeholder={placeholder || t('describeDetails')}
                onChange={(e) => {
                    if (onChange) {
                        onChange(e);
                    }
                    autoGrow();
                }}
                value={attribute ? attribute.description : ''}
                readOnly={readOnly} // Pass the readOnly prop to the textarea
            />
        </div>
    );
});

export default TextArea;
