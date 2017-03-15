var http = require("http");


module.exports.authenticate = function(request) {
  var at = request.get('access-token');
  var client = request.get('client');
  var uid = request.get('uid');
  return new Promise(function (resolve, reject) {
    var req = http.request({
      host: 'localhost',
      port: 3000,
      path: '/api/auth/validate_token?uid='+uid+'&access-token='+at+'&client='+client,
      method: 'GET'
    }, function(res){
      resolve(res.statusCode)
    })
    req.on('error', function (er) {
      reject()
    })
    req.end();
  })
}
