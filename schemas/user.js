const mongoose = require('mongoose');

const { Schema } = mongoose;
const UserSchema = new Schema ({
    nickname: String,
    pw: String,
    user_id: String
});

UserSchema.virtual('userId').get(function () {
    return this._id.toHexString();
});

UserSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('User', UserSchema);