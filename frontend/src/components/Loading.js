import React from 'react';


const Loading = ({ text }) => {


    return (
        <div className="loading-overlay">
            <div className="spinner"></div>
            <p className="loading-text">{text}</p>
        </div>
    );
};

export default Loading;
