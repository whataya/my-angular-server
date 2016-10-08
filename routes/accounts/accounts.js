let [
    Accounts,
    utils
    ]
    = 
    [
        require('../../models/accounts/accounts'),
        require('../../utils/utils')
    ];

let handler = {
    /**
     * 新增账目
     * 新增一条账目信息
     * @param {any} data
     * @param {any} callback
     */
    save (data, callback) {
        let { outOrIn, date, clock, bank, payway, count, remark } = data;

        if (!outOrIn || !date || !clock || !bank || !payway || !count) {
            return callback({success: false, err: null, msg: '参数输入有误, 保存失败'});
        }

        let accounts = {
            out_or_in: outOrIn,
            date: date,
            clock: clock,
            create_time: utils.formatDate(date, clock),
            bank: bank,
            payway: payway,
            count: count,
            remark: remark
        };
        Accounts.create(accounts, function (err, docs) {a
            if (!err) {
                return callback({success: true, err: null, msg: '保存成功，请查看'});
            } else {
                return callback({success: false, err: err, msg: '保存失败，请查看错误信息'});
            }
        });

    },

    /**
     * 查询账目
     * 两种查询: 1.查询全部;2.根据条件查询
     * @param {any} data
     * @param {any} callback
     */
    find (data, callback) {
        let {type, bTime, eTime, bank, payway, count, countType, lastone, limit} = data;

        if (!limit) {
            return callback({success: false, err: null, msg: '请指定查询数量'});
        }
        if (type === 'all') {
            let param = {
                status: {
                    $gte: 0
                }
            };
            if (lastone) {
                param.create_time = {
                    $gte: lastOne
                };
            }
            let query = Accounts.find({param});
            // TODO: 添加降序排序
            query.limit(limit);
            query.exec(function (err, docs) {
                if (!err) {
                    return callback({success: true, err: null, msg: '查询成功', result: docs});
                } else {
                    return callback({success: false, err: err, msg: '查询失败，请查看错误信息'});
                }
            });
            
        } else {
            // TODO: 完善条件查询
        }
    }
}