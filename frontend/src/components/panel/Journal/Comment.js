
import React, { useState } from 'react';
import CharacterButton from "../../CharacterButton";
import TimeAgo from '../../TimeAgo';
import openNewPanel from '../../openNewPanel';
import EntryTag from '../../EntryTag';
import WriteCommentInput from './WriteCommentInput';

const Comment = (props) => {
    const { panels, setPanels, createdCharacter, selectedMode, createdAt, isEditing, editContent, setEditContent, content, onEditSave } = props


    return (
        <>
            <div style={styles.commentHeader}>
                <div style={styles.commentInfo}>
                    {/* Use CharacterButton here */}
                    <button
                        style={styles.profileButtonContainer}
                        key={createdCharacter.uuid}
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
                    <div >
                        <EntryTag selectedMode={selectedMode} size='small' hasBackground={false}> </EntryTag>
                        {createdAt && (
                            <span style={styles.commentTime}><TimeAgo createdAt={createdAt} /></span>
                        )}
                    </div>
                </div>
            </div >

            {
                isEditing ? (
                    <WriteCommentInput
                        commentValue={editContent}
                        setCommentValue={setEditContent}
                        sendButtonCallback={onEditSave}
                    ></WriteCommentInput>
                    // <div style={styles.commentText} >
                    //     <input
                    //         type="text"
                    //         value={editContent}
                    //         onChange={(e) => setEditContent(e.target.value)}
                    //         style={styles.editInput}
                    //     />
                    // </div >
                ) : (
                    <div style={styles.commentText} >
                        {content}
                    </div >
                )}
        </>
    )
}
export default Comment
const styles = {
    commentHeader: {
        display: 'flex',
        alignItems: 'center',

    },
    commentInfo: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileButtonContainer: {
        display: 'flex', // Keep flex alignment
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
    },
    characterButtonIconStyle: {
        width: '30px',
        height: '30px',
    },
    characterButtonTextStyle: {
        fontSize: 'var(--font-small)',
        fontWeight: 'var(--font-bold)',
        marginRight: '10px',
    }, commentTime: {
        fontSize: '10px',
        color: '#9b9b9b',
        marginLeft: '10px',
    },
    commentText: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        fontSize: 'var(--font-medium)',
        color: '#333',
        padding: '5px',
        whiteSpace: "pre-line",
        lineHeight: 'var(--line-height)',
    },
    editInput: {
        width: '100%',
        padding: '5px',
        fontSize: 'var(--font-small)',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
}