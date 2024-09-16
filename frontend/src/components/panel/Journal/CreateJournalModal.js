import React, { useState } from "react";
import ModalOverlay from "../../ModalOverlay";
import ModeSelection from "./ModeSelection";
import SelectBox from "../../SelectBox";
import PostTextArea from "../../panel/Journal/PostTextArea";
import { v4 as uuidv4 } from 'uuid';

const CreateJournalModal = (props) => {
    const { setShowModal, createdCharacters, createdJournalBooks, setCreatedJournalBooks } = props;
    const [selectedMode, setSelectedMode] = useState(null); // Keep track of the selected mode
    const [stage, setStage] = useState(0); // Keep track of the selected mode
    const [selectedCharacters, setSelectedCharacters] = useState([])
    const [journalPrompt, setJournalPrompt] = useState(null)

    const nextButtonClick = () => {
        if (selectedMode) {
            console.log(`Selected mode: ${selectedMode}`);
            setStage(1)
            // You can handle the next step here based on the selected mode.
        } else {
            alert('select a mode')
        }
    }
    const backArrowClick = () => {
        setStage(0)
    }
    const onChange = (value) => {
        setJournalPrompt(value)
    };
    const onAnyPostButtonClick = () => {
        if (createdCharacters.length == 0) {
            alert('create a character first')
        }
        else if (selectedCharacters.length === 0) {
            alert('select a character')
        }
        else if (journalPrompt === null) {
            alert('write something')
        }
        else {
            let newJournalBook = {
                id: uuidv4(),
                journalPrompt: journalPrompt,
                selectedMode: selectedMode,
                createdAt: Date.now(),
                selectedCharacters: selectedCharacters,
                journalEntries: selectedCharacters.map(characterName => ({
                    id: uuidv4(),
                    ownerName: characterName,
                    content: journalPrompt,
                }))
            };
            console.log('new Journal', newJournalBook);
            if (selectedMode === "System Generate") {
                // 나중에 LLM Generate으로 변경 
            }
            setCreatedJournalBooks([...createdJournalBooks, newJournalBook]);
            setShowModal(false)
        }
    }

    return (
        stage === 0 ? (
            <ModalOverlay
                title="Create New Journal"
                setShowModal={setShowModal}
                footerButtonLabel="Next"
                onFooterButtonClick={nextButtonClick}
            >
                <div style={styles.subtitleContainer}>
                    <h3 style={styles.subtitle}>Select a Mode</h3>
                </div>

                <ModeSelection
                    selectedMode={selectedMode}
                    setSelectedMode={setSelectedMode}
                />
            </ModalOverlay>
        ) : stage === 1 ? (
            selectedMode === "Manual Post" ? (
                <div>
                    <ModalOverlay
                        title="Create New Journal"
                        setShowModal={setShowModal}
                        showBackArrow={true}
                        onBackArrowClick={backArrowClick}
                        footerButtonLabel="Post"
                        onFooterButtonClick={onAnyPostButtonClick}
                    >
                        <div style={styles.scrollableContent}>
                            <h3 style={styles.subtitle}>✍️ {selectedMode} Mode</h3>
                            <SelectBox
                                selectedCharacters={selectedCharacters}
                                setSelectedCharacters={setSelectedCharacters}
                                allCharacters={createdCharacters.map(character => character.name)}
                            >
                            </SelectBox>
                            <br></br>
                            <PostTextArea
                                key={'journal'}
                                title={""}
                                placeholder={"What is on the character's mind?"}
                                attribute={journalPrompt}
                                onChange={(event) => { onChange(event.target.value) }}
                            ></PostTextArea>
                        </div>
                    </ModalOverlay>
                </div>
            ) : (
                <div>
                    <ModalOverlay
                        title="Create New Journal"
                        setShowModal={setShowModal}
                        footerButtonLabel="Generate"
                        showBackArrow={true}
                        onBackArrowClick={backArrowClick}
                        onFooterButtonClick={onAnyPostButtonClick}
                    >

                        <h3 style={styles.subtitle}>🔧 {selectedMode} Mode</h3>
                        <SelectBox
                            selectedCharacters={selectedCharacters}
                            setSelectedCharacters={setSelectedCharacters}
                            allCharacters={createdCharacters.map(character => character.name)}
                        ></SelectBox>
                        <br></br>
                        <div style={styles.scrollableContent}>
                            <PostTextArea
                                key={'journal'}
                                title={""}
                                placeholder={"What should the characters write about?"}
                                attribute={journalPrompt}
                                onChange={(event) => { onChange(event.target.value) }}
                            ></PostTextArea>
                        </div>
                    </ModalOverlay>
                </div>
            )
        ) : null
    );
};

const styles = {
    subtitle: {
        color: "#6c63ff",
        fontSize: "16px",
        fontWeight: "500",
        marginBottom: "20px",
        textAlign: "center",
        // backgroundColor: '#f0eaff',
        // borderRadius: '6px',
        // width: 'auto',
        // paddingRight: '10px',
        // paddingLeft: '10px'
    },
    subtitleContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollableContent: {
        maxHeight: '800px',        // Define the maximum height for the content
        overflowY: 'auto',         // Enable vertical scrolling
    }
}

export default CreateJournalModal;
