var validatorFactory = require('./validator-factory');
var assign = require('lodash.assign');
var forEach = require('lodash.foreach');
var isString = require('lodash.isstring');
var immutable = require('immutable');

module.exports = function scehmaFactoryCreate(options) {
  var scehma = {};
  var validators = {};
  var properties = immutable.Map({});

  if (process.env.NODE_ENV !== 'production' && !options.properties) {
    console.warn('Creating a new schema without any properties doesn\'t seem that useful');
  }

  forEach(options.properties, function(options, propertyName) {
    var initialValue = options.initialValue || '';
    var validatorOptions = assign({
      initialValue: initialValue
    }, options.validatorOptions || {});

    //add the scehma context to all validators
    if (validatorOptions.validators && validatorOptions.validators.length > 0) {
      validatorOptions.validators.forEach(function(validator, key) {
        validatorOptions.validators[key].context = scehma;
      });
    }

    validators[propertyName] = validatorFactory(validatorOptions);
    var initialDataStructure = immutable.Map({
      initialValue: initialValue,
      value: initialValue,
      isValid: null,
      validationErrors: immutable.List([])
    });
    properties = properties.set(propertyName, initialDataStructure);
  });

  scehma.get = function scehmaGetValue(propertyName) {
    if (propertyName) {
      return properties.getIn([propertyName, 'value']);
    } else {
      var propertyValues = {};

      properties.forEach(function(property, propertyName) {
        propertyValues[propertyName] = property.get('value');
      });

      return propertyValues;
    }
  };

  scehma.set = function scehmaSetValue(propertyName, newValue) {
    if (isString(propertyName)) {
      properties = properties.setIn([propertyName, 'value'], newValue);
    } else {
      forEach(propertyName, function(value, key) {
        properties = properties.setIn([key, 'value'], value);
      });
    }
  };

  scehma.reset = function scehmaResetValue(propertyName) {
    if (propertyName) {
      properties = properties.setIn([propertyName, 'value'], properties.getIn([propertyName, 'initialValue']));
      properties = properties.setIn([propertyName, 'validationErrors'], properties.getIn([propertyName, 'validationErrors']).clear());
    } else {
      properties.forEach(function(property, propertyName) {
        properties = properties.setIn([propertyName, 'value'], properties.getIn([propertyName, 'initialValue']));
        properties = properties.setIn([propertyName, 'validationErrors'], properties.getIn([propertyName, 'validationErrors']).clear());
      });
    }
  };

  scehma.validate = function scehmaValidate(propertyName) {
    if (propertyName) {
      validators[propertyName].validate(properties.getIn([propertyName, 'value']));
      properties = properties.setIn([propertyName, 'isValid'], validators[propertyName].valid);
      properties = properties.updateIn([propertyName, 'validationErrors'], function(list) {
        if (validators[propertyName].validationErrors.length === 0) {
          list = list.clear()
        } else if (validators[propertyName].validationErrors.length > list.size) {
          validators[propertyName].validationErrors.forEach(function(error, key) {
            list = list.set(key, error);
          });
        } else {
          list.forEach(function(value, key) {
            if (validators[propertyName].validationErrors[key]) {
              list = list.set(key, validators[propertyName].validationErrors[key]);
            } else {
              list = list.remove(key);
            }
          });
        }

        return list;
      });
    } else {
      properties.forEach(function(property, propertyName) {
        validators[propertyName].validate(property.get('value'));
        properties = properties.setIn([propertyName, 'isValid'], validators[propertyName].valid);
        properties = properties.updateIn([propertyName, 'validationErrors'], function(list) {
          if (validators[propertyName].validationErrors.length === 0) {
            list = list.clear()
          } else if (validators[propertyName].validationErrors.length > list.size) {
            validators[propertyName].validationErrors.forEach(function(error, key) {
              list = list.set(key, error);
            });
          } else {
            list.forEach(function(value, key) {
              if (validators[propertyName].validationErrors[key]) {
                list = list.set(key, validators[propertyName].validationErrors[key]);
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

  scehma.isValid = function scehmaIsValid(propertyName) {
    this.validate(propertyName);

    if (propertyName) {
      return properties.getIn([propertyName, 'isValid']);
    } else {
      var isValid = true;
      var invalidFields = [];
      var propertyNames = Object.keys(properties.toJSON());
      var count = propertyNames.length;

      for(var x = 0; x < count; x += 1) {
        if (properties.getIn([propertyNames[x], 'isValid']) !== true) {
          isValid = false;
          invalidFields.push(propertyNames[x]);
        }
      }

      return isValid || invalidFields;
    }
  };

  scehma.getValidationMessages = function scehmaGetValidationMessage (propertyName) {
    if (propertyName) {
      return properties.getIn([propertyName, 'validationErrors']).toJSON();
    } else {
      var propertyValidationMessages = null;

      properties.forEach(function(property, propertyName) {
        var validationErrors = properties.getIn([propertyName, 'validationErrors']).toJSON();

        if (validationErrors.length > 0) {
          if (!propertyValidationMessages) {
            propertyValidationMessages = {};
          }

          propertyValidationMessages[propertyName] = validationErrors;
        }
      });

      return propertyValidationMessages;
    }
  };

  scehma.getImmutable = function scehmaGetImmutable() {
    return properties;
  }

  return scehma;
};