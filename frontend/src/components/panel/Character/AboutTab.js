import React, { useState } from 'react';
import Attribute from '../Attribute';
import AddAttributeModal from '../AddAttributeModal';
import { useTranslation } from 'react-i18next';
import DeleteConfirmationModal from '../../DeleteConfirmationModal';

const AboutTab = (props) => {
    const { t } = useTranslation();
    const { personaAttributes, setPersonaAttributes } = props
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [selectedAttributeToDelete, setSelectedAttributeToDelete] = useState(null);


    const deleteAttribute = (title) => {
        setSelectedAttributeToDelete(title);
        setShowDeleteConfirmation(true);
    };

    const confirmDeleteAttribute = () => {
        const newAttributes = personaAttributes.filter(attr => attr.name !== selectedAttributeToDelete);
        setPersonaAttributes(newAttributes);
        setShowDeleteConfirmation(false);
        setSelectedAttributeToDelete(null);
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
                    key={attribute?.name}
                    title={attribute?.name}
                    deleteFunction={deleteAttribute}
                    list={personaAttributes}
                    setter={setPersonaAttributes}
                    onChange={(event) => { onChange(attribute?.name, event?.target?.value) }}
                />
            ))}
            {showModal && (
                <AddAttributeModal
                    setShowModal={setShowModal}
                    personaAttributes={personaAttributes}
                    setPersonaAttributes={setPersonaAttributes}
                />
            )}
            {showDeleteConfirmation && (
                <DeleteConfirmationModal
                    title={t('confirmDeletion')}
                    setShowModal={setShowDeleteConfirmation}
                >
                    <p style={{ marginBottom: '20px' }}>{t('areYouSureDelete')}</p>
                    <div style={styles.modalButtonContainer}>
                        <button onClick={() => setShowDeleteConfirmation(false)} style={styles.cancelButton}>
                            {t('cancel')}
                        </button>
                        <button onClick={confirmDeleteAttribute} style={styles.deleteButton}>
                            {t('delete')}
                        </button>
                    </div>
                </DeleteConfirmationModal>
            )}

            <div style={styles.buttonContainer}>
                <button style={styles.createButton} onClick={() => setShowModal(true)}>
                    {t('addattributes')}
                </button>
            </div>
        </div>
    );
};

const styles = {
    abouttabWrapper: {
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 350px)',
    },
    buttonContainer: {
        position: 'sticky',
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        padding: '10px 0px',
        backgroundColor: '#fff',
        zIndex: 100,
        gap: '10px',
    },
    modalButtonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginTop: '20px',
    },
    cancelButton: {
        padding: '8px 16px',
        backgroundColor: '#ccc',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    deleteButton: {
        padding: '8px 16px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    createButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: 'var(--color-secondary)',
        border: 'none',
        borderRadius: '6px',
        color: 'white',
        fontSize: 'var(--font-medium)',
        marginTop: '6px',
        cursor: 'pointer',
    }
}

export default AboutTab