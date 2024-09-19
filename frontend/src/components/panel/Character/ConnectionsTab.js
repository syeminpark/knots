import React, { useState, useEffect } from 'react';
import Attribute from '../Attribute';
import AddConnectionModal from '../AddConnectionModal';

const ConnectionsTab = (props) => {
    const { connectedCharacters, setConnectedCharacters, createdCharacters, caller } = props
    const [showModal, setShowModal] = useState(false);

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
                    key={child.name}
                    title={child.name}
                    placeholder="Add relationship details"
                    deleteFunction={deleteConnection}
                    list={connectedCharacters}
                    setter={setConnectedCharacters}
                    onChange={(event) => { onChange(child.name, event.target.value) }}
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


