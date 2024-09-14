import TextArea from "../../TextArea";
const PostTextArea = (props) => {
    const { title, placeholder, attribute, onChange } = props;
    
    return (
        <div style={styles.attributeContainer}>
            <div style={styles.sectionHeader}>
                <label style={styles.sectionHeaderLabel}>{title}</label>
            </div>
            <TextArea
            attribute={attribute}
            placeholder={placeholder}
            onChange={onChange}
            styles={styles}></TextArea>
            
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
    description: {
        width: '100%',
        minHeight: '100px', // Start with a base height
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        backgroundColor: 'white',
        fontSize: '14px',
        resize: 'vertical', // Allows the user to manually resize vertically
        overflow: 'hidden', // Hides overflow to prevent the scroll bar
    }

};

export default PostTextArea