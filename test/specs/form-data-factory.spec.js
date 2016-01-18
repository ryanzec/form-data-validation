var formDataFactory = require('../../index').formDataFactory;
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

      expect(formData.get('firstName')).to.equal('');
    });

    it('should be able to get specific initial value', function() {
      var formData = formDataFactory(configInitialValue);

      expect(formData.get('firstName')).to.equal('initial');
    });

    it('should be able to get all formData values', function() {
      var formData = formDataFactory(configBasic);

      expect(formData.get()).to.deep.equal({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    });

    it('should be able to set specific field value', function() {
      var formData = formDataFactory(configBasic);

      formData.set('firstName', 'test');

      expect(formData.get('firstName')).to.equal('test');
      expect(formData.isDirty('firstName')).to.be.true;
    });

    it('should be able to skip marking field as dirty when setting field value', function() {
      var formData = formDataFactory(configBasic);

      formData.set('firstName', 'test', false);

      expect(formData.isDirty('firstName')).to.be.false;
    });

    it('should be able mark field as dirty', function() {
      var formData = formDataFactory(configBasic);

      formData.markFieldAsDirty('firstName');

      expect(formData.isDirty('firstName')).to.be.true;
    });

    it('should be able mark field as clean', function() {
      var formData = formDataFactory(configBasic);

      formData.set('firstName', 'test');
      formData.markFieldAsClean('firstName');

      expect(formData.isDirty('firstName')).to.be.false;
    });

    it('should be able to set all formData values', function() {
      var formData = formDataFactory(configBasic);
      formData.set({
        firstName: 'first',
        lastName: 'last',
        email: 'email',
        password: 'password',
        confirmPassword: 'confirm'
      });

      expect(formData.get()).to.deep.equal({
        firstName: 'first',
        lastName: 'last',
        email: 'email',
        password: 'password',
        confirmPassword: 'confirm'
      });
    });

    it('should be able to reset specific field value', function() {
      var formData = formDataFactory(configBasic);
      formData.set('firstName', 'test');
      formData.reset('firstName');

      expect(formData.get('firstName')).to.equal('');
    });

    it('should be able to reset all formData values', function() {
      var formData = formDataFactory(configBasic);
      formData.set({
        firstName: 'first',
        lastName: 'last',
        email: 'email',
        password: 'password',
        confirmPassword: 'confirm'
      });
      formData.reset();

      expect(formData.get()).to.deep.equal({
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
      var formData = formDataFactory(configValidation);

      expect(formData.isValid('firstName')).to.be.false;
    });

    it('should validate to true for specific field', function() {
      var formData = formDataFactory(configValidation);
      formData.set('firstName', 'test');

      expect(formData.isValid('firstName')).to.be.true;
    });

    it('should validate to false for all fields', function() {
      var formData = formDataFactory(configValidation);

      expect(formData.isValid()).to.deep.equal([
        'firstName',
        'lastName',
        'email',
        'password',
        'confirmPassword'
      ]);
    });

    it('should validate to true for all fields', function() {
      var formData = formDataFactory(configValidation);
      formData.set({
        firstName: 'test',
        lastName: 'test',
        email: 'test',
        password: 'test',
        confirmPassword: 'test'
      });

      expect(formData.isValid()).to.be.true;
    });

    it('should be able to get validation messages for a specific field', function() {
      var formData = formDataFactory(configValidation);

      formData.validate();

      expect(formData.getValidationMessages('firstName')).to.deep.equal([
        '"" is not "test"'
      ]);
    });

    it('should be able to get validation messages for all fields', function() {
      var formData = formDataFactory(configValidation);

      formData.validate();

      expect(formData.getValidationMessages()).to.deep.equal({
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

    it('should reset validation message when resetting formData', function() {
      var formData = formDataFactory(configValidation);

      formData.validate();
      formData.reset();

      expect(formData.getValidationMessages()).to.be.null;
    });

    it('should reset validation message when resetting a value', function() {
      var formData = formDataFactory(configValidation);

      formData.validate();
      formData.reset('firstName');

      expect(formData.getValidationMessages()).to.deep.equal({
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

      formData.validate();
      formData.set('firstName', 'test');
      formData.validate();

      expect(formData.getValidationMessages()).to.deep.equal({
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

      formData.set('firstName', 'tes');
      formData.validate();

      expect(formData.getValidationMessages()).to.deep.equal({
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

      formData.set('firstName', 'test');
      formData.validate();

      expect(formData.getValidationMessages()).to.deep.equal({
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

    it('should call the validator function in the context of the formData object', function(done) {
      var formData = formDataFactory({
        fields: {
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
      formData.validate();
    });

    it('should be able to disable validation for one field', function() {
      var formData = formDataFactory(configTwoValidation);

      formData.validate();

      expect(formData.getImmutable().getIn(['firstName', 'isValid'])).to.be.false;
      expect(formData.getImmutable().getIn(['firstName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);
      expect(formData.getImmutable().getIn(['lastName', 'isValid'])).to.be.false;
      expect(formData.getImmutable().getIn(['lastName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);

      formData.disableValidation('firstName');
      formData.validate();

      expect(formData.getImmutable().getIn(['firstName', 'isValid'])).to.be.null;
      expect(formData.getImmutable().getIn(['firstName', 'validationErrors']).toArray()).to.deep.equal([]);
      expect(formData.getImmutable().getIn(['lastName', 'isValid'])).to.be.false;
      expect(formData.getImmutable().getIn(['lastName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);
    });

    it('should be able to disable validation for all fields', function() {
      var formData = formDataFactory(configTwoValidation);

      formData.validate();

      expect(formData.getImmutable().getIn(['firstName', 'isValid'])).to.be.false;
      expect(formData.getImmutable().getIn(['firstName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);
      expect(formData.getImmutable().getIn(['lastName', 'isValid'])).to.be.false;
      expect(formData.getImmutable().getIn(['lastName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);

      formData.disableValidation();
      formData.validate();

      expect(formData.getImmutable().getIn(['firstName', 'isValid'])).to.be.null;
      expect(formData.getImmutable().getIn(['firstName', 'validationErrors']).toArray()).to.deep.equal([]);
      expect(formData.getImmutable().getIn(['lastName', 'isValid'])).to.be.null;
      expect(formData.getImmutable().getIn(['lastName', 'validationErrors']).toArray()).to.deep.equal([]);
    });

    it('should be able to enable validation for one field', function() {
      var formData = formDataFactory(configTwoValidation);

      formData.validate();

      expect(formData.getImmutable().getIn(['firstName', 'isValid'])).to.be.false;
      expect(formData.getImmutable().getIn(['firstName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);
      expect(formData.getImmutable().getIn(['lastName', 'isValid'])).to.be.false;
      expect(formData.getImmutable().getIn(['lastName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);

      formData.disableValidation('firstName');
      formData.validate();

      expect(formData.getImmutable().getIn(['firstName', 'isValid'])).to.be.null;
      expect(formData.getImmutable().getIn(['firstName', 'validationErrors']).toArray()).to.deep.equal([]);
      expect(formData.getImmutable().getIn(['lastName', 'isValid'])).to.be.false;
      expect(formData.getImmutable().getIn(['lastName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);

      formData.enableValidation('firstName');
      formData.validate();

      expect(formData.getImmutable().getIn(['firstName', 'isValid'])).to.be.false;
      expect(formData.getImmutable().getIn(['firstName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);
      expect(formData.getImmutable().getIn(['lastName', 'isValid'])).to.be.false;
      expect(formData.getImmutable().getIn(['lastName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);
    });

    it('should be able to enable validation for all fields', function() {
      var formData = formDataFactory(configTwoValidation);

      formData.validate();

      expect(formData.getImmutable().getIn(['firstName', 'isValid'])).to.be.false;
      expect(formData.getImmutable().getIn(['firstName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);
      expect(formData.getImmutable().getIn(['lastName', 'isValid'])).to.be.false;
      expect(formData.getImmutable().getIn(['lastName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);

      formData.disableValidation();
      formData.validate();

      expect(formData.getImmutable().getIn(['firstName', 'isValid'])).to.be.null;
      expect(formData.getImmutable().getIn(['firstName', 'validationErrors']).toArray()).to.deep.equal([]);
      expect(formData.getImmutable().getIn(['lastName', 'isValid'])).to.be.null;
      expect(formData.getImmutable().getIn(['lastName', 'validationErrors']).toArray()).to.deep.equal([]);

      formData.enableValidation();
      formData.validate();

      expect(formData.getImmutable().getIn(['firstName', 'isValid'])).to.be.false;
      expect(formData.getImmutable().getIn(['firstName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);
      expect(formData.getImmutable().getIn(['lastName', 'isValid'])).to.be.false;
      expect(formData.getImmutable().getIn(['lastName', 'validationErrors']).toArray()).to.deep.equal(['"" is not "test"']);
    });
  });

  it('should be able to add fields after initial creation', function() {
    var formData = formDataFactory(configSingle);

    formData.addField('lastName', {});

    expect(formData.get()).to.deep.equal({
      firstName: '',
      lastName: ''
    });
  });

  describe('diff testing', function() {
    it('should equate to false when a value has changed', function() {
      var formData = formDataFactory(configBasic);
      var initialData = formData.getImmutable();

      formData.set('firstName', 'test');

      var changedData = formData.getImmutable();

      expect(initialData === changedData).to.be.false;
    });

    it('should equate to true when a value has not changed from initial', function() {
      var formData = formDataFactory(configBasic);
      var initialData = formData.getImmutable();

      formData.set('firstName', '');

      var changedData = formData.getImmutable();

      expect(initialData === changedData).to.be.true;
    });

    it('should not be effected when calling validate on the formData', function() {
      var formData = formDataFactory(configValidation);

      formData.set('firstName', 'tes');

      formData.validate();

      var changedData1 = formData.getImmutable();

      formData.validate();

      var changedData2 = formData.getImmutable();

      expect(changedData1 === changedData2).to.be.true;
    });
  });
});