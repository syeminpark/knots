import { v4 as uuidv4 } from 'uuid';

const openNewPanel = (panels, setPanels, type, caller = null, uuid = uuidv4()) => {
    setPanels([...panels, {
        type: type, id: uuid, caller: caller
    }])
}

export default openNewPanel