const TabNavigation = (props) => {
    const { tabs, activeTab, setActiveTab } = props;
    return (
        <div className="tabs">
            {tabs.map(tab => (
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
}

export default TabNavigation