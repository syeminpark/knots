const Attribute = (props) => {
    const { title, content, placeholder, deleteFunction, list, setter, onChange } = props;

    const attribute = list.find(attr => attr.name === title);
    return (
        <div style={styles.attributeContainer}>
            <div style={styles.sectionHeader}>
                <label style={styles.sectionHeaderLabel}>{title}</label>
                <button style={styles.closeSectionBtn}
                    onClick={() => { deleteFunction(title, list, setter) }}>✖</button>
            </div>
            <textarea
                style={styles.description}
                placeholder={placeholder || "Add description"}
                onChange={onChange}
                value={attribute ? attribute.description : ""}  // Set the textarea value
            >
            </textarea>
        </div>
    );
};

const styles = {
    attributeContainer: {
        backgroundColor: '#f0f0ff',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px',
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    sectionHeaderLabel: {
        color: '#6d6dff',
        fontSize: '16px',
    },
    closeSectionBtn: {
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '12px',
        cursor: 'pointer',
        color: 'gray',
    },
    description: {
        width: '100%',
        height: '80px',
        padding: '10px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: 'white',
        fontSize: '14px',
    },
};

export default Attribute;