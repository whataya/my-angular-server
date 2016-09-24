let User = require('../../models/user/user'),
    async = require('async'),
    utils = require('../../utils/utils');

let handler = {
    /**
     * 登录
     * 
     * @param {any} data
     * @param {any} callback
     */
    login (data, callback) {
        let { username, password, ip } = data;
        if (!username || !password) {
            return callback({success: false, msg: '用户名/密码不能为空'});
        }
        // TODO: 密码需要base64编码
        password = utils.md5(password + 'manager.' + password);
        User.find(
            {
                '$or': [
                        {
                            'username': username, 
                            'password': password
                        }, 
                        {
                            'email': username, 
                            'password': password
                        }
                ]
            }, 
            {
                'password': 0,
                'state': 0,
                'login_counts': 0,
                'ip': 0,
                'status': 0
            }, 
            function (err, docs) {
                if (!err) {
                    if (docs && docs.length > 0) {
                        let doc = docs[0];
                        User.update(
                            {
                                '_id': doc._id
                            },
                            {
                                '$set': {
                                    'state.is_online': !doc.state.is_online,
                                    'state.last_login_time': utils.getCurrentDate(),
                                    'ip': ip
                                },
                                '$inc': {
                                    'login_counts': 1
                                }
                            },
                            function (err, results) {
                                // TODO: 添加logger记录
                            }
                        );
                        return callback({success: true, msg: '登录成功', data: doc});
                    } else {
                        return callback({success: false, err: '用户名/密码错误', msg: '登录失败'});
                    }
                } else {
                    return callback({success: false, err: err, msg: '登录失败'});
                }
            }
        );
    },
    /**
     * 保存用户
     * 1. 验证用户名或者邮箱是否已存在
     * @param {any} data
     * @param {any} callback
     */
    register (data, callback) {
        let { username, password, email, ip } = data;
        if (!username || !password || !email) {
            return callback({success: false, msg: '信息不完整，请重新输入'});
        }
        password = utils.md5(password + 'manager.' + password);
        // 新建用户
        async.waterfall([
            // 验证用户名或者邮箱是否已经存在
            function (cb) {
                User.find({'$or': [{'username': username}, {'email': email}]}, function (err, docs) {
                    cb(err, docs);
                });
            },
            // 存在,cb;不存在，保存
            function (docs, cb) {
                if (docs && docs.length > 0) {
                    cb('err', '用户名或密码已存在');
                } else {
                    let user = {
                        username: username,
                        password: password,
                        email: email,
                        ip: ip
                    };
                    User.create(user, function (err, doc) {
                        cb(err, docs);
                    });
                }
            }
        ], function (err, docs) {
            if (!err) {
                return callback({success: true, msg: '注册成功, 请登录'});
            } else {
                return callback({success: false, err: err, msg: docs});
            }
        });
        

    },
    /**
     * 退出登陆
     * 
     * @param {any} data
     * @param {any} callback
     */
    logout (data, callback) {
        let id = data.id;
        if (!id) {
            return callback({success: false, err: '未知错误'});
        }
        User.update(
            {
                '_id': id
            },
            {
                '$set': {
                    'state.is_online': false,
                    'state.last_logout_time': utils.getCurrentDate()
                }
            },
            function (err, docs) {
                // TODO: 添加logger记录
                return callback({success: true, msg: ''});
            }
        );
    }
};

module.exports = handler;