const TabNavigation = ({ tabs, activeTab, setActiveTab }) => {

    const getSliderPosition = () => {
        return activeTab === tabs[0].key ? 'translateX(0%)' : 'translateX(100%)';
    };

    return (
        <div className="tabs">
            {/* Sliding background */}
            <div
                className="tab-slider"
                style={{ transform: getSliderPosition() }}
            ></div>

            {/* Tab buttons */}
            {tabs.map(({ key, label }) => (
                <button
                    key={key}
                    className={`tab ${activeTab === key ? 'active' : ''}`}
                    onClick={() => setActiveTab(key)}
                >
                    <div style={styles.tabTitle}>
                        {label}
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
};

export default TabNavigation;
