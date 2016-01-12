var assign = require('lodash.assign');
var isArray = require('lodash.isarray');

var isValueEmpty = function isValueEmpty(value) {
  return value === '' || value === null || value === undefined || value.length === 0;
};

module.exports = function validatorFactoryCreate(options) {
  options = options || {};
  options = assign({
    renderValidation: 'invalid',
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

  validator._valid = true;

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

  validator.shouldRenderValidation = function validatorShouldRenderValidation() {
    return (
      options.renderValidation !== false
      && options.isActive
      && this.validationHasHappened === true
      && (
        this.valid && options.renderValidation !== 'invalid'
        || !this.valid && options.renderValidation !== 'valid'
      )
    );
  };

  validator.reset = function validatorReset() {
    this.validationHasHappened = false;
    this.lastValidatedValue = null;
    this.valid = true;
    this.validationErrors = [];
  };

  validator.updateOptions = function validatorUpdateOptions(newOptions) {
    options = assign(options, newOptions);
  };

  Object.defineProperty(validator, 'valid', {
    get: function validatorCustomPropertyValueGet() {
      return validator._valid || options.isActive === false;
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
