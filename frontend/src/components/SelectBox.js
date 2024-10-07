import { useState, useEffect } from 'react';
import CharacterButton from './CharacterButton';
import { useTranslation } from 'react-i18next';

const SelectBox = (props) => {
    const { t } = useTranslation();
    const { selectedCharacters, setSelectedCharacters, availableCharacters = [], multipleSelect = true } = props;
    const [dropdownOpen, setDropdownOpen] = useState(false);


    const handleSelectCharacter = (character) => {
        const isSelected = selectedCharacters.some((c) => c.uuid === character.uuid);

        if (isSelected) {
            setSelectedCharacters(selectedCharacters.filter((c) => c.uuid !== character.uuid));
        } else {
            if (multipleSelect) {
                setSelectedCharacters([...selectedCharacters, character]);
            } else {
                setSelectedCharacters([character]);
            }
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
    }, [availableCharacters, selectedCharacters, setSelectedCharacters]);

    useEffect(() => {
        if (selectedCharacters.length > 1 && !multipleSelect) {
            setSelectedCharacters([])
        }
    }, [multipleSelect, selectedCharacters.length, setSelectedCharacters])

    return (
        <div style={styles.modalBody}>
            {/* Dropdown for selecting characters */}
            <div style={styles.dropdownContainer}>
                <div style={styles.dropdownHeader} onClick={toggleDropdown}>
                    <span>
                        {selectedCharacters.length > 0
                            ?
                            selectedCharacters.map((char) => char.name).join(', ')
                            : multipleSelect ? t('selectCharacters') : t('selectCharacter')}
                    </span>
                    <span>{dropdownOpen ? '▲' : '▼'}</span>
                </div>

                {dropdownOpen && (
                    <div style={styles.dropdownList}>
                        {availableCharacters.length > 0 ? (
                            availableCharacters
                                .filter((character) => !character.deleted)
                                .map((character) => (
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
                                {t('noCharacters')}

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
    },
    dropdownHeader: {
        border: '1px solid #E0E0E0',
        borderRadius: '8px',
        padding: '10px 15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        fontSize: 'var(--font-medium)',
        color: '#333',
        backgroundColor: 'var(--color-bg-grey)',
        fontWeight: 'var(--font-semibold)',
        transition: 'background-color 0.2s ease',
    },
    dropdownList: {
        position: 'relative',
        top: '0%',
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
        // backgroundColor: 'var(--color-primary)',
        marginRight: '10px',
    },
    dropdownText: {
        fontFamily: 'var(--font-secondary)',
        fontSize: 'var(--font-medium)',
        fontWeight: 'var(--font-bold)',
        color: '#333',
    },
};

export default SelectBox;
