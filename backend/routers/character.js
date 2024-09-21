import express from 'express';
import character from '../controller/character.js';
import auth from '../middleware/auth.js'

const router = express.Router();

router
    .get('/getAllCharacters', auth, character.onGetAllCharactersByUser)
    .get('/getCharacterById/:uuid', auth, character.onGetCharacterByUUID)
    .post('/createCharacter', auth, character.onCreateCharacter)
    .put('/updateCharacter/:uuid', auth, character.onUpdateCharacter)
    .delete('/deleteCharacter/:uuid', auth, character.onDeleteCharacterByUUID)
    .delete('/deleteAllCharacters', auth, character.onDeleteAllCharactersByUser);

export default router;