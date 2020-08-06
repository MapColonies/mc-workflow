"use strict";

module.exports = class Helper {

  objectContainsFields(obj, fields) {
    let result = true;
    for (let index = 0; index < fields.length; index++) {
      if (!obj.hasOwnProperty(fields[index])) {
        result = false;
        break;
      }
    }
    return result;
  }
};
