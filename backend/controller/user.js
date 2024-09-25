
import UserModel from '../models/user.js';
import { USER_AUTH_TYPES } from '../utils/constants.js';
import jwt from 'jsonwebtoken';

export default {
    onCreateUser: async (req, res) => {
        const { userName, password, auth_type, } = req.body;

        try {
            const user = await UserModel.getUserByUserName(userName);
            if (!user) {
                const user = await UserModel.createUser(userName, password, auth_type);
                return res.status(200).json({ success: true, user });
            }
            else {
                return res.status(500).json({ success: false, error: "user already exists" });
            }
        } catch (error) {
            console.log(error)
            //the error is an object so just throw the string message
            return res.status(500).json({ success: false, error: error.message })
        }
    },

    onUpdateUser: async (req, res) => {
        const { ID } = req.body
        try {
            const user = await UserModel.updateUser(ID, req.body)
            return res.status(200).json({ success: true, user });
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, error: error.message })
        }
    },

    onGetUserById: async (req, res) => {
        const { ID } = req.body
        try {
            const user = await UserModel.getUserByID(ID);
            return res.status(200).json({ success: true, user });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message })
        }
    },

    onLoginUser: async (req, res) => {
        const { userName, password, } = req.body;
        try {
            const user = await UserModel.getUserByUserName(userName);
            if (!user) {
                return res.status(500).json({
                    success: false,
                    error: "No User with this ID"
                });
            }
            else {
                // bcrypt.compare(password, user.password, function (_err, result) {
                // if (!result) {
                if (password != user.password) {
                    return res.status(500).json({ success: false, error: 'Invalid password' })
                }
                else {

                    const token = jwt.sign({ ID: user.ID, auth_type: user.auth_type }, process.env.JWT_SECRET);
                    return res.json({ success: true, auth_type: user.auth_type, token });
                }

            }
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message })
        }
    },

    onGetAllUsers: async (req, res) => {
        try {
            const users = await UserModel.getAllUsers();
            if (users.length == 0) {
                return res.status(500).json({
                    success: false,
                    error: "No Users"
                });
            }
            return res.status(200).json({ success: true, users });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message })
        }
    },

    onDeleteUserById: async (req, res) => {
        try {
            const { ID } = req.body;
            const user = await UserModel.deleteUserByID(ID);
            if (!user) {
                return res.status(500).json({ success: false, error: "no User Found" });
            }

            return res.status(200).json({
                success: true,
                message: `Deleted ${user.name}`
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message })
        }
    },

    onDeleteAllUsers: async (req, res) => {
        try {
            const users = await UserModel.deleteAllUsers()
            if (users.length == 0 || !users) {

                return res.status(200).json({ success: true, users });
            }

            return res.status(500).json({
                success: false,
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message })
        }
    },
    onAuthOnly: async (req, res) => {
        return res.status(200).json({ success: true, message: 'success' })
    }
}
