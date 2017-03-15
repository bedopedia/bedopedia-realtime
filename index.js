require('./lib/array');

var express = require('express');
var bodyParser = require("body-parser");
var io = require('socket.io');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = io.listen(server);


app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});

var SchoolDict = require('./schools_dict/methods');
var schoolDictRoutes = require('./schools_dict/routes')
schoolDictRoutes(app);

var MongoDB = require('./mongodb/methods')
var MongoDBRoutes = require('./mongodb/routes')
MongoDBRoutes(app);

var Authentication = require("./authentication/methods")

server.listen(8080);
console.log('listening on 8080');




// MongoDB.insert({
//   name: "ahmed",level: "3", school: 'glory'
// })
// MongoDB.insert({
//   name: "ali",level: "1", school: 'glory'
// })
// MongoDB.insert({
//   name: "mohamed",level: "1", school: 'glory'
// })
// MongoDB.insert({
//   name: "momen",level: "3", school: 'glory'
// })
// MongoDB.insert({name: 'momen'})
// MongoDB.findAll();
// MongoDB.register({id: 1, name: 'user1'})

// Authentication.authenticate(request).then(function(status){
//   response.status(status).end();
// }, function(){
//   response.status(500).end()
// })

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
