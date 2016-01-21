var formDataFactory = require('../../index').formDataFactory;
var helpers = require('../../index').helpers;
var deepEqual = require('deep-equal');
var expect = require('chai').expect;

var configSingle = {
  fields: {
    firstName: {}
  }
};

var configTwoValidation = {
  fields: {
    firstName: {
      validatorOptions: {
        validators: [{
          validator: function(value) {
            return value === 'test';
          },
          message: '"%%value%%" is not "test"'
        }]
      }
    },
    lastName: {
      validatorOptions: {
        validators: [{
          validator: function(value) {
            return value === 'test';
          },
          message: '"%%value%%" is not "test"'
        }]
      }
    }
  }
};

var configBasic = {
  fields: {
    firstName: {},
    lastName: {},
    email: {},
    password: {},
    confirmPassword: {}
  }
};

var configInitialValue = {
  fields: {
    firstName: {
      initialValue: 'initial'
    },
    lastName: {},
    email: {},
    password: {},
    confirmPassword: {}
  }
};

var configValidation = {
  fields: {
    firstName: {
      validatorOptions: {
        validators: [{
          validator: function(value) {
            return value === 'test';
          },
          message: '"%%value%%" is not "test"'
        }]
      }
    },
    lastName: {
      validatorOptions: {
        validators: [{
          validator: function(value) {
            return value === 'test';
          },
          message: '"%%value%%" is not "test"'
        }]
      }
    },
    email: {
      validatorOptions: {
        validators: [{
          validator: function(value) {
            return value === 'test';
          },
          message: '"%%value%%" is not "test"'
        }]
      }
    },
    password: {
      validatorOptions: {
        validators: [{
          validator: function(value) {
            return value === 'test';
          },
          message: '"%%value%%" is not "test"'
        }]
      }
    },
    confirmPassword: {
      validatorOptions: {
        validators: [{
          validator: function(value) {
            return value === 'test';
          },
          message: '"%%value%%" is not "test"'
        }]
      }
    }
  }
};

var configMultiValidation = {
  fields: {
    firstName: {
      validatorOptions: {
        validators: [{
          validator: function(value) {
            return value.length > 3;
          },
          message: '"%%value%%" is not at least 4 characters'
        }, {
          validator: function(value) {
            return value.length > 4;
          },
          message: '"%%value%%" is not at least 5 characters'
        }]
      }
    },
    lastName: {
      validatorOptions: {
        validators: [{
          validator: function(value) {
            return value === 'test';
          },
          message: '"%%value%%" is not "test"'
        }]
      }
    },
    email: {
      validatorOptions: {
        validators: [{
          validator: function(value) {
            return value === 'test';
          },
          message: '"%%value%%" is not "test"'
        }]
      }
    },
    password: {
      validatorOptions: {
        validators: [{
          validator: function(value) {
            return value === 'test';
          },
          message: '"%%value%%" is not "test"'
        }]
      }
    },
    confirmPassword: {
      validatorOptions: {
        validators: [{
          validator: function(value) {
            return value === 'test';
          },
          message: '"%%value%%" is not "test"'
        }]
      }
    }
  }
};

describe('form data factory', function() {
  describe('basic functionality', function() {
    it('should be able to get specific field value', function() {
      var formData = formDataFactory(configBasic);

      expect(helpers.get(formData, 'firstName')).to.equal('');
    });

    it('should be able to get specific initial value', function() {
      var formData = formDataFactory(configInitialValue);

      expect(helpers.get(formData, 'firstName')).to.equal('initial');
    });

    it('should be able to get all formData values', function() {
      var formData = formDataFactory(configBasic);

      expect(helpers.get(formData)).to.deep.equal({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    });

    it('should be able to set specific field value', function() {
      var formData = formDataFactory(configBasic);

      formData = helpers.set(formData, 'firstName', 'test');

      expect(helpers.get(formData, 'firstName')).to.equal('test');
      expect(helpers.isDirty(formData, 'firstName')).to.be.true;
    });

    it('should be able to skip marking field as dirty when setting field value', function() {
      var formData = formDataFactory(configBasic);

      formData = helpers.set(formData, 'firstName', 'test', false);

      expect(helpers.isDirty(formData, 'firstName')).to.be.false;
    });

    it('should be able mark field as dirty', function() {
      var formData = formDataFactory(configBasic);

      formData = helpers.markFieldAsDirty(formData, 'firstName');

      expect(helpers.isDirty(formData, 'firstName')).to.be.true;
    });

    it('should be able mark field as clean', function() {
      var formData = formDataFactory(configBasic);

      formData = helpers.set(formData, 'firstName', 'test');
      formData = helpers.markFieldAsClean(formData, 'firstName');

      expect(helpers.isDirty(formData, 'firstName')).to.be.false;
    });

    it('should be able to set all formData values', function() {
      var formData = formDataFactory(configBasic);

      formData = helpers.set(formData, {
        firstName: 'first',
        lastName: 'last',
        email: 'email',
        password: 'password',
        confirmPassword: 'confirm'
      });

      expect(helpers.get(formData)).to.deep.equal({
        firstName: 'first',
        lastName: 'last',
        email: 'email',
        password: 'password',
        confirmPassword: 'confirm'
      });
    });

    it('should be able to reset specific field value', function() {
      var formData = formDataFactory(configBasic);

      formData = helpers.set(formData, 'firstName', 'test');
      formData = helpers.reset(formData, 'firstName');

      expect(helpers.get(formData, 'firstName')).to.equal('');
    });

    it('should be able to reset all formData values', function() {
      var formData = formDataFactory(configBasic);

      formData = helpers.set(formData, {
        firstName: 'first',
        lastName: 'last',
        email: 'email',
        password: 'password',
        confirmPassword: 'confirm'
      });

      formData = helpers.reset(formData);

      expect(helpers.get(formData)).to.deep.equal({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    });

    it('should be able to add fields after initial creation', function() {
      var formData = formDataFactory(configSingle);

      formData = helpers.addField(formData, 'lastName', {});

      expect(helpers.get(formData)).to.deep.equal({
        firstName: '',
        lastName: ''
      });
    });

    it('should be able to remove fields after initial creation', function() {
      var formData = formDataFactory(configSingle);

      formData = helpers.addField(formData, 'lastName', {});
      formData = helpers.removeField(formData, 'firstName');

      expect(helpers.get(formData)).to.deep.equal({
        lastName: ''
      });
    });

    it('should be able to convert to JSON object', function() {
      var formData = formDataFactory(configTwoValidation);

      formData = helpers.set(formData, 'lastName', 'test');

      formData = helpers.validate(formData);

      expect(helpers.asJson(formData)).to.deep.equal({
        firstName: {
          initialValue: '',
          value: '',
          isValid: false,
          validationErrors: [
            '"" is not "test"'
          ],
          isDirty: false
        },
        lastName: {
          initialValue: '',
          value: 'test',
          isValid: true,
          validationErrors: [],
          isDirty: true
        }
      });
    });
  });

  describe('validation', function() {
    it('should return null is validation has not be performed', function() {
      var formData = formDataFactory(configValidation);

      expect(helpers.isValid(formData, 'firstName')).to.be.null;
    });

    it('should validate to false for specific field', function() {
      var formData = formDataFactory(configValidation);

      formData = helpers.validate(formData, 'firstName');

      expect(helpers.isValid(formData, 'firstName')).to.be.false;
    });

    it('should validate to true for specific field', function() {
      var formData = formDataFactory(configValidation);

      formData = helpers.set(formData, 'firstName', 'test');
      formData = helpers.validate(formData, 'firstName');

      expect(helpers.isValid(formData, 'firstName')).to.be.true;
    });

    it('should validate to false for all fields', function() {
      var formData = formDataFactory(configValidation);

      expect(helpers.isValid(formData)).to.deep.equal([
        'firstName',
        'lastName',
        'email',
        'password',
        'confirmPassword'
      ]);
    });

    it('should validate to true for all fields', function() {
      var formData = formDataFactory(configValidation);

      formData = helpers.set(formData, {
        firstName: 'test',
        lastName: 'test',
        email: 'test',
        password: 'test',
        confirmPassword: 'test'
      });

      formData = helpers.validate(formData);

      expect(helpers.isValid(formData)).to.be.true;
    });

    it('should be able to get validation messages for a specific field', function() {
      var formData = formDataFactory(configValidation);

      formData = helpers.validate(formData);

      expect(helpers.getValidationMessages(formData, 'firstName')).to.deep.equal([
        '"" is not "test"'
      ]);
      expect(helpers.getGroupedValidationMessages(formData, 'firstName')).to.deep.equal({
        firstName: [
          '"" is not "test"'
        ]
      });
    });

    it('should be able to get validation messages for all fields', function() {
      var formData = formDataFactory(configValidation);

      formData = helpers.validate(formData);

      expect(helpers.getValidationMessages(formData)).to.deep.equal([
        '"" is not "test"',
        '"" is not "test"',
        '"" is not "test"',
        '"" is not "test"',
        '"" is not "test"'
      ]);
      expect(helpers.getGroupedValidationMessages(formData)).to.deep.equal({
        firstName: [
          '"" is not "test"'
        ],
        lastName:[
          '"" is not "test"'
        ],
        email: [
          '"" is not "test"'
        ],
        password: [
          '"" is not "test"'
        ],
        confirmPassword: [
          '"" is not "test"'
        ]
      });
    });

    it('should reset validation message when resetting formData', function() {
      var formData = formDataFactory(configValidation);

      formData = helpers.validate(formData);
      formData = helpers.reset(formData);

      expect(helpers.getValidationMessages(formData)).to.be.null;
      expect(helpers.getGroupedValidationMessages(formData)).to.be.null;
    });

    it('should reset validation message when resetting a value', function() {
      var formData = formDataFactory(configValidation);

      formData = helpers.validate(formData);
      formData = helpers.reset(formData, 'firstName');

      expect(helpers.getValidationMessages(formData)).to.deep.equal([
        '"" is not "test"',
        '"" is not "test"',
        '"" is not "test"',
        '"" is not "test"'
      ]);
      expect(helpers.getGroupedValidationMessages(formData)).to.deep.equal({
        lastName: [
          '"" is not "test"'
        ],
        email: [
          '"" is not "test"'
        ],
        password: [
          '"" is not "test"'
        ],
        confirmPassword: [
          '"" is not "test"'
        ]
      });
    });

    it('should remove validation message when valid', function() {
      var formData = formDataFactory(configValidation);

      formData = helpers.validate(formData);
      formData = helpers.set(formData, 'firstName', 'test');
      formData = helpers.validate(formData);

      expect(helpers.getValidationMessages(formData)).to.deep.equal([
        '"" is not "test"',
        '"" is not "test"',
        '"" is not "test"',
        '"" is not "test"'
      ]);
      expect(helpers.getGroupedValidationMessages(formData)).to.deep.equal({
        lastName: [
          '"" is not "test"'
        ],
        email: [
          '"" is not "test"'
        ],
        password: [
          '"" is not "test"'
        ],
        confirmPassword: [
          '"" is not "test"'
        ]
      });
    });

    it('should remove validation message that are valid when muliple rules exist', function() {
      var formData = formDataFactory(configMultiValidation);

      formData = helpers.set(formData, 'firstName', 'tes');
      formData = helpers.validate(formData);

      expect(helpers.getValidationMessages(formData)).to.deep.equal([
        '"tes" is not at least 4 characters',
        '"tes" is not at least 5 characters',
        '"" is not "test"',
        '"" is not "test"',
        '"" is not "test"',
        '"" is not "test"'
      ]);
      expect(helpers.getGroupedValidationMessages(formData)).to.deep.equal({
        firstName: [
          '"tes" is not at least 4 characters',
          '"tes" is not at least 5 characters'
        ],
        lastName: [
          '"" is not "test"'
        ],
        email: [
          '"" is not "test"'
        ],
        password: [
          '"" is not "test"'
        ],
        confirmPassword: [
          '"" is not "test"'
        ]
      });

      formData = helpers.set(formData, 'firstName', 'test');
      formData = helpers.validate(formData);

      expect(helpers.getValidationMessages(formData)).to.deep.equal([
        '"test" is not at least 5 characters',
        '"" is not "test"',
        '"" is not "test"',
        '"" is not "test"',
        '"" is not "test"'
      ]);
      expect(helpers.getGroupedValidationMessages(formData)).to.deep.equal({
        firstName: [
          '"test" is not at least 5 characters'
        ],
        lastName: [
          '"" is not "test"'
        ],
        email: [
          '"" is not "test"'
        ],
        password: [
          '"" is not "test"'
        ],
        confirmPassword: [
          '"" is not "test"'
        ]
      });
    });

    it('should be able to disable validation for one field', function() {
      var formData = formDataFactory(configTwoValidation);

      formData = helpers.validate(formData);

      expect(formData.getIn(['firstName', 'isValid'])).to.be.false;
      expect(formData.getIn(['firstName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);
      expect(formData.getIn(['lastName', 'isValid'])).to.be.false;
      expect(formData.getIn(['lastName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);

      formData = helpers.disableValidation(formData, 'firstName');
      formData = helpers.validate(formData);

      expect(formData.getIn(['firstName', 'isValid'])).to.be.null;
      expect(formData.getIn(['firstName', 'validationErrors']).toArray()).to.deep.equal([]);
      expect(formData.getIn(['lastName', 'isValid'])).to.be.false;
      expect(formData.getIn(['lastName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);
    });

    it('should be able to disable validation for all fields', function() {
      var formData = formDataFactory(configTwoValidation);

      formData = helpers.validate(formData);

      expect(formData.getIn(['firstName', 'isValid'])).to.be.false;
      expect(formData.getIn(['firstName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);
      expect(formData.getIn(['lastName', 'isValid'])).to.be.false;
      expect(formData.getIn(['lastName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);

      formData = helpers.disableValidation(formData);
      formData = helpers.validate(formData);

      expect(formData.getIn(['firstName', 'isValid'])).to.be.null;
      expect(formData.getIn(['firstName', 'validationErrors']).toArray()).to.deep.equal([]);
      expect(formData.getIn(['lastName', 'isValid'])).to.be.null;
      expect(formData.getIn(['lastName', 'validationErrors']).toArray()).to.deep.equal([]);
    });

    it('should be able to enable validation for one field', function() {
      var formData = formDataFactory(configTwoValidation);

      formData = helpers.validate(formData);

      expect(formData.getIn(['firstName', 'isValid'])).to.be.false;
      expect(formData.getIn(['firstName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);
      expect(formData.getIn(['lastName', 'isValid'])).to.be.false;
      expect(formData.getIn(['lastName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);

      formData = helpers.disableValidation(formData, 'firstName');
      formData = helpers.validate(formData);

      expect(formData.getIn(['firstName', 'isValid'])).to.be.null;
      expect(formData.getIn(['firstName', 'validationErrors']).toArray()).to.deep.equal([]);
      expect(formData.getIn(['lastName', 'isValid'])).to.be.false;
      expect(formData.getIn(['lastName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);

      formData = helpers.enableValidation(formData, 'firstName');
      formData = helpers.validate(formData);

      expect(formData.getIn(['firstName', 'isValid'])).to.be.false;
      expect(formData.getIn(['firstName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);
      expect(formData.getIn(['lastName', 'isValid'])).to.be.false;
      expect(formData.getIn(['lastName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);
    });

    it('should be able to enable validation for all fields', function() {
      var formData = formDataFactory(configTwoValidation);

      formData = helpers.validate(formData);

      expect(formData.getIn(['firstName', 'isValid'])).to.be.false;
      expect(formData.getIn(['firstName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);
      expect(formData.getIn(['lastName', 'isValid'])).to.be.false;
      expect(formData.getIn(['lastName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);

      formData = helpers.disableValidation(formData);
      formData = helpers.validate(formData);

      expect(formData.getIn(['firstName', 'isValid'])).to.be.null;
      expect(formData.getIn(['firstName', 'validationErrors']).toArray()).to.deep.equal([]);
      expect(formData.getIn(['lastName', 'isValid'])).to.be.null;
      expect(formData.getIn(['lastName', 'validationErrors']).toArray()).to.deep.equal([]);

      formData = helpers.enableValidation(formData);
      formData = helpers.validate(formData);

      expect(formData.getIn(['firstName', 'isValid'])).to.be.false;
      expect(formData.getIn(['firstName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);
      expect(formData.getIn(['lastName', 'isValid'])).to.be.false;
      expect(formData.getIn(['lastName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);
    });

    it('should be able to tell if a field has been validated', function() {
      var formData = formDataFactory(configTwoValidation);

      formData = helpers.validate(formData, 'firstName');

      expect(helpers.hasBeenValidated(formData, 'firstName')).to.be.true;
      expect(helpers.hasBeenValidated(formData, 'lastName')).to.be.false;
    });

    it('should be able to tell if the all field of form have been validated', function() {
      var formData = formDataFactory(configTwoValidation);

      formData = helpers.validate(formData);

      expect(helpers.hasBeenValidated(formData)).to.be.true;
    });

    it('should be able to tell what field have not been validated', function() {
      var formData = formDataFactory(configTwoValidation);

      expect(helpers.hasBeenValidated(formData)).to.deep.equal([
        'firstName',
        'lastName'
      ]);

      formData = helpers.validate(formData, 'firstName');

      expect(helpers.hasBeenValidated(formData)).to.deep.equal([
        'lastName'
      ]);
    });
  });

  describe('diff testing', function() {
    it('should equate to false when a value has changed', function() {
      var formData = formDataFactory(configBasic);
      var newFormData = helpers.set(formData, 'firstName', 'test');

      expect(formData === newFormData).to.be.false;
    });

    it('should equate to true when a value has not changed from initial', function() {
      var formData = formDataFactory(configBasic);
      var newFormData = helpers.set(formData, 'firstName', '');

      expect(formData === newFormData).to.be.true;
    });

    it('should not be effected when calling validate on the formData', function() {
      var formData = formDataFactory(configValidation);

      formData = helpers.set(formData, 'firstName', 'tes');

      var changedData1 = helpers.validate(formData);
      var changedData2 = helpers.validate(changedData1);

      expect(changedData1 === changedData2).to.be.true;
    });
  });
});