import { useState, useEffect } from 'react';
import calculateTimeAgo from './CaluclateTimeAgo';

const JournalGroup = (props) => {
    const { selectedMode, journalBookPrompt, createdAt, children } = props
    const [timeAgo, setTimeAgo] = useState('');
    const [expandedGroup, setExpandedGroup] = useState({});

    useEffect(() => {
        const updateAgo = () => setTimeAgo(calculateTimeAgo(createdAt));
        updateAgo(); // Initial calculation
        const interval = setInterval(updateAgo, 60000); // Recalculate every minute
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [createdAt]);

    const toggleEntry = (entryId) => {
        setExpandedGroup(prev => ({
            ...prev,
            [entryId]: !prev[entryId]
        }));
    }

    return (
        <div style={styles.journalEntry}>
            <div style={styles.entryHeader}>
                <strong style={styles.entryTitle}>{journalBookPrompt}</strong>
                <span style={styles.entryTime}>{timeAgo}</span>
            </div>
            <div>
                <span style={{ ...styles.entryTag, ...styles.systemGenerated }}>{selectedMode}</span>
            </div>
            {/* Toggle Button */}
            <button style={styles.entryToggle} onClick={() => toggleEntry('entry1')}>
                {expandedGroup['entry1'] ? 'ʌ' : 'v'} {/* Toggle icon based on state */}
            </button>

            {/* Conditionally render expanded view */}
            {expandedGroup['entry1'] && (
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
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        textAlign: 'center',
        position: 'relative',
    },
    entryHeader: {
        display: 'flex',
        justifyContent: 'center',  // Center content horizontally
        alignItems: 'center',      // Center content vertically
        position: 'relative',      // Allow absolute positioning of the time element
        marginBottom: '10px',
        paddingLeft: '30px',
        paddingRight: '30px'
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
        textAlign: 'center',       // Ensure the text is centered
        maxWidth: '100%',          // Allow the title to take up available space
    },
    entryTime: {
        color: '#9b9b9b',
        fontSize: '12px',
        position: 'absolute',      // Absolute positioning to the right
        right: '0',                // Stick to the right edge of the container
        top: '50%',                // Vertically center the time
        transform: 'translateY(-50%)',  // Adjust for vertical centering
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
