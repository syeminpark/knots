
import openNewPanel from './openNewPanel';

const SidebarLeft = (props) => {
    const { panels, setPanels } = props;

    return (
        <button className="sidebarLeft" onClick={() => { openNewPanel(panels, setPanels, 'journal') }}>
            <span className="journal-icon"></span>
            <i className="sidebarLeft-title">Journal</i>
        </button>
    );
}

export default SidebarLeft;
