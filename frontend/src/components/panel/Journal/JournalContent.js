import CharacterButton from "../../CharacterButton";
import openNewPanel from "../../openNewPanel";
import { getJournalBookInfoAndEntryByIds } from "./journalBookReducer";
import ToggleButton from "../../ToggleButton";
import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { m } from "framer-motion";

const JournalContent = forwardRef((props, ref) => {
    const { t } = useTranslation();
    const { panels, setPanels, createdCharacter, content, journalBookUUID, journalEntryUUID, setSelectedBookAndJournalEntry, createdJournalBooks, setTrackingJournalEntry, createdCharacters } = props;
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

    const characterUUIDsWhoCommented = new Set();
    journalBookInfoandJournalEntry?.journalEntry?.commentThreads?.forEach(thread => {
        thread?.comments.forEach(comment => {
            characterUUIDsWhoCommented.add(comment?.ownerUUID);
        });
    });
    console.log(characterUUIDsWhoCommented)


    // Get the character objects from createdCharacters that match the UUIDs
    const charactersWhoCommented = Array.from(characterUUIDsWhoCommented).map(ownerUUID =>
        createdCharacters?.characters?.find(character => character.uuid === ownerUUID)
    ).filter(Boolean); // Filter out any undefined values
    console.log(charactersWhoCommented)

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
                    size="large" // You can change the size to small, medium, or large
                    onClick={onMoreButtonClick}  // This will trigger the onMoreButtonClick function
                ></ToggleButton>
            </div>

            <div style={styles.journalText}>
                {content}

            </div>
            {/* Display CharacterButtons for all characters who commented */}
            <div style={styles.toggleContainer}>
                <ToggleButton
                    expandable={false}  // This makes it a static button, not toggleable
                    direction="right"   // Specify the arrow direction (e.g., right for ">")
                    size="medium"       // You can change the size to small, medium, or large
                    onClick={onMoreButtonClick}  // This will trigger the onMoreButtonClick function
                    icon={'💬'}
                    text={t('seeComments', {
                        totalComments
                    })}
                />
            </div>

            <div style={styles.charactersWhoCommented}
                onClick={onMoreButtonClick}>
                {charactersWhoCommented.map(character => (
                    <CharacterButton
                        key={character.uuid}
                        createdCharacter={character}
                        panels={panels}
                        setPanels={setPanels}
                        iconStyle={styles.iconStyle}
                        textStyle={styles.textStyle}
                        containerStyle={styles.containerStyle}
                    />
                ))}
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

        padding: '15px 0px 10px'

    },
    profileButtonContainer: {
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        padding: "5px",
        backgroundColor: "transparent",
        border: "none",
    },
    charactersWhoCommented: {
        display: 'flex',
        flexWrap: 'wrap',
        cursor: "pointer",
        gap: '5px',
    },
    iconStyle: {
        width: '20px',
        height: '20px',
        opacity: 0.5,
        filter: 'grayscale(100%)',  // Apply black-and-white effect
        marginLeft: '5px',
    },
    textStyle: {
        fontSize: 'var(--font-xs)',
        marginRight: '15px',
        color: 'gray',

    },
    containerStyle: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        flexGrow: 0

    }
};

export default JournalContent;