module.exports = function(immutableStructure, fieldName) {
  if (fieldName) {
    return immutableStructure.getIn([fieldName, 'isValid']);
  } else {
    var isValid = true;
    var invalidFields = [];
    var fieldNames = Object.keys(immutableStructure.toJSON());
    var count = fieldNames.length;

    for(var x = 0; x < count; x += 1) {
      if (immutableStructure.getIn([fieldNames[x], 'isValid']) !== true) {
        isValid = false;
        invalidFields.push(fieldNames[x]);
      }
    }

    return isValid || invalidFields;
  }
};