var validatorFactory = require('./validator-factory');
var assign = require('lodash.assign');
var forEach = require('lodash.foreach');
var isString = require('lodash.isstring');
var immutable = require('immutable');

module.exports = function(options) {
  var formData = {};
  var validators = {};
  var fields = immutable.Map({});

  if (process.env.NODE_ENV !== 'production' && !options.fields) {
    console.warn('Creating a new form data object without any fields doesn\'t seem that useful');
  }

  var addField = function(fieldName, options) {
    var initialValue = options.initialValue || '';
    var validatorOptions = assign({
      initialValue: initialValue
    }, options.validatorOptions || {});

    //default the validator context to the formData object
    if (validatorOptions.validators && validatorOptions.validators.length > 0) {
      validatorOptions.validators.forEach(function(validator, key) {

        if (!validatorOptions.validators[key].context) {
          validatorOptions.validators[key].context = formData;
        }
      });
    }

    validators[fieldName] = validatorFactory(validatorOptions);
    var initialDataStructure = immutable.Map({
      initialValue: initialValue,
      value: initialValue,
      isValid: null,
      validationErrors: immutable.List([]),
      isDirty: false
    });
    fields = fields.set(fieldName, initialDataStructure);
  };

  forEach(options.fields, function(options, fieldName) {
    addField(fieldName, options);
  });

  formData.addField = function(fieldName, options) {
    addField(fieldName, options);
  };

  formData.removeField = function(fieldName) {
    delete validators[fieldName];
    fields = fields.delete(fieldName);
  };

  formData.get = function(fieldName) {
    if (fieldName) {
      return fields.getIn([fieldName, 'value']);
    } else {
      var fieldValues = {};

      fields.forEach(function(field, fieldName) {
        fieldValues[fieldName] = field.get('value');
      });

      return fieldValues;
    }
  };

  formData.set = function(fieldName, newValue, markAsDirty) {
    if (markAsDirty !== false) {
      markAsDirty = true;
    }

    //NOTE: don't mark as dirty if the value is the same as the initial value
    if (fields.getIn([fieldName, 'initialValue']) === newValue) {
      markAsDirty = false;
    }

    if (isString(fieldName)) {
      fields = fields.setIn([fieldName, 'value'], newValue);

      //NOTE: need the check as setting the value should never set isDirty to false
      if (markAsDirty) {
        fields = fields.setIn([fieldName, 'isDirty'], true);
      }
    } else {
      forEach(fieldName, function(value, key) {
        fields = fields.setIn([key, 'value'], value);

        //NOTE: need the check as setting the value should never set isDirty to false
        if (markAsDirty) {
          fields = fields.setIn([key, 'isDirty'], true);
        }
      });
    }
  };

  formData.markFieldAsDirty = function(fieldName) {
    fields = fields.setIn([fieldName, 'isDirty'], true);
  };

  formData.markFieldAsClean = function(fieldName) {
    fields = fields.setIn([fieldName, 'isDirty'], false);
  };

  formData.reset = function(fieldName) {
    if (fieldName) {
      validators[fieldName].reset();
      fields = fields.setIn([fieldName, 'value'], fields.getIn([fieldName, 'initialValue']));
      fields = fields.setIn([fieldName, 'validationErrors'], fields.getIn([fieldName, 'validationErrors']).clear());
      fields = fields.setIn([fieldName, 'isValid'], validators[fieldName].valid);
      fields = fields.setIn([fieldName, 'isDirty'], false);
    } else {
      fields.forEach(function(field, fieldName) {
        validators[fieldName].reset();
        fields = fields.setIn([fieldName, 'value'], fields.getIn([fieldName, 'initialValue']));
        fields = fields.setIn([fieldName, 'validationErrors'], fields.getIn([fieldName, 'validationErrors']).clear());
        fields = fields.setIn([fieldName, 'isValid'], validators[fieldName].valid);
        fields = fields.setIn([fieldName, 'isDirty'], false);
      });
    }
  };

  formData.validate = function(fieldName) {
    if (fieldName) {
      if (validators[fieldName].isActive()) {
        validators[fieldName].validate(fields.getIn([fieldName, 'value']));
        fields = fields.setIn([fieldName, 'isValid'], validators[fieldName].valid);
        fields = fields.updateIn([fieldName, 'validationErrors'], function(list) {
          if (validators[fieldName].validationErrors.length === 0) {
            list = list.clear()
          } else if (validators[fieldName].validationErrors.length > list.size) {
            validators[fieldName].validationErrors.forEach(function(error, key) {
              list = list.set(key, error);
            });
          } else {
            list.forEach(function(value, key) {
              if (validators[fieldName].validationErrors[key]) {
                list = list.set(key, validators[fieldName].validationErrors[key]);
              } else {
                list = list.remove(key);
              }
            });
          }

          return list;
        });
      }
    } else {
      fields.forEach(function(field, fieldName) {
        if (validators[fieldName].isActive()) {
          validators[fieldName].validate(field.get('value'));
          fields = fields.setIn([fieldName, 'isValid'], validators[fieldName].valid);
          fields = fields.updateIn([fieldName, 'validationErrors'], function(list) {
            if (validators[fieldName].validationErrors.length === 0) {
              list = list.clear()
            } else if (validators[fieldName].validationErrors.length > list.size) {
              validators[fieldName].validationErrors.forEach(function(error, key) {
                list = list.set(key, error);
              });
            } else {
              list.forEach(function(value, key) {
                if (validators[fieldName].validationErrors[key]) {
                  list = list.set(key, validators[fieldName].validationErrors[key]);
                } else {
                  list = list.remove(key);
                }
              });
            }

            return list;
          });
        }
      });
    }
  },

  formData.isValid = function(fieldName) {
    if (fieldName) {
      return fields.getIn([fieldName, 'isValid']);
    } else {
      var isValid = true;
      var invalidFields = [];
      var fieldNames = Object.keys(fields.toJSON());
      var count = fieldNames.length;

      for(var x = 0; x < count; x += 1) {
        if (fields.getIn([fieldNames[x], 'isValid']) !== true) {
          isValid = false;
          invalidFields.push(fieldNames[x]);
        }
      }

      return isValid || invalidFields;
    }
  };

  formData.isDirty = function(fieldName) {
    if (fieldName) {
      return fields.getIn([fieldName, 'isDirty']);
    } else {
      var isDirty = true;
      var fieldNames = Object.keys(fields.toJSON());
      var count = fieldNames.length;

      for(var x = 0; x < count; x += 1) {
        if (fields.getIn([fieldNames[x], 'isDirty']) !== true) {
          isDirty = false;
        }
      }

      return isDirty;
    }
  };

  formData.hasBeenValidated = function(fieldName) {
    if (fieldName) {
      return fields.getIn([fieldName, 'isValid']) !== null;
    } else {
      var hasBeenValidated = true;
      var unvalidatedFields = [];
      var fieldNames = Object.keys(fields.toJSON());
      var count = fieldNames.length;

      for(var x = 0; x < count; x += 1) {
        if (fields.getIn([fieldNames[x], 'isValid']) === null) {
          hasBeenValidated = false;
          unvalidatedFields.push(fieldNames[x]);
        }
      }

      return hasBeenValidated || unvalidatedFields;
    }
  };

  formData.disableValidation = function(fieldName) {
    if (fieldName) {
      fields = fields.setIn([fieldName, 'isValid'], null);
      fields = fields.setIn([fieldName, 'validationErrors'], fields.getIn([fieldName, 'validationErrors']).clear());
      validators[fieldName].updateOptions({
        isActive: false
      });
    } else {
      var fieldNames = Object.keys(fields.toJSON());
      var count = fieldNames.length;

      for(var x = 0; x < count; x += 1) {
        fields = fields.setIn([fieldNames[x], 'isValid'], null);
        fields = fields.setIn([fieldNames[x], 'validationErrors'], fields.getIn([fieldNames[x], 'validationErrors']).clear());
        validators[fieldNames[x]].updateOptions({
          isActive: false
        });
      }
    }
  },

  formData.enableValidation = function(fieldName) {
    if (fieldName) {
      validators[fieldName].updateOptions({
        isActive: true
      });
    } else {
      var fieldNames = Object.keys(fields.toJSON());
      var count = fieldNames.length;

      for(var x = 0; x < count; x += 1) {
        validators[fieldNames[x]].updateOptions({
          isActive: true
        });
      }
    }
  },

  //NOTE: field names can be passed as arguments
  formData.getValidationMessages = function() {
    var passedFieldNames = Array.prototype.slice.call(arguments);
    var fieldNamesToLoop = passedFieldNames.length > 0 ? passedFieldNames : Object.keys(fields.toJSON());
    var fieldValidationMessages = null;

    fieldNamesToLoop.forEach(function(fieldName) {
      //TODO: should probably have error when trying to access fieldName that does not exist
      var validationErrors = fields.getIn([fieldName, 'validationErrors']).toJSON();

      if (validationErrors.length > 0) {
        if (!fieldValidationMessages) {
          fieldValidationMessages = [];
        }

        fieldValidationMessages = fieldValidationMessages.concat(validationErrors);
      }
    });

    return fieldValidationMessages;
  };

  formData.getGroupedValidationMessages = function() {
    var passedFieldNames = Array.prototype.slice.call(arguments);
    var fieldNamesToLoop = passedFieldNames.length > 0 ? passedFieldNames : Object.keys(fields.toJSON());
    var fieldValidationMessages = null;

    fieldNamesToLoop.forEach(function(fieldName) {
      //TODO: should probably have error when trying to access fieldName that does not exist
      var validationErrors = fields.getIn([fieldName, 'validationErrors']).toJSON();

      if (validationErrors.length > 0) {
        if (!fieldValidationMessages) {
          fieldValidationMessages = {};
        }

        fieldValidationMessages[fieldName] = validationErrors;
      }
    });

    return fieldValidationMessages;
  };

  formData.asImmutable = function() {
    return fields;
  };

  formData.asJson = function() {
    return fields.toJSON();
  };

  return formData;
};
