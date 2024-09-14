
const ModeSelection = (props) => {
    const { selectedMode, setSelectedMode } = props

    const handleModeSelect = (mode) => {
        setSelectedMode(mode);
    };

    return (
        <div style={styles.modeSelectionContainer}>
            <div style={styles.modeButtons}>
                {/* Manual Post Mode */}
                <div
                    style={{
                        ...styles.modeButton,
                        ...(selectedMode === "Manual Post" ? styles.selectedModeButton : {}),
                    }}
                    onClick={() => handleModeSelect("Manual Post")}
                >
                    <div style={styles.iconContainer}>
                        <i className="icon">✍️</i>
                    </div>
                    <span style={styles.modeLabel}>Manual Post</span>
                </div>

                {/* System Generate Mode */}
                <div
                    style={{
                        ...styles.modeButton,
                        ...(selectedMode === "System Generate" ? styles.selectedModeButton : {}),
                    }}
                    onClick={() => handleModeSelect("System Generate")}
                >
                    <div style={styles.iconContainer}>
                        <i className="icon">🔧</i>
                    </div>
                    <span style={styles.modeLabel}>System Generate</span>
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
        width: "120px",
        height: "120px",
        backgroundColor: "#f7f7ff",
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
        fontSize: "14px",
        color: "#333",
    },
};
export default ModeSelection