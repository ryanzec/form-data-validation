module.exports = function(immutableStructure, fieldName) {
  if (fieldName) {
    if (immutableStructure.getIn([fieldName, 'validator']).isActive()) {
      immutableStructure.getIn([fieldName, 'validator']).validate(immutableStructure.getIn([fieldName, 'value']));
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
    immutableStructure.forEach(function(field, fieldName) {
      if (immutableStructure.getIn([fieldName, 'validator']).isActive()) {
        immutableStructure.getIn([fieldName, 'validator']).validate(field.get('value'));
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