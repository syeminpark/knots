import { USER_AUTH_TYPES } from "../constants.js";

const adminAuth = (req, res, next) => {
    if (req.user.auth_type != USER_AUTH_TYPES.ADMINISTRATOR) {
        return res.status(403).send({ error: 'Access denied' });
    }
    next();
};

export default adminAuth;

