const CharacterButton = (props) => {
    const { createdCharacter, iconStyle, textStyle } = props;


    return (
        <>
            <div className="character-icon" style={iconStyle}>
                {createdCharacter.imageSrc ? (
                    <img src={createdCharacter.imageSrc} alt="Character" className="profile-image-preview" />
                ) : (
                    <div className="default-icon" />
                )}
            </div>
            <span className="character-name" style={textStyle}>
                {createdCharacter.name || 'Unnamed Character'}
            </span>
        </>
    );
};

export default CharacterButton;
