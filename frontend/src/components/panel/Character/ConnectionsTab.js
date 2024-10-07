import React, { useState, useEffect } from 'react';
import AddConnectionModal from '../AddConnectionModal';
import DiscoverCharacterModal from '../DiscoverCharacterModal';
import Attribute from '../Attribute';
import { useTranslation } from 'react-i18next';
import DeleteConfirmationModal from '../../DeleteConfirmationModal';
import ConnectionAttribute
    from './ConnectionAttribute';
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
        dispatchCreatedCharacters,
    } = props;

    const [showModal, setShowModal] = useState(false);
    const [showDiscoverModal, setShowDiscoverModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [selectedConnectionToDelete, setSelectedConnectionToDelete] = useState(null);

    // useEffect(() => {
    //     console.log(currentCharacter)
    // }, [currentCharacter])

    let currentCharacterName = "this character";
    if (caller) {
        currentCharacterName = caller.name;
    }

    const deleteConnection = (name) => {
        setSelectedConnectionToDelete(name);
        setShowDeleteConfirmation(true);
    };

    const confirmDeleteConnection = () => {
        const newConnections = connectedCharacters.filter(
            (character) => character.name !== selectedConnectionToDelete
        );
        setConnectedCharacters(newConnections);
        setShowDeleteConfirmation(false);
        setSelectedConnectionToDelete(null);
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

    const handleOpenAddModal = () => {
        setShowDiscoverModal(false); // Close the discover modal if it's open
        setShowModal(true);
    };

    const handleOpenDiscoverModal = () => {
        setShowModal(false); // Close the add connection modal if it's open
        setShowDiscoverModal(true);
    };

    return (
        <>
            {t(
                connectedCharacters.length === 1
                    ? 'connection_singular'
                    : 'connection_plural',
                { count: connectedCharacters.length }
            )}

            <div style={styles.connectionsTabWrapper}>
                {connectedCharacters.map((child) => (
                    <ConnectionAttribute
                        panels={panels}
                        setPanels={setPanels}
                        key={child.name}
                        title={child.name}
                        placeholder={t('connectionPlaceholder', {
                            currentCharacterName,
                            childName: child.name,
                        })}
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
                        setConnectedCharacters={setConnectedCharacters}
                        dispatchCreatedCharacters={dispatchCreatedCharacters}
                    />
                )}

                {showDeleteConfirmation && (
                    <DeleteConfirmationModal
                        title={t('confirmDeletion')}
                        setShowModal={setShowDeleteConfirmation}
                    >
                        <p style={{ marginBottom: '20px' }}>{t('areYouSureDelete')}</p>
                        <div style={styles.modalButtonContainer}>
                            <button onClick={() => setShowDeleteConfirmation(false)} style={styles.cancelButton}>
                                {t('cancel')}
                            </button>
                            <button onClick={confirmDeleteConnection} style={styles.deleteButton}>
                                {t('delete')}
                            </button>
                        </div>
                    </DeleteConfirmationModal>
                )}

                <div style={styles.buttonContainer}>
                    <button style={styles.discoverButton} onClick={handleOpenDiscoverModal}
                    >
                        {t('discoverCharacter')}
                    </button>
                    <button style={styles.createButton} onClick={handleOpenAddModal}>
                        {t('addconnections')}
                    </button>
                </div>
            </div>
        </>
    );
};

const styles = {
    connectionsTabWrapper: {
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 400px)',
        marginTop: '10px'
    },
    buttonContainer: {
        position: 'sticky',
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        padding: '10px 0px',
        backgroundColor: '#fff',
        zIndex: 100,
        gap: '10px',
    },
    modalButtonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginTop: '20px',
    },
    cancelButton: {
        padding: '8px 16px',
        backgroundColor: '#ccc',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    deleteButton: {
        padding: '8px 16px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    discoverButton: {

        width: '100%',
        padding: '10px',
        backgroundColor: 'black',
        border: 'none',
        borderRadius: '6px',
        color: 'white',
        fontSize: 'var(--font-medium)',
        marginTop: '6px',
        cursor: 'pointer',

    },
    createButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: 'var(--color-secondary)',
        border: 'none',
        borderRadius: '6px',
        color: 'white',
        fontSize: 'var(--font-medium)',
        marginTop: '6px',
        cursor: 'pointer',
    }
};

export default ConnectionsTab;
