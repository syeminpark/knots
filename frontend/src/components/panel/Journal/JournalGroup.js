import { useState } from 'react';
      const JournalGroup= (props) => {
        const {type,journalEntry}=props
        const [expandedGroup, setExpandedGroup] = useState({}); 
        const toggleEntry = (entryId) => {
            setExpandedGroup(prev => ({
                ...prev,
                [entryId]: !prev[entryId] 
            }));
        };


        return(

      <div style={styles.journalEntry}>
      <div style={styles.entryHeader}>
          <strong style={styles.entryTitle}>{journalEntry}</strong>
          <span style={styles.entryTime}>1h</span>
      </div>
      <div>
          <span style={{ ...styles.entryTag, ...styles.systemGenerated }}>{type}</span>
      </div>
      {/* Toggle Button */}
      <button style={styles.entryToggle} onClick={() => toggleEntry('entry1')}> 
          {expandedGroup['entry1'] ? 'ʌ' : 'v'} {/* Toggle icon based on state */}
      </button>

      {/* Conditionally render expanded view */}
      {expandedGroup['entry1'] && (
          <div style={styles.expandedContent}>
              {/* Expanded content UI based on your image */}
              <div style={styles.expandedHeader}>
                  <div style={styles.avatar}></div>
                  <div>
                      <strong>Ron</strong> | <span style={styles.systemGenerated}>System Generated</span>
                  </div>
              </div>
              <p style={styles.journalText}>
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut..."
                  <span style={styles.moreLink}>more</span>
              </p>
          </div>
      )}
  </div>
)}
    

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
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    entryTitle: {
        fontWeight: 'bold',
        fontSize: '16px',
        flexGrow: 1,
    },
    entryTime: {
        color: '#9b9b9b',
        fontSize: '12px',
        marginLeft: '10px',
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
    expandedContent: {
        marginTop: '15px',
        backgroundColor: '#ffffff',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        textAlign: 'left',
    },
    expandedHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
    },
    journalText: {
        color: '#333',
        fontSize: '14px',
        marginTop: '10px',
        backgroundColor: '#f0f0f0',
        padding: '10px',
        borderRadius: '5px',
    },
    moreLink: {
        color: '#9b9b9b',
        cursor: 'pointer',
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#b3b3ff',
        marginRight: '10px',
    },
    
};export default JournalGroup
