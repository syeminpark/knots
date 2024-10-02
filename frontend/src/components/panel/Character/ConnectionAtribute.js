import React, { useState } from 'react';
import CharacterButton from '../../CharacterButton';
import openNewPanel from '../../openNewPanel';
import Attribute from '../Attribute';

const ConnectionAttribute = (props) => {
    const {
        panels, setPanels, title, placeholder, deleteFunction, list, setter, onChange,
        connectedCharacter, currentCharacter, personaAttributes
    } = props;

    const attribute = list.find(attr => attr.name === title);
    const [selectedChips, setSelectedChips] = useState([]);

    const handleChipClick = (name, e) => {
        e.stopPropagation(); // Prevent triggering edit mode when clicking on chips
        setSelectedChips((prevSelected) =>
            prevSelected.includes(name)
                ? prevSelected.filter((chip) => chip !== name)
                : [...prevSelected, name]
        );
    };

    return (
        <Attribute
            title={title}
            placeholder={placeholder}
            attribute={attribute}
            onChange={onChange}
            deleteFunction={deleteFunction}
            list={list}
            setter={setter}
            isClickableToEdit={true}
            isClickableToSave={true}
        >

            <div style={styles.characterProfiles}>
                <CharacterButton createdCharacter={currentCharacter}></CharacterButton>
                →
                <button
                    style={styles.profileButtonContainer}
                    key={connectedCharacter.uuid}
                    onClick={(e) => {
                        e.stopPropagation();
                        openNewPanel(panels, setPanels, "character-profile", connectedCharacter);
                    }}
                >
                    <CharacterButton createdCharacter={connectedCharacter}></CharacterButton>
                </button>
            </div>
            <label style={styles.sectionHeaderLabel}>Relationship</label>

            <div style={styles.sectionHeaderLabel}>Knowledge</div>
            <div style={styles.knowledgeExplanation}>
                {currentCharacter.name} knows about {connectedCharacter.name}'s
            </div>
            <div style={styles.chipsContainer}>
                {personaAttributes.map((attr, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.chip,
                            ...(selectedChips.includes(attr.name) ? styles.selectedChip : {}),
                        }}
                        onClick={(e) => handleChipClick(attr.name, e)}
                    >
                        {selectedChips.includes(attr.name) ? '✔ ' : ''}{attr.name}
                    </div>
                ))}
            </div>


        </Attribute >
    );
};

// Connection-specific styles
const styles = {
    characterProfiles: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '10px',
        width: '100%',
    },
    profileButtonContainer: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
    },
    knowledgeExplanation: {
        padding: '5px 0px',
        color: '#333',
        fontSize: 'var(--font-xs)',
    },
    chipsContainer: {
        marginTop: '10px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
    },
    chip: {
        backgroundColor: '#f0f0f0',
        color: '#333',
        padding: '5px 10px',
        borderRadius: '15px',
        fontSize: '14px',
        cursor: 'pointer',
    },
    selectedChip: {
        backgroundColor: '#f0eaff',
        borderColor: 'var(--color-secondary)',
        borderWidth: '1px',
        borderStyle: 'solid',
    },
    sectionHeaderLabel: {
        color: '#6d6dff',
        fontSize: 'var(--font-medium)',
        fontWeight: 'var(--font-bold)',
    },
};

export default ConnectionAttribute;
