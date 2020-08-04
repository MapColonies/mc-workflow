"use strict";

const { has } = require("lodash");

module.exports = class Helper {
  constructor() {}

  objectContainsFields(obj, fields) {
    let result = true;
    for (let field of fields) {
      if (!has(obj, field)) {
        result = false;
        break;
      }
    }
    return result;
  }

  jsonCopy(src) {
    return JSON.parse(JSON.stringify(src));
  }
};
