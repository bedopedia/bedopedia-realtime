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
      collection.update(query, record, function(err, result) {
        assert.equal(err, null);
        db.close();
        resolve(result)
      });
    })
  })
}

var find = function(collectionName, query) {
  if (query.id) {
    query.id = query.id.toString();
  }
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

var getTokens = (oldTokens, newTokens) => {
  var ret = [];
  if (!oldTokens) {
    oldTokens = [];
  }
  if (!newTokens) {
    newTokens = [];
  }
  ret = [... new Set(oldTokens.concat(newTokens))];
  return ret.clean(undefined);
}

var getOpenSockets = (sockets, io) => {
  if (!io) {
    return sockets;
  }
  var soc = [];
  for (var i = 0; i < sockets.length; i++) {
    if (io.sockets.connected[sockets[i]]) {
      soc.push(sockets[i])
    }
  }
  return soc;
}

module.exports = {
  register: function(user,io) {
    var query = {id: user.id, school: user.school};
    return new Promise((resolve, reject) => {
      find(USERS, query).then((users) => {
        if (users.length > 0) { //exists
          var updatedUser = extend({tokens: [], sockets: []}, users[0], user);
          updatedUser.tokens = getTokens(user.tokens,users[0].tokens);
          updatedUser.sockets = getOpenSockets(getTokens(user.sockets, users[0].sockets),io);
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
  }
}
