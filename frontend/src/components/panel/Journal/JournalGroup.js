import { useState, useEffect } from 'react';
import TimeAgo from './TimeAgo';

const JournalGroup = (props) => {
    const { id, selectedMode, journalBookTitle, createdAt, children, } = props
    const [expandedGroup, setExpandedGroup] = useState({});


    const toggleEntry = (entryId) => {
        setExpandedGroup(prev => ({
            ...prev,
            [entryId]: !prev[entryId]
        }));
    }

    useEffect(() => {
        if (id === 'specific') {
            setExpandedGroup({ [id]: true });
        }
    }, [id])

    return (
        <div style={styles.journalEntry}>
            <div style={styles.entryHeader}>
                <span style={styles.entryTime}><TimeAgo createdAt={createdAt} /></span>
                <strong style={styles.entryTitle}>{journalBookTitle}</strong>
            </div>
            <div>
                <span style={{ ...styles.entryTag, ...styles.systemGenerated }}>{selectedMode}</span>
            </div>
            {id !== 'specific' && (
                <button style={styles.entryToggle} onClick={() => toggleEntry(id)}>
                    {expandedGroup[id] ? 'ʌ' : 'v'}
                </button>
            )}
            {expandedGroup[id] && (
                children
            )}
        </div>
    )
}


const styles = {
    journalEntry: {
        backgroundColor: '#f7f7ff',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        position: 'relative',
        marginBottom: '20px',
    },
    entryHeader: {
        display: 'flex',
        justifyContent: 'center',  // Center content horizontally
        alignItems: 'center',      // Center content vertically
        position: 'relative',      // Allow absolute positioning of the time element
        marginBottom: '10px',
        paddingLeft: '30px',
        paddingRight: '30px',

    },
    entryTitle: {
        fontWeight: 'bold',
        fontSize: '16px',
        whiteSpace: 'normal',      // Allow text to wrap to multiple lines
        overflow: 'hidden',        // Hide overflowed content
        display: '-webkit-box',    // Display as a webkit box to enable line clamping
        WebkitLineClamp: 3,        // Limit to 3 lines
        WebkitBoxOrient: 'vertical', // Set box orientation to vertical for clamping
        textOverflow: 'ellipsis',  // Add ellipsis for long text
        textAlign: 'left',       // Ensure the text is centered
        maxWidth: '100%',          // Allow the title to take up available space
        resize: 'vertical', // Allows the user to manually resize vertically
    },
    entryTime: {
        color: '#9b9b9b',
        fontSize: '10px',
        position: 'absolute',      // Absolute positioning to the right
        right: '0',                // Stick to the right edge of the container
        // Vertically center the time
        bottom: '0',
        whiteSpace: 'nowrap',      // Prevent wrapping of the time
    },
    entryTag: {
        padding: '5px 10px',
        borderRadius: '8px',
        fontSize: '12px',
        marginBottom: '10px',
        alignItems: 'center',
    },
    systemGenerated: {
        backgroundColor: '#f0eaff',
        color: '#6c63ff',
    },
    manual: {
        backgroundColor: '#e0eaff',
        color: '#6c63ff',
    },
    entryToggle: {
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '18px',
        color: 'gray',
        cursor: 'pointer',
        marginTop: '10px',
        alignSelf: 'center',
    },


}; export default JournalGroup
