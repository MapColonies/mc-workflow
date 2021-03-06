"use strict";

const BaseWorkflow = require("./baseWorkflow");
const config = require("config");
const workflowError = require("../../errors/workflowError");

module.exports = class IngestWorkflow extends BaseWorkflow {
  constructor(job, apiInvoker, helper, logger) {
    super(helper, job, logger);
    this._job = job;
    this._apiInvoker = apiInvoker;
    this._helper = helper;
    this._returnValue = this._job;
    this.logger = logger;
    this._ingestValidator = {
      ...this._validator,
      ingestFields: config.get("validator.ingestFields"),
    };
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
      const missingField = this._helper.objectContainsFields(
        job,
        this._ingestValidator.ingestFields
      );
      if (missingField !== undefined) {
        reject(
          new workflowError(
            `Ingest validation - missing field: "${missingField}" in root ingest json`
          )
        );
      }
      resolve();
    });
  }
};
