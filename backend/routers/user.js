import express from 'express';
import user from '../controller/user.js';
import auth from '../middleware/auth.js'
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router
    .get('/getAllUsers', user.onGetAllUsers)
    .get('/getUserById', user.onGetUserById)
    .post('/createUser', user.onCreateUser)
    .post('/verify', auth, user.onAuthOnly)
    .post('/verifyAdmin', user.onAuthOnly)
    .post('/loginUser', user.onLoginUser)
    .put('/updateUser', user.onUpdateUser)
    .delete('/deleteUser', user.onDeleteUserById)

export default router;