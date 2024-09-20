import TextArea from '../TextArea'
import CharacterButton from '../CharacterButton';
import openNewPanel from '../openNewPanel';

const Attribute = (props) => {
    const { panels, setPanels, title, placeholder, deleteFunction, list, setter, onChange, connectedCharacter } = props;
    const attribute = list.find(attr => attr.name === title);
    console.log(connectedCharacter)
    return (
        <div style={styles.attributeContainer}>
            <div style={styles.sectionHeader}>
                {
                    connectedCharacter ? (
                        <button
                            style={styles.profileButtonContainer}
                            key={connectedCharacter.uuid}
                            onClick={() => {
                                openNewPanel(panels, setPanels, "character-profile", connectedCharacter);
                            }}
                        >
                            <CharacterButton createdCharacter={connectedCharacter}></CharacterButton>
                        </button>
                    ) : (
                        <label style={styles.sectionHeaderLabel}>{title}</label>
                    )
                }
                {deleteFunction && (
                    <button style={styles.closeSectionBtn}
                        onClick={() => { deleteFunction(title, list, setter) }}>✖</button>
                )}
            </div>
            <TextArea
                attribute={attribute}
                placeholder={placeholder}
                onChange={onChange}
                styles={styles}>
            </TextArea>

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
    description: {
        width: '100%',
        minHeight: '10px', // Start with a base height
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
    },


};

export default Attribute;