var MongoDB = require('./methods')

module.exports = function(app) {
  app.post('/register', function(request, response){
    var body = request.body;
    MongoDB.register(body.user).then(function(){
      response.status(200).end()
    },function(){
      response.status(500).end()
    })
  })
}
