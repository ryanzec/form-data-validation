module.exports = function(immutableStructure, fieldName) {
  if (fieldName) {
    immutableStructure = immutableStructure.setIn([fieldName, 'isValid'], null);
    immutableStructure = immutableStructure.setIn([fieldName, 'validationErrors'], immutableStructure.getIn([fieldName, 'validationErrors']).clear());
    immutableStructure.getIn([fieldName, 'validator']).updateOptions({
      isActive: false
    });
  } else {
    var fieldNames = Object.keys(immutableStructure.toJSON());
    var count = fieldNames.length;

    for(var x = 0; x < count; x += 1) {
      immutableStructure = immutableStructure.setIn([fieldNames[x], 'isValid'], null);
      immutableStructure = immutableStructure.setIn([fieldNames[x], 'validationErrors'], immutableStructure.getIn([fieldNames[x], 'validationErrors']).clear());
      immutableStructure.getIn([fieldNames[x], 'validator']).updateOptions({
        isActive: false
      });
    }
  }

  return immutableStructure
};