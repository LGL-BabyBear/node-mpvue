var express = require('express');
var router = express.Router();
var WineDAO=require('../dao/WineDAO');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/wineInfo', function(req,res){
    var name = req.body.name ? req.body.name : '';
    var id = req.body.id ? req.body.id :'';
    var OBJ = {};
   if (id) {
        OBJ = {_id: id};
   }
   if (name) {
       OBJ = Object.assign({}, {name:{$regex: name}}, OBJ )
   }
    WineDAO.findByCondition(OBJ, function(data){
        res.send(data);
    })
});

router.get('/shops', function(req, res) {
    var name = req.body.name ? req.body.name : '';
    var OBJ = {};
    if (name) {
        OBJ = Object.assign({}, {name:{$regex: name}}, OBJ )
    }
    WineDAO.findShopByCondition(OBJ, function(data){
        res.send(data);
    })
})

module.exports = router;