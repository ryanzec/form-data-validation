var assign = require('lodash.assign');
var immutable = require('immutable');
var validatorFactory = require('../validator-factory');

module.exports = function(immutableStructure, fieldName, options) {
  var initialValue = options.initialValue || '';
  var validatorOptions = assign({
    initialValue: initialValue
  }, options.validatorOptions || {});

  var initialDataStructure = immutable.Map({
    initialValue: initialValue,
    value: initialValue,
    isValid: null,
    validationErrors: immutable.List([]),
    isDirty: false,
    validator: validatorFactory(validatorOptions)
  });

  return immutableStructure.set(fieldName, initialDataStructure);
};