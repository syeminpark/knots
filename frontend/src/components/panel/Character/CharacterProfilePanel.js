import React, { useState } from 'react';
import BasePanel from '../BasePanel';
import AboutTab from './AboutTab';
import ConnectionsTab from './ConnectionsTab';
import TabNavigation from '../TabNavigation';
import ProfileSection from './ProfileSection';

const CharacterProfilePanel = (props) => {
    const { id, caller, panels, setPanels, createdCharacters, setCreatedCharacters } = props;

    const [activeTab, setActiveTab] = useState('About');
    const [connectedCharacters, setConnectedCharacters] = useState(caller.connectedCharacters);
    const [personaAttributes, setPersonaAttributes] = useState(caller.personaAttributes);
    const [imageSrc, setImageSrc] = useState(caller.imageSrc);
    const [name, setName] = useState(caller.name);

    const saveFunction = () => {
        if (!name.trim()) {
            alert("Name is required");
            return;
        }
        const newPanels = panels.filter(panel => panel.id !== id);
        setPanels(newPanels);

        const updatedCharacters = createdCharacters.map(character => {
            if (character.uuid === caller.uuid) {
                // Return a new object with updated values
                return {
                    ...character,//Copies all properties from the original character and the lines beneath override specific properties
                    name: name, // Update name
                    personaAttributes: personaAttributes, // Update other properties as needed
                    connectedCharacters: connectedCharacters,
                    imageSrc: imageSrc
                };
            }
            return character; // Return unchanged character
        });
        // Set the updated characters array back into state
        setCreatedCharacters(updatedCharacters);
    }

    return (
        <BasePanel
            id={id}
            panels={panels}
            setPanels={setPanels}
            title="Character Profile"
            saveFunction={saveFunction}
        >
            {<ProfileSection
                id={id}
                imageSrc={imageSrc}
                setImageSrc={setImageSrc}
                name={name}
                setName={setName}
            ></ProfileSection>}
            <TabNavigation tabs={['About', 'Connections', 'Journals', 'Comments']} activeTab={activeTab} setActiveTab={setActiveTab} />
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
    )
}

export default CharacterProfilePanel
