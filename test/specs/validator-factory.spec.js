var validatorFactory = require('../../index').validatorFactory;
var assign = require('lodash.assign');
var clone = require('lodash.clone');
var expect = require('chai').expect;

var minLengthMessage = 'min length of 4 required';
var maxLengthMessage = 'max length of 8 required';
var matchMessage = '"%%value%%" does not equal "match"';

var validatorsConfigNone = {};

var validatorsConfig1NotArray = {
  validators: function() {}
};

var validatorConfigMinLength = {
  validators: [{
    options: {
      length: 4
    },
    validator: function(value, options) {
      return value.length >= options.length;
    }
  }]
};

var validatorConfigMinLengthWithMessage = {
  validators: [{
    message: minLengthMessage,
    options: {
      length: 4
    },
    validator: function(value, options) {
      return value.length >= options.length;
    }
  }]
};

var validatorConfigMinMaxLength = {
  validators: [{
    options: {
      length: 4
    },
    validator: function(value, options) {
      return value.length >= options.length;
    }
  }, {
    options: {
      length: 8
    },
    validator: function(value, options) {
      return value.length <= options.length;
    }
  }]
};

var validatorConfigMinMaxLengthWithMessage = {
  validators: [{
    message: minLengthMessage,
    options: {
      length: 4
    },
    validator: function(value, options) {
      return value.length >= options.length;
    }
  }, {
    message: maxLengthMessage,
    options: {
      length: 8
    },
    validator: function(value, options) {
      return value.length <= options.length;
    }
  }]
};

var validatorConfigMatchWithMessage = {
  validators: [{
    message: matchMessage,
    options: {
      match: 'match',
    },
    validator: function(value, options) {
      return value === options.match;
    }
  }]
}

var validatorConfigMinMaxLengthMatchWithMessage = {
  validators: [{
    message: minLengthMessage,
    options: {
      length: 4
    },
    validator: function(value, options) {
      return value.length >= options.length;
    }
  }, {
    message: maxLengthMessage,
    options: {
      length: 8
    },
    validator: function(value, options) {
      return value.length <= options.length;
    }
  }, {
    message: matchMessage,
    options: {
      match: 'match',
    },
    validator: function(value, options) {
      return value === options.match;
    }
  }]
};

var validatorConfigMinMaxLengthMatchWithMessageAllowEmpty = {
  allowEmpty: true,
  validators: [{
    message: minLengthMessage,
    options: {
      length: 4
    },
    validator: function(value, options) {
      return value.length >= options.length;
    }
  }, {
    message: maxLengthMessage,
    options: {
      length: 8
    },
    validator: function(value, options) {
      return value.length <= options.length;
    }
  }, {
    message: matchMessage,
    options: {
      match: 'match',
    },
    validator: function(value, options) {
      return value === options.match;
    }
  }]
};

describe('validator factory', function() {
  it('should be able to create multiple instances', function() {
    var validator1 = validatorFactory(validatorsConfigNone);
    var validator2 = validatorFactory(validatorsConfigNone);

    validator2.valid = false;

    expect(validator1.valid).to.be.null;
    expect(validator2.valid).to.be.false;
  });

  it('should throw error if validator is not an array', function() {
    expect(function() {
      validatorFactory(validatorsConfig1NotArray);
    }).to.throw('You must pass validators as an array');
  });

  it('should be able to validate a value to true', function() {
    var myValidator = validatorFactory(validatorConfigMinLength);
    myValidator.validate('test');

    expect(myValidator.valid).to.be.true;
  });

  it('should validate to true is no validators are given', function() {
    var myValidator = validatorFactory(validatorsConfigNone);
    myValidator.validate('test');

    expect(myValidator.valid).to.be.true;
  });

  it('should work with passing any configuration', function() {
    var myValidator = validatorFactory();
    myValidator.validate('test');

    expect(myValidator.valid).to.be.true;
  });

  it('should be able to validate a value to false', function() {
    var myValidator = validatorFactory(validatorConfigMinLength);
    myValidator.validate('tes');

    expect(myValidator.valid).to.be.false;
  });

  it('should should the last validated value', function() {
    var myValidator = validatorFactory(validatorConfigMinLength);
    myValidator.validate('tes');

    expect(myValidator.lastValidatedValue).to.equal('tes');

    myValidator.validate('test');

    expect(myValidator.lastValidatedValue).to.equal('test');
  });

  it('should be able to validate on create', function() {
    var myValidator = validatorFactory(assign(clone(validatorConfigMinLength, true), {
      validateValueOnCreate: 'tes'
    }));

    expect(myValidator.valid).to.be.false;
  });

  it('should be able to define multiple validators', function() {
    var myValidator = validatorFactory(validatorConfigMinMaxLength);
    myValidator.validate('testtest');

    expect(myValidator.valid).to.be.true;
  });

  it('should be return false if even just one of the validators fail', function() {
    var myValidator = validatorFactory(validatorConfigMinMaxLength);
    myValidator.validate('testtestt');

    expect(myValidator.valid).to.be.false;
  });

  it('should be able to define error messages', function() {
    var myValidator = validatorFactory(validatorConfigMinLengthWithMessage);
    myValidator.validate('tes');

    expect(myValidator.validationErrors).to.deep.equal([
      minLengthMessage
    ]);
  });

  it('should be able define message with value inside it', function() {
    var myValidator = validatorFactory(validatorConfigMatchWithMessage);
    myValidator.validate('test');

    expect(myValidator.validationErrors).to.deep.equal([
      matchMessage.replace('%%value%%', 'test')
    ]);
  });

  it('should be able to store multiple error messages', function() {
    var myValidator = validatorFactory(validatorConfigMinMaxLengthMatchWithMessage);
    myValidator.validate('tes');

    expect(myValidator.validationErrors).to.deep.equal([
      minLengthMessage,
      matchMessage.replace('%%value%%', 'tes')
    ]);
  });

  it('should be able to allow a value to be empty even with validators', function() {
    var myValidator = validatorFactory(validatorConfigMinMaxLengthMatchWithMessageAllowEmpty);
    myValidator.validate('');

    expect(myValidator.valid).to.be.true;
  });

  it('should return true for should render validation', function() {
    var myValidator = validatorFactory(validatorConfigMinMaxLengthMatchWithMessage);
    myValidator.validate('tes');

    expect(myValidator.validationErrors).to.deep.equal([
      minLengthMessage,
      matchMessage.replace('%%value%%', 'tes')
    ]);
  });

  it('should be able to reset validator state to new', function() {
    var myValidator = validatorFactory(validatorConfigMinMaxLengthMatchWithMessage);
    myValidator.validate('tes');
    myValidator.reset();

    expect(myValidator.lastValidatedValue).to.be.null;
    expect(myValidator.valid).to.be.null;
    expect(myValidator.validationErrors).to.deep.equal([]);
  });

  it('should be able to specific `this` context for the validator execution', function(done) {
    var obj = {
      test: 'what?'
    };
    var myValidator = validatorFactory({
      validators: [{
        message: minLengthMessage,
        options: {
          length: 4
        },
        validator: function(value, options) {
          expect(this.test).to.equal('what?');
          done();
        },
        thisContext: obj
      }]
    });
    myValidator.validate('testtestt');
  });

  it('should be able to update options', function() {
    var validator = validatorFactory(validatorsConfigNone);

    expect(validator.isActive()).to.be.true;

    validator.updateOptions({
      isActive: false
    });

    expect(validator.isActive()).to.be.false;
  });
});
