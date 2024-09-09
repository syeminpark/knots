import { useState } from 'react';
import ModalOverlay from '../ModalOverlay';
import SelectBox from '../SelectBox';

const AddConnectionModal = (props) => {
    const { setShowModal, connectedCharacters, setConnectedCharacters } = props;
    const [selectedCharacters, setSelectedCharacters] = useState([]);

    const allCharacters = ['Harry', 'Ron', 'Snape', 'R', 'Z', 'C',];

    const handleAddConnection = () => {
        if (selectedCharacters.length > 0) {
            console.log(`Adding connection to: ${selectedCharacters.join(', ')}`);
            let temp = []
            for (let character of selectedCharacters) {
                temp.push({ name: character, description: '' })
                console.log(temp)
            }
            setConnectedCharacters([...connectedCharacters, ...temp])
            setShowModal(false);
        }
    };

    return (
        <div>
            <ModalOverlay
                title="Add New Connection"
                setShowModal={setShowModal}
                footerButtonLabel="Add"
                onFooterButtonClick={handleAddConnection}
                isFooterButtonDisabled={selectedCharacters.length === 0}
            >
                <SelectBox selectedCharacters={selectedCharacters}
                    setSelectedCharacters={setSelectedCharacters}
                    allCharacters={allCharacters}
                >
                </SelectBox>
            </ModalOverlay>
        </div>
    );
};



export default AddConnectionModal;