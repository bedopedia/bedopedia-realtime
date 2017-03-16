var MongoDB = require('../mongodb/methods')
// user should have school & id
// data should have event & payload
module.exports.notify = function(user, data, io) {
  return new Promise((resolve, reject) => {
    MongoDB.getUser(user).then((user) => {
      user.sockets.forEach((socketID)=>{
        var socket = io.sockets.connected[socketID]
        if (socket) {
          socket.emit(data.event, data.payload)
        }
      })
      resolve()
    })
  })
}
