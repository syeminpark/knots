import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import { USER_AUTH_TYPES } from "../constants.js";


import { v4 as uuidv4 } from 'uuid';
const userSchema = new mongoose.Schema({
    ID: {
        type: String,
        required: true,
        unique: true,
        default: () => uuidv4().replace(/\-/g, ""),
    },
    userName: {
        type: String,
        required: true,
        unique: true,
    },

    password: { type: String, required: true },
    auth_type: {
        type: String,
        enum: [USER_AUTH_TYPES.ADMINISTRATOR, USER_AUTH_TYPES.PARTICIPANT],
        required: true,
        default: () => USER_AUTH_TYPES.PARTICIPANT
    }
}, {
    timestamps: true,
    collection: "login",
});

userSchema.methods.generateAuthToken = function () {
    const user = this;
    const token = jwt.sign({ ID: user.ID.toString(), auth_type: user.auth_type }, process.env.JWT_SECRET);
    return token;
};


//static method
//this ensures performing operations on the userSchema object
userSchema.statics.createUser = async function (
    userName,
    password,
    auth_type
) {

    try {
        const user = await this.create({
            userName,
            password,
            auth_type
        });
        console.log(user)
        return user;
    } catch (error) {
        throw error;
    }
}


userSchema.statics.getUserByID = async function (_ID) {
    try {
        const user = await this.findOne({ ID: _ID });
        console.log('user', user)
        return user;
    } catch (error) {
        throw error;
    }
}
userSchema.statics.getUserByUserName = async function (_userName) {
    try {
        const user = await this.findOne({ userName: _userName });
        console.log('user', user)
        return user;
    } catch (error) {
        throw error;
    }
}

userSchema.statics.getAllUsers = async function () {
    try {
        const users = await this.find();
        console.log('users', users)
        return users;
    } catch (error) {
        throw error;
    }
}

userSchema.statics.deleteUserByID = async function (_ID) {
    try {
        const user = await this.findOne({ ID: _ID });
        const result = await this.deleteOne({ ID: _ID });
        return user
    } catch (error) {
        throw error;
    }
}

userSchema.statics.deleteAllUsers = async function () {
    try {
        const result = await this.deleteMany({});
        const users = await this.find();
        return users
    } catch (error) {
        throw new Error('Error deleting users: ' + error.message);
    }
}

export default mongoose.model("User", userSchema);