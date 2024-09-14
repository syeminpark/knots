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
        <>
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
            <button className="add-attributes-btn" onClick={() => setShowModal(true)}>
                + Add Attributes
            </button>
            {showModal && (
                <AddAttributeModal
                    setShowModal={setShowModal}
                    personaAttributes={personaAttributes}
                    setPersonaAttributes={setPersonaAttributes}
                />
            )}
        </>
    );
};

export default AboutTab