let userHandler = require('./user');
let utils = require('../../utils/utils');


let handler = {
    user: {
        login: userHandler.login,
        register: userHandler.register,
        logout: userHandler.logout
    },
    // 处理req, 分发请求
    handler (req, res) {
        var action = utils.parseReqData(req);
        var actionFun = eval("handler." + action.name);
        if (actionFun) {
            actionFun(action.data, function(data) {
                res.send(data);
                return;
            });
        } else {
            res.send({success: "false", msg:"无效的请求"});
            return;
        }
    }
};

module.exports = handler;
