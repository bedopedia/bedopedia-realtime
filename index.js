var express = require('express'),
    bodyParser = require("body-parser"),
    io = require('socket.io'),
    http = require('http'),
    app = express(),
    server = http.createServer(app),
    io = io.listen(server);
server.listen(8080);
app.use(bodyParser.json());
app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
        next();
    });
console.log('listening on 8080');

// notifications
// require('./notifications/notifications.js')(io);
io.on('connection', function(socket) {
  console.log('connected...');
  socket.on('message', function(from, msg) {
    console.log('recieved message from',from, 'msg', JSON.stringify(msg));
    console.log('broadcasting message');
    console.log('payload is', msg);
    io.sockets.emit('broadcast', {
      payload: msg,
      source: from
    });
    console.log('broadcast complete');
  });
});

app.post('/realtime',function(request, response){
  var body = request.body;
  console.log('=================');
  console.log(body);
  console.log('=================');
  if (body.event) {
    io.sockets.emit(body.event,body.payload);
  }
  response.json({status: 'okay'})
})
