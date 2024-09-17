
import CharacterButton from './CharacterButton';
import openNewPanel from './openNewPanel';

const SidebarRight = (props) => {
    const { panels, setPanels, createdCharacters } = props
    return (
        <div className="sidebarRight">
            <h3 className="sidebarRight-title">Characters</h3>

            <span className="sidebarRight-subtitle"> Online - {createdCharacters.length}</span>
            <div className="character-list">
                {/* Render all Attribute components for each selected character */}
                {createdCharacters.length > 0 && (
                    createdCharacters.map((character) => (
                        <button key={character.uuid} className="character-item" onClick={() => { openNewPanel(panels, setPanels, 'character-profile', character) }}>
                            <CharacterButton
                                panels={panels}
                                setPanels={setPanels}
                                createdCharacter={character}
                            ></CharacterButton>
                        </button>
                    ))
                )}
            </div>
            <div className="buttonContainer">
                <button className="create-button" onClick={() => { openNewPanel(panels, setPanels, "character-creation") }}>
                    <i className="icon">+</i> Create
                </button>
            </div>
        </div >
    )
}
export default SidebarRight

