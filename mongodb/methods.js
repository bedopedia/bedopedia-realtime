var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var extend = require('extend');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
const USERS = 'users';

var insert = function(collectionName, record, callback) {
  MongoClient.connect(url, function(erro, db){
    var collection = db.collection(collectionName);
    var ret = collection.insert(record);
    ret.then(function(response){
      db.close();
      if (callback) {
        callback(response)
      }
    })
  })
}

var update = function(collectionName, query, record, callback) {
  MongoClient.connect(url, function(erro, db){
    var collection = db.collection(collectionName);
    collection.updateOne(query, record, function(err, result) {
      assert.equal(err, null);
      db.close();
      if (callback) {
        callback(result)
      }
    });
  })
}

var find = function(collectionName, query, callback) {
  MongoClient.connect(url, function(erro, db){
    var collection = db.collection(collectionName);
    collection.find(query).toArray(function(err, docs) {
      assert.equal(err, null);
      db.close();
      if (callback) {
        callback(docs);
      }
    });
  })
}

module.exports = {
  register: function(user) {
    var query = {id: user.id};
    return new Promise(function(resolve, reject){
      find(USERS, query, function(users){
        if (users.length > 0) { //exists
          var updatedUser = extend({tokens: [], sockets: []}, users[0], user);
          updatedUser.tokens = [... new Set(updatedUser.tokens.concat(users[0].tokens))];
          updatedUser.sockets = [... new Set(updatedUser.sockets.concat(users[0].sockets))];
          updatedUser.tokens.clean(undefined)
          updatedUser.sockets.clean(undefined)
          if (updatedUser.tokens.length == 0) {
            delete updatedUser.tokens
          }
          if (updatedUser.sockets.length == 0) {
            delete updatedUser.sockets
          }
          update(USERS, query, updatedUser, function(){
            resolve();
          })
        } else {
          insert(USERS, user, function () {
            resolve();
          });
        }
      })
    })
  }
}
