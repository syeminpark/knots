import React, { useState } from 'react';
import Attribute from '../Attribute';
import AddAttributeModal from '../AddAttributeModal';
import { useTranslation } from 'react-i18next';
import DeleteConfirmationModal from '../../DeleteConfirmationModal';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

const AboutTab = (props) => {
    const { t } = useTranslation();
    const { personaAttributes, setPersonaAttributes } = props;
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [selectedAttributeToDelete, setSelectedAttributeToDelete] = useState(null);

    const deleteAttribute = (uuid) => {
        setSelectedAttributeToDelete(uuid);
        setShowDeleteConfirmation(true);
    };

    const confirmDeleteAttribute = () => {
        const newAttributes = personaAttributes.filter((attr) => attr.uuid !== selectedAttributeToDelete);
        setPersonaAttributes(newAttributes);
        setShowDeleteConfirmation(false);
        setSelectedAttributeToDelete(null);
    };

    const onChange = (uuid, value) => {
        setPersonaAttributes(
            personaAttributes.map((attribute) =>
                attribute.uuid === uuid ? { ...attribute, description: value } : attribute
            )
        );
        console.log('personaChanged');
    };

    const onTitleChange = (uuid, newTitle) => {

        setPersonaAttributes(
            personaAttributes.map((attribute) =>
                attribute.uuid === uuid ? { ...attribute, name: newTitle } : attribute
            )
        );
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id && over && active.id !== over.id) { // Correct
            const oldIndex = personaAttributes.findIndex((attr) => attr.uuid === active.id);
            const newIndex = personaAttributes.findIndex((attr) => attr.uuid === over.id);


            if (oldIndex !== -1 && newIndex !== -1) {
                const newAttributes = arrayMove(personaAttributes, oldIndex, newIndex);
                setPersonaAttributes(newAttributes);

            }
        }
    };

    return (
        <div style={styles.abouttabWrapper}>
            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
            >
                <SortableContext
                    items={personaAttributes.map((attr) => attr.uuid)}
                    strategy={verticalListSortingStrategy}
                >
                    {personaAttributes.map((attribute) => (
                        <Attribute
                            key={attribute.uuid}
                            uuid={attribute.uuid}
                            title={attribute.name}
                            placeholder=""
                            deleteFunction={deleteAttribute}
                            list={personaAttributes}
                            setter={setPersonaAttributes}
                            onChange={(value) => {
                                onChange(attribute.uuid, value);
                            }}
                            onTitleChange={(newTitle) => {
                                onTitleChange(attribute.uuid, newTitle);
                            }}
                        />
                    ))}
                </SortableContext>
            </DndContext>

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
                        <button
                            onClick={() => setShowDeleteConfirmation(false)}
                            style={styles.cancelButton}
                        >
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
        overflowX: 'hidden',
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
    },
};

export default AboutTab;
