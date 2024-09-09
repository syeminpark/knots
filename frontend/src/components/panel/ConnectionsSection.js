import React, { useState } from 'react';
import Attribute from './Attribute';
import AddConnectionModal from './AddConnectionModal';

const ConnectionsSection = (props) => {
    const { connectedCharacters, setConnectedCharacters } = props
    const [showModal, setShowModal] = useState(false);

    const deleteConnection = (name) => {
        const newConnections = connectedCharacters.filter(character => character.name !== name);
        setConnectedCharacters(newConnections)

    };

    const onChange = (title, value) => {
        setConnectedCharacters(connectedCharacters.map(attribute =>
            attribute.name === title ? { ...attribute, description: value } : attribute
        ));
    };

    return (
        <>
            <div>{`${connectedCharacters.length} Connections`}</div>
            {connectedCharacters.map(character => (
                <Attribute
                    key={character.name}
                    title={character.name}
                    placeholder="Add relationship details"
                    deleteFunction={deleteConnection}
                    list={connectedCharacters}
                    setter={setConnectedCharacters}
                    onChange={(event) => { onChange(character.name, event.target.value) }}
                />
            ))}
            <button className="add-attributes-btn" onClick={() => setShowModal(true)}>
                + Add Connections
            </button>
            {showModal && (
                <AddConnectionModal
                    setShowModal={setShowModal}
                    connectedCharacters={connectedCharacters}
                    setConnectedCharacters={setConnectedCharacters}
                />
            )}
        </>
    );
};

export default ConnectionsSection;


