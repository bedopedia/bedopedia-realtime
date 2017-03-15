var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'schools.json');
var schools = JSON.parse(fs.readFileSync(filePath, 'utf8'));

module.exports = function(app){
  app.get('/schools_dict/:name', function(request, response){
    var url = schools[request.params.name]
    if (url != undefined) {
      response.status(200).json({url: url})
    } else {
      response.status(404).json({error: "school not found"})
    }
  })
}
