import ToggleButton
    from "./ToggleButton";
const ModalOverlay = (props) => {
    const { title, children, setShowModal, footerButtonLabel, onFooterButtonClick, onBackArrowClick, showBackArrow } = props;

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalBox}>
                {/* Modal Header */}
                <div style={styles.modalHeader}>
                    {showBackArrow && (
                        <ToggleButton
                            onClick={onBackArrowClick}
                            direction="left"
                        ></ToggleButton>
                    )}
                    <h2 className="header-title">{title}</h2>
                </div>
                <div className="x-more-button-container">
                    <button className="close-btn" onClick={() => setShowModal(false)}>✖</button>
                </div>
                {/* Modal Content */}
                <div style={styles.modalContent}>{children}</div>
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

// Updated styles
const styles = {
    modalOverlay: {
        position: 'absolute',  // Position the modal relative to the parent panel
        top: '50%',            // Center the modal vertically in the panel
        left: '50%',           // Center the modal horizontally in the panel
        transform: 'translate(-50%, -50%)',  // Adjusts for the modal's own width/height
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        width: '100%',
        height: '100',
    },
    modalBox: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        width: '95%',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        position: 'relative',
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: '10px',
        fontSize: '14px',

    },
    modalContent: {
        marginBottom: '20px',
        position: 'relative',
        maxHeight: '70vh',
        overflowY: 'auto',
    },
    modalFooter: {
        textAlign: 'center',
    },
    modalDoneBtn: {
        backgroundColor: 'black',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
    },
};

export default ModalOverlay;