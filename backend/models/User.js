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
    verified: {
        type: Boolean
    }
}, { timeStamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User
