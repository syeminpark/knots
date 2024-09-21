import React, { useState, useEffect } from 'react';
import BasePanel from '../BasePanel';
import AboutTab from './AboutTab';
import ConnectionsTab from './ConnectionsTab';
import TabNavigation from './TabNavigation';
import { v4 as uuidv4 } from 'uuid';
import ProfileSection from './ProfileSection';
import apiRequest from '../../../utility/apiRequest';

const CharacterCreationPanel = (props) => {
    const { id, type, panels, setPanels, createdCharacters, dispatchCreatedCharacters } = props;
    const [activeTab, setActiveTab] = useState('About');
    const [connectedCharacters, setConnectedCharacters] = useState([]);
    const [personaAttributes, setPersonaAttributes] = useState([{ name: 'Backstory', description: '' }]);
    const [imageSrc, setImageSrc] = useState(null);
    const [name, setName] = useState('');

    const saveFunction = async () => {
        if (!name.trim()) {
            alert("Name is required");
            return;
        }
        const newPanels = panels.filter(panel => panel.id !== id);
        setPanels(newPanels);

        const CharcterData = {
            name: name,
            personaAttributes: personaAttributes,
            connectedCharacters: connectedCharacters,
            imageSrc: imageSrc,
            uuid: uuidv4()
        }

        dispatchCreatedCharacters({
            type: 'CREATE_CHARACTER',
            payload: CharcterData
        })
        try {
            const response = await apiRequest('/createCharacter', 'POST', CharcterData);
            console.log(response)
        }
        catch (error) {
            console.log(error)
        }
    };

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

    return (
        <BasePanel
            id={id}
            panels={panels}
            setPanels={setPanels}
            title="Create Character"
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
                        connectedCharacters={connectedCharacters}
                        setConnectedCharacters={setConnectedCharacters}
                        createdCharacters={createdCharacters}

                    />
                ) : null}
            </div>

            <div className="save-btn-container">
                <button className="save-btn" onClick={saveFunction}>
                    Save
                </button>
            </div>
        </BasePanel>
    );
};

export default CharacterCreationPanel;
