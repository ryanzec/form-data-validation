module.exports = function(immutableStructure, fieldName) {
  if (fieldName) {
    return immutableStructure.getIn([fieldName, 'initialValue']);
  } else {
    var fieldValues = {};

    immutableStructure.forEach(function(field, fieldName) {
      fieldValues[fieldName] = field.get('initialValue');
    });

    return fieldValues;
  }
};