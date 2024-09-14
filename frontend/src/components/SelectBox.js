import { useState } from 'react';
const SelectBox = (props) => {

    const { selectedCharacters, setSelectedCharacters, allCharacters } = props
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
                                        ? '#E0E0E0'
                                        : 'transparent',
                                }}
                                onClick={() => handleSelectCharacter(character)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedCharacters.includes(character)}
                                    onChange={() => handleSelectCharacter(character)}
                                    style={styles.checkbox}
                                />
                                {character}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
const styles = {
    modalBody: {
        padding: '0px',
    },
    dropdownContainer: {
        position: 'relative',
        width: '100%',
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
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        border: '1px solid #E0E0E0',
        borderRadius: '5px',
        backgroundColor: 'white',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        marginTop: '5px',
        padding: '10px 0',
        maxHeight: '200px',  // Limit the height of the dropdown list
        overflowY: 'auto',    // Add scrolling when the content exceeds max height
    },
    dropdownItem: {
        padding: '10px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
    },
    checkbox: {
        marginRight: '10px',
    },
};

export default SelectBox