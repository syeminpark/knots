import React, { useState } from 'react';
// import RelationshipAttribute from './RelationshipAttribute';
import AddConnectionModal from '../AddConnectionModal';
import Attribute from '../Attribute';

const ConnectionsTab = (props) => {
    const { panels, setPanels, connectedCharacters, setConnectedCharacters, createdCharacters, caller, currentCharacter } = props;
    const [showModal, setShowModal] = useState(false);

    let currentCharacterName = "this character";
    if (caller) {
        currentCharacterName = caller.name;
    }

    const deleteConnection = (name) => {
        const newConnections = connectedCharacters.filter(character => character.name !== name);
        setConnectedCharacters(newConnections);
    };

    // // Updated onChange to handle specific fields
    // const handleChange = (title, field, value) => {
    //     console.log(title, field, value)
    //     setConnectedCharacters(connectedCharacters.map(child =>
    //         child.name === title ? { ...child, [field]: { ...child[field], description: value } } : child
    //     ));
    // };

    const onChange = (title, value) => {
        setConnectedCharacters(connectedCharacters.map(child =>
            child.name === title ? { ...child, description: value } : child
        ));
    };

    return (
        <>
            <div>
                {connectedCharacters.length < 2
                    ? `${connectedCharacters.length} Connection`
                    : `${connectedCharacters.length} Connections`}
            </div>
            <br />
            {connectedCharacters.map(child => (

                <Attribute
                    panels={panels}
                    setPanels={setPanels}
                    key={child.name}
                    title={child.name}
                    placeholder={`How does ${currentCharacterName} feel, think, behave towards ${child.name} and why? What has happened between them from ${currentCharacterName}'s perspective? `}
                    deleteFunction={deleteConnection}
                    list={connectedCharacters}
                    setter={setConnectedCharacters}
                    onChange={(event) => { onChange(child.name, event.target.value) }}
                    connectedCharacter={createdCharacters.characters.find(character => character.uuid === child.uuid)}
                    currentCharacter={currentCharacter}
                />

            ))}
            <button className="create-new-btn" onClick={() => setShowModal(true)}>
                + Add Connections
            </button>
            {showModal && (
                <AddConnectionModal
                    setShowModal={setShowModal}
                    connectedCharacters={connectedCharacters}
                    setConnectedCharacters={setConnectedCharacters}
                    createdCharacters={createdCharacters}
                    caller={caller}
                />
            )}
        </>
    );
};

export default ConnectionsTab;


{/* <RelationshipAttribute
                    panels={panels}
                    setPanels={setPanels}
                    key={child.uuid} // Use 'uuid' if 'name' is not unique
                    title={child.name}
                    placeholders={{
                        myPOV: `How does ${currentCharacterName} feel, think, behave towards ${ child.name } and why ? What has happened between them from ${ currentCharacterName }'s perspective? `,
                        // theirPOV: `How does ${child.name} feel, think, behave towards ${currentCharacterName} and why?`,
                        // sharedHistory: `What events, situations have happened between them?`,
                    }}
            textAreaTitles={{
                myPOV: `${currentCharacterName}'s Perspective`,
                // theirPOV: `${child.name}'s Perspective`,
                // sharedHistory: `Shared History`,
            }}
            type={{
                myPOV: "myPOV",
                // theirPOV: "theirPOV",
                // sharedHistory: "sharedHistory",
            }}
            deleteFunction={deleteConnection}
            list={connectedCharacters}
            setter={setConnectedCharacters}
                    // onChange={(field, value) => handleChange(child.name, field, value)}
            onChange={(event) => { onChange(child.name, event.target.value) }}
            connectedCharacter={createdCharacters.characters.find(character => character.uuid === child.uuid)}
                /> */}