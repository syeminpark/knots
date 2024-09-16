import { useState } from 'react';

const SelectBox = (props) => {
    const { selectedCharacters, setSelectedCharacters, allCharacters } = props;
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Handle multiple character selection
    const handleSelectCharacter = (character) => {
        if (selectedCharacters.includes(character)) {
            // If already selected, remove it from the array
            setSelectedCharacters(selectedCharacters.filter((c) => c !== character));
        } else {
            // Otherwise, add it to the array
            setSelectedCharacters([...selectedCharacters, character]);
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div style={styles.modalBody}>
            {/* Dropdown for selecting characters */}
            <div style={styles.dropdownContainer}>
                <div style={styles.dropdownHeader} onClick={toggleDropdown}>
                    <span>
                        {selectedCharacters.length > 0
                            ? selectedCharacters.join(', ')
                            : 'Select Characters'}
                    </span>
                    <span>{dropdownOpen ? '▲' : '▼'}</span>
                </div>

                {dropdownOpen && (
                    <div style={styles.dropdownList}>
                        {allCharacters.map((character) => (
                            <div
                                key={character}
                                style={{
                                    ...styles.dropdownItem,
                                    backgroundColor: selectedCharacters.includes(character)
                                        ? '#E0E0FF' // selected color
                                        : 'transparent',
                                }}
                                onClick={() => handleSelectCharacter(character)}
                            >
                                <div style={styles.dropdownIcon}></div>
                                <span style={styles.dropdownText}>{character}</span>
                                <input
                                    type="checkbox"
                                    checked={selectedCharacters.includes(character)}
                                    onChange={() => handleSelectCharacter(character)}
                                    style={styles.checkbox}
                                />
                            </div>
                        ))}
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
        // borderBottom: '1px solid #E0E0E0',
    },
    checkbox: {
        marginLeft: 'auto',
        width: '16px', // 체크박스 크기 조정
        height: '16px',
    },
    dropdownIcon: {
        width: '25px', // 아이콘 크기
        height: '25px',
        borderRadius: '50%',
        backgroundColor: '#A0A0FF', // 원형 아이콘 배경색
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
