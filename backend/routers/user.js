import express from 'express';
import user from '../controller/user.js';
import auth from '../middleware/auth.js'
import adminAuth from '../middleware/adminAuth.js'

const router = express.Router();

router
    .get('/getAllUsers', adminAuth, user.onGetAllUsers)
    .get('/getUserById', auth, user.onGetUserById)
    .post('/createUser', adminAuth, user.onCreateUser)
    .post('/verify', auth, user.onAuthOnly)
    .post('/loginUser', user.onLoginUser)
    .put('/updateUser', adminAuth, user.onUpdateUser)
    .delete('/deleteUser', adminAuth, user.onDeleteUserById)
    .delete('/deleteAllUsers', adminAuth, user.onDeleteAllUsers)

export default router;