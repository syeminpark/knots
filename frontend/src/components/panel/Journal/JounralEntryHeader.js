import React from 'react';
import TimeAgo from './TimeAgo';

const JournalEntryHeader = ({ title, createdAt, tag, onReturnClick }) => {
    return (
        <div style={styles.entryHeader}>
            {onReturnClick && (
                <button style={styles.returnButton} onClick={onReturnClick}>
                    {'<'}
                </button>
            )}
            <div>
                <span style={styles.entryTime}><TimeAgo createdAt={createdAt} /></span>
            </div>
            <strong style={styles.entryTitle}>{title}</strong>
            <div>
                <span style={{ ...styles.entryTag, ...styles.systemGenerated }}>{tag}</span>

            </div>
        </div>
    );
};

export default JournalEntryHeader;

const styles = {
    entryHeader: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        paddingLeft: '40px',
        paddingRight: '35px'

    },
    entryTitle: {
        fontWeight: 'var(--font-bold)',
        fontSize: 'var(--font-medium)',
        whiteSpace: 'normal',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        textOverflow: 'ellipsis',
        textAlign: 'center',
        maxWidth: '100%',

    },
    entryTime: {
        color: '#9b9b9b',
        fontSize: '10px',
        position: 'absolute',
        right: '15px',
        transform: 'translateY(-50%)',
    },
    entryTag: {
        padding: '5px 10px',
        fontSize: 'var(--font-xs)',
        borderRadius: '8px',
        fontWeight: 'var(--font-bold)',
    },
    systemGenerated: {
        backgroundColor: '#f0eaff',
        color: '#6c63ff',
    },
    returnButton: {
        position: 'absolute',
        left: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: 'var(--font-xl)',
        cursor: 'pointer',
        color: '#333',
        fontWeight: 'var(--font-bold)',
    },
};
