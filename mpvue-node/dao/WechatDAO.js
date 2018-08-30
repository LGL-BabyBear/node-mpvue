var db = require('./database');


module.exports.login = function(option, func) {
    db.collection('data-wine', 'users').find(option, func);
}

module.exports.setOpenID = function(option,func) {
    db.collection('data-wine', 'users').insert(option, func);
}