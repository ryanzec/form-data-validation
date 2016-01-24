module.exports = function(immutableStructure, fieldName) {
  if (arguments.length === 2) {
    if (immutableStructure.getIn([fieldName, 'validator']).isActive()) {
      immutableStructure.getIn([fieldName, 'validator']).validate(immutableStructure.getIn([fieldName, 'value']), immutableStructure);
      immutableStructure = immutableStructure.setIn([fieldName, 'isValid'], immutableStructure.getIn([fieldName, 'validator']).valid);
      immutableStructure = immutableStructure.updateIn([fieldName, 'validationErrors'], function(list) {
        if (immutableStructure.getIn([fieldName, 'validator']).validationErrors.length === 0) {
          list = list.clear()
        } else if (immutableStructure.getIn([fieldName, 'validator']).validationErrors.length > list.size) {
          immutableStructure.getIn([fieldName, 'validator']).validationErrors.forEach(function(error, key) {
            list = list.set(key, error);
          });
        } else {
          list.forEach(function(value, key) {
            if (immutableStructure.getIn([fieldName, 'validator']).validationErrors[key]) {
              list = list.set(key, immutableStructure.getIn([fieldName, 'validator']).validationErrors[key]);
            } else {
              list = list.remove(key);
            }
          });
        }

        return list;
      });
    }
  } else {
    var fieldNames = arguments.length === 1
      ? Object.keys(immutableStructure.toJSON())
      : Array.prototype.slice.call(arguments).slice(1);
    fieldNames.forEach(function(fieldName) {
      if (immutableStructure.getIn([fieldName, 'validator']).isActive()) {
        immutableStructure.getIn([fieldName, 'validator']).validate(immutableStructure.getIn([fieldName, 'value']), immutableStructure);
        immutableStructure = immutableStructure.setIn([fieldName, 'isValid'], immutableStructure.getIn([fieldName, 'validator']).valid);
        immutableStructure = immutableStructure.updateIn([fieldName, 'validationErrors'], function(list) {
          if (immutableStructure.getIn([fieldName, 'validator']).validationErrors.length === 0) {
            list = list.clear()
          } else if (immutableStructure.getIn([fieldName, 'validator']).validationErrors.length > list.size) {
            immutableStructure.getIn([fieldName, 'validator']).validationErrors.forEach(function(error, key) {
              list = list.set(key, error);
            });
          } else {
            list.forEach(function(value, key) {
              if (immutableStructure.getIn([fieldName, 'validator']).validationErrors[key]) {
                list = list.set(key, immutableStructure.getIn([fieldName, 'validator']).validationErrors[key]);
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

  return immutableStructure;
};