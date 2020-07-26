"use strict";

const { BaseWorkflow } = require("./baseWorkflow");

module.exports = class uploadWorkflow extends BaseWorkflow {
  constructor(job, apiInvoker, helper) {
    super(job, helper);
    this._job = job;
    this._apiInvoker = apiInvoker;
    this._helper = helper;
    this._returnValue = this._job;
  }

  get upload() {
    return this._returnValue;
  }

  backupMetadata() {
    return () => {
      console.log("BACKUP METADATA!");
    };
  }

  convertFile() {
    return () => {
      console.log("CONVERT FILE");
    };
  }
};
