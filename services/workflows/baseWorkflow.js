"use strict";

const workflowError = require("../../errors/workflowError");
const container = require("../../containerConfig");
const jWorkflow = require("jWorkflow");
const config = require("config");

module.exports = class BaseWorkflow {
  constructor(helper, job, logger) {
    this._helper = helper;
    this._job = job;
    this._logger = logger;
    //properties for workflow validation
    this._validator = {
      workflowFields: config.get("validator.workflowFields"),
      dynamicActivityFields: config.get("validator.dynamicActivityFields"),
      dynamicActivityNameValues: config.get(
        "validator.dynamicActivityNameValues"
      ),
    };
    this._dynamicActivity = "dynamicActivity";
  }

  async build(workflow) {
    try {
      this._workflow = workflow;
      this._logger.info(
        `[BaseWorkflow] build - Building workflow ${this._workflow.name}`
      );
      await this.checkWorkflowValidation(this._workflow);
      const workflowOrder = jWorkflow.order(() => {}, this);
      workflow.activities.forEach((activity) => {
        workflowOrder.andThen(this.getActivity(activity), this);
      });

      return new Promise((resolve, reject) => {
        this._logger.info(
          "[BaseWorkflow] build - Workflow prepare successfully, Starting workflow"
        ),
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
      this._logger.error(
        `[BaseWorkflow] build - Error in building activities : ${err}`
      );
      throw err;
    }
  }

  getActivity(activity) {
    try {
      if (activity.name !== this._dynamicActivity) {
        return this[activity.name](
          activity.params,
          activity.dropOnError,
          activity.wait
        );
      } else {
        return this[activity.name](
          activity.wait,
          activity.dropOnError,
          activity.params
        );
      }
    } catch (err) {
      throw err;
    }
  }

  dynamicActivity(wait = true, dropOnError = true, params) {
    return (prev, baton) => {
      let template = () => {
        if (!params.additional.headers) {
          params.additional.headers = {};
        }
        return this[`_${params.action}`][`${params.method}`](
          this._returnValue,
          params.additional
        );
      };
      template.fname = params.description
        ? params.description
        : this._dynamicActivity;

      wait
        ? this.waitTrueTemplate(baton, template, dropOnError)
        : this.waitFalseTemplate(template);
    };
  }

  checkWorkflowValidation(workflow = this._workflow) {
    const isValid = this._helper.objectContainsFields(workflow, this._validator.workflowFields);
    return new Promise((resolve, reject) => {
      if (!isValid) {
        reject(
          new workflowError(
            `Workflow validation - missing fields in root workflow`
          )
        );
      }
      workflow.activities.forEach((activity) => {
        {
          if (activity.hasOwnProperty("name")) {
            if (typeof this[activity.name] !== typeof (() => {})) {
              reject(
                new workflowError(
                  `Workflow validation - There is no activity for ${activity.name}`
                )
              );
            }
          } else {
            reject(
              new workflowError(
                `Workflow validation - activity in ${workflow.name} workflow has no name`
              )
            );
          }

          if (activity.name === this._dynamicActivity) {
           
            let isValid = false;
            if (activity.hasOwnProperty("params")) {
              if (
                this._helper.objectContainsFields(
                  activity.params,
                  this._validator.dynamicActivityFields
                )
              ) {
                if (
                  this._validator.dynamicActivityNameValues.indexOf(
                    activity.params.action
                  ) !== -1
                ) {
                  isValid = true;
                }
              }
            }
            if (!isValid) {
              reject(
                new workflowError(
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

  async waitTrueTemplate(baton, template, dropOnError = true) {
    try {
      baton.take();
      let result = await template();
      baton.pass(result);
    } catch (err) {
      err.ActivityName = template.fname;
      this._logger.error(
        `[BaseWorkFlow] - Error in workflow : ${err.ActivityName} ${err.message}`
      );
      dropOnError ? baton.drop(err) : baton.pass();
    }
  }

  waitFalseTemplate(template) {
    try {
      template();
    } catch (err) {
      err.ActivityName = template.fname;
      this._logger.error(
        `[BaseWorkFlow] - Error in workflow : ${err.ActivityName} ${err.message}`
      );
    }
  }
};
