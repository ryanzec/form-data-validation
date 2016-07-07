var forEach = require('lodash.foreach');
var isString = require('lodash.isstring');

module.exports = function(immutableStructure, fieldName, newValue, markAsDirty) {
  if (markAsDirty !== false) {
    markAsDirty = true;
  }

  //NOTE: don't mark as dirty if the value is the same as the initial value
  if (immutableStructure.getIn([fieldName, 'initialValue']) === newValue) {
    markAsDirty = false;
  }

  if (isString(fieldName)) {
    immutableStructure = immutableStructure.setIn([fieldName, 'value'], newValue);

    //NOTE: need the check as setting the value should never set isDirty to false
    if (markAsDirty) {
      immutableStructure = immutableStructure.setIn([fieldName, 'isDirty'], true);
    }
  } else {
    forEach(fieldName, function(value, key) {
      immutableStructure = immutableStructure.setIn([key, 'value'], value);

      //NOTE: need the check as setting the value should never set isDirty to false
      if (markAsDirty) {
        immutableStructure = immutableStructure.setIn([key, 'isDirty'], true);
      }
    });
  }

  return immutableStructure;
};