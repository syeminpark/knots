import React, { useState } from 'react';
import AddConnectionModal from '../AddConnectionModal';
import DiscoverCharacterModal from '../DiscoverCharacterModal';
import Attribute from '../Attribute';
import { useTranslation } from 'react-i18next';

const ConnectionsTab = (props) => {
    const { t } = useTranslation();
    const {
        panels,
        setPanels,
        connectedCharacters,
        setConnectedCharacters,
        createdCharacters,
        caller,
        currentCharacter,
        personaAttributes
    } = props;
    const [showModal, setShowModal] = useState(false);
    const [showDiscoverModal, setShowDiscoverModal] = useState(false);

    let currentCharacterName = "this character";
    if (caller) {
        currentCharacterName = caller.name;
    }

    const deleteConnection = (name) => {
        const newConnections = connectedCharacters.filter(
            (character) => character.name !== name
        );
        setConnectedCharacters(newConnections);
    };

    const onChange = (title, field, value) => {
        setConnectedCharacters(
            connectedCharacters.map((child) =>
                child.name === title ? { ...child, [field]: value } : child
            )
        );
    };

    const handleDiscover = (data) => {
        console.log("Discovered new character:", data);
    };

    return (
        <div style={styles.connectionsTabWrapper}>
            <div>
                {connectedCharacters.length === 1
                    ? `${connectedCharacters.length} Connection`
                    : `${connectedCharacters.length} Connections`}
            </div>
            <br />
            {connectedCharacters.map((child) => (
                <Attribute
                    panels={panels}
                    setPanels={setPanels}
                    key={child.name}
                    title={child.name}
                    placeholder={`How does ${currentCharacterName} feel, think, behave towards ${child.name} and why? What has happened between them from ${currentCharacterName}'s perspective? `}
                    deleteFunction={deleteConnection}
                    list={connectedCharacters}
                    setter={setConnectedCharacters}
                    onChange={(field, event) => {
                        onChange(child.name, field, event.target.value);
                    }}
                    connectedCharacter={createdCharacters.characters.find(
                        (character) => character.uuid === child.uuid
                    )}
                    currentCharacter={currentCharacter}
                    isConnectionsTab={true}
                />
            ))}
            <button className="create-new-btn" onClick={() => setShowModal(true)}>
                {t('addconnections')}
            </button>
            <button
                className="discover-btn"
                onClick={() => setShowDiscoverModal(true)}
            >
                {t('discoverCharacter')}
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

            {showDiscoverModal && (
                <DiscoverCharacterModal
                    setShowModal={setShowDiscoverModal}
                    onDiscover={handleDiscover}
                    currentCharacter={currentCharacter}
                />
            )}
        </div>
    );
};

const styles = {
    connectionsTabWrapper: {
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 400px)',
    },
};

export default ConnectionsTab;
