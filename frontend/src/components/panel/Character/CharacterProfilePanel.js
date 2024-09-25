import React, { useState, useEffect } from 'react';
import BasePanel from '../BasePanel';
import AboutTab from './AboutTab';
import ConnectionsTab from './ConnectionsTab';
import TabNavigation from './TabNavigation';
import ProfileSection from './ProfileSection';
import JournalsTab from './JournalsTab';
import CommentsTab from './CommentsTab';
import { apiRequest, apiRequestFormData } from '../../../utility/apiRequest';

const CharacterProfilePanel = (props) => {
    const { id, caller, panels, setPanels, createdCharacters, dispatchCreatedCharacters, createdJournalBooks, dispatchCreatedJournalBooks } = props;

    const [activeTab, setActiveTab] = useState('About');
    const [connectedCharacters, setConnectedCharacters] = useState(caller.connectedCharacters);
    const [personaAttributes, setPersonaAttributes] = useState(caller.personaAttributes);
    const [imageSrc, setImageSrc] = useState(caller.imageSrc);
    const [name, setName] = useState(caller.name);

    const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    console.log(createdCharacters)

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
            if (foundCharacter) {
                return {
                    ...connectedCharacter,
                    name: foundCharacter.name,
                };
            }
            return connectedCharacter;
        });
        setConnectedCharacters(updatedConnectedCharacters);
    }, [createdCharacters]);

    const saveFunction = async () => {
        if (!name.trim()) {
            alert("Name is required");
            return;
        }
        const newPanels = panels.filter(panel => panel.id !== id);
        setPanels(newPanels);

        const existingCharacter = createdCharacters.characters.find(character => character.uuid === caller.uuid);
        const characterUUID = caller.uuid;
        const updatedData = {};

        if (name !== existingCharacter.name) updatedData.name = name;
        if (JSON.stringify(personaAttributes) !== JSON.stringify(existingCharacter.personaAttributes)) updatedData.personaAttributes = personaAttributes;
        if (JSON.stringify(connectedCharacters) !== JSON.stringify(existingCharacter.connectedCharacters)) updatedData.connectedCharacters = connectedCharacters;

        const isImageUpdated = imageSrc !== existingCharacter.imageSrc;
        if (!Object.keys(updatedData).length && !isImageUpdated) {
            alert('No changes to save.');
            return;
        }
        try {
            if (isImageUpdated) {
                const formData = new FormData();
                formData.append('image', imageSrc);
                formData.append('characterUUID', characterUUID);

                const uploadResponse = await apiRequestFormData('/uploadImage', 'POST', formData);
                if (uploadResponse.imageUrl) {
                    updatedData.imageSrc = uploadResponse.imageUrl;
                }
            }
            dispatchCreatedCharacters({
                type: 'EDIT_CREATED_CHARACTER',
                payload: { ...updatedData, uuid: characterUUID }
            });
            const response = await apiRequest(`/updateCharacter/${characterUUID}`, 'PUT', updatedData);
            console.log('Character update response:', response);
        } catch (error) {
            console.log('Error updating character:', error);
        }
    };

    const deleteFunction = async () => {

        setPanels([]);

        dispatchCreatedJournalBooks({
            type: 'DELETE_JOURNAL_ENTRY_OWNER_UUID',
            payload: { ownerUUID: caller.uuid }

        })

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
            title="Profile"
            saveFunction={saveFunction}
            deleteFunction={deleteFunction}
        >
            <div style={styles.stickyHeader}>
                <ProfileSection
                    id={id}
                    imageSrc={imageSrc}
                    setImageSrc={setImageSrc}
                    name={name}
                    setName={setName}
                />
                <TabNavigation tabs={['About', 'Connections', 'Journal History', 'Comment History']} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            {/* Conditionally render the appropriate panel based on activeTab */}
            {activeTab === 'About' ? (
                <AboutTab
                    personaAttributes={personaAttributes}
                    setPersonaAttributes={setPersonaAttributes}
                />
            ) : activeTab === 'Connections' ? (
                <ConnectionsTab
                    panels={panels}
                    setPanels={setPanels}
                    connectedCharacters={connectedCharacters}
                    setConnectedCharacters={setConnectedCharacters}
                    createdCharacters={createdCharacters}
                    caller={caller}
                />
            ) : activeTab === 'Journal History' ? (
                <JournalsTab
                    caller={caller}
                    createdJournalBooks={createdJournalBooks}
                    dispatchCreatedJournalBooks={dispatchCreatedJournalBooks}
                    panels={panels}
                    setPanels={setPanels}
                />
            ) : activeTab === 'Comment History' ? (
                <CommentsTab
                    panels={panels}
                    setPanels={setPanels}
                    caller={caller}
                    createdJournalBooks={createdJournalBooks}
                    createdCharacters={createdCharacters}
                />
            ) : null}
            <div className="save-btn-container">
                <button
                    className="save-btn"
                    onClick={saveFunction}
                    disabled={!saveButtonEnabled}
                >
                    Save
                </button>
            </div>
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
};

export default CharacterProfilePanel;
