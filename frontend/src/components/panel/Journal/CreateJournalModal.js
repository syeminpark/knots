import React, { useState, useEffect } from "react";
import ModalOverlay from "../../ModalOverlay";
import ModeSelection from "./ModeSelection";
import SelectBox from "../../SelectBox";
import TextArea from "../../TextArea";

const CreateJournalModal = (props) => {
    const { setShowModal, createdJournalBooks, dispatchCreatedJournalBooks, createdCharacters, dispatchCreatedCharacters } = props;
    const [selectedMode, setSelectedMode] = useState(null); // Keep track of the selected mode
    const [stage, setStage] = useState(0); // Keep track of the selected mode
    const [selectedCharacters, setSelectedCharacters] = useState([]);
    const [journalBookText, setJournalBookText] = useState({ title: "", content: "" });
    let content = '';

    const nextButtonClick = () => {
        if (selectedMode) {
            console.log(`Selected mode: ${selectedMode}`);
            setStage(1);
        } else {
            alert('Please select a mode');
        }
    };

    const backArrowClick = () => {
        setStage(0);
    };

    const onChangeTitle = (value) => {
        setJournalBookText((prev) => ({ ...prev, title: value }));
    };

    const onChangeContent = (value) => {
        setJournalBookText((prev) => ({ ...prev, content: value }));
    };

    const onAnyPostButtonClick = () => {
        const characters = createdCharacters?.characters || [];

        if (characters.length === 0) {
            alert('Create a character first');
        } else if (selectedCharacters.length === 0) {
            alert('Please select a character');
        } else if (selectedMode === 'Manual Post' && journalBookText.title.trim() === "") {
            alert('Please write a title');
        } else if (selectedMode === 'Manual Post' && journalBookText.content.trim() === "") {
            alert('Please write something');
        } else if (selectedMode === 'System Generate' && journalBookText.title.trim() === "") {
            alert('Please write something');
        } else {
            if (selectedMode === "Manual Post") {
                content = journalBookText.content;
            } else {
                console.log("Perform API call for system generation");
            }

            dispatchCreatedJournalBooks({
                type: 'CREATE_JOURNAL_BOOK',
                payload: {
                    journalBookTitle: journalBookText.title,
                    journalBookContent: content,
                    selectedMode,
                    selectedCharacters,
                }
            });

            const lastCreatedJournalBook = createdJournalBooks?.lastCreatedJournalBook;
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
                                journalBookTitle: lastCreatedJournalBook.bookInfo.title,
                                selectedMode,
                                createdAt: lastCreatedJournalBook.bookInfo.createdAt,
                                journalEntryContent: content,
                                journalEntryUUID: journalEntry.uuid,
                                characterUUID: selectedCharacter.uuid,
                            }
                        });
                    }
                });
            }

            setShowModal(false);
        }
    };

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
                            availableCharacters={createdCharacters?.characters || []}
                            multipleSelect={false}
                        />
                        <br />
                        <div style={styles.scrollableContent}>
                            <div style={styles.attributeContainer}>
                                <div style={styles.sectionHeader}>
                                    <label style={styles.sectionHeaderLabel}>{""}</label>
                                </div>
                                <TextArea
                                    attribute={journalBookText.title}
                                    placeholder={"Title"}
                                    onChange={(event) => onChangeTitle(event.target.value)}
                                    styles={styles}
                                />
                                <TextArea
                                    attribute={journalBookText.content}
                                    placeholder={"What is on the character's mind?"}
                                    onChange={(event) => onChangeContent(event.target.value)}
                                    styles={styles}
                                />
                            </div>
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
                        <h3 style={styles.subtitle}>🌟 {selectedMode} Mode</h3>
                        <SelectBox
                            selectedCharacters={selectedCharacters}
                            setSelectedCharacters={setSelectedCharacters}
                            availableCharacters={createdCharacters?.characters || []}
                        />
                        <br />
                        <div style={styles.scrollableContent}>
                            <div style={styles.attributeContainer}>
                                <div style={styles.sectionHeader}>
                                    <label style={styles.sectionHeaderLabel}>{""}</label>
                                </div>
                                <TextArea
                                    attribute={journalBookText.title}
                                    placeholder={"What should the characters write about?"}
                                    onChange={(event) => onChangeTitle(event.target.value)}
                                    styles={styles}
                                />
                            </div>
                        </div>
                    </ModalOverlay>
                </div>
            )
        ) : null
    );
};

const styles = {
    attributeContainer: {
        backgroundColor: '#f0f0ff',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px',
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    sectionHeaderLabel: {
        color: '#6d6dff',
        fontSize: '16px',
        fontWeight: 'bold'
    },
    description: {
        width: '100%',
        minHeight: '100%',
        height: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        backgroundColor: 'white',
        fontSize: '14px',
        resize: 'vertical',
        overflow: 'hidden',
    },
    subtitle: {
        color: "#6c63ff",
        fontSize: "16px",
        fontWeight: "500",
        marginBottom: "20px",
        textAlign: "center",
    },
    subtitleContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollableContent: {
        maxHeight: '600px',
        overflowY: 'auto',
    }
};

export default CreateJournalModal;
