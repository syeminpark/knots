import CharacterButton from "../../CharacterButton";
import openNewPanel from "../../openNewPanel";


const JournalContent = (props) => {
    const { panels, setPanels, createdCharacter, content, journalBookID, journalEntryID, setSelectedJournal } = props;

    const onMoreButtonClick = () => {
        setSelectedJournal({ journalBookID, journalEntryID })

    }
    return (
        <div style={styles.expandedContent}>
            {/* Expanded content UI based on your image */}
            <div style={styles.expandedHeader}>
                <button
                    style={styles.profileButtonContainer}
                    key={createdCharacter.uuid}
                    onClick={() => {
                        openNewPanel(panels, setPanels, "character-profile", createdCharacter);
                    }}
                >
                    <CharacterButton
                        panels={panels}
                        setPanels={setPanels}
                        createdCharacter={createdCharacter}
                    />
                </button>
                <button style={styles.arrowButton} onClick={() => { onMoreButtonClick() }}> {'>'}</button>
            </div>

            <div style={styles.journalText} onClick={() => { onMoreButtonClick() }}>
                {content}
            </div>
        </div>
    );
};

const styles = {
    expandedContent: {
        marginTop: "15px",
        backgroundColor: "#ffffff",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        textAlign: "left",
    },
    expandedHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // To push the arrow to the right
        marginBottom: "10px",
    },
    journalText: {
        color: "black",
        fontSize: "16px",
        marginTop: "10px",
        backgroundColor: "#f0f0f0",
        padding: "20px",
        borderRadius: "5px",
        whiteSpace: "pre-line", // Preserves paragraph and line breaks
        cursor: "pointer", // Make the text area clickable
    },
    profileButtonContainer: {
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        padding: "5px",
        backgroundColor: "transparent",
        border: "none",
    },
    arrowButton: {
        cursor: "pointer",
        backgroundColor: "transparent",
        border: "none",
        fontSize: "20px", // Adjust the size of the arrow
        fontWeight: 'bold',
        color: "#9b9b9b", // Adjust the color of the arrow
    }
};

export default JournalContent;
