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

  backupMetadata(wait = true, dropOnError) {
    return (prev, baton) => {
      let template = () => {
        throw new Error("Throw Error backupMetadata");
      };
      template.fname = "backupMetadata";

      wait
        ? this.waitTrueTemplate(baton, template, dropOnError)
        : this.waitFalseTemplate(template);
    };
  }

  convertFile() {
    return () => {
      console.log("CONVERT FILE");
    };
  }
};
