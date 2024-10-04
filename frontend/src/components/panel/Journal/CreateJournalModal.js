import React, { useState, useEffect } from "react";
import ModalOverlay from "../../ModalOverlay";
import ModeSelection from "./ModeSelection";
import SelectBox from "../../SelectBox";
import TextArea from "../../TextArea";
import apiRequest from "../../../utility/apiRequest";
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import Loading from "../../Loading";


const CreateJournalModal = (props) => {
    const { t } = useTranslation();
    const { setShowModal, createdCharacters, dispatchCreatedJournalBooks } = props;
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
        } else if (selectedMode === 'MANUALPOST' && journalBookText.title.trim() === "") {
            alert(t('pleaseWriteTitle'));
        } else if (selectedMode === 'MANUALPOST' && journalBookText.content.trim() === "") {
            alert(t('pleaseWriteContent'));
        } else if (selectedMode === 'SYSTEMGENERATE' && journalBookText.title.trim() === "") {
            alert(t('pleaseWriteContent'));
        } else {


            if (selectedMode === "MANUALPOST") {
                selectedCharacters.forEach(character => character.content = journalBookText.content)
            } else {
                try {
                    setLoading(true);
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

            if (selectedCharacters[0]?.content) {
                const journalBookUUID = uuidv4();
                selectedCharacters.forEach(character => character.journalEntryUUID = uuidv4());
                const payload = {
                    uuid: journalBookUUID,
                    journalBookTitle: journalBookText?.title,
                    selectedMode: selectedMode,
                    selectedCharacters,
                    createdAt: Date.now()
                };


                dispatchCreatedJournalBooks({
                    type: 'CREATE_JOURNAL_BOOK',
                    payload: payload
                });
                setShowModal(false);
                setLoading(false);
                try {
                    const response = await apiRequest('/createJournalBook', 'POST', payload);
                    console.log(response);
                } catch (error) {
                    console.log(error);
                } finally {


                }
            }
        }
    };

    return (
        <div>
            {loading && (
                <Loading text={t("loadingText")}></Loading>
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
                selectedMode === "MANUALPOST" ? (
                    <div>
                        <ModalOverlay
                            title={t('createNewJournalModal')}
                            setShowModal={setShowModal}
                            showBackArrow={true}
                            onBackArrowClick={backArrowClick}
                            footerButtonLabel={t('post')}
                            onFooterButtonClick={onAnyPostButtonClick}
                        >
                            <h3 style={styles.subtitle}>📝 {t('MANUALPOST')}</h3>
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
                                            placeholder={t(
                                                selectedCharacters.length === 1
                                                    ? 'whatThinking_singular'
                                                    : 'whatThinking_plural',
                                                { name: contentPlaceholder }
                                            )}
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
                            <h3 style={styles.subtitle}>🌟{t('SYSTEMGENERATE')}</h3>
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
                                            placeholder={t('writeTopicPrompt', { contentPlaceholder })}
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