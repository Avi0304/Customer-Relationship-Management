const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resettoken:
    {
        type: String,
        required: null
    },
    is2FAEnabled: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
    bio:{
        type: String,
    },
    DOB: {
        type: Date
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    organization: {
        type: String
    },
    occupation: {
        type: String
    },
    skills: {
        type: [String], 
        default: []
    },
    photo: {
        type: String,
        default: "/uploads/1742536102867-img (1).jpeg"
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Boolean
    }
}, { timeStamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User
