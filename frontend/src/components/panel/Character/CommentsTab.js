import { useState } from "react"
import { getInteractedCharactersWithPosts } from "../Journal/journalBookReducer"
import CharacterButton from "../../CharacterButton"
import openNewPanel from "../../openNewPanel"
import ToggleButton from "../../ToggleButton"

const CommentsTab = (props) => {

    const { panels, setPanels, caller, createdJournalBooks, createdCharacters } = props
    const [stage, setStage] = useState(0)

    const interactedCharacters = getInteractedCharactersWithPosts(createdJournalBooks, caller.uuid)
    const interactedCharacterList = []
    interactedCharacters.forEach(interactionCharacterUUID => {
        interactedCharacterList.push(createdCharacters.characters.find(createdCharacter => createdCharacter.uuid === interactionCharacterUUID))
    })

    const onClick = () => {
        setStage(1)
    }

    return (
        stage === 0 ? (
            <div style={styles.profileContainer}>
                <div style={styles.profileList}>
                    {interactedCharacterList.map((createdCharacter, index) => (
                        <div key={index} style={styles.profileItem}>
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
                                ></CharacterButton>

                            </button>
                            <ToggleButton
                                onClick={() => onClick()}
                            ></ToggleButton>
                        </div>
                    ))}
                </div>
            </div>
        ) : stage === 1 ? (
            <>

            </>
        ) : null
    )
}

export default CommentsTab


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
    characterButtonTextStyle: {
        fontSize: 'var(--font-medium)',
        fontWeight: 'var(--font-bold)',
        paddingLeft: '10px'

    },

    profileButtonContainer: {
        display: 'flex', // Keep flex alignment
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
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
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    profileItemHover: {
        backgroundColor: '#f1f1f1',
    },
    profileAvatarSm: {
        width: '20px',
        height: '20px',
        backgroundColor: '#6c63ff',
        borderRadius: '50%',
        marginRight: '10px',
    },
    arrow: {
        color: '#888',
        fontSize: '16px',
    },
};