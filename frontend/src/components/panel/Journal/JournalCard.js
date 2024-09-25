import React from 'react';
import TimeAgo from '../../TimeAgo';
import ToggleButton from '../../ToggleButton';
import EntryTag from '../../EntryTag';

const JournalCard = ({ title, content, createdAt, entryTag, onClick }) => {
    return (
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                {/* Title and EntryTag on the same line */}
                <div style={styles.titleWithTag}>
                    <strong style={styles.title}>{title}
                        <br></br>
                    </strong>
                    <div>
                        <EntryTag selectedMode={entryTag} size='large' hasBackground={false}> </EntryTag>
                        <span style={styles.time}>
                            <TimeAgo createdAt={createdAt} />
                        </span>
                    </div>
                </div>
                <div style={styles.iconWithText}>
                    <img src={'/tabs2.svg'} alt="icon" style={{ width: '14px' }} onClick={onClick} />
                </div>
            </div>
            <div style={styles.content}>{content}</div>
        </div >
    );
};

const styles = {
    card: {
        backgroundColor: 'var(--color-bg-lightpurple)',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 4px rgba(196, 196, 196, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        textAlign: 'left',
        width: '100%',
        margin: '0 auto 15px',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    titleWithTag: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start', // Keep title and entryTag aligned
        gap: '5px',
        flex: 1, // Allows the title to take up available space
    },
    title: {
        fontWeight: 'var(--font-bold)',
        fontSize: 'var(--font-large)',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        resize: 'vertical',
    },

    toggleButtonContainer: {
        position: 'relative',

    },
    iconWithText: {
        fontSize: 'var(--font-xs)',
        display: 'flex',
        flexDirection: 'column', // Stack the icon and the text vertically
        alignItems: 'center',
        cursor: 'pointer',
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
        fontWeight: 'var(--font-regular)',
        fontSize: 'var(--font-xs)',
        color: '#9b9b9b',
        marginLeft: '5px'
    },

    content: {
        fontSize: 'var(--font-medium)',
        color: '#555',
        marginTop: '10px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        // whiteSpace: "pre-line",

        display: '-webkit-box',
        WebkitLineClamp: 5,
        WebkitBoxOrient: 'vertical',
        textOverflow: 'ellipsis',
        textAlign: 'left',
        maxWidth: '100%',
        resize: 'vertical',


    },
};

export default JournalCard;
