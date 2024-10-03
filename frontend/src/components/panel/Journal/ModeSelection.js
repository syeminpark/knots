import { useTranslation } from 'react-i18next'; // i18n 가져오기

const ModeSelection = (props) => {
    const { selectedMode, setSelectedMode } = props
    const { t } = useTranslation();

    const handleModeSelect = (mode) => {
        setSelectedMode(mode);
    };

    return (
        <div style={styles.modeSelectionContainer}>
            <div style={styles.modeButtons}>

                <div
                    style={{
                        ...styles.modeButton,
                        ...(selectedMode === "SYSTEMGENERATE" ? styles.selectedModeButton : {}),
                    }}
                    onClick={() => handleModeSelect("SYSTEMGENERATE")}
                >
                    <div style={styles.iconContainer}>
                        <span className="icon">✨</span>
                    </div>
                    <span style={styles.modeLabel}>{t('SYSTEMGENERATE')}</span>
                </div>
                <div
                    style={{
                        ...styles.modeButton,
                        ...(selectedMode === "MANUALPOST" ? styles.selectedModeButton : {}),
                    }}
                    onClick={() => handleModeSelect("MANUALPOST")}
                >
                    <div style={styles.iconContainer}>
                        <span className="icon"> 📝
                        </span>
                    </div>
                    <span style={styles.modeLabel}>{t('MANUALPOST')}</span>
                </div>
            </div>
        </div>

    )
}



const styles = {
    modeSelectionContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
    },

    modeButtons: {
        display: "flex",
        justifyContent: "center",
        gap: "20px",
    },
    modeButton: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "140px",
        height: "120px",
        backgroundColor: 'var(--color-bg-lightpurple)',
        borderRadius: "10px",
        cursor: "pointer",
        padding: "10px",
        border: "1px solid transparent",
        transition: "border 0.2s ease",
    },
    selectedModeButton: {
        border: "1px solid #6c63ff",
    },
    iconContainer: {
        fontSize: "40px",
        marginBottom: "10px",
    },
    modeLabel: {
        fontSize: 'var(--font-small)',
        fontWeight: 'var(--font-semibold)',
        color: "#333",
    },
};
export default ModeSelection