
import openNewPanel from './openNewPanel';
import { useTranslation } from 'react-i18next';

const SidebarLeft = (props) => {
    const { panels, setPanels } = props;
    const { t } = useTranslation();

    return (
        <button className="sidebarLeft" onClick={() => { openNewPanel(panels, setPanels, 'journal') }}>
            <span className="journal-icon"></span>

            <span className="sidebarLeft-title"> {t('journalfeed')} </span>
        </button>
    );
}

export default SidebarLeft;
