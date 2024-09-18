import { v4 as uuidv4 } from 'uuid';

const openNewPanel = (panels, setPanels, type, caller = null, reference = null, uuid = uuidv4()) => {
    setPanels([...panels, {
        type: type, id: uuid, caller: caller, reference: reference
    }])
}

export default openNewPanel