var forEach = require('lodash.foreach');
var immutable = require('immutable');
var addField = require('./helpers/add-field');

module.exports = function(options) {
  var validators = {};
  var immutableStructure = immutable.Map({});

  if (process.env.NODE_ENV !== 'production' && !options.fields) {
    console.warn('Creating a new form data object without any fields doesn\'t seem that useful');
  }

  forEach(options.fields, function(options, fieldName) {
    immutableStructure = addField(immutableStructure, fieldName, options);
  });

  return immutableStructure;
};
