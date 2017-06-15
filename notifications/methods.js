var MongoDB = require('../mongodb/methods')
var FCM = require('fcm-node');
const SERVERKEY = 'AAAArO2sV0k:APA91bHGhvw6EX-42rDXvj64OS3X-6e_SKtQ95p7NSTHVGwTMj4vEUxMXbzJfFYpSvhK_eaJPxG8zyN0UUpG3MbjbhXeRwVTUgI1KGtioggrT8o9VfD2XBgzW6o0MBNhahbJ7zRadbiZ';
var fcm = new FCM(SERVERKEY);

var message;
// user should have school & id
// data should have event & payload
// event can be notification or message
module.exports.notify = function(user, data, io) {
  MongoDB.register(user)
  return new Promise((resolve, reject) => {
    MongoDB.getUser(user).then((user) => {
      user.sockets.forEach((socketID)=>{
        var socket = io.sockets.connected[socketID]
        if (socket) {
          socket.emit(data.event, data.payload)
        }
      })
      user.tokens.forEach((tokenID)=>{
        if (tokenID) {
          message = {
            to: tokenID,
            data: data
          };
          fcm.send(message, function(err, response){
            if (err) {
                console.log("Something has gone wrong!");
            } else {
                console.log("Successfully sent with response: ", response);
            }
          });
        }
      })
      resolve()
    })
  })
}
