module.exports = function(immutableStructure) {
  var newInitialData = {};
  var extraParameters = Array.prototype.slice.call(arguments).slice(1);

  if (extraParameters.length === 2) {
    newInitialData[extraParameters[0]] = extraParameters[1];
  } else {
    newInitialData = extraParameters[0];
  }

  var fieldNames = Object.keys(newInitialData)

  fieldNames.forEach(function(fieldName) {
    immutableStructure.getIn([fieldName, 'validator']).reset();
    immutableStructure = immutableStructure.setIn([fieldName, 'initialValue'], newInitialData[fieldName]);
    immutableStructure = immutableStructure.setIn([fieldName, 'value'], newInitialData[fieldName]);
    immutableStructure = immutableStructure.setIn([fieldName, 'validationErrors'], immutableStructure.getIn([fieldName, 'validationErrors']).clear());
    immutableStructure = immutableStructure.setIn([fieldName, 'isValid'], immutableStructure.getIn([fieldName, 'validator']).valid);
    immutableStructure = immutableStructure.setIn([fieldName, 'isDirty'], false);
  });

  return immutableStructure;
};
