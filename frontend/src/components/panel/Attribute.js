import TextArea from '../TextArea'
const Attribute = (props) => {
    const { title, placeholder, deleteFunction, list, setter, onChange } = props;
    const attribute = list.find(attr => attr.name === title);
    return (
        <div style={styles.attributeContainer}>
            <div style={styles.sectionHeader}>
                <label style={styles.sectionHeaderLabel}>{title}</label>
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


    }


};

export default Attribute;