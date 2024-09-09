
const SidebarRight = (props) => {
    const { panels, setPanels, createdCharacters } = props

    const onButtonClick = (type) => {
        const id = panels.length
        setPanels([...panels, {
            type: type, id: id,
        }])
    }
    return (
        <div className="sidebarRight">
            <h2 className="sidebarRight-title">Characters</h2>
            <div className="character-list">
                {/* Render all Attribute components for each selected character */}
                {createdCharacters.length > 0 && (
                    createdCharacters.map((character) => (
                        <button key={character} className="character-item" onClick={() => { onButtonClick('character-profile') }}>
                            <div className="character-icon"></div>
                            <span className="character-name">{character}</span>
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

