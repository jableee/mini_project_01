const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true,
    },

    pw: {
        tyep: String,
        // required: true,
    },

    nickname: {
        type: String,
        unique: true,
        required: true,
    },
});

module.exports = mongoose.model('User', UserSchema);