const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    resettoken:
    {
        type: String,
        default: null
    },
    verified: {
        type: Boolean
    }
}, { timeStamp: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User
