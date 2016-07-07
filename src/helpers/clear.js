var set = require('./set');
var resetWithData = require('./reset-with-data');

module.exports = function(immutableStructure, reset) {
  var fieldNames = Object.keys(immutableStructure.toJSON());
  var newData = {};

  fieldNames.forEach(function(fieldName) {
    newData[fieldName] = '';
  });

  if (reset === true) {
    immutableStructure = resetWithData(immutableStructure, newData);
  } else {
    immutableStructure = set(immutableStructure, newData);
  }

  return immutableStructure;
};
