var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'schools.json');
var schools = JSON.parse(fs.readFileSync(filePath, 'utf8'));

module.exports.getSchoolUrl = function(name){
  return schools[name];
}
