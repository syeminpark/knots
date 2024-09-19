import React from 'react';
import TimeAgo from '../../TimeAgo';
import ToggleButton from '../../ToggleButton';

const JournalCard = ({ title, content, createdAt, entryTag, onClick }) => {
    return (
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                {/* Title and EntryTag on the same line */}
                <div style={styles.titleWithTag}>
                    <strong style={styles.title}>{title}
                        <br></br>
                        <span style={styles.entryTag}>{entryTag}</span>
                        <span style={styles.time}>
                            <TimeAgo createdAt={createdAt} />
                        </span>

                    </strong>
                </div>
                <div style={styles.toggleButtonContainer}>

                    <ToggleButton
                        expandable={false}
                        onClick={onClick}
                        size={'medium'}
                        direction={'right'}

                    />
                </div>
            </div>
            <div style={styles.content}>{content}</div>
        </div>
    );
};

const styles = {
    card: {
        backgroundColor: '#f7f7ff',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 4px 4px rgba(196, 196, 196, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: '15px',
        textAlign: 'left',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '5px',
    },
    titleWithTag: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start', // Keep title and entryTag aligned
        gap: '10px', // Adds spacing between title and entryTag
        flex: 1, // Allows the title to take up available space
    },
    title: {
        fontWeight: 'bold',
        fontSize: '18px',
    },
    entryTag: {
        paddingRight: "10px",
        borderRadius: '8px',
        fontSize: '14px',

        color: '#6c63ff',
        whiteSpace: 'nowrap', // Prevents wrapping of the entryTag
    },
    toggleButtonContainer: {
        position: 'relative',
        right: '-10px',
    },
    rightContent: {
        position: 'absolute',
        right: '10px',
        top: '50%',
        display: 'flex',
        flexDirection: 'column', // Align time above the toggle button
        alignItems: 'flex-end', // Align both time and toggle button to the right
    },
    time: {
        fontWeight: '400',
        fontSize: '12px',
        color: '#9b9b9b',
    },

    content: {
        fontSize: '16px',
        color: '#555',
        marginTop: '10px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: "pre-line",

        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        textOverflow: 'ellipsis',
        textAlign: 'left',
        maxWidth: '100%',


    },
};

export default JournalCard;
