const EntryTag = (props) => {
    const { selectedMode, size = 'medium', hasBackground = true } = props;

    const getSizeStyle = () => {
        switch (size) {
            case 'small':
                return styles.small;
            case 'large':
                return styles.large;
            case 'medium':
            default:
                return styles.medium;
        }
    };

    const backgroundStyle = hasBackground ? styles.background : styles.noBackground;

    return (
        <span style={{ ...styles.entryTag, ...getSizeStyle(), ...backgroundStyle }}>
            {selectedMode}
        </span>
    );
};

const styles = {
    entryTag: {

        fontWeight: 'bold',
        borderRadius: '8px',
        color: '#6c63ff',
    },
    background: {
        backgroundColor: '#f0eaff',
    },
    noBackground: {
        backgroundColor: 'transparent',
        padding: '0px',
    },
    small: {
        padding: '3px 8px',
        fontSize: '10px',
    },
    medium: {
        padding: '5px 10px',
        fontSize: '12px',
    },
    large: {
        padding: '6px 12px',
        fontSize: '14px',
    },
};

export default EntryTag;
