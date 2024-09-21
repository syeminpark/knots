import { USER_AUTH_TYPES } from "../constants.js";
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const adminAuth = async (req, res, next) => {

    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use secret from environment variables

    const user = await User.findOne({ ID: decoded.ID, auth_type: decoded.auth_type });
    console.log('data', { ID: decoded.ID, auth_type: decoded.auth_type })
    console.log('user', user)
    if (!user) {
        return res.status(403).send({ error: 'Access denied' });

    }
    if (user.auth_type != USER_AUTH_TYPES.ADMINISTRATOR) {
        console.log('auth_type', user.auth_type)
        return res.status(403).send({ error: 'Access denied' });
    }
    next();
};

export default adminAuth;

