let mongoose = require('mongoose');

mongoose.connect('mongodb://admin:111111@localhost:27017/admin');

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('get it !')
});

module.exports = mongoose;