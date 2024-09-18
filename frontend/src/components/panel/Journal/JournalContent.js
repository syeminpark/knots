import CharacterButton from "../../CharacterButton";
import openNewPanel from "../../openNewPanel";
import { getJournalBookInfoAndEntryByIds } from "./journalBookReducer";
import ToggleButton from "../../ToggleButton";

const JournalContent = (props) => {
    const { panels, setPanels, createdCharacter, content, journalBookUUID, journalEntryUUID, setSelectedBookAndJournalEntry, createdJournalBooks } = props;

    const onMoreButtonClick = () => {
        const journalBookInfoandJournalEntry = getJournalBookInfoAndEntryByIds(createdJournalBooks, journalBookUUID, journalEntryUUID);
        setSelectedBookAndJournalEntry(journalBookInfoandJournalEntry);
        console.log(journalBookInfoandJournalEntry, journalBookUUID, journalEntryUUID);
    };

    return (
        <div style={styles.expandedContent}>
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
                {/* Use the ToggleButton here, static mode */}
                <ToggleButton
                    expandable={false}  // This makes it a static button, not toggleable
                    direction="right"   // Specify the arrow direction (e.g., right for ">")
                    size="small"       // You can change the size to small, medium, or large
                    onClick={onMoreButtonClick}  // This will trigger the onMoreButtonClick function
                    text="More"
                />
            </div>

            <div style={styles.journalText}>
                {content}
            </div>
        </div >
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
        justifyContent: "space-between",
        marginBottom: "10px",
    },
    journalText: {
        color: '#333',
        fontSize: '14px',
        marginTop: "10px",
        backgroundColor: '#f0f0f0',
        padding: "15px",
        borderRadius: "5px",
        whiteSpace: "pre-line",
        overflowWrap: 'break-word',

    },
    profileButtonContainer: {
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        padding: "5px",
        backgroundColor: "transparent",
        border: "none",
    }
};

export default JournalContent;
