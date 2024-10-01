import React, { useState, useEffect } from "react";
import ModalOverlay from "../../ModalOverlay";
import ModeSelection from "./ModeSelection";
import SelectBox from "../../SelectBox";
import TextArea from "../../TextArea";
import apiRequest from "../../../utility/apiRequest";
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';

const CreateJournalModal = (props) => {
    const { t } = useTranslation();
    const { setShowModal, createdJournalBooks, dispatchCreatedJournalBooks, createdCharacters, dispatchCreatedCharacters } = props;
    const [selectedMode, setSelectedMode] = useState(null); // Keep track of the selected mode
    const [stage, setStage] = useState(0); // Keep track of the selected mode
    const [selectedCharacters, setSelectedCharacters] = useState([]);
    const [journalBookText, setJournalBookText] = useState({ title: "", content: "" });
    const [contentPlaceholder, setContentPlaceholder] = useState("");
    const [loading, setLoading] = useState(false); // Loading state to handle API or heavy data fetching

    const nextButtonClick = () => {
        if (selectedMode) {
            setStage(1);
        } else {
            alert(t('pleaseSelectMode'));
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

    useEffect(() => {
        if (selectedCharacters.length > 0) {
            const characterNames = selectedCharacters
                .map(character => `'${character.name}'`) // Add single quotes around each name
                .join(', ');
            setContentPlaceholder(characterNames);
        }
    }, [selectedCharacters]);

    const onAnyPostButtonClick = async () => {
        const characters = createdCharacters?.characters || [];

        if (characters.length === 0) {
            alert(t('createCharacterFirst'));
        } else if (selectedCharacters.length === 0) {
            alert(t('pleaseSelectCharacter'));
        } else if (selectedMode === 'Manual Post' && journalBookText.title.trim() === "") {
            alert(t('pleaseWriteTitle'));
        } else if (selectedMode === 'Manual Post' && journalBookText.content.trim() === "") {
            alert(t('pleaseWriteContent'));
        } else if (selectedMode === 'System Generate' && journalBookText.title.trim() === "") {
            alert(t('pleaseWriteContent'));
        } else {

            setLoading(true);
            if (selectedMode === "Manual Post") {
                selectedCharacters.forEach(character => character.content = journalBookText.content)
            } else {
                try {
                    const response = await apiRequest(`/createLLMJournalEntries`, 'POST', {
                        characterUUIDs: selectedCharacters.map(character => character.uuid),
                        journalTitle: journalBookText.title
                    });
                    response.journalEntries.forEach(object => {
                        const character = selectedCharacters.find(character => character.uuid === object.characterUUID);
                        if (character) {
                            character.content = object.generation;
                        }
                    });
                } catch (error) {
                    console.log(error);
                }
            }

            const journalBookUUID = uuidv4();
            selectedCharacters.forEach(character => character.journalEntryUUID = uuidv4());
            const payload = {
                uuid: journalBookUUID,
                journalBookTitle: journalBookText.title,
                selectedMode: selectedMode,
                selectedCharacters,
                createdAt: Date.now()
            };

            try {
                const response = await apiRequest('/createJournalBook', 'POST', payload);
                console.log(response);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
                setShowModal(false);
            }
        }
    };

    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                    <p className="loading-text">{t("loadingText")}</p>
                </div>
            )}
            {stage === 0 ? (
                <ModalOverlay
                    title={t('createNewJournalModal')}
                    setShowModal={setShowModal}
                    footerButtonLabel={t('next')}
                    onFooterButtonClick={nextButtonClick}
                >
                    <div style={styles.subtitleContainer}>
                        <h3 style={styles.subtitle}>{t('selectMode')}</h3>
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
                            title={t('createNewJournalModal')}
                            setShowModal={setShowModal}
                            showBackArrow={true}
                            onBackArrowClick={backArrowClick}
                            footerButtonLabel={t('post')}
                            onFooterButtonClick={onAnyPostButtonClick}
                        >
                            <h3 style={styles.subtitle}>📝 {t('manualpost')} {t('mode')}</h3>
                            <SelectBox
                                selectedCharacters={selectedCharacters}
                                setSelectedCharacters={setSelectedCharacters}
                                availableCharacters={createdCharacters?.characters || []}
                            />
                            <br />
                            {selectedCharacters.length > 0 && (
                                <div style={styles.scrollableContent}>
                                    <div style={styles.attributeContainer}>
                                        <div style={styles.sectionHeader}>
                                            <label style={styles.sectionHeaderLabel}>{""}</label>
                                        </div>
                                        <TextArea
                                            attribute={journalBookText.title}
                                            placeholder={t('title')}
                                            onChange={(event) => onChangeTitle(event.target.value)}
                                            styles={styles}
                                        />
                                        <TextArea
                                            attribute={journalBookText.content}
                                            placeholder={
                                                selectedCharacters.length === 1
                                                    ? `What is ${contentPlaceholder} thinking about?`
                                                    : `What are ${contentPlaceholder} thinking about?`
                                            }
                                            onChange={(event) => onChangeContent(event.target.value)}
                                            styles={styles}
                                        />
                                    </div>
                                </div>
                            )}
                        </ModalOverlay>
                    </div>
                ) : (
                    <div>
                        <ModalOverlay
                            title={t('createNewJournalModal')}
                            setShowModal={setShowModal}
                            footerButtonLabel={t('generate')}
                            showBackArrow={true}
                            onBackArrowClick={backArrowClick}
                            onFooterButtonClick={onAnyPostButtonClick}
                        >
                            <h3 style={styles.subtitle}>🌟 {t('systemgenerate')} {t('mode')}</h3>
                            <SelectBox
                                selectedCharacters={selectedCharacters}
                                setSelectedCharacters={setSelectedCharacters}
                                availableCharacters={createdCharacters?.characters || []}
                            />
                            <br />
                            {selectedCharacters.length > 0 && (
                                <div style={styles.scrollableContent}>
                                    <div style={styles.attributeContainer}>
                                        <div style={styles.sectionHeader}>
                                            <label style={styles.sectionHeaderLabel}>{""}</label>
                                        </div>
                                        <TextArea
                                            attribute={journalBookText.title}
                                            placeholder={`What topic should ${contentPlaceholder} write about?`}
                                            onChange={(event) => onChangeTitle(event.target.value)}
                                            styles={styles}
                                        />
                                    </div>
                                </div>
                            )}
                        </ModalOverlay>
                    </div>
                )
            ) : null}
        </div>
    );
};

const styles = {
    attributeContainer: {
        backgroundColor: 'var(--color-bg-grey)',
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
        fontSize: 'var(--font-medium)',
        fontWeight: 'var(--font-bold)',
    },
    description: {
        width: '100%',
        minHeight: '100%',
        height: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        backgroundColor: 'white',
        fontSize: 'var(--font-small)',
        resize: 'vertical',
        overflow: 'hidden',
    },
    subtitle: {
        color: "#6c63ff",
        fontSize: 'var(--font-medium)',
        fontWeight: 'var(--font-semibold)',
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
export default CreateJournalModal