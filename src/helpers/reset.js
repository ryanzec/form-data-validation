module.exports = function(immutableStructure, fieldName) {
  if (fieldName) {
    immutableStructure.getIn([fieldName, 'validator']).reset();
    immutableStructure = immutableStructure.setIn([fieldName, 'value'], immutableStructure.getIn([fieldName, 'initialValue']));
    immutableStructure = immutableStructure.setIn([fieldName, 'validationErrors'], immutableStructure.getIn([fieldName, 'validationErrors']).clear());
    immutableStructure = immutableStructure.setIn([fieldName, 'isValid'], immutableStructure.getIn([fieldName, 'validator']).valid);
    immutableStructure = immutableStructure.setIn([fieldName, 'isDirty'], false);
  } else {
    immutableStructure.forEach(function(field, fieldName) {
      immutableStructure.getIn([fieldName, 'validator']).reset();
      immutableStructure = immutableStructure.setIn([fieldName, 'value'], immutableStructure.getIn([fieldName, 'initialValue']));
      immutableStructure = immutableStructure.setIn([fieldName, 'validationErrors'], immutableStructure.getIn([fieldName, 'validationErrors']).clear());
      immutableStructure = immutableStructure.setIn([fieldName, 'isValid'], immutableStructure.getIn([fieldName, 'validator']).valid);
      immutableStructure = immutableStructure.setIn([fieldName, 'isDirty'], false);
    });
  }

  return immutableStructure;
};