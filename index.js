require('./lib/array');
require('dotenv').config({path : 'constants.env'})

var express = require('express');
var bodyParser = require("body-parser");
var io = require('socket.io');
var http = require('http');
var fs = require('fs');

const privateKey = fs.readFileSync('/etc/letsencrypt/live/realtime.skolera.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/realtime.skolera.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/realtime.skolera.com/chain.pem', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};
var app = express();
var server = http.createServer(credentials, app);
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

var Notification = require('./notifications/methods')
var NotificationRoutes = require('./notifications/routes')
NotificationRoutes(app, io);

server.listen(8080);
console.log('listening on 8080');

// Authentication.authenticate(request).then(function(status){
//   response.status(status).end();
// }, function(){
//   response.status(500).end()
// })

// notifications
io.on('connection', function(socket) {
  var userId = socket.request._query.id;
  var school = socket.request._query.school;
  MongoDB.register({id: userId,school: school, sockets: [socket.id]}, io)
});

// app.post('/realtime',function(request, response){
// var body = request.body;
// console.log('=================');
// console.log(body);
// console.log('=================');
// if (body.event) {
//   io.sockets.emit(body.event,body.payload);
// }
// response.json({status: 'okay'})
// })
