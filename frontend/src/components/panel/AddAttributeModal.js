import React, { useState } from 'react';
import ModalOverlay from '../ModalOverlay';

const AddAttributeModal = (props) => {
    const { setShowModal, personaAttributes, setPersonaAttributes } = props
    const [attribute, setAttribute] = useState('');

    const handleAddAttribute = () => {
        if (attribute) {
            console.log(`Adding attribute: ${attribute}`);

            setPersonaAttributes([...personaAttributes, { name: attribute, description: '' }])
            setShowModal(false);
        }
    };
    return (
        <div>
            <ModalOverlay
                title="Add New Attribute"
                setShowModal={setShowModal}
                footerButtonLabel="Done"
                onFooterButtonClick={handleAddAttribute}
            >

                <textarea
                    value={attribute}
                    onChange={(e) => setAttribute(e.target.value)}
                    placeholder="Attribute Name (e.g., age, gender, nationality, hobby, personality, occupation, etc.)"
                    style={styles.textarea}
                />
            </ModalOverlay>
        </div>
    );
};

const styles = {
    textarea: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        marginBottom: '10px',
        resize: 'vertical',  // Allow resizing vertically
        whiteSpace: 'pre-wrap', // Make sure line breaks are supported in the text
        overflowWrap: 'break-word', // Break long words if necessary
    },
};

export default AddAttributeModal;
