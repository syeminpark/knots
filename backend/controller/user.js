
import UserModel from '../models/user.js';
import { USER_AUTH_TYPES } from '../constants.js';
import jwt from 'jsonwebtoken';

export default {
    onCreateUser: async (req, res) => {
        const { ID, password, data_types, data_category, auth_type, } = req.body;

        try {
            const user = await UserModel.getUserById(ID);
            if (!user) {
                const user = await UserModel.createUser(ID, password, data_types, data_category, auth_type);
                return res.status(200).json({ success: true, user });
            }
            else {
                return res.status(200).json({ success: false, error: "user already exists" });
            }
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },

    onGetUserById: async (req, res) => {
        const { ID } = req.user
        try {
            const user = await UserModel.getUserById(ID);
            return res.status(200).json({ success: true, user });
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },

    onLoginUser: async (req, res) => {
        const { ID, password, } = req.body;
  
        try {
            const user = await UserModel.getUserById(ID);
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "No User with this ID"
                });
            }
            else{
                // bcrypt.compare(password, user.password, function (_err, result) {
                // if (!result) {
                if (password != user.password) {
                    return res.status(401).json({  success: false, message: 'Invalid password' })
                }
                else{
                console.log(user.ID, user.auth_type, process.env.JWT_SECRET)
                const token = jwt.sign({ ID: user.ID, auth_type: user.auth_type }, process.env.JWT_SECRET);
                return res.json({ success: true, token });
                }
      
                }
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },

    onGetAllUsers: async (req, res) => {
        try {
            const users = await UserModel.getAllUsers();
            if (users.length == 0) {
                return res.status(400).json({
                    success: false,
                    message: "No Users"
                });
            }
            return res.status(200).json({ success: true, users });
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },

    onDeleteUserById: async (req, res) => {
        try {
            const { ID, } = req.body;
            const user = await UserModel.deleteUserById(ID);
            if (!user) {
                return res.status(400).json({  success: false, error: "no User Found" });
            }

            return res.status(200).json({
                success: true,
                message: `Deleted ${user.name}`
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },

    onDeleteAllUsers: async (req, res) => {
        try {
            const users = await UserModel.deleteAllUsers()
            if (users.length == 0 || !users) {

                return res.status(200).json({ success: true, users });
            }

            return res.status(400).json({
                success: false,
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },
    onAuthOnly: async (req, res) => {
        return res.status(200).json({ success: true, message: 'success' })
    }
}
