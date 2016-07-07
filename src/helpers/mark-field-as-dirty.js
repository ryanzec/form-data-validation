module.exports = function(immutableStructure, fieldName) {
  return immutableStructure.setIn([fieldName, 'isDirty'], true);
};