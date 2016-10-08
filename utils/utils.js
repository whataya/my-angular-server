let crypto = require('crypto');

let utils = {
    /**
     * 处理客户端发来的请求数据
     * { action: string, data: Object }
     * @param {any} req
     * @returns
     */
    parseReqData (req) {
        var action = {};
        var query = req.query;
        if (req.method === "POST") {
            query = req.body;
        }
        action.name = query.action;
        action.data = query.data;
        if('string' == typeof(action.data) && action.data.length > 0){
            action.data = JSON.parse(action.data);
        }
        action.data.session = req.session;
        action.data.ip = utils.getClientIp(req);
        return action;
    },
    // 获取客户端IP
    getClientIp (req) {
        return req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    },
    // 获取当前时间 格式:2016-05-19 10:00:00
    getCurrentDate () {
        return (new Date()).Format("yyyy-MM-dd hh:mm:ss");
    },
    // 获取时间戳 mills
    getCurrentDateMills () {
        return (new Date()).getTime() / 1000;
    },
    /**
     * 验证手机号
     * @param phone
     */
    isGoodPhone (phone) {
        let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

        return reg.test(phone);
    },
    /**
     * 验证邮箱
     * @param email
     */
    isGoodEmail (email) {
        let reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        return reg.test(email);
    },
    md5 (content) {
        let md5 = crypto.createHash('md5');
        md5.update(content);
        return md5.digest('hex');
    },
    /**
     * 格式化时间
     * (01/01/2016 && 01:00) TO '2016-01-01 01:00:00'
     * @param {any} date
     */
    formatDate (date, clock) {
        date = date ? (date.split('/').reverse().join('-')): date;
        clock = clock ? (clock + ':00') : '';
        return date + ' ' + clock;
    }
}

// 获取格式化时间公用方法
Date.prototype.Format = function(fmt)
{
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
};

module.exports = utils;