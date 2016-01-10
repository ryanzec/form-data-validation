var schemaFactory = require('../../index').schemaFactory;
var deepEqual = require('deep-equal');
var expect = require('chai').expect;

var configBasic = {
  properties: {
    firstName: {},
    lastName: {},
    email: {},
    password: {},
    confirmPassword: {}
  }
};

var configInitialValue = {
  properties: {
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
  properties: {
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
  properties: {
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

describe('schema', function() {
  describe('basic functionality', function() {
    it('should be able to get specific field value', function() {
      var schema = schemaFactory(configBasic);

      expect(schema.get('firstName')).to.equal('');
    });

    it('should be able to get specific initial value', function() {
      var schema = schemaFactory(configInitialValue);

      expect(schema.get('firstName')).to.equal('initial');
    });

    it('should be able to get all schema values', function() {
      var schema = schemaFactory(configBasic);

      expect(schema.get()).to.deep.equal({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    });

    it('should be able to set specific field value', function() {
      var schema = schemaFactory(configBasic);
      schema.set('firstName', 'test');

      expect(schema.get('firstName')).to.equal('test');
    });

    it('should be able to set all schema values', function() {
      var schema = schemaFactory(configBasic);
      schema.set({
        firstName: 'first',
        lastName: 'last',
        email: 'email',
        password: 'password',
        confirmPassword: 'confirm'
      });

      expect(schema.get()).to.deep.equal({
        firstName: 'first',
        lastName: 'last',
        email: 'email',
        password: 'password',
        confirmPassword: 'confirm'
      });
    });

    it('should be able to reset specific field value', function() {
      var schema = schemaFactory(configBasic);
      schema.set('firstName', 'test');
      schema.reset('firstName');

      expect(schema.get('firstName')).to.equal('');
    });

    it('should be able to reset all schema values', function() {
      var schema = schemaFactory(configBasic);
      schema.set({
        firstName: 'first',
        lastName: 'last',
        email: 'email',
        password: 'password',
        confirmPassword: 'confirm'
      });
      schema.reset();

      expect(schema.get()).to.deep.equal({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    });
  });

  describe('validation', function() {
    it('should validate to false for specific field', function() {
      var schema = schemaFactory(configValidation);

      expect(schema.isValid('firstName')).to.be.false;
    });

    it('should validate to true for specific field', function() {
      var schema = schemaFactory(configValidation);
      schema.set('firstName', 'test');

      expect(schema.isValid('firstName')).to.be.true;
    });

    it('should validate to false for all properties', function() {
      var schema = schemaFactory(configValidation);

      expect(schema.isValid()).to.deep.equal([
        'firstName',
        'lastName',
        'email',
        'password',
        'confirmPassword'
      ]);
    });

    it('should validate to true for all properties', function() {
      var schema = schemaFactory(configValidation);
      schema.set({
        firstName: 'test',
        lastName: 'test',
        email: 'test',
        password: 'test',
        confirmPassword: 'test'
      });

      expect(schema.isValid()).to.be.true;
    });

    it('should be able to get validation messages for a specific field', function() {
      var schema = schemaFactory(configValidation);

      schema.validate();

      expect(schema.getValidationMessages('firstName')).to.deep.equal([
        '"" is not "test"'
      ]);
    });

    it('should be able to get validation messages for all properties', function() {
      var schema = schemaFactory(configValidation);

      schema.validate();

      expect(schema.getValidationMessages()).to.deep.equal({
        firstName: [
          '"" is not "test"'
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

    it('should reset validation message when resetting schema', function() {
      var schema = schemaFactory(configValidation);

      schema.validate();
      schema.reset();

      expect(schema.getValidationMessages()).to.be.null;
    });

    it('should reset validation message when resetting a value', function() {
      var schema = schemaFactory(configValidation);

      schema.validate();
      schema.reset('firstName');

      expect(schema.getValidationMessages()).to.deep.equal({
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
      var schema = schemaFactory(configValidation);

      schema.validate();
      schema.set('firstName', 'test');
      schema.validate();

      expect(schema.getValidationMessages()).to.deep.equal({
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
      var schema = schemaFactory(configMultiValidation);

      schema.set('firstName', 'tes');
      schema.validate();

      expect(schema.getValidationMessages()).to.deep.equal({
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

      schema.set('firstName', 'test');
      schema.validate();

      expect(schema.getValidationMessages()).to.deep.equal({
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

    it('should call the validator function in the context of the schema object', function(done) {
      var schema = schemaFactory({
        properties: {
          firstName: {
            validatorOptions: {
              validators: [{
                validator: function() {
                  expect(this.get('lastName')).to.equal('what?');
                  done();
                }
              }]
            }
          },
          lastName: {
            initialValue: 'what?'
          }
        }
      });
      schema.validate();
    });
  });

  describe('diff testing', function() {
    it('should equate to false when a value has changed', function() {
      var schema = schemaFactory(configBasic);
      var initialData = schema.getImmutable();

      schema.set('firstName', 'test');

      var changedData = schema.getImmutable();

      expect(initialData === changedData).to.be.false;
    });

    it('should equate to true when a value has not changed', function() {
      var schema = schemaFactory(configBasic);
      var initialData = schema.getImmutable();

      schema.set('firstName', '');

      var changedData = schema.getImmutable();

      expect(initialData === changedData).to.be.true;
    });

    it('should equate to true when deep diffing resulting JSON', function() {
      var schema = schemaFactory(configBasic);
      var initialData = schema.getImmutable();

      schema.set('firstName', 'test');
      schema.set('firstName', '');

      var changedData = schema.getImmutable();

      expect(initialData === changedData).to.be.false;
      expect(deepEqual(initialData.toJSON(), changedData.toJSON())).to.be.true;
    });

    it('should not be effected when calling validate on the schema', function() {
      var schema = schemaFactory(configValidation);

      schema.set('firstName', 'tes');

      schema.validate();

      var changedData1 = schema.getImmutable();

      schema.validate();

      var changedData2 = schema.getImmutable();

      expect(changedData1 === changedData2).to.be.true;
    });
  });
});