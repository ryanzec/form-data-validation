var validatorFactory = require('./validator-factory');
var assign = require('lodash.assign');
var forEach = require('lodash.foreach');
var isString = require('lodash.isstring');
var immutable = require('immutable');

module.exports = function formDataFactoryCreate(options) {
  var formData = {};
  var validators = {};
  var fields = immutable.Map({});

  if (process.env.NODE_ENV !== 'production' && !options.fields) {
    console.warn('Creating a new form data object without any fields doesn\'t seem that useful');
  }

  forEach(options.fields, function(options, fieldName) {
    var initialValue = options.initialValue || '';
    var validatorOptions = assign({
      initialValue: initialValue
    }, options.validatorOptions || {});

    //add the formData context to all validators
    if (validatorOptions.validators && validatorOptions.validators.length > 0) {
      validatorOptions.validators.forEach(function(validator, key) {
        validatorOptions.validators[key].context = formData;
      });
    }

    validators[fieldName] = validatorFactory(validatorOptions);
    var initialDataStructure = immutable.Map({
      initialValue: initialValue,
      value: initialValue,
      isValid: true,
      validationErrors: immutable.List([])
    });
    fields = fields.set(fieldName, initialDataStructure);
  });

  formData.get = function formDataGetValue(fieldName) {
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

  formData.set = function formDataSetValue(fieldName, newValue) {
    if (isString(fieldName)) {
      fields = fields.setIn([fieldName, 'value'], newValue);
    } else {
      forEach(fieldName, function(value, key) {
        fields = fields.setIn([key, 'value'], value);
      });
    }
  };

  formData.reset = function formDataResetValue(fieldName) {
    if (fieldName) {
      fields = fields.setIn([fieldName, 'value'], fields.getIn([fieldName, 'initialValue']));
      fields = fields.setIn([fieldName, 'validationErrors'], fields.getIn([fieldName, 'validationErrors']).clear());
    } else {
      fields.forEach(function(field, fieldName) {
        fields = fields.setIn([fieldName, 'value'], fields.getIn([fieldName, 'initialValue']));
        fields = fields.setIn([fieldName, 'validationErrors'], fields.getIn([fieldName, 'validationErrors']).clear());
      });
    }
  };

  formData.validate = function formDataValidate(fieldName) {
    if (fieldName) {
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
    } else {
      fields.forEach(function(field, fieldName) {
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
      });
    }
  },

  formData.isValid = function formDataIsValid(fieldName) {
    this.validate(fieldName);

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

  formData.getValidationMessages = function formDataGetValidationMessage (fieldName) {
    if (fieldName) {
      return fields.getIn([fieldName, 'validationErrors']).toJSON();
    } else {
      var fieldValidationMessages = null;

      fields.forEach(function(field, fieldName) {
        var validationErrors = fields.getIn([fieldName, 'validationErrors']).toJSON();

        if (validationErrors.length > 0) {
          if (!fieldValidationMessages) {
            fieldValidationMessages = {};
          }

          fieldValidationMessages[fieldName] = validationErrors;
        }
      });

      return fieldValidationMessages;
    }
  };

  formData.getImmutable = function formDataGetImmutable() {
    return fields;
  }

  return formData;
};