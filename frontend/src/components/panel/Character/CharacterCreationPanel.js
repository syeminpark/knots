import React, { useState, useEffect } from 'react';
import BasePanel from '../BasePanel';
import AboutTab from './AboutTab';
import ConnectionsTab from './ConnectionsTab';
import TabNavigation from './TabNavigation';
import { v4 as uuidv4 } from 'uuid';
import ProfileSection from './ProfileSection';
import { apiRequest, apiRequestFormData } from '../../../utility/apiRequest';
import { useTranslation } from 'react-i18next';

const CharacterCreationPanel = (props) => {
    const { id, type, panels, setPanels, createdCharacters, dispatchCreatedCharacters } = props;
    const [activeTab, setActiveTab] = useState('About');
    const [connectedCharacters, setConnectedCharacters] = useState([]);
    const [personaAttributes, setPersonaAttributes] = useState([{ name: 'Backstory', description: '' }]);
    const [imageSrc, setImageSrc] = useState(null);
    const [name, setName] = useState('');
    const { t } = useTranslation();
    const [currentCharacter, setCurrentCharacter] = useState(null);

    const saveFunction = async () => {
        if (!name.trim()) {
            alert("Name is required");
            return;
        }
        const newPanels = panels.filter(panel => panel.id !== id);
        setPanels(newPanels);

        const uuid = uuidv4()
        try {
            let imageUrl = null;
            if (imageSrc) {
                const formData = new FormData();
                formData.append('image', imageSrc);
                formData.append('characterUUID', uuid);

                const uploadResponse = await apiRequestFormData('/uploadImage', 'POST', formData);
                if (uploadResponse.imageUrl) {
                    imageUrl = uploadResponse.imageUrl;
                }
            }
            const characterData = {
                name: name,
                personaAttributes: personaAttributes,
                connectedCharacters: connectedCharacters,
                imageSrc: imageUrl,
                uuid: uuid,
            };
            dispatchCreatedCharacters({
                type: 'CREATE_CHARACTER',
                payload: characterData,
            });
            const createCharacterResponse = await apiRequest('/createCharacter', 'POST', characterData);
            console.log('Character creation response:', createCharacterResponse);

        } catch (error) {
            console.log('Error:', error);
        }
    }

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
    }, [createdCharacters]);  // Dependency array

    useEffect(() => {

        const updatedObject = {
            name: name,
            imageSrc: imageSrc,
            personaAttributes: personaAttributes,
            connectedCharacters: connectedCharacters
        }
        setCurrentCharacter(updatedObject)
        console.log('hey', currentCharacter)
    }, [name, imageSrc, personaAttributes, connectedCharacters])

    return (
        <BasePanel
            id={id}
            panels={panels}
            setPanels={setPanels}
            title={t('createcharacter')}
            saveFunction={saveFunction}
        >
            <div className="panel-header-sticky">
                {/* Profile Section */}
                <ProfileSection
                    id={id}
                    imageSrc={imageSrc}
                    setImageSrc={setImageSrc}
                    name={name}
                    setName={setName}
                />
                {/* Tabs */}
                <TabNavigation tabs={['About', 'Connections']} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* Conditionally render the appropriate panel based on activeTab */}
            <div className="panel-content">
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
                        currentCharacter={currentCharacter}
                    />
                ) : null}
            </div>

            <div className="save-btn-container">
                <button className="save-btn" onClick={saveFunction}>
                    Create
                </button>
            </div>
        </BasePanel>
    );
};

export default CharacterCreationPanel;
