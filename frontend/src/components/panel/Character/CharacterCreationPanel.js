import React, { useState, useEffect } from 'react';
import BasePanel from '../BasePanel';
import AboutTab from './AboutTab';
import ConnectionsTab from './ConnectionsTab';
import TabNavigation from '../TabNavigation';
import { v4 as uuidv4 } from 'uuid';
import ProfileSection from './ProfileSection';

const CharacterCreationPanel = (props) => {

    const { id, type, panels, setPanels, createdCharacters, setCreatedCharacters } = props;
    const [activeTab, setActiveTab] = useState('About');
    const [connectedCharacters, setConnectedCharacters] = useState([]);
    const [personaAttributes, setPersonaAttributes] = useState([{ name: 'Backstory', description: '' }]);
    const [imageSrc, setImageSrc] = useState(null);
    const [name, setName] = useState('');


    const saveFunction = () => {
        if (!name.trim()) {
            alert("Name is required");
            return;
        }
        const newPanels = panels.filter(panel => panel.id !== id);
        setPanels(newPanels);
        const uuid = uuidv4();
        const newCharacter = { uuid, name, personaAttributes, connectedCharacters, imageSrc, }
        setCreatedCharacters((prevCharacters) => [...prevCharacters, newCharacter]);
    }

    return (
        <BasePanel
            id={id}
            panels={panels}
            setPanels={setPanels}
            title="Create Character"
            saveFunction={saveFunction}
        >
            {<ProfileSection
                id={id}
                imageSrc={imageSrc}
                setImageSrc={setImageSrc}
                name={name}
                setName={setName}
            ></ProfileSection>}
            {/* Tabs */}
            <TabNavigation tabs={['About', 'Connections']} activeTab={activeTab} setActiveTab={setActiveTab} />
            {/* Conditionally render the appropriate panel based on activeTab */}
            {activeTab === 'About' ? (
                <AboutTab
                    personaAttributes={personaAttributes}
                    setPersonaAttributes={setPersonaAttributes}
                />
            ) : activeTab === 'Connections' ? (
                <ConnectionsTab
                    connectedCharacters={connectedCharacters}
                    setConnectedCharacters={setConnectedCharacters}
                />
            ) : null}
            <div className="save-btn-container">
                <button className="save-btn" onClick={saveFunction}>
                    Save
                </button>
            </div>
        </BasePanel>
    );
}


export default CharacterCreationPanel;
