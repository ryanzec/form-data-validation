var forEach = require('lodash.foreach');

module.exports = function validatorCollectionFactoryCreate(validatorsObject) {
  return {
    isValid: function validatorCollectionIsValid() {
      var isValid = true;

      _.forEach(validatorsObject, function validatorCollectionIsValidValidatorsObjectLoop(validator) {
        if (isValid === true && validator.valid === false) {
          isValid = false;
        }
      });

      return isValid;
    },

    getValidationErrors: function validatorCollectionGetValidationErrors() {
      var errorMessages = {};

      _.forEach(validatorsObject, function validatorCollectionGetValidationErrorsValidatorsObjectLoop(validator, field) {
        if (validator.validationErrors.length > 0) {
          errorMessages[field] = validator.validationErrors;
        }
      });

      return errorMessages;
    }
  };
};
