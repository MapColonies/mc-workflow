"use strict";

const jWorkflow = require("jWorkflow");
const _ = require("lodash");

module.exports.BaseWorkflow = class BaseWorkflow {
  constructor(job, helper) {
    this._job = job;
    this._helper = helper;

    //properties for workflow validation
    this._validator = {
      workflowFields: ["name", "activities"],
      dynamicActivityFields: ["action", "method", "additional"],
      dynamicActivityNameValues: ["apiInvoker", "cache"],
    };
  }
  async build(workflow) {
    try {
      this._workflow = workflow;
      console.log(`Building workflow ${this._workflow.name}`);
      await this.checkWorkflowValidation();
      let workflowOrder = jWorkflow.order(() => {}, this);
      const activities = [];
      workflow.activities.forEach((activity) => {
        activities.push(this.getActivity(activity));
      });
      workflowOrder.andThen(activities, this);

      return new Promise((resolve, reject) => {
        console.log("Workflow prepare successfully, Stating workflow"),
          workflowOrder.start({
            callback: (result) => {
              if (result instanceof Error) {
                return reject(result);
              }
              return resolve(this._returnValue);
            },
            initialValue: "",
          });
      });
    } catch (err) {
      console.log(`Error in building activities : ${err}`);
    }
  }

  getActivity(activity) {
    if (activity.name !== "dynamicActivity") {
      return this[activity.name];
    } else {
      return this[activity.name](activity.params);
    }
  }

  async dynamicActivity(params) {
    console.log(`dynamicActivity ${params.action} - ${params.description}`);
    console.log(params.action);
    console.log(`headers: ${JSON.stringify(params.additional.headers)}`);
    return await this[`_${params.action}`][`${params.method}`](
      this._returnValue,
      params.additional
    );
  }

  checkWorkflowValidation(workflow = this._workflow) {
    console.log(workflow);
    return new Promise((resolve, reject) => {
      if (
        !this._helper.objectContainsFields(
          workflow,
          this._validator.workflowFields
        )
      ) {
        reject(
          new Error(`Workflow validation - missing fields in root workflow`)
        );
      }
      workflow.activities.forEach((activity) => {
        {
          if (activity.hasOwnProperty("name")) {
            if (typeof this[activity.name] !== "function") {
              reject(
                new Error(
                  `Workflow validation - There is no activity for ${activity.name}`
                )
              );
            }
          } else {
            reject(new Error(`Workflow validation - activity has no name`));
          }

          if (activity.name === "dynamicActivity") {
            let isValid = false;
            if (activity.hasOwnProperty("params")) {
              if (
                this._helper.objectContainsFields(
                  activity.params,
                  this._validator.dynamicActivityFields
                )
              ) {
                if (
                  _.indexOf(
                    this._validator.dynamicActivityNameValues,
                    activity.params.action
                  ) !== -1
                ) {
                  isValid = true;
                }
              }
            }
            if (!isValid) {
              reject(
                new Error(
                  `Workflow validation - dynamic activity missing fields`
                )
              );
            }
          }
        }
      });
      resolve();
    });
  }
};
