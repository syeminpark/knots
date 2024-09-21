import express from 'express';

const router = express.Router();

router
    .get('/getAllCharacters', user.onGetAllUsers)
    .get('/getCharacterById', user.onGetUserById)
    .post('/createCharacter', auth, adminAuth, user.onCreateUser)
    .put('/updateCharacter', adminAuth, user.onUpdateUser)
    .delete('/deleteCharacter', adminAuth, user.onDeleteUserById)
    .delete('/deleteCharacter', adminAuth, user.onDeleteAllUsers)

export default router;