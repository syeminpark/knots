import React, { useState, useEffect } from 'react';
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

const CharacterProfilePanel = (props) => {
    const { id, caller, panels, setPanels, createdCharacters, dispatchCreatedCharacters, createdJournalBooks, dispatchCreatedJournalBooks } = props;
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('');
    const [connectedCharacters, setConnectedCharacters] = useState(caller.connectedCharacters);
    const [personaAttributes, setPersonaAttributes] = useState(caller.personaAttributes);
    const [imageSrc, setImageSrc] = useState(caller.imageSrc);
    const [name, setName] = useState(caller.name);
    const [preview, setPreview] = useState(null);

    const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);



    useEffect(() => {
        setActiveTab(t('about'));
    }, [t]);

    useEffect(() => {
        if (!createdCharacters.characters.find(character => character.uuid === caller.uuid)) {
            setPanels(prevPanels => prevPanels.filter(panel => panel.id !== id));
        }
    }, [createdCharacters]);


    // enabling save button 
    useEffect(() => {
        const hasChanges =
            name !== caller.name ||
            JSON.stringify(personaAttributes) !== JSON.stringify(caller.personaAttributes) ||
            JSON.stringify(connectedCharacters) !== JSON.stringify(caller.connectedCharacters) ||
            imageSrc !== caller.imageSrc;

        setSaveButtonEnabled(hasChanges);
    }, [name, personaAttributes, connectedCharacters, imageSrc, caller]);

    // Effect to update local state when `createdCharacters` is updated
    useEffect(() => {
        const updatedCharacter = createdCharacters.characters.find(character => character.uuid === caller.uuid);
        if (updatedCharacter) {
            setName(updatedCharacter.name);
            setPersonaAttributes(updatedCharacter.personaAttributes);
            setConnectedCharacters(updatedCharacter.connectedCharacters);
            setImageSrc(updatedCharacter.imageSrc);
        }
    }, [createdCharacters, caller.uuid]);

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


    useEffect(() => {
        const saveFunction = async () => {
            console.log('saveFunctionTriggered')
            if (!name.trim()) {
                alert(t("nameRequired"));
                return;
            }
            // const newPanels = panels.filter(panel => panel.id !== id);
            // setPanels(newPanels);

            const existingCharacter = createdCharacters.characters.find(character => character.uuid === caller.uuid);
            const updatedData = {};
            // const connectionUpdates = [];

            if (name !== existingCharacter.name) updatedData.name = name;
            if (JSON.stringify(personaAttributes) !== JSON.stringify(existingCharacter.personaAttributes)) updatedData.personaAttributes = personaAttributes;
            if (JSON.stringify(connectedCharacters) !== JSON.stringify(existingCharacter.connectedCharacters)) {
                updatedData.connectedCharacters = connectedCharacters;
                //     connectedCharacters.forEach(connectedCharacter => {
                //         const foundConnectedCharacter = createdCharacters.characters.find(
                //             (createdCharacter) => createdCharacter.uuid === connectedCharacter.uuid
                //         );

                //         if (foundConnectedCharacter) {
                //             const reverseConnectionIndex = foundConnectedCharacter.connectedCharacters.findIndex(c => c.uuid === caller.uuid);
                //             const reverseConnection = {
                //                 uuid: caller.uuid,
                //                 name,  
                //                 sharedHistory: connectedCharacter.sharedHistory,  
                //                 myPOV: connectedCharacter.theirPOV,  
                //                 theirPOV: connectedCharacter.myPOV,
                //             };
                //             if (reverseConnectionIndex >= 0) {
                //                 foundConnectedCharacter.connectedCharacters[reverseConnectionIndex] = reverseConnection;
                //             } else {
                //                 foundConnectedCharacter.connectedCharacters.push(reverseConnection);
                //             }
                //             connectionUpdates.push(apiRequest(`/updateCharacter/${foundConnectedCharacter.uuid}`, 'PUT', { connectedCharacters: foundConnectedCharacter.connectedCharacters }));
                //         }
                //     });
            }
            const isImageUpdated = imageSrc !== existingCharacter.imageSrc;
            if (!Object.keys(updatedData).length && !isImageUpdated) {
                return;
            }
            try {
                if (isImageUpdated) {
                    const formData = new FormData();
                    formData.append('image', imageSrc);
                    formData.append('characterUUID', caller.uuid);

                    const uploadResponse = await apiRequestFormData('/uploadImage', 'POST', formData);
                    if (uploadResponse.imageUrl) {
                        updatedData.imageSrc = uploadResponse.imageUrl;
                    }
                }
                // dispatchCreatedCharacters({
                //     type: 'EDIT_CREATED_CHARACTER',
                //     payload: { ...updatedData, uuid: characterUUID }
                // });
                const response = await apiRequest(`/updateCharacter/${caller.uuid}`, 'PUT', updatedData);
                console.log('Character update response:', response);

                // await Promise.all(connectionUpdates);
                // console.log('Character and connections updated successfully');

            } catch (error) {
                console.log('Error updating character:', error);
            }
        };
        saveFunction()
    }, [connectedCharacters, personaAttributes, imageSrc, name])



    const deleteFunction = async () => {
        setShowDeleteConfirmation(true);
    };

    const confirmDelete = async () => {

        // setPanels([]);
        // dispatchCreatedJournalBooks({
        //     type: 'DELETE_JOURNAL_ENTRY_OWNER_UUID',
        //     payload: { ownerUUID: caller.uuid }

        // })
        dispatchCreatedCharacters({
            type: 'DELETE_CHARACTER',
            payload: { uuid: caller.uuid }
        })

        try {
            const response = await apiRequest(`/deleteJournalEntryByOwnerUUID/${caller.uuid}`, 'DELETE')
            console.log('Entry delete response', response)
        }
        catch (error) {
            console.log('Error deleting entries:', error);
        }

        try {
            const response = await apiRequest(`/deleteCharacter/${caller.uuid}`, 'DELETE')
            console.log('Character Delete response: ', response)
        }
        catch (error) {
            console.log('Error deleting character:', error);
        }
    };


    const toggleDeleteButton = () => {
        setShowDelete(prev => !prev);
    };

    return (
        <BasePanel
            id={id}
            panels={panels}
            setPanels={setPanels}
            title={t('profile')}
            deleteFunction={deleteFunction}
        >
            <div style={styles.stickyHeader}>
                <ProfileSection
                    id={id}
                    imageSrc={imageSrc}
                    setImageSrc={setImageSrc}
                    name={name}
                    setName={setName}
                    preview={preview}
                    setPreview={setPreview}
                />
                <TabNavigation tabs={[t('about'), t('connections'), t('journalhistory'), t('commenthistory')]} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            {/* Conditionally render the appropriate panel based on activeTab */}
            {activeTab === t('about') ? (
                <AboutTab
                    personaAttributes={personaAttributes}
                    setPersonaAttributes={setPersonaAttributes}

                />
            ) : activeTab === t('connections') ? (
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

                />
            ) : activeTab === t('journalhistory') ? (
                <JournalsTab
                    caller={caller}
                    createdJournalBooks={createdJournalBooks}
                    dispatchCreatedJournalBooks={dispatchCreatedJournalBooks}
                    panels={panels}
                    setPanels={setPanels}
                />
            ) : activeTab === t('commenthistory') ? (
                <CommentsTab
                    panels={panels}
                    setPanels={setPanels}
                    caller={caller}
                    createdJournalBooks={createdJournalBooks}
                    createdCharacters={createdCharacters}
                />
            ) : null}
            {/* <div className="save-btn-container">
                <button
                    className="save-btn"
                    onClick={saveFunction}
                    disabled={!saveButtonEnabled}
                >
                    Save
                </button>
            </div> */}
            {showDeleteConfirmation && (
                <DeleteConfirmationModal
                    title={t('confirmDeletion')}
                    setShowModal={setShowDeleteConfirmation}
                >
                    <p style={{ marginBottom: '20px' }}>
                        {t('areYouSureDelete')}
                        <br></br>

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
};

export default CharacterProfilePanel;