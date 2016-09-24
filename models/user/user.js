let mongoose = require('../../utils/mongo');

let UserSchema = mongoose.Schema({
    nickname: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        unique: true,
        index: 1,
        required: true
    },
    password: {
        type: String,
        index: 1,
        required: true
    },
    email: {
        type: String,
        index: 1,
        required: true,
        unique: true
    },
    create_time: {
        type: Date,
        default: Date.now
    },
    state: {
        is_online: {
            type: Boolean,
            default: false
        },
        last_login_time: {
            type: String,
            default: null
        },
        last_logout_time: {
            type: String,
            default: null
        }
    },
    login_counts: {
        type: Number,
        default: 0
    },
    ip: String,
    status: {
        type: Number,
        default: 0
    }

});

let UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;