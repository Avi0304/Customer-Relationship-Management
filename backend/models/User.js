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
    verified: {
        type: Boolean
    }
}, { timeStamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User
