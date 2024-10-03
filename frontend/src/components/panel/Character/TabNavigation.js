import React from 'react';

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
                    <div style={styles.tabTitle}>
                        {tab}
                    </div>
                </button>
            ))}
        </div>
    );
};

const styles = {
    tabTitle: {
        fontSize: 'var(--font-small)',
    }
}

export default TabNavigation;
