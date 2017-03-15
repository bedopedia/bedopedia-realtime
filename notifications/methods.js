var MongoDB = require('../mongodb/methods')
module.exports.notify = function(user, data, io) {
  return new Promise((resolve, reject) => {
    MongoDB.getUser(user).then((user) => {
      user.sockets.forEach((socketID)=>{
        var socket = io.sockets.connected[socketID]
        if (socket) {
          socket.emit('message', {id: 10})
          socket.emit('notification', {id: 1000})
        }
      })
      resolve()
    })
  })
}
