
const ModalOverlay = ({ title, children, setShowModal, footerButtonLabel, onFooterButtonClick }) => {
    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalBox}>
                {/* Modal Header */}
                <div style={styles.modalHeader}>
                    <h2 className='header-title'>{title}</h2>
                </div>
                <div className="x-more-button-container">
                    <button className='close-btn'
                        onClick={() => { setShowModal(false) }}>
                        ✖
                    </button>
                </div>

                {/* Modal Content */}
                <div style={styles.modalContent}>
                    {children}
                </div>

                {/* Modal Footer */}
                <div style={styles.modalFooter}>
                    <button style={styles.modalDoneBtn} onClick={onFooterButtonClick}>
                        {footerButtonLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Styles for the modal (you can convert this to CSS if needed)
const styles = {
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalBox: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        width: '800px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        position: 'relative',
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: '20px',
    },
    modalContent: {
        marginBottom: '20px',
    },
    modalFooter: {
        textAlign: 'center',
    },
    modalDoneBtn: {
        backgroundColor: '#6C63FF',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
};

export default ModalOverlay