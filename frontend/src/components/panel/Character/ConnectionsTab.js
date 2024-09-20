import React, { useState, useEffect } from 'react';
import Attribute from '../Attribute';
import AddConnectionModal from '../AddConnectionModal';

const ConnectionsTab = (props) => {
    const { panels, setPanels, connectedCharacters, setConnectedCharacters, createdCharacters, caller } = props
    const [showModal, setShowModal] = useState(false);

    let currentCharacterName = "this character"
    if (caller) {
        currentCharacterName = caller.name
    }


    const deleteConnection = (name) => {
        const newConnections = connectedCharacters.filter(character => character.name !== name);
        setConnectedCharacters(newConnections)
    };

    const onChange = (title, value) => {
        setConnectedCharacters(connectedCharacters.map(child =>
            child.name === title ? { ...child, description: value } : child
        ));
    };

    return (
        <>
            <div>{`${connectedCharacters.length} Connections`}</div>
            {connectedCharacters.map(child => (
                <Attribute
                    panels={panels}
                    setPanels={setPanels}
                    key={child.name}
                    title={child.name}
                    placeholder={`What is their relationship or shared history? How does ${currentCharacterName} feel about ${child.name}?`}
                    deleteFunction={deleteConnection}
                    list={connectedCharacters}
                    setter={setConnectedCharacters}
                    onChange={(event) => { onChange(child.name, event.target.value) }}
                    connectedCharacter={createdCharacters.characters.find(character => character.uuid === child.uuid)}
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

export default ConnectionsTab


