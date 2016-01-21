module.exports = function(immutableStructure, fieldName) {
  var json;

  if (fieldName) {
    json = immutableStructure.toJSON();

    delete josn.validator;
  } else {
    json = {};

    immutableStructure.forEach(function(field, fieldName) {
      var temp = field.toJSON();

      delete temp.validator;

      json[fieldName] = temp;
    });
  }

  return json;
};