import { useState, useEffect } from "react";
import { getInteractedCharactersWithPosts, getCommentsBetweenCharacters } from "../Journal/journalBookReducer";
import CharacterButton from "../../CharacterButton";
import openNewPanel from "../../openNewPanel";
import ToggleButton from "../../ToggleButton";

const CommentsTab = (props) => {

    const { panels, setPanels, caller, createdJournalBooks, createdCharacters } = props;
    const [stage, setStage] = useState(0);
    const [selectedCharacter, setSelectedCharacter] = useState(null);

    const interactedCharacters = getInteractedCharactersWithPosts(createdJournalBooks, caller.uuid);
    const interactedCharacterList = [];
    interactedCharacters.forEach(interactionCharacterUUID => {
        interactedCharacterList.push(createdCharacters.characters.find(createdCharacter => createdCharacter.uuid === interactionCharacterUUID));
    });
    const commentsLimitShow = 3;
    const threadsLimitShow = 100;

    const onClickCharacter = (character) => {
        setSelectedCharacter(character);
        setStage(1);
    };

    const onBack = () => {
        setStage(0);
        setSelectedCharacter(null);
    };

    useEffect(() => {
        if (selectedCharacter) {
            setSelectedCharacter(createdCharacters.characters.find(createdCharacter => createdCharacter.uuid === selectedCharacter.uuid));
        }
    }, [createdCharacters]);

    const onClickComment = (bookUUID, entryUUID, commentThreadUUID) => {
        openNewPanel(panels, setPanels, 'journal', null, {
            type: "comment",
            bookUUID: bookUUID,
            entryUUID: entryUUID,
            commentThreadUUID: commentThreadUUID
        });
    };

    const commentExchangeHistory = selectedCharacter
        ? getCommentsBetweenCharacters(createdJournalBooks, caller.uuid, selectedCharacter.uuid)
        : [];

    return (
        stage === 0 ? (
            <div style={styles.profileContainer}>
                <div style={styles.profileList}>
                    {interactedCharacterList.map((createdCharacter, index) => (
                        <div key={index} style={styles.profileItem}>
                            <button
                                style={styles.profileButtonContainer}
                                onClick={() => {
                                    openNewPanel(panels, setPanels, "character-profile", createdCharacter);
                                }}
                            >
                                <CharacterButton
                                    createdCharacter={createdCharacter}
                                    iconStyle={styles.characterButtonIconStyle}
                                    textStyle={styles.characterButtonTextStyle}
                                />
                            </button>

                            <ToggleButton
                                onClick={() => onClickCharacter(createdCharacter)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        ) : stage === 1 && selectedCharacter ? (
            <>
                <div style={styles.header}>
                    <div style={styles.leftToggleButtonContainer}>
                        <ToggleButton
                            direction={'left'}
                            onClick={onBack}
                        />
                    </div>
                    <div style={styles.characterLink}>
                        <button
                            style={styles.profileButtonContainer}
                            onClick={() => {
                                openNewPanel(panels, setPanels, "character-profile", createdCharacters.characters.find(createdCharacter => createdCharacter.uuid === caller.uuid));
                            }}
                        >
                            <CharacterButton
                                createdCharacter={createdCharacters.characters.find(createdCharacter => createdCharacter.uuid === caller.uuid)}
                                iconStyle={styles.characterButtonIconStyle}
                                textStyle={styles.characterButtonTextStyle}
                            />
                        </button>
                        <div style={styles.connectionIcon}>
                            💬
                        </div>
                        <button
                            style={styles.profileButtonContainer}
                            onClick={() => {
                                openNewPanel(panels, setPanels, "character-profile", selectedCharacter);
                            }}
                        >
                            <CharacterButton
                                createdCharacter={selectedCharacter}
                                iconStyle={styles.characterButtonIconStyle}
                                textStyle={styles.characterButtonTextStyle}
                            />
                        </button>
                    </div>
                </div>
                <div style={styles.commentsContainer}>
                    {commentExchangeHistory
                        .sort((a, b) => new Date(b.journalBookInfo.createdAt) - new Date(a.journalBookInfo.createdAt))
                        .map((journalEntryItem, journalEntryIndex) => (
                            <div key={journalEntryIndex} style={styles.journalEntry}>
                                <div style={styles.journalHeader}>
                                    {createdCharacters.characters.find(createdCharacter => createdCharacter.uuid === journalEntryItem.journalEntryInfo.ownerUUID).name}'s Journal
                                </div>

                                {journalEntryItem.commentThreads.slice(0, threadsLimitShow).map((commentThread, commentThreadIndex) => {
                                    let moreCommentsShown = false;
                                    return (
                                        <div key={commentThreadIndex} style={styles.commentThread}>
                                            <div style={styles.commentThreadContent}>
                                                {commentThread.comments.slice(0, commentsLimitShow).map((comment, commentIndex) => {
                                                    const currentCharacter = createdCharacters.characters.find(createdCharacter => createdCharacter.uuid === comment.ownerUUID);
                                                    return (
                                                        <div key={commentIndex} style={styles.comment}>
                                                            <button
                                                                style={styles.profileButtonContainer}
                                                                onClick={() => {
                                                                    openNewPanel(panels, setPanels, "character-profile", currentCharacter);
                                                                }}
                                                            >
                                                                <CharacterButton
                                                                    createdCharacter={currentCharacter}
                                                                    iconStyle={styles.characterButtonIconSmallStyle}
                                                                    textStyle={styles.characterButtonTextSmallStyle}
                                                                />
                                                            </button>
                                                            <div style={styles.commentContent}>
                                                                <div style={styles.commentText}>{comment.content}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                {commentThread.comments.length > commentsLimitShow && !moreCommentsShown && (
                                                    <div style={styles.moreComments}>
                                                        {"..."}
                                                    </div>
                                                )}
                                            </div>
                                            <ToggleButton
                                                direction={'right'}
                                                onClick={() => onClickComment(
                                                    journalEntryItem.journalBookInfo.uuid,
                                                    journalEntryItem.journalEntryInfo.uuid,
                                                    commentThread.commentThreadUUID
                                                )}
                                            />
                                        </div>
                                    );
                                })}
                                {journalEntryItem.commentThreads.length > threadsLimitShow && (
                                    <div style={styles.moreComments}>
                                        {"..."}
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </>
        ) : null
    );
};

export default CommentsTab;

const styles = {
    profileContainer: {
        width: '100%',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
    },
    characterButtonIconStyle: {
        width: '50px',
        height: '50px',
    },
    characterButtonTextSmallStyle: {
        fontSize: 'var(--font-small)',
        fontWeight: 'var(--font-semibold)',
    },
    characterButtonIconSmallStyle: {
        width: '40px',
        height: '40px',
    },
    characterButtonTextStyle: {
        fontSize: 'var(--font-medium)',
        fontWeight: 'var(--font-bold)',
    },
    profileButtonContainer: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
        padding: '0',

    },
    leftToggleButtonContainer: {
        position: 'absolute',
        left: '0',
        transform: 'translateX(50%)'
    },

    profileList: {
        marginTop: '20px',
    },
    profileItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        marginBottom: '10px',
        height: '80px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    commentThreadContent: {
        flex: 1,
    },

    header: {
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    characterLink: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    connectionIcon: {
        fontSize: 'var(--font-xl)',
        marginLeft: '20px',
        marginRight: '25px'
    },
    commentsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        height: '80%', // Limit height to make it scrollable
        overflowY: 'scroll', // Enable vertical scrolling
        width: '100%',
    },
    journalEntry: {
        backgroundColor: '#f0f0ff',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '15px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',

    },
    journalHeader: {
        fontWeight: 'var(--font-bold)',
        marginBottom: '10px',
        fontSize: 'var(--font-small)',

    },
    commentThread: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '10px',
        marginTop: '15px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between', // Ensures space between content and button
        alignItems: 'center',

    },
    comment: {
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'column',
        padding: '10px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        marginBottom: '10px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        width: '100%',

    },

    commentContent: {
        marginLeft: '10px',
        flexGrow: 1,
    },

    commentText: {
        color: '#555',
        fontSize: 'var(--font-small)',
        marginTop: '5px',
    },
    moreComments: {
        color: '#555',
        fontSize: 'var(--font-medium)',
        marginLeft: '10px',

    },
};
