var db = require('./database');


module.exports.findByUserName = function(id,func){
  db.collection('data-wine', 'wines' ).find({_id:id},func);
}
module.exports.getUserListFilterByName = function (name, func) {
  var obj = {
    name: name
  }
  if (!name) {
      obj = {}
  }
  db.collection('data-wine', 'wines' ).find(obj, func);
}
