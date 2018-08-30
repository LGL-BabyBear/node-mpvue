var db = require('./database');

module.exports.findByCondition = function(option, func) {
    db.collection('data-wine', 'wines').find(option, func);
}
module.exports.findShopByCondition = function(option, func) {
    db.collection('data-wine', 'shops').find(option, func);
}