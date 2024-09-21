import React, { useState, useEffect } from 'react';
import BasePanel from '../BasePanel';
import AboutTab from './AboutTab';
import ConnectionsTab from './ConnectionsTab';
import TabNavigation from './TabNavigation';
import ProfileSection from './ProfileSection';
import JournalsTab from './JournalsTab';
import CommentsTab from './CommentsTab';
import apiRequest from '../../../utility/apiRequest';

const CharacterProfilePanel = (props) => {
    const { id, caller, panels, setPanels, createdCharacters, dispatchCreatedCharacters, createdJournalBooks, dispatchCreatedJournalBooks } = props;

    const [activeTab, setActiveTab] = useState('About');
    const [connectedCharacters, setConnectedCharacters] = useState(caller.connectedCharacters);
    const [personaAttributes, setPersonaAttributes] = useState(caller.personaAttributes);
    const [imageSrc, setImageSrc] = useState(caller.imageSrc);
    const [name, setName] = useState(caller.name);

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
    }, [createdCharacters]);  // Dependency array


    const saveFunction = async () => {
        if (!name.trim()) {
            alert("Name is required");
            return;
        }
        const newPanels = panels.filter(panel => panel.id !== id);
        setPanels(newPanels);

        const CharacterData = {
            name: name,
            personaAttributes: personaAttributes,
            connectedCharacters: connectedCharacters,
            imageSrc: imageSrc,
            uuid: caller.uuid,
        }

        dispatchCreatedCharacters({
            type: 'EDIT_CREATED_CHARACTER',
            payload: CharacterData
        })
        try {
            const response = await apiRequest('/updateCharacter', 'PUT', CharacterData);
            console.log(response)
        }
        catch (error) {
            console.log(error)
        }
    };

    const deleteFunction = () => {
        const currentCharacter = createdCharacters.charactrs.find(character => character.uuid === caller.uuid)
    }

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
                {<ProfileSection
                    id={id}
                    imageSrc={imageSrc}
                    setImageSrc={setImageSrc}
                    name={name}
                    setName={setName}
                ></ProfileSection>}
                <TabNavigation tabs={['About', 'Connections', 'Journals', 'Comments']} activeTab={activeTab} setActiveTab={setActiveTab} />
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
            ) : activeTab === 'Journals' ? (
                <JournalsTab
                    caller={caller}
                    createdJournalBooks={createdJournalBooks}
                    dispatchCreatedJournalBooks={dispatchCreatedJournalBooks}
                    panels={panels}
                    setPanels={setPanels}
                ></JournalsTab>

            ) : activeTab === 'Comments' ? (
                <CommentsTab
                    panels={panels}
                    setPanels={setPanels}
                    caller={caller}
                    createdJournalBooks={createdJournalBooks}
                    createdCharacters={createdCharacters}
                ></CommentsTab>

            ) : null}
            <div className="save-btn-container">
                <button className="save-btn" onClick={saveFunction}>
                    Save
                </button>
            </div>
        </BasePanel>
    )
}
const styles = {
    stickyHeader: {
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: 'white',
        paddingBottom: '10px',
    },
};

export default CharacterProfilePanel
