import React, { useState, useEffect } from "react";

import TimeAgo from '../../TimeAgo';
import Comment from "./Comment";
import BottomActions from "./BottomActions";
import DetailedJournalPost from "./DetailedJournalPost";


const DetailedJournal = (props) => {
    const {
        panels,
        setPanels,
        selectedBookAndJournalEntry,
        setSelectedBookAndJournalEntry,
        createdCharacters,
        dispatchCreatedCharacters,
        dispatchCreatedJournalBooks,
    } = props;

    const [selectedCharacters, setSelectedCharacters] = useState([]);

    const createdCharacter = createdCharacters.characters.find(character => character.uuid === selectedBookAndJournalEntry.journalEntry.ownerUUID);
    const { bookInfo, journalEntry } = selectedBookAndJournalEntry;

    return (
        <div style={styles.container}>
            {/* Journal Entry Section */}
            <div style={styles.journalEntry}>
                <div style={styles.entryHeader}>
                    <div>
                        <strong style={styles.entryTitle}>{bookInfo.title}</strong>
                        <span style={styles.entryTime}><TimeAgo createdAt={bookInfo.createdAt} /></span>
                    </div>
                    <div>
                        <span style={{ ...styles.entryTag, ...styles.systemGenerated }}>{bookInfo.selectedMode}</span>
                    </div>
                </div>

                <DetailedJournalPost
                    panels={panels}
                    setPanels={setPanels}
                    createdCharacter={createdCharacter}
                    selectedBookAndJournalEntry={selectedBookAndJournalEntry}
                    setSelectedBookAndJournalEntry={setSelectedBookAndJournalEntry}
                    dispatchCreatedJournalBooks={dispatchCreatedCharacters}
                >

                </DetailedJournalPost>
                <div style={styles.commentIcon}>
                    <p> 💬 Comments</p>
                </div>
            </div>
            <div style={styles.commentContainer}>

                <Comment></Comment>


            </div>

            {/* Bottom Section with Character Selection and Comment Input */}
            <div style={styles.bottom}>
                <BottomActions
                    selectedCharacters={selectedCharacters}
                    setSelectedCharacters={setSelectedCharacters}
                    createdCharacters={createdCharacters}></BottomActions>
            </div>
        </div >
    );
};

const styles = {
    container: {
        backgroundColor: '#ffffff',
        width: '100%',
        height: '98%',
        marginTop: '10px',
        display: 'flex',
        flexDirection: 'column', // Add flexbox to the container
        position: 'relative',
        borderRadius: '8px',
        boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.3)',
        flexGrow: 1, // Allow the journal entry section to take the remaining space
        overflowY: 'auto', // Enable scrolling if the content is too long

    },
    journalEntry: {

    },
    entryHeader: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: '10px',
        backgroundColor: '#f7f7ff',
        padding: '10px 15px',
        borderRadius: '8px 8px 0 0',
        fontSize: '16px',
    },
    entryTitle: {
        fontWeight: 'bold',
        fontSize: '16px',
        whiteSpace: 'normal',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        textOverflow: 'ellipsis',
        textAlign: 'left',
        maxWidth: '100%',
        resize: 'vertical',
    },

    entryTime: {
        color: '#9b9b9b',
        fontSize: '12px',
        position: 'absolute',
        right: '15px',
        top: '0%',
        transform: 'translateY(50%)',
        whiteSpace: 'nowrap',
    },
    entryTag: {
        padding: '5px 10px',
        borderRadius: '8px',
        fontSize: '12px',
        marginBottom: '10px',
        alignItems: 'center',
        fontWeight: 'bold',
    },
    systemGenerated: {
        backgroundColor: '#f0eaff',
        color: '#6c63ff',
    },

    commentIcon: {
        marginTop: '15px',
        marginLeft: '15px',
        fontSize: '14px',
        textAlign: 'left',
        fontWeight: 'bold',
    },

    commentContainer: {
        paddingLeft: "20px",
        paddingRight: "20px",
        marginBottom: '300px'
    },
    bottom: {
        backgroundColor: '#f7f7ff',
        padding: '10px',
        width: '100%',
        position: 'sticky',
        bottom: 0, // Position at the bottom of the container
    },

};

export default DetailedJournal