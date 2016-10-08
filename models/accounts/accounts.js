let mongoose = require('mongoose');

let AccountSchema = mongoose.Schema({
    out_or_in: String,
    date: String,
    clock: String,
    create_time: {
        type: Date,
        default: Date().now
    },
    bank: String,
    payway: String,
    count: Number,
    remarK: String,
    status: {
        type: Number,
        default: 0
    }
});

let AccountsModel = mongoose.model('accounts', AccountSchema);

module.exports = AccountsModel;