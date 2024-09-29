import React, { useState } from 'react';
import Attribute from '../Attribute';
import AddAttributeModal from '../AddAttributeModal';
import { useTranslation } from 'react-i18next';

const AboutTab = (props) => {
    const { t } = useTranslation();
    const { personaAttributes, setPersonaAttributes, saveFunction } = props
    const [showModal, setShowModal] = useState(false);

    const deleteAttribute = (title) => {
        const newAttributes = personaAttributes.filter(attr => attr.name !== title);
        setPersonaAttributes(newAttributes);
    };

    const onChange = (title, value) => {
        setPersonaAttributes(personaAttributes.map(attribute =>
            attribute.name === title ? { ...attribute, description: value } : attribute
        ));
        console.log('personaChanged')

    };

    return (
        <div style={styles.abouttabWrapper}>
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
                {t('addattributes')}
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
    abouttabWrapper: {
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 400px)',
    },
}

export default AboutTab