var Notification = require("./methods")

module.exports = function(app, io) {
  // {
  //   "users": [
  //     {"id": "3","school": "Bedopedia"}
  //   ],
  //   "notification": {
  //     "event": "notification",
  //     "payload": {
  //       "logo": "zone",
  //       "text": "You have joined a new zone"
  //     }
  //   }
  // }
  app.post('/notifications/push', function(request, response){
    var body = request.body;
    body.users.forEach((user) => {
      Notification.notify(user, body.notification, io)
    })
    response.status(200).end();
  })
}
