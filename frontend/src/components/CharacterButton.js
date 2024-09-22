const CharacterButton = (props) => {
    const { createdCharacter, iconStyle, textStyle, onlyProfileImage = false } = props;


    return (
        <>
            <div className="character-icon" style={iconStyle} >
                {createdCharacter.imageSrc ? (
                    <img src={createdCharacter.imageSrc} alt="Character" className="profile-image-preview" />
                ) : (
                    <div className="default-icon" />
                )}
            </div>
            {onlyProfileImage !== true ? (
                <span className="character-name" style={textStyle}>
                    {createdCharacter.name || 'Unnamed Character'}
                </span>
            ) : null}
        </>
    );
};

export default CharacterButton;
