import React, { useState, useEffect } from 'react';
// import RelationshipAttribute from './RelationshipAttribute';
import AddConnectionModal from '../AddConnectionModal';
import Attribute from '../Attribute';
import { useTranslation } from 'react-i18next';


const ConnectionsTab = (props) => {
    const { t } = useTranslation();
    const { panels, setPanels, connectedCharacters, setConnectedCharacters, createdCharacters, caller, currentCharacter, personaAttributes } = props;
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

    // useEffect(() => {
    //     // Loop over connected characters and update the currentCharacter's knowledge field
    //     const updatedKnowledge = connectedCharacters.map(connection => {
    //         return {
    //             name: connection.name,
    //             description: connection.description || "", // Or any other logic to extract knowledge
    //         };
    //     });

    //     // Update the currentCharacter's knowledge about the connected characters
    //     setConnectedCharacters(prev => prev.map(char => {
    //         if (char.uuid === currentCharacter.uuid) {
    //             return { ...char, knowledge: updatedKnowledge };
    //         }
    //         return char;
    //     }));

    // }, [connectedCharacters]);

    const onChange = (title, field, value) => {
        setConnectedCharacters(connectedCharacters.map(child =>
            child.name === title
                ? { ...child, [field]: value }
                : child
        ));
        console.log(connectedCharacters);
    };



    return (
        <div style={styles.connectionsTabWrapper}>
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
                    onChange={(field, event) => { onChange(child.name, field, event.target.value) }}
                    connectedCharacter={createdCharacters.characters.find(character => character.uuid === child.uuid)}
                    currentCharacter={currentCharacter}
                    isConnectionsTab={true}
                />

            ))}
            <button className="create-new-btn" onClick={() => setShowModal(true)}>
                {t('addconnections')}
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
        </div>
    );
};

const styles = {
    connectionsTabWrapper: {
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 400px)', // 이 높이를 원하는 대로 조정하세요.
    },
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