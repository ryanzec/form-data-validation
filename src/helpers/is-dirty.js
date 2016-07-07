module.exports = function(immutableStructure, fieldName) {
  if (fieldName) {
    return immutableStructure.getIn([fieldName, 'isDirty']);
  } else {
    var isDirty = true;
    var fieldNames = Object.keys(immutableStructure.toJSON());
    var count = fieldNames.length;

    for(var x = 0; x < count; x += 1) {
      if (immutableStructure.getIn([fieldNames[x], 'isDirty']) !== true) {
        isDirty = false;
      }
    }

    return isDirty;
  }
};