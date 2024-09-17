import { useState, useEffect } from 'react';
import CharacterButton from './CharacterButton';

const SelectBox = (props) => {
    const { selectedCharacters, setSelectedCharacters, availableCharacters = [] } = props;
    const [dropdownOpen, setDropdownOpen] = useState(false);


    // Handle multiple character selection
    const handleSelectCharacter = (character) => {
        const isSelected = selectedCharacters.some((c) => c.uuid === character.uuid);
        if (isSelected) {
            // If already selected, remove it from the array
            setSelectedCharacters(selectedCharacters.filter((c) => c.uuid !== character.uuid));
        } else {
            // Otherwise, add it to the array
            setSelectedCharacters([...selectedCharacters, character]);
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        const updatedSelectedCharacters = selectedCharacters.map((selectedCharacter) => {
            const foundCharacter = availableCharacters.find(
                (createdCharacter) => createdCharacter.uuid === selectedCharacter.uuid
            );
            return foundCharacter ? foundCharacter : selectedCharacter;
        });
        const hasChanges = updatedSelectedCharacters.some((updatedCharacter, index) => {
            return updatedCharacter.name !== selectedCharacters[index]?.name;
        });
        if (hasChanges) {
            setSelectedCharacters(updatedSelectedCharacters);
        }
    }, [availableCharacters]);

    return (
        <div style={styles.modalBody}>
            {/* Dropdown for selecting characters */}
            <div style={styles.dropdownContainer}>
                <div style={styles.dropdownHeader} onClick={toggleDropdown}>
                    <span>
                        {selectedCharacters.length > 0
                            ? selectedCharacters.map((char) => char.name).join(', ')
                            : 'Select Characters'}
                    </span>
                    <span>{dropdownOpen ? '▲' : '▼'}</span>
                </div>

                {dropdownOpen && (
                    <div style={styles.dropdownList}>
                        {availableCharacters.length > 0 ? (
                            availableCharacters.map((character) => (
                                <div
                                    key={character.uuid}
                                    style={{
                                        ...styles.dropdownItem,
                                        backgroundColor: selectedCharacters.some((c) => c.uuid === character.uuid)
                                            ? '#E0E0FF' // selected color
                                            : 'transparent',
                                    }}
                                    onClick={() => handleSelectCharacter(character)}
                                >
                                    <CharacterButton
                                        createdCharacter={character}
                                        iconStyle={styles.dropdownIcon}
                                        textStyle={styles.dropdownText}
                                    />
                                    <input
                                        type="checkbox"
                                        checked={selectedCharacters.some((c) => c.uuid === character.uuid)}
                                        onChange={() => handleSelectCharacter(character)}
                                        style={styles.checkbox}
                                    />
                                </div>
                            ))
                        ) : (
                            <div style={styles.noCharactersMessage}>
                                No characters available.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    modalBody: {
        padding: '0px',
        position: 'relative',
    },
    dropdownContainer: {
        position: 'relative',
        width: '100%',
        marginBottom: '20px',
    },
    dropdownHeader: {
        border: '1px solid black',
        borderRadius: '5px',
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        cursor: 'pointer',
        fontSize: '16px',
        color: 'black',
    },
    dropdownList: {
        position: 'relative',
        top: '100%',
        left: 0,
        right: 0,
        border: '1px solid #E0E0E0',
        borderRadius: '10px',
        backgroundColor: 'white',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        marginTop: '5px',
        padding: '0',
        maxHeight: '200px',
        overflowY: 'auto',
    },
    dropdownItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 15px',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
    },
    checkbox: {
        marginLeft: 'auto',
        width: '16px',
        height: '16px',
    },
    noCharactersMessage: {
        padding: '10px',
        textAlign: 'center',
        color: '#666',
    },
    dropdownIcon: {
        width: '25px',
        height: '25px',
        borderRadius: '50%',
        backgroundColor: '#A0A0FF',
        marginRight: '10px',
    },
    dropdownText: {
        fontFamily: "'Roboto Mono', monospace",
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
    },
};

export default SelectBox;
