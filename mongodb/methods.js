var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var extend = require('extend');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
const USERS = 'users';

var insert = function(collectionName, record) {
  return new Promise(function(resolve, reject){
    MongoClient.connect(url, function(erro, db){
      var collection = db.collection(collectionName);
      var ret = collection.insert(record);
      ret.then(function(response){
        db.close();
        resolve(response)
      })
    })
  })
}

var update = function(collectionName, query, record) {
  return new Promise((resolve, reject)=> {
    MongoClient.connect(url, function(erro, db){
      var collection = db.collection(collectionName);
      collection.updateOne(query, record, function(err, result) {
        assert.equal(err, null);
        db.close();
        resolve(result)
      });
    })
  })
}

var find = function(collectionName, query) {
  return new Promise((resolve, reject)=> {
    MongoClient.connect(url, function(erro, db){
      var collection = db.collection(collectionName);
      collection.find(query).toArray(function(err, docs) {
        assert.equal(err, null);
        db.close();
        resolve(docs);
      });
    })
  })
}

module.exports = {
  register: function(user) {
    var query = {id: user.id};
    return new Promise((resolve, reject) => {
      find(USERS, query).then((users) => {
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
          update(USERS, query, updatedUser).then(() => {resolve(updatedUser)})
        } else {
          insert(USERS, user).then(() => {resolve(user)});
        }
      })
    })
  },
  getUser: function(user) {
    return new Promise((resolve, reject) => {
      find(USERS, user).then((users)=> {
        resolve(users[0]);
      },(error)=>{reject(error)})
    })
  },
  unregister: (user, io) => {
    return new Promise((resolve, reject) => {
      find(USERS, user).then((users) => {
        var user = users[0];
        if (user) {
          var soc = user.sockets;
          for (var i = 0; i < soc.length; i++) {
            if (!io.sockets.connected[soc[i]]) {
              soc.splice(i, 1);
              i--;
            }
          }
          update(USERS, user, {$set: {sockets: soc}}).then(() => {
            resolve(soc);
          }, () => {
            reject();
          })
        } else {
          reject("user with id ${user.id} not found")
        }
      })
    })
  }
}
