const CharacterButton = (props) => {
    const { createdCharacter, iconStyle, textStyle } = props;

    return (
        <>
            <div className="character-icon" style={iconStyle}>
                <img src={createdCharacter.imageSrc} className="profile-image-preview" />
            </div>
            <span className="character-name" style={textStyle}>{createdCharacter.name}</span>
        </>
    );
};

export default CharacterButton;
