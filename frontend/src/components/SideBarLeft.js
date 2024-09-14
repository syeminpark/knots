import { v4 as uuidv4 } from 'uuid';
const SidebarLeft = (props) => {
    const { panels, setPanels } = props

    const onButtonClick = (type, uuid = uuidv4()) => {
        setPanels([...panels, {
            type: type, id: uuid,
        }])
    }
    return (
        < button className="sidebarLeft" onClick={() => { onButtonClick('journal') }}>
            <i className="sidebarLeft-title">Journal</i>
        </button >
    )
}

export default SidebarLeft