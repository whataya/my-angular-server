var express = require('express');
var router = express.Router();

let user = require('./user/handler');

/* GET home page. */
router.use('/users', user.handler);

module.exports = router;
