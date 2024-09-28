import React from 'react';
import TextArea from '../../TextArea';
import CharacterButton from '../../CharacterButton';
import openNewPanel from '../../openNewPanel';

const RelationshipAttribute = (props) => {
    const {
        panels,
        setPanels,
        title,
        placeholders,
        deleteFunction,
        list,
        setter,
        onChange,
        connectedCharacter,
        textAreaTitles,
        type
    } = props;

    const attribute = list.find(attr => attr.name === title) || {}; // Fallback to empty object if not found

    return (
        <div style={styles.attributeContainer}>
            <div style={styles.sectionHeader}>
                {connectedCharacter ? (
                    <button
                        style={styles.profileButtonContainer}
                        key={connectedCharacter.uuid}
                        onClick={() => openNewPanel(panels, setPanels, "character-profile", connectedCharacter)}
                    >
                        <CharacterButton createdCharacter={connectedCharacter} iconstyle={styles.iconstyle} />
                    </button>
                ) : (
                    <label style={styles.sectionHeaderLabel}>{title}</label>
                )}
                {deleteFunction && (
                    <button
                        style={styles.closeSectionBtn}
                        onClick={() => deleteFunction(title, list, setter)}
                    >
                        ✖
                    </button>
                )}
            </div>

            {/* My POV TextArea */}
            <div style={styles.textAreaTitles}>{textAreaTitles.myPOV}</div>
            <TextArea
                key={type.myPOV}
                attribute={attribute || { description: '' }} // Ensure fallback if attribute is undefined
                placeholder={placeholders.myPOV}
                // onChange={(event) => onChange(type.myPOV, event.target.value)}
                onChange={onChange}
                styles={styles}
            />

            {/* Their POV TextArea */}
            {/* <div style={styles.textAreaTitles}>{textAreaTitles.theirPOV}</div> */}
            {/* <TextArea
                key={type.theirPOV}
                attribute={attribute.theirPOV || { description: '' }} // Ensure fallback if attribute is undefined
                placeholder={placeholders.theirPOV}
                onChange={(event) => onChange(type.theirPOV, event.target.value)}
                styles={styles}
            /> */}

            {/* Shared History TextArea */}
            {/* <div style={styles.textAreaTitles}>{textAreaTitles.sharedHistory}</div>
            <TextArea
                key={type.sharedHistory}
                attribute={attribute.sharedHistory || { description: '' }} // Ensure fallback if attribute is undefined
                placeholder={placeholders.sharedHistory}
                onChange={(event) => onChange(type.sharedHistory, event.target.value)}
                styles={styles}
            /> */}
        </div>
    );
};

const styles = {
    attributeContainer: {
        backgroundColor: 'var(--color-bg-grey)',
        padding: '15px',
        borderRadius: '10px',
        marginTop: '10px',
        marginBottom: '12px',
        boxShadow: '0 4px 4px rgba(196, 196, 196, 0.25)',
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    sectionHeaderLabel: {
        color: '#6d6dff',
        fontSize: 'var(--font-medium)',
        fontWeight: 'var(--font-bold)',
    },
    closeSectionBtn: {
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: 'var(--font-xs)',
        cursor: 'pointer',
        color: 'gray',
    },
    textAreaTitles: {
        fontSize: 'var(--font-small)',
    },
    description: {
        width: '100%',
        minHeight: '150px', // Start with a base height
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        backgroundColor: 'white',
        fontSize: 'var(--font-small)',
        resize: 'vertical', // Allows the user to manually resize vertically
        overflow: 'hidden', // Hides overflow to prevent the scroll bar
    },
    profileButtonContainer: {
        display: 'flex', // Keep flex alignment
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
        justifyContent: 'center',
    },
    iconstyle: {
        display: 'flex',
    }
};

export default RelationshipAttribute;
