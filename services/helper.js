'use strict';

const _ = require('lodash');

module.exports = class Helper {
    constructor() {
    }

    objectContainsFields(obj, fields) {
        let result = true;
        for (let field of fields) {
            if (!(_.has(obj, field))) {
                result = false;
                break
            }
        }
        return result;
    }

    jsonCopy(src){
        return JSON.parse(JSON.stringify(src));
    }
}
