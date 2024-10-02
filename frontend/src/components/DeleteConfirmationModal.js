import React from 'react';

const DeleteConfirmationModal = ({ title, children, setShowModal }) => {
    return (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
            <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div style={styles.modalHeader}>
                    <h2 className="header-title">{title}</h2>
                    <button className="close-btn" onClick={() => setShowModal(false)}>✖</button>
                </div>
                {/* Modal Content */}
                <div style={styles.modalContent}>{children}</div>
            </div>
        </div>
    );
};

const styles = {
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalBox: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        width: '95%',
        maxWidth: '500px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        position: 'relative',
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
        fontSize: 'var(--font-small)',
    },
    modalContent: {
        marginBottom: '10px',
        maxHeight: '70vh',
        overflowY: 'auto',
        textAlign: 'center', // Center-align the text
    },
};

export default DeleteConfirmationModal;
