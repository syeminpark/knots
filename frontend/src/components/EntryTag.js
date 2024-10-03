import { useTranslation } from 'react-i18next'; // i18n 가져오기
const EntryTag = (props) => {
    const { selectedMode, size = 'medium', hasBackground = true } = props;
    const { t } = useTranslation();
    const getSizeStyle = () => {
        switch (size) {
            case 'xs':
                return styles.xs
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
            {t(selectedMode)}
        </span>
    );
};

const styles = {
    entryTag: {

        fontWeight: 'var(--font-bold)',
        borderRadius: '8px',
        color: '#6c63ff',
    },
    background: {
        backgroundColor: 'var(--color-bg-greypurple)',
    },
    noBackground: {
        backgroundColor: 'transparent',
        padding: '0px',
    },
    xs: {
        fontSize: 'var(--font-xs)',
        padding: '2px 6px',
    },
    small: {
        padding: '3px 8px',
        fontSize: 'var(--font-small)',
    },
    medium: {
        padding: '5px 10px',
        fontSize: 'var(--font-medium)',
    },
    large: {
        padding: '6px 12px',
        fontSize: '14px',
    },
};

export default EntryTag;
