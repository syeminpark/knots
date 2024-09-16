const CharacterButton = (props) => {
    const { createdCharacter, } = props

    return (
        <>
            <div className="character-icon">
                <img src={createdCharacter.imageSrc} className="profile-image-preview" />
            </div>
            <span className="character-name">{createdCharacter.name}</span>
        </>

    )
}
export default CharacterButton
