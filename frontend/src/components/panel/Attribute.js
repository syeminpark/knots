import TextArea from '../TextArea'
const Attribute = (props) => {
    const { title, placeholder, deleteFunction, list, setter, onChange } = props;
    const attribute = list.find(attr => attr.name === title);
    console.log(title)

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
        fontWeight: 'bold'
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
        minHeight: '10px', // Start with a base height
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        backgroundColor: 'white',
        fontSize: '14px',
        resize: 'vertical', // Allows the user to manually resize vertically
        overflow: 'hidden', // Hides overflow to prevent the scroll bar
    }


};

export default Attribute;