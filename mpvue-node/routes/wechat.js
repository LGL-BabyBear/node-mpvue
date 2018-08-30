var express = require('express');
var router = express.Router();
var WechatDao = require('../dao/WechatDAO');
var config = require('../config/config');
// const Ut = require("../common/utils");
const request = require("request");

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/login', function(req,res){
    console.log('postBody', req.body);
    var openID = req.body.openID
    if (openID) {
        WechatDao.login({smallID: openID}, function(data){
            if (data) {
                res.send(data);
            } else {

            }
        })
    } else {
        var code = req.body.code;
        var appID = config.wechat.appID;
        var appSecret = config.wechat.appSecret;
        var url =  `https://api.weixin.qq.com/sns/jscode2session?appid=${appID}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`;
        new Promise((resolve, reject) => {
            request({url: url}, (e, r, d) => {
                console.log('是否报错', d, r.statusCod);
                if (e) {
                    reject(e);
                }
                if (r.statusCode != 200) {
                    reject(`back statusCode：${r.statusCode}`);
                }
                resolve(d);
            });
        }).then(function(val) {
            var val = JSON.parse(val);
            WechatDao.setOpenID({'smallID': val.openid, session_key: val.session_key }, function( data ) {
                console.log('连接成功了？', data);
                res.send({openID: val.openid})
            })
        })
        // Ut.promiseReq({url: url});
        // openID = JSON.parse(openID);
        // console.log('返回的', openID);
        // res.json(openID);
    }
});

module.exports = router;