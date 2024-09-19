import React, { useState } from 'react';
import Attribute from '../Attribute';
import AddAttributeModal from '../AddAttributeModal';

const AboutTab = (props) => {
    const { personaAttributes, setPersonaAttributes } = props
    const [showModal, setShowModal] = useState(false);

    const deleteAttribute = (title) => {
        const newAttributes = personaAttributes.filter(attr => attr.name !== title);
        setPersonaAttributes(newAttributes);
    };

    const onChange = (title, value) => {
        setPersonaAttributes(personaAttributes.map(attribute =>
            attribute.name === title ? { ...attribute, description: value } : attribute
        ));
    };

    return (
        <div style={styles.attributeWrapper}>
            {personaAttributes.map(attribute => (
                <Attribute
                    key={attribute.name}
                    title={attribute.name}
                    deleteFunction={deleteAttribute}
                    list={personaAttributes}
                    setter={setPersonaAttributes}
                    onChange={(event) => { onChange(attribute.name, event.target.value) }}
                />
            ))}
            <button className="create-new-btn" onClick={() => setShowModal(true)}>
                + Add Attributes
            </button>
            {showModal && (
                <AddAttributeModal
                    setShowModal={setShowModal}
                    personaAttributes={personaAttributes}
                    setPersonaAttributes={setPersonaAttributes}
                />
            )}
        </div>
    );
};

const styles = {
    attributeWrapper: {
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 400px)',
    },
}

export default AboutTab