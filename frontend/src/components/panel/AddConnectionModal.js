import { useState, useEffect } from 'react';
import ModalOverlay from '../ModalOverlay';
import SelectBox from '../SelectBox';
import { useTranslation } from 'react-i18next';

const AddConnectionModal = (props) => {
    const { t } = useTranslation();
    const { setShowModal, connectedCharacters, setConnectedCharacters, createdCharacters, caller } = props;
    const [selectedCharacters, setSelectedCharacters] = useState([]);
    console.log('caller', caller, createdCharacters)
    const handleAddConnection = () => {
        if (selectedCharacters.length > 0) {
            let temp = []
            for (let character of selectedCharacters) {
                temp.push({ name: character.name, uuid: character.uuid })
                console.log(temp)
            }
            setConnectedCharacters([...connectedCharacters, ...temp])
            setShowModal(false);
        }
    };

    return (

        <ModalOverlay
            title={t("addnewconnection")}
            setShowModal={setShowModal}
            footerButtonLabel="Add"
            onFooterButtonClick={handleAddConnection}
            isFooterButtonDisabled={selectedCharacters.length === 0}
        >
            <SelectBox
                selectedCharacters={selectedCharacters}
                setSelectedCharacters={setSelectedCharacters}
                availableCharacters={createdCharacters.characters.filter(createdCharacter =>
                    !connectedCharacters.some(connectedCharacter =>
                        connectedCharacter.uuid === createdCharacter.uuid
                    ) && (caller?.uuid ? createdCharacter.uuid !== caller.uuid : true))}

            >
            </SelectBox>
        </ModalOverlay>

    );
};



export default AddConnectionModal;