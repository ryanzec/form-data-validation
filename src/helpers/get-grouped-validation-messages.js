module.exports = function() {
  var passedFieldNames = Array.prototype.slice.call(arguments);
  var immutableStructure = passedFieldNames.splice(0, 1)[0];
  var fieldNamesToLoop = passedFieldNames.length > 0 ? passedFieldNames : Object.keys(immutableStructure.toJSON());
  var fieldValidationMessages = null;

  fieldNamesToLoop.forEach(function(fieldName) {
    //TODO: should probably have error when trying to access fieldName that does not exist
    var validationErrors = immutableStructure.getIn([fieldName, 'validationErrors']).toJSON();

    if (validationErrors.length > 0) {
      if (!fieldValidationMessages) {
        fieldValidationMessages = {};
      }

      fieldValidationMessages[fieldName] = validationErrors;
    }
  });

  return fieldValidationMessages;
};