"use strict";

module.exports = class Helper {
  objectContainsFields(obj, fields) {
    let result;
    for (let index = 0; index < fields.length; index++) {
      if (!obj.hasOwnProperty(fields[index])) {
        const missingField = fields[index];
        result = missingField;
        break;
      }
    }
    return result;
  }
};

