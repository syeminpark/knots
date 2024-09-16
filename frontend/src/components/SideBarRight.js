import { v4 as uuidv4 } from 'uuid';

const SidebarRight = (props) => {
    const { panels, setPanels, createdCharacters } = props

    const onButtonClick = (type, caller = null, uuid = uuidv4()) => {
        setPanels([...panels, {
            type: type, id: uuid, caller: caller
        }])
    }
    return (
        <div className="sidebarRight">
            <h3 className="sidebarRight-title">Characters</h3>

            <span className="sidebarRight-subtitle"> Online - {createdCharacters.length}</span>
            <div className="character-list">
                {/* Render all Attribute components for each selected character */}
                {createdCharacters.length > 0 && (

                    createdCharacters.map((character) => (
                        <button key={character.uuid} className="character-item" onClick={() => { onButtonClick('character-profile', character) }}>
                            <div className="character-icon">
                                <img src={character.imageSrc} className="profile-image-preview" />
                            </div>
                            <span className="character-name">{character.name}</span>
                        </button>
                    ))
                )}
            </div>
            <div className="button-container">
                <button className="create-button" onClick={() => { onButtonClick("character-creation") }}>
                    <i className="icon">+</i> Create
                </button>
            </div>
        </div >
    )
}
export default SidebarRight

