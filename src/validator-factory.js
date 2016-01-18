var assign = require('lodash.assign');
var isArray = require('lodash.isarray');

var isValueEmpty = function isValueEmpty(value) {
  return value === '' || value === null || value === undefined || value.length === 0;
};

module.exports = function validatorFactoryCreate(options) {
  options = options || {};
  options = assign({
    validateValueOnCreate: undefined,
    validators: [],
    initialValue: null,
    allowEmpty: false,
    isActive: true,
  }, options);

  if (options.validators && !isArray(options.validators)) {
    throw new Error('You must pass validators as an array');
  }

  var validator = {};

  validator.validationHasHappened = false;

  validator.lastValidatedValue = null;

  validator._valid = null;

  validator.validationErrors = [];

  validator.validate = function validatorValidate(value) {
    if (options.isActive) {
      this.validationErrors = [];
      this.valid = true;
      this.lastValidatedValue = value;

      if (options.validators.length > 0) {
        if (!isValueEmpty(value) || options.allowEmpty !== true) {
          options.validators.forEach(function validatorValidateValidatorsLoop(validator) {
            var context = validator.context || null;
            if (validator.validator.call(context, value, validator.options) !== true) {
              this.valid = false;

              if (validator.message) {
                this.validationErrors.push(validator.message.replace('%%value%%', value));
              }
            }
          }.bind(this));
        }
      }

      this.validationHasHappened = true;
    }
  };

  validator.reset = function validatorReset() {
    this.validationHasHappened = false;
    this.lastValidatedValue = null;
    this.valid = null;
    this.validationErrors = [];

    if (options.validateValueOnCreate !== undefined) {
      this.validate(options.validateValueOnCreate);
    }
  };

  validator.updateOptions = function validatorUpdateOptions(newOptions) {
    options = assign(options, newOptions);
  };

  validator.isActive = function() {
    return options.isActive;
  };

  //TODO: this propbably should just be a method (trying to be fancy for no reason)
  Object.defineProperty(validator, 'valid', {
    get: function validatorCustomPropertyValueGet() {
      return validator._valid;
    },

    set: function validatorCustomPropertyValueSet(newValue) {
      validator._valid = newValue;
    }
  });

  if (options.validateValueOnCreate !== undefined) {
    validator.validate(options.validateValueOnCreate);
  }

  return validator;
};
