var methods = require('./methods')
module.exports = function(app){
  app.get('/schools_dict/:name', function(request, response){
    var url = methods.getSchoolUrl(request.params.name)
    if (url != undefined) {
      response.status(200).json({url: url})
    } else {
      response.status(404).json({error: "school not found"})
    }
  })
}
