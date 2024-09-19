import React, { useState } from 'react';

const TabNavigation = ({ tabs, activeTab, setActiveTab }) => {

    const getSliderPosition = () => {
        return activeTab === tabs[0] ? 'translateX(0%)' : 'translateX(100%)';
    };

    return (
        <div className="tabs">
            {/* Sliding background */}
            <div
                className="tab-slider"
                style={{ transform: getSliderPosition() }}
            ></div>

            {/* Tab buttons */}
            {tabs.map((tab) => (
                <button
                    key={tab}
                    className={`tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default TabNavigation;
