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
                <input
                    type="text"
                    value={attribute}
                    onChange={(e) => setAttribute(`${e.target.value}`)}
                    placeholder="Add Attribute Name (e.g., age, gender, nationality, hobby, personality, occupation, etc.)"
                    style={styles.input}
                />
            </ModalOverlay>
        </div>
    );
};

const styles = {
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
};

export default AddAttributeModal;
