"use strict";

const Workflows = require("../services/WorkflowsService");

module.exports.workflowsGET = function workflowsGET(req, res, next) {
  Workflows.workflowsGET(req, res, next);
};

module.exports.workflowsPOST = function workflowsPOST(req, res, next) {
  Workflows.workflowsPOST(req.swagger.params["body"].value, res, next);
};

module.exports.workflowsDELETE = function workflowsDELETE(req, res, next) {
  Workflows.workflowsDELETE(req.swagger.params["workflowName"].value, res, next);
};

