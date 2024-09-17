import React, { useState, useEffect } from "react";
import ModalOverlay from "../../ModalOverlay";
import ModeSelection from "./ModeSelection";
import SelectBox from "../../SelectBox";
import PostTextArea from "../../panel/Journal/PostTextArea";

const CreateJournalModal = (props) => {
    const { setShowModal, createdJournalBooks, dispatchCreatedJournalBooks, createdCharacters, dispatchCreatedCharacters } = props;
    const [selectedMode, setSelectedMode] = useState(null); // Keep track of the selected mode
    const [stage, setStage] = useState(0); // Keep track of the selected mode
    const [selectedCharacters, setSelectedCharacters] = useState([])
    const [journalBookPrompt, setJournalBookPrompt] = useState(null)

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
        setJournalBookPrompt(value)
    };
    const onAnyPostButtonClick = () => {
        if (createdCharacters.characters.length == 0) {
            alert('create a character first')
        }
        else if (selectedCharacters.length === 0) {
            alert('select a character')
        }
        else if (journalBookPrompt === null) {
            alert('write something')
        }
        else {
            dispatchCreatedJournalBooks({
                type: 'CREATE_JOURNAL_BOOK',
                payload: {
                    journalBookPrompt,
                    selectedMode,
                    selectedCharacters,
                }
            })
            console.log('selectedCharacters', selectedCharacters)
            const lastCreatedJournalBook = createdJournalBooks.lastCreatedJournalBook;
            if (lastCreatedJournalBook) {
                selectedCharacters.forEach((selectedCharacter) => {
                    const journalEntry = lastCreatedJournalBook.journalEntries.find(
                        (entry) => entry.ownerUUID === selectedCharacter.uuid
                    );
                    if (journalEntry) {
                        dispatchCreatedCharacters({
                            type: 'CREATE_NEW_JOURNAL',
                            payload: {
                                journalBookUUID: lastCreatedJournalBook.bookInfo.uuid,
                                journalBookPrompt,
                                selectedMode,
                                createdAt: lastCreatedJournalBook.bookInfo.createdAt,
                                journalEntryUUID: journalEntry.uuid,  // The specific journal entry for this character
                                characterUUID: selectedCharacter.uuid  // The character UUID
                            }
                        });
                    }
                });


            }
            if (selectedMode === "System Generate") {
                // 나중에 LLM Generate으로 변경 
            }
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

                        <h3 style={styles.subtitle}>📝 {selectedMode} Mode</h3>
                        <SelectBox
                            selectedCharacters={selectedCharacters}
                            setSelectedCharacters={setSelectedCharacters}
                            availableCharacters={createdCharacters.characters}
                            multipleSelect={false}
                        >
                        </SelectBox>
                        <br></br>
                        <div style={styles.scrollableContent}>
                            <PostTextArea
                                key={'journal'}
                                title={""}
                                placeholder={"What is on the character's mind?"}
                                attribute={journalBookPrompt}
                                onChange={(event) => { onChange(event.target.value) }}
                            ></PostTextArea>
                        </div>
                    </ModalOverlay >
                </div >
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

                        <h3 style={styles.subtitle}>🌟 {selectedMode} Mode</h3>
                        <SelectBox
                            selectedCharacters={selectedCharacters}
                            setSelectedCharacters={setSelectedCharacters}
                            availableCharacters={createdCharacters.characters}
                        ></SelectBox>
                        <br></br>
                        <div style={styles.scrollableContent}>
                            <PostTextArea
                                key={'journal'}
                                title={""}
                                placeholder={"What should the characters write about?"}
                                attribute={journalBookPrompt}
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
        maxHeight: '600px',        // Define the maximum height for the content
        overflowY: 'auto',         // Enable vertical scrolling
    }
}

export default CreateJournalModal;
