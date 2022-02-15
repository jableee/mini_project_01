const mongoose = require('mongoose');

const { Schema } = mongoose;
const UserSchema = new Schema ({
    nickname: String,
    pw: String
});

UserSchema.virtual('user_id').get(function () {
    return this._id.tohexString();
});

UserSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('User', UserSchema);