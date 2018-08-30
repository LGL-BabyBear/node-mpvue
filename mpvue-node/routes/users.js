var express = require('express');
var router = express.Router();
var UserDAO=require('../dao/UserDAO');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/getUserInfo', function(req,res){
    var id = req.body.id;
    console.log('fuwuqide', req.body);
    UserDAO.findByUserName(id, function(data){
        console.log('查询结果,', data);
        res.send(data);
    })
});
router.get('/userList', function(req, res){
    var name = req.body.name ? req.body.name : '';
    UserDAO.getUserListFilterByName(name, function(data){
        var data = data ? data : [];
        console.log('userList', data);
        res.send(data);
    })
})
module.exports = router;