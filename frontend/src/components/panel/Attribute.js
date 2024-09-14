import React, { useEffect, useRef } from 'react';
import TextArea from '../TextArea'
const Attribute = (props) => {
    const { title, placeholder, deleteFunction, list, setter, onChange } = props;
    const attribute = list.find(attr => attr.name === title);
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
        <div style={styles.attributeContainer}>
            <div style={styles.sectionHeader}>
                <label style={styles.sectionHeaderLabel}>{title}</label>
                <button style={styles.closeSectionBtn}
                    onClick={() => { deleteFunction(title, list, setter) }}>✖</button>
            </div>

        </div>
    );
};


const styles = {
    attributeContainer: {
        backgroundColor: '#f0f0ff',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px',
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    sectionHeaderLabel: {
        color: '#6d6dff',
        fontSize: '16px',
        fontWeight: 'bold'
    },
    closeSectionBtn: {
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '12px',
        cursor: 'pointer',
        color: 'gray',
    },

};

export default Attribute;