'use strict';
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;
var url = 'mongodb://127.0.0.1:27017/mongo_data';

var arySort = function(ary){
    ary.sort(function(a,b){
        if(a._id < b._id){
            return -1;
        }else if(a._id > b._id){
            return 1;
        }else{
            return 0;
        }
    });
}
var dbCtrl = function(database, listName, ctrl) {
    return function() {
        //将arguments转换为数组
        var arg = [].slice.apply(arguments);
        console.log('arguments', arguments, 'arguments-arg', arg);
        MongoClient.connect(url,{ useNewUrlParser: true}, function(err, db) {
            console.log(db);
            if (err) {
                console.log("数据库连接出错：" + err);
            } else {
                var dbo = db.db(database);
                var c = dbo.collection(listName);
                var func = arg[arg.length - 1];
                if (typeof(func) == "function") {
                    arg[arg.length - 1] = function(err, result) {
                        if (err) {
                            console.log("数据操作失败：" + err);
                        }
                        func(result);
                        //关闭数据库连接
                        db.close();
                    }
                }

                c[ctrl].apply(c, arg);
            }
        });
    }
}
var dbQueryCtrl = function(database, listName, ctrl) {
    return function() {
        var arg = [].slice.apply(arguments);
        console.log('arguments', arguments, 'arguments-arg', arg);
        MongoClient.connect(url, { useNewUrlParser: true}, function(err, db) {
            if (err) {
                console.log("数据库连接出错：" + err);
            } else {
                var dbo = db.db(database);
                var c = dbo.collection(listName);
                var func = arg.pop();
                var result = c[ctrl].apply(c, arg);
                result.toArray(function(err, data) {
                    console.log('获取到了什么数据', data );
                    func(data);
                    db.close();
                });
            }
        });
    }
}
var dbQueryPageCtrl = function(database, listName, ctrl) {
    return function() {
        var arg = [].slice.apply(arguments);
        MongoClient.connect(url, { useNewUrlParser: true}, function(err, db) {
            if (err) {
                console.log("数据库连接出错：" + err);
            } else {
                var dbo = db.db(database);
                var c = dbo.collection(listName);
                //获取当前页码和每页显示数
                var curpage = arg.shift();
                var eachpage = arg.shift();
                //如果页码不存在，则默认为第1页
                if(!curpage || isNaN(parseInt(curpage))){
                    curpage = 1;
                }
                //如果每页显示数不存在则默认为每页显示5条数据
                if(!eachpage || isNaN(parseInt(eachpage))){
                    eachpage = 5;
                }
                var func = arg.pop();
                if (typeof(func) == "function") {

                    c.count(arg[0],function(err, cnt) {
                        if (err) {
                            console.log("分页查询获取数据失败：" + err);
                        } else {
                            var result = c[ctrl].apply(c, arg);
                            result.limit(eachpage);
                            result.skip((curpage - 1) * eachpage);
                            result.toArray(function(err, data) {
                                var page = {
                                    curpage:curpage,
                                    eachpage:eachpage,
                                    maxpage:Math.ceil(cnt/eachpage),
                                    data:data,
                                    count:cnt
                                }
                                func(page);
                                db.close();
                            });
                        }
                    });

                }

            }
        });
    }
}
var dbRefQuery = function(data, database, listName, func){

        MongoClient.connect(url, { useNewUrlParser: true}, function(err, db) {
            if (err) {
                console.log("数据库连接出错：" + err);
            } else {
                var newAry = [];
                if(data && data.length > 0 ){
                    data.forEach(function(ele){
                        if(ele[listName] && ele[listName]._bsontype == 'DBRef'){
                            var dbo = db.db(database);
                            dbo .collection(listName).find({_id:ObjectID(ele[listName].oid)}).toArray(function(err,result){
                                    if(result && result.length > 0){
                                        ele[listName] = result[0];
                                    }else{
                                        ele[listName] = {};
                                    }
                                    newAry.push(ele);
                                    if(newAry.length == data.length){

                                        arySort(newAry);
                                        func(newAry);
                                        db.close();
                                    }
                            })

                        }else{
                            newAry.push(ele);
                            if(newAry.length == data.length){

                                arySort(newAry);

                                func(newAry);
                                db.close();
                            }
                        }

                    })
                }else{
                    func(data);
                    db.close();
                }


            }
        });

}
exports.collection = function(database, liseName) {

    return {
        insert: dbCtrl(database, liseName, "insert"),
        update: dbCtrl(database, liseName, "update"),
        remove: dbCtrl(database, liseName, "remove"),
        find: dbQueryCtrl(database, liseName, "find"),
        findByPage: dbQueryPageCtrl(database, liseName, "find")

    }
}
exports.ObjectID = ObjectID;
exports.findJoin = dbRefQuery;
