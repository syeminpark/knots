const CharacterButton = (props) => {
    const { createdCharacter, iconStyle, textStyle, onlyProfileImage = false, containerStyle = {} } = props;
    return (
        <div style={{ ...styles.basic, ...containerStyle }}>
            <div className="character-icon" style={iconStyle} >
                {createdCharacter?.imageSrc ? (
                    <img src={createdCharacter?.imageSrc} alt="Character" className="profile-image-preview" />
                ) : (
                    <div className="default-icon" />
                )}
            </div>
            {onlyProfileImage !== true ? (
                <span className="character-name" style={textStyle}>
                    {createdCharacter?.name || 'Unnamed Character'}
                </span>
            ) : null}
        </div>
    );
};


export default CharacterButton;

const styles = {
    basic: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        flexGrow: 1
    }
}