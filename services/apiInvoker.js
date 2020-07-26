"use strict";

const axios = require("axios").default;

module.exports = class APIInvoker {
  async dynamicPost(reqParams, params) {
    const elementObj = reqParams.element;

    try {
      const bodyObj = this.GetParamObj(elementObj, params.data);

      const configRequest = {
        url: params.url,
        body: bodyObj,
      };
      const response = await axios.post(configRequest.url, configRequest.body);

      console.log("General post success for element id:%s", elementObj.id);
      const newElement = { ...reqParams.element, ...response.data };

      return newElement;
    } catch (error) {
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
