"use strict";

const BaseWorkflow = require("./baseWorkflow");
const config = require("config");
const workflowError = require("../../errors/workflowError");

module.exports = class uploadWorkflow extends BaseWorkflow {
  constructor(job, apiInvoker, helper, logger) {
    super(helper, job, logger);
    this._job = job;
    this._apiInvoker = apiInvoker;
    this._helper = helper;
    this._returnValue = this._job;
    this.logger = logger;
    this._ingestValidator = {
      ...this._validator, ingestFields: config.get('validator.ingestFields')
    }
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

  checkIngestValidation(job = this.job) {
    return new Promise((resolve, reject) => {
      if (
        !this._helper.objectContainsFields(job, this._ingestValidator.ingestFields)
      ) {
        reject(
          new workflowError(
            `Ingest validation - missing fields in root workflow`
          )
        );
      }
      resolve();
    });
  }
};
