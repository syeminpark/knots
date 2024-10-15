import { useState, useEffect } from "react";
import { getInteractedCharactersWithPosts, getCommentsBetweenCharacters, getCommentExchangeCount } from "../Journal/journalBookReducer";
import CharacterButton from "../../CharacterButton";
import openNewPanel from "../../openNewPanel";
import ToggleButton from "../../ToggleButton";
import { useTranslation } from 'react-i18next';
import EntryTag from "../../EntryTag";
import TimeAgo from "../../TimeAgo";

const CommentsTab = (props) => {
    const { t } = useTranslation();

    const { panels, setPanels, caller, createdJournalBooks, createdCharacters } = props;
    const [stage, setStage] = useState(0);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [commentExchangeHistory, setCommentExchangeHistory] = useState([]);

    const profileOwner = createdCharacters.characters.find(character => character.uuid === caller.uuid)

    const interactedCharacters = getInteractedCharactersWithPosts(createdJournalBooks, caller.uuid);
    const interactedCharacterList = interactedCharacters.map(interactionCharacterUUID =>
        createdCharacters.characters.find(createdCharacter => createdCharacter.uuid === interactionCharacterUUID)
    );




    const commentsLimitShow = 100;
    const threadsLimitShow = 100;

    const onClickCharacter = (clickedOnCharacter) => {
        setSelectedCharacter(clickedOnCharacter);
        setStage(1);
        const commentHistory = getCommentsBetweenCharacters(createdJournalBooks, caller.uuid, clickedOnCharacter?.uuid);
        setCommentExchangeHistory(commentHistory);
        console.log(commentHistory, 'please')
    };

    const onBack = () => {
        setStage(0);
        setSelectedCharacter(null);
        setCommentExchangeHistory([]);
    };

    const onClickComment = (bookUUID, entryUUID, commentThreadUUID) => {
        openNewPanel(panels, setPanels, 'journal', null, {
            type: "comment",
            bookUUID: bookUUID,
            entryUUID: entryUUID,
            commentThreadUUID: commentThreadUUID
        });
    };

    useEffect(() => {
        if (selectedCharacter) {
            const updatedCharacter = createdCharacters.characters.find(createdCharacter => createdCharacter.uuid === selectedCharacter.uuid);
            setSelectedCharacter(updatedCharacter);
        }
    }, [createdCharacters]);

    useEffect(() => {
        if (selectedCharacter) {
            const updatedCommentHistory = getCommentsBetweenCharacters(createdJournalBooks, caller.uuid, selectedCharacter.uuid);
            setCommentExchangeHistory(updatedCommentHistory);

        }
    }, [createdJournalBooks]);

    return (
        stage === 0 ? (
            <>
                {interactedCharacterList.length < 2 ? (
                    <div>{t('commentsWithCharacter', { count: interactedCharacterList.length })}</div>
                ) : (
                    <div>{t('commentsWithCharacter_plural', { count: interactedCharacterList.length })}</div>
                )}

                <div style={styles.profileContainer}>
                    <div style={styles.profileList}>
                        {interactedCharacterList.map((interactedCharacter, index) => {
                            // console.log(caller, interactedCharacter)
                            const commentCount = getCommentExchangeCount(createdJournalBooks, caller.uuid, interactedCharacter?.uuid)
                            return (
                                <div key={index} style={styles.profileItem}>
                                    <button
                                        style={styles.profileButtonContainer}
                                        onClick={() => {
                                            openNewPanel(panels, setPanels, "character-profile", interactedCharacter);
                                        }}
                                    >
                                        <CharacterButton
                                            createdCharacter={interactedCharacter}
                                            iconStyle={styles.characterButtonIconStyle}
                                            textStyle={styles.characterButtonTextStyle}
                                        />
                                    </button>
                                    <div style={styles.commentCount}>
                                        {/* {` ${commentCount.receivedComments.length} `} ⇅   {` ${commentCount.sentComments.length} `} */}
                                        {/* {` ${commentCount.receivedComments.length} `}  ⬇    {` ${commentCount.sentComments.length} `} */}

                                        {t('totalComments', { count: commentCount.receivedComments.length + commentCount.sentComments.length })} ⇵
                                    </div>
                                    <ToggleButton
                                        onClick={() => onClickCharacter(interactedCharacter)}
                                        size="large"

                                    />
                                </div >
                            );
                        })}
                    </div>
                </div >
            </>
        ) : stage === 1 && selectedCharacter ? (

            <div >

                <div style={styles.header}>


                    <div style={styles.leftToggleButtonContainer}>
                        <ToggleButton
                            direction={'left'}
                            onClick={onBack}
                            size="large"

                        />
                    </div>

                    <div style={styles.characterLink}>
                        <button
                            style={styles.profileButtonContainer}
                            onClick={() => {
                                openNewPanel(panels, setPanels, "character-profile", profileOwner);
                            }}
                        >
                            <CharacterButton
                                createdCharacter={profileOwner}
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
                                    {t('journalOf', {
                                        name: createdCharacters.characters.find(
                                            createdCharacter => createdCharacter.uuid === journalEntryItem.journalEntry.ownerUUID).name
                                    })}
                                </div>

                                {journalEntryItem.commentThreads.slice(0, threadsLimitShow).map((commentThread, commentThreadIndex) => (
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

                                                            <EntryTag
                                                                selectedMode={comment?.selectedMode}
                                                                size={"xs"}
                                                            ></EntryTag>
                                                            <TimeAgo
                                                                createdAt={comment.createdAt}
                                                            >

                                                            </TimeAgo>
                                                        </button>
                                                        <div style={styles.commentContent}>
                                                            <div style={styles.commentText}>{comment.content}</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {commentThread.comments.length > commentsLimitShow && (
                                                <div style={styles.moreComments}>
                                                    {"..."}
                                                </div>
                                            )}
                                        </div>
                                        <div style={styles.iconWithText}>
                                            <img src={'/tabs2.svg'} alt="icon" style={{ width: '14px' }} onClick={() => onClickComment(journalEntryItem.journalBookInfo.uuid, journalEntryItem.journalEntry.uuid, commentThread.commentThreadUUID)} />
                                        </div>
                                    </div>
                                ))}
                                {journalEntryItem.commentThreads.length > threadsLimitShow && (
                                    <div style={styles.moreComments}>
                                        {"..."}
                                    </div>
                                )}
                            </div>
                        ))}
                </div >
            </div>
        ) : null
    );
};

export default CommentsTab;

const styles = {
    profileContainer: {
        width: '100%',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        overflow: 'auto',
        maxHeight: 'calc(100vh - 400px)',
    },
    characterButtonIconStyle: {
        width: '50px',
        height: '50px',
    },
    characterButtonTextSmallStyle: {
        fontSize: 'var(--font-small)',
        fontWeight: 'var(--font-semibold)',
        marginRight: '10px',
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
        left: '15px',
        zIndex: 1, /* Keep it above other elements */

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
        marginBottom: '20px',
        height: '80px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        position: 'relative', // Add this line
    },
    commentThreadContent: {
        flex: 1,
    },
    commentCount: {
        position: 'absolute',
        width: '85%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
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
        maxWidth: '80%', /* Ensure the names don’t take up the full width */
        overflow: 'hidden', /* Prevent overflow if the names get too long */
        textOverflow: 'ellipsis', /* Add ellipsis if the text gets too long */
    },
    connectionIcon: {
        fontSize: 'var(--font-xl)',
        marginLeft: '20px',
        marginRight: '25px',
    },
    commentsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 450px)',
        width: '100%',
        flexGrow: 1,

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
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '10px',

    },
    comment: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '10px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        marginBottom: '10px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        width: '100%',
        fontSize: 'var(--font-small)',
        lineHeight: 'var(--line-height)',

    },
    commentContent: {
        flexGrow: 1,
        width: '100%',
        wordBreak: 'break-word',
    },
    commentText: {
        fontSize: 'var(--font-small)',
        marginTop: '5px',
        wordWrap: 'break-word',
    },
    moreComments: {
        color: '#555',
        fontSize: 'var(--font-medium)',
        marginLeft: '10px',
    },
    iconWithText: {
        fontSize: 'var(--font-xs)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
    },
};
