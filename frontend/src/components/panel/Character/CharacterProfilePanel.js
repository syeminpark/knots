// CharacterProfilePanel.js
import React, { useState, useEffect, useRef } from 'react';
import BasePanel from '../BasePanel';
import AboutTab from './AboutTab';
import ConnectionsTab from './ConnectionsTab';
import TabNavigation from './TabNavigation';
import ProfileSection from './ProfileSection';
import JournalsTab from './JournalsTab';
import CommentsTab from './CommentsTab';
import { apiRequest, apiRequestFormData } from '../../../utility/apiRequest';
import { useTranslation } from 'react-i18next';
import DeleteConfirmationModal from '../../DeleteConfirmationModal';
import { debounce } from 'lodash';
import isEqual from 'lodash/isEqual';
import Loading from '../../Loading';

const CharacterProfilePanel = (props) => {
    const { id, caller, panels, setPanels, createdCharacters, dispatchCreatedCharacters, createdJournalBooks, dispatchCreatedJournalBooks } = props;
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('');
    const [connectedCharacters, setConnectedCharacters] = useState(caller.connectedCharacters);
    const [personaAttributes, setPersonaAttributes] = useState(caller.personaAttributes);
    const [imageSrc, setImageSrc] = useState(caller.imageSrc);
    const [name, setName] = useState(caller.name);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(null);

    const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [selectedConnectionToDelete, setSelectedConnectionToDelete] = useState(null);

    const tabs = [
        { key: 'ABOUT', label: t('about') },
        { key: 'CONNECTIONS', label: t('connections') },
        { key: 'JOURNALHISTORY', label: t('journalhistory') },
        { key: 'COMMENTHISTORY', label: t('commenthistory') },
    ];


    // Initialize active tab
    useEffect(() => {
        setActiveTab('ABOUT');
    }, [t]);

    // Remove panel if character is deleted
    useEffect(() => {
        if (!createdCharacters.characters.find(character => character.uuid === caller.uuid)) {
            setPanels(prevPanels => prevPanels.filter(panel => panel.id !== id));
        }
    }, [createdCharacters, caller.uuid, id, setPanels]);

    // Enable save button if there are changes
    useEffect(() => {
        const hasChanges =
            name !== caller.name ||
            JSON.stringify(personaAttributes) !== JSON.stringify(caller.personaAttributes) ||
            JSON.stringify(connectedCharacters) !== JSON.stringify(caller.connectedCharacters) ||
            imageSrc !== caller.imageSrc;

        setSaveButtonEnabled(hasChanges);
    }, [name, personaAttributes, connectedCharacters, imageSrc, caller.name, caller.personaAttributes, caller.connectedCharacters, caller.imageSrc]);

    // Update local state when `createdCharacters` changes
    useEffect(() => {
        const updatedCharacter = createdCharacters.characters.find(character => character.uuid === caller.uuid);
        console.log(updatedCharacter)
        if (updatedCharacter) {
            setName(updatedCharacter.name);
            setPersonaAttributes(updatedCharacter.personaAttributes);
            setConnectedCharacters(updatedCharacter.connectedCharacters);
            setImageSrc(updatedCharacter.imageSrc);
        }
    }, [createdCharacters, caller.uuid]);

    // Synchronize connected characters names
    useEffect(() => {
        const updatedConnectedCharacters = connectedCharacters.map((connectedCharacter) => {
            const foundCharacter = createdCharacters.characters.find(
                (createdCharacter) => createdCharacter.uuid === connectedCharacter.uuid
            );
            if (foundCharacter && foundCharacter.name !== connectedCharacter.name) {
                return {
                    ...connectedCharacter,
                    name: foundCharacter.name,
                };
            }
            return connectedCharacter;
        });

        // Only update state if there's a change
        const isDifferent = updatedConnectedCharacters.some((char, index) => char.name !== connectedCharacters[index].name);
        if (isDifferent) {
            setConnectedCharacters(updatedConnectedCharacters);
        }
    }, [createdCharacters, connectedCharacters]);

    // Debounced save function inside useEffect
    useEffect(() => {
        const debouncedSave = debounce(async () => {
            console.log('saveFunctionTriggered');

            if (!name.trim()) {
                alert(t("nameRequired"));
                return;
            }


            const existingCharacter = createdCharacters.characters.find(character => character.uuid === caller.uuid);
            if (!existingCharacter) {
                console.error('Existing character not found.');
                return;
            }

            const updatedData = {};

            if (name !== existingCharacter.name) {
                updatedData.name = name;
            }

            if (!isEqual(personaAttributes, existingCharacter.personaAttributes)) {
                updatedData.personaAttributes = personaAttributes;
            }

            if (!isEqual(connectedCharacters, existingCharacter.connectedCharacters)) {
                updatedData.connectedCharacters = connectedCharacters;
            }

            const isImageUpdated = imageSrc !== existingCharacter.imageSrc;
            if (!Object.keys(updatedData).length && !isImageUpdated) {
                console.log('No changes detected. Skipping save.');
                return;
            }

            try {
                setLoading(true)
                if (isImageUpdated) {
                    const formData = new FormData();
                    formData.append('image', imageSrc);
                    formData.append('characterUUID', caller.uuid);

                    const uploadResponse = await apiRequestFormData('/uploadImage', 'POST', formData);
                    if (uploadResponse.imageUrl) {
                        updatedData.imageSrc = uploadResponse.imageUrl;
                    } else {
                        console.error('Image upload failed. Response:', uploadResponse);
                        alert(t('imageUploadFailed')); // Ensure you have this translation key
                        return;
                    }
                }

                // Dispatch the update to the global state
                dispatchCreatedCharacters({
                    type: 'EDIT_CREATED_CHARACTER',
                    payload: { ...updatedData, uuid: caller.uuid }
                });

                // Make the API call to update the character
                const response = await apiRequest(`/updateCharacter/${caller.uuid}`, 'PUT', updatedData);
                console.log('Character update response:', response);

                // Optionally, provide user feedback
                // alert(t('profileSavedSuccessfully')); // Ensure you have this translation key

            } catch (error) {
                console.error('Error updating character:', error);
                // alert(t('updateFailed')); // Ensure you have this translation key
            }
            finally {
                setLoading(false)
            }
        }, 1000); // 500ms debounce delay

        debouncedSave();

        // Cleanup function to cancel the debounced call if dependencies change before the debounce delay
        return () => {
            debouncedSave.cancel();
        };
    }, [connectedCharacters, personaAttributes, imageSrc, name, t, caller.uuid, createdCharacters.characters, dispatchCreatedCharacters]);

    // Delete function
    const deleteFunction = async () => {
        setShowDeleteConfirmation(true);
    };

    const confirmDelete = async () => {
        dispatchCreatedJournalBooks({
            type: 'DELETE_JOURNAL_ENTRY_OWNER_UUID',
            payload: { ownerUUID: caller.uuid }
        });

        dispatchCreatedCharacters({
            type: 'DELETE_CHARACTER',
            payload: { uuid: caller.uuid }
        });

        try {
            const response = await apiRequest(`/deleteJournalEntryByOwnerUUID/${caller.uuid}`, 'DELETE');
            console.log('Entry delete response', response);
        } catch (error) {
            console.log('Error deleting entries:', error);
        }

        try {
            const response = await apiRequest(`/deleteCharacter/${caller.uuid}`, 'DELETE');
            console.log('Character Delete response: ', response);
        } catch (error) {
            console.log('Error deleting character:', error);
        }
    };
    const renderPromptStatus = () => (
        <div style={styles.promptStatus}>
            {caller?.type?.prompt !== 'null'
                ? t('promptAvailable')  // Add translation key in your translation files
                : t('noPromptAvailable')}
        </div>
    );


    return (
        <BasePanel
            id={id}
            panels={panels}
            setPanels={setPanels}
            title={t('profile')}
            deleteFunction={deleteFunction}
        >
            <div style={styles.stickyHeader}>
                {/* {renderPromptStatus()} Display the prompt status */}
                <ProfileSection
                    id={id}
                    imageSrc={imageSrc}
                    setImageSrc={setImageSrc}
                    name={name}
                    setName={setName}
                    preview={preview}
                    setPreview={setPreview}
                    createdCharacters={createdCharacters}
                    currentCharacterUUID={caller.uuid}
                />
                <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            {/* Conditionally render the appropriate panel based on activeTab */}
            {activeTab === 'ABOUT' ? (
                <AboutTab
                    personaAttributes={personaAttributes}
                    setPersonaAttributes={setPersonaAttributes}
                    isCreationPanel={false}
                />
            ) : activeTab === 'CONNECTIONS' ? (
                <ConnectionsTab
                    panels={panels}
                    setPanels={setPanels}
                    connectedCharacters={connectedCharacters}
                    setConnectedCharacters={setConnectedCharacters}
                    createdCharacters={createdCharacters}
                    caller={caller}
                    currentCharacter={createdCharacters.characters.find(character => character.uuid === caller.uuid)}
                    personaAttributes={personaAttributes}
                    setPersonaAttributes={setPersonaAttributes}
                    dispatchCreatedCharacters={dispatchCreatedCharacters}
                />
            ) : activeTab === 'JOURNALHISTORY' ? (
                <JournalsTab
                    caller={caller}
                    createdJournalBooks={createdJournalBooks}
                    dispatchCreatedJournalBooks={dispatchCreatedJournalBooks}
                    panels={panels}
                    setPanels={setPanels}
                />
            ) : activeTab === 'COMMENTHISTORY' ? (
                <CommentsTab
                    panels={panels}
                    setPanels={setPanels}
                    caller={caller}
                    createdJournalBooks={createdJournalBooks}
                    createdCharacters={createdCharacters}
                />
            ) : null}
            {/* Delete Confirmation Modal */}
            {showDeleteConfirmation && (
                <DeleteConfirmationModal
                    title={t('confirmDeletion')}
                    setShowModal={setShowDeleteConfirmation}
                >
                    <p style={{ marginBottom: '20px' }}>
                        {t('areYouSureDelete')}
                        <br />
                    </p>
                    <div style={styles.modalButtonContainer}>
                        <button onClick={() => setShowDeleteConfirmation(false)} style={styles.cancelButton}>
                            {t('cancel')}
                        </button>
                        <button onClick={confirmDelete} style={styles.deleteButton}>
                            {t('delete')}
                        </button>
                    </div>
                </DeleteConfirmationModal>
            )}
        </BasePanel>
    );
};

const styles = {
    stickyHeader: {
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: 'white',
        paddingBottom: '10px',
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
    promptStatus: {
        marginTop: '10px',
        fontStyle: 'italic',

    },
};

export default CharacterProfilePanel;
