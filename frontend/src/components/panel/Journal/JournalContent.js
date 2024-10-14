import CharacterButton from "../../CharacterButton";
import openNewPanel from "../../openNewPanel";
import { getJournalBookInfoAndEntryByIds } from "./journalBookReducer";
import ToggleButton from "../../ToggleButton";
import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

const JournalContent = forwardRef((props, ref) => {
    const { t } = useTranslation();
    const { panels, setPanels, createdCharacter, content, journalBookUUID, journalEntryUUID, setSelectedBookAndJournalEntry, createdJournalBooks, setTrackingJournalEntry } = props;
    const journalBookInfoandJournalEntry = getJournalBookInfoAndEntryByIds(createdJournalBooks, journalBookUUID, journalEntryUUID);
    const totalComments = journalBookInfoandJournalEntry?.journalEntry?.commentThreads?.reduce((total, thread) => {
        return total + (thread.comments?.length || 0); // Sum the length of the comments array
    }, 0) || 0; // Default to 0 if there are no threads or comments


    const onMoreButtonClick = () => {
        const journalBookInfoandJournalEntry = getJournalBookInfoAndEntryByIds(createdJournalBooks, journalBookUUID, journalEntryUUID);
        setSelectedBookAndJournalEntry(journalBookInfoandJournalEntry);
        setTrackingJournalEntry(journalEntryUUID);
        console.log(journalBookInfoandJournalEntry)
    };

    return (
        <div style={styles.expandedContent} ref={ref}>
            <div style={styles.expandedHeader}>
                <button
                    style={styles.profileButtonContainer}
                    key={createdCharacter?.uuid}
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
                    size="medium"       // You can change the size to small, medium, or large
                    onClick={onMoreButtonClick}  // This will trigger the onMoreButtonClick function
                ></ToggleButton>
            </div>

            <div style={styles.journalText}>
                {content}

            </div>
            <div style={styles.toggleContainer}>
                <ToggleButton
                    expandable={false}  // This makes it a static button, not toggleable
                    direction="left"   // Specify the arrow direction (e.g., right for ">")
                    size="small"       // You can change the size to small, medium, or large
                    onClick={onMoreButtonClick}  // This will trigger the onMoreButtonClick function
                    icon={'💬'}
                    text={t('seeComments', {
                        totalComments
                    })}
                />
            </div>
        </div >
    );
});

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
        fontSize: 'var(--font-small)',
        lineHeight: 'var(--line-height)',
        marginTop: "10px",
        backgroundColor: 'var(--color-bg-grey)',
        padding: "15px",
        borderRadius: "5px",
        whiteSpace: "pre-line",
        wordBreak: "break-word",
    },
    toggleContainer: {
        padding: "15px",
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