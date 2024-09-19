
import openNewPanel from './openNewPanel';

const SidebarLeft = (props) => {
    const { panels, setPanels } = props;

    return (
        <button className="sidebarLeft" onClick={() => { openNewPanel(panels, setPanels, 'journal') }}>
            <span className="journal-icon"></span>
            <span className="sidebarLeft-title">Journal</span>
        </button>
    );
}

export default SidebarLeft;
