module.exports = function(immutableStructure, fieldName) {
  if (fieldName) {
    return immutableStructure.getIn([fieldName, 'isValid']) !== null;
  } else {
    var hasBeenValidated = true;
    var unvalidatedFields = [];
    var fieldNames = Object.keys(immutableStructure.toJSON());
    var count = fieldNames.length;

    for(var x = 0; x < count; x += 1) {
      if (immutableStructure.getIn([fieldNames[x], 'isValid']) === null) {
        hasBeenValidated = false;
        unvalidatedFields.push(fieldNames[x]);
      }
    }

    return hasBeenValidated || unvalidatedFields;
  }
};