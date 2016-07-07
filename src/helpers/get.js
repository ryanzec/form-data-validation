module.exports = function(immutableStructure, fieldName) {
  if (fieldName) {
    return immutableStructure.getIn([fieldName, 'value']);
  } else {
    var fieldValues = {};

    immutableStructure.forEach(function(field, fieldName) {
      fieldValues[fieldName] = field.get('value');
    });

    return fieldValues;
  }
};