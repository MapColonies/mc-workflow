"use strict";

const logger = require("../logger/logger");

const axios = require("axios");

module.exports = class APIInvoker {
  constructor(logger) {
    this._logger = logger;
  }
  async dynamicPost(reqParams, params) {
    const elementObj = reqParams.imageMetaData;

    try {
      const bodyObj = this.GetParamObj(elementObj, params.data);

      const configRequest = {
        url: params.url,
        body: bodyObj,
      };
      const response = await axios.post(configRequest.url, configRequest.body);
      this._logger.info(
        "[apiInvoker] dynamicPost success for element id: %s",
        elementObj.id
      );

      const newElement = { ...reqParams.imageMetaData, ...response.data };

      return newElement;
    } catch (error) {
      this._logger.error(
        "[apiInvoker] dynamicPost FAILED for element id: %s",
        elementObj.id
      );
      throw error;
    }
  }

  GetParamObj(element, fieldArray) {
    if (!fieldArray) {
      return undefined;
    }

    let paramObj = {};

    if (fieldArray[0] === "*") {
      paramObj = element;
    } else {
      fieldArray.forEach((field) => {
        paramObj[field] = element[field];
      });
    }

    return paramObj;
  }
};

