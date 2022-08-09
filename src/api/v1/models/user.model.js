const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    userId: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
    },
    reqId: {
        type: String,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isLogin: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;