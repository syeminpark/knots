const CharacterButton = (props) => {
    const { createdCharacter, iconStyle, textStyle, onlyProfileImage = false } = props;


    return (
        <div style={styles.basic}>
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
        </div>
    );
};


export default CharacterButton;

const styles = {
    basic: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row'

    }
}