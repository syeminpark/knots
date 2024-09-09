import React, { useState } from 'react';
import BasePanel from './BasePanel';
import AboutSection from './AboutSection';
import ConnectionsSection from './ConnectionsSection';
import TabNavigation from './TabNavigation';

const CharacterPanel = (props) => {
    const [activeTab, setActiveTab] = useState('About');

    const [connectedCharacters, setConnectedCharacters] = useState([]);
    const [personaAttributes, setPersonaAttributes] = useState([{ name: 'Backstory', description: '' }]);
    const [imageSrc, setImageSrc] = useState(null);
    const [name, setName] = useState('');

    const { id, type, panels, setPanels } = props;

    const saveFunction = () => {
        if (!name.trim()) {
            alert("Name is required");
            return;
        }
        const newPanels = panels.filter(panel => panel.id !== id);
        setPanels(newPanels);
        console.log("Character Info:", { id, name, personaAttributes, connectedCharacters, imageSrc, name }); // Now logs name and imageSrc
    }

    return (
        <>
            {type === "character-creation" && (
                <div>
                    <BasePanel
                        id={id}
                        panels={panels}
                        setPanels={setPanels}
                        title="Create Character"
                        saveFunction={saveFunction}
                        setImageSrc={setImageSrc}  // Pass setImageSrc as a prop
                        imageSrc={imageSrc}        // Pass the imageSrc to display it
                        setName={setName}          // Pass setName as a prop
                        name={name}                // Pass the name to display it
                    >
                        {/* Tabs */}
                        <TabNavigation tabs={['About', 'Connections']} activeTab={activeTab} setActiveTab={setActiveTab} />
                        {/* Conditionally render the appropriate panel based on activeTab */}
                        {activeTab === 'About' ? (
                            <AboutSection
                                personaAttributes={personaAttributes}
                                setPersonaAttributes={setPersonaAttributes}
                            />
                        ) : activeTab === 'Connections' ? (
                            <ConnectionsSection
                                connectedCharacters={connectedCharacters}
                                setConnectedCharacters={setConnectedCharacters}
                            />
                        ) : null}
                    </BasePanel>
                </div>
            )}
            {
                type === "character-profile" && (
                    <BasePanel
                        id={id}
                        panels={panels}
                        setPanels={setPanels}
                        title="Character Profile"
                        saveFunction={saveFunction}
                        setImageSrc={setImageSrc}  // Pass setImageSrc as a prop
                        imageSrc={imageSrc}        // Pass the imageSrc to display it
                        setName={setName}          // Pass setName as a prop
                        name={name}                // Pass the name to display it
                    >
                        <TabNavigation tabs={['About', 'Connections', 'Journals', 'Comments']} activeTab={activeTab} setActiveTab={setActiveTab} />
                        {/* Conditionally render the appropriate panel based on activeTab */}
                        {activeTab === 'About' ? (
                            <AboutSection
                                personaAttributes={personaAttributes}
                                setPersonaAttributes={setPersonaAttributes}
                            />
                        ) : activeTab === 'Connections' ? (
                            <ConnectionsSection
                                connectedCharacters={connectedCharacters}
                                setConnectedCharacters={setConnectedCharacters}
                            />
                        ) : null}
                    </BasePanel>
                )
            }
        </>
    );
}

export default CharacterPanel;
