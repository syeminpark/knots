import React from 'react';

const arrowDirections = {
    up: '▲',
    down: '▼',
    left: '◀',
    right: '▶',
};

const sizeStyles = {
    small: { fontSize: '12px' },
    medium: { fontSize: '14px' },
    large: { fontSize: '24px' },
};

const ToggleButton = ({ expandable, expanded, onClick, direction = 'right', size = 'medium', text, icon, svgFilePath }) => {
    const sizeStyle = sizeStyles[size] || sizeStyles.medium; // Default to medium if an unknown size is provided

    const getTextPositionStyle = () => {
        if (text)
            switch (direction) {
                case 'up':
                    return { flexDirection: 'column-reverse' };
                case 'down':
                    return { flexDirection: 'column' };
                case 'left':
                    return { flexDirection: 'row-reverse' };
                case 'right':
                default:
                    return { flexDirection: 'row' };
            }
    };

    return (
        <div style={{ ...styles.container, ...getTextPositionStyle(), ...sizeStyle }}>
            <button onClick={onClick} style={{ ...styles.button, ...sizeStyle }}>
                {text && <span style={{ ...styles.text, ...sizeStyle }}>{text}</span>}
                {svgFilePath ? (
                    <>
                        <img src={svgFilePath} alt="icon" style={{ ...styles.svgIcon, ...sizeStyle }} />
                        <span>
                            open
                        </span>
                    </>

                ) : icon ? (
                    <span style={{ ...sizeStyle }}>{icon}</span>  // Render the icon (like emoji)
                ) : (
                    expandable ? (expanded ? '▲' : '▼') : arrowDirections[direction]
                )}
            </button>
        </div >
    );
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'transparent',
        border: 'none',
        color: 'gray',
        cursor: 'pointer',
        alignSelf: 'center',
    },
    text: {
        marginRight: '5px',
        color: 'gray', // Match button color
    },
    svgIcon: {

        width: '24px', // Default SVG size
        height: '24px',
    },
};

export default ToggleButton;
