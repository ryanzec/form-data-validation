module.exports = function(immutableStructure, fieldName) {
  if (fieldName) {
    immutableStructure.getIn([fieldName, 'validator']).updateOptions({
      isActive: true
    });
  } else {
    var fieldNames = Object.keys(immutableStructure.toJSON());
    var count = fieldNames.length;

    for(var x = 0; x < count; x += 1) {
      immutableStructure.getIn([fieldNames[x], 'validator']).updateOptions({
        isActive: true
      });
    }
  }

  return immutableStructure;
};