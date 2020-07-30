"use strict";

const ingestWorkflow = require("../services/workflows/ingestWorkflow");
const container = require("../containerConfig");
const config = require("config");
const DataHandlerFileSystem = container.get("dataHandlerFileSystem");
const apiInvoker = container.get("apiInvoker");
const helper = container.get("helper");
const logger = container.get("logger");
/**
 * create workflow
 *
 * body Workflow create new workflow based on json schema
 * no response value expected for this operation
 **/
exports.workflowsPOST = async function (args, res, next) {
  const incWorkflow = args;
  try {
    const jsonWorkflowData = JSON.stringify(incWorkflow);
    const workflow = new ingestWorkflow({}, apiInvoker, helper);

    await workflow.checkWorkflowValidation(incWorkflow);
    await DataHandlerFileSystem.writeFile(
      config.get("fileSystem.workflowsPath"),
      incWorkflow.name,
      jsonWorkflowData,
      "json"
    );
    logger.info(
      `[WorkflowService] workflowPOST - workflow: ${incWorkflow.name} in created`
    );
    res.statusCode = 201;
    res.end("Created");
  } catch (error) {
    logger.error(
      `[WorkflowService] workflowPOST - failed to create workflow: ${incWorkflow.name} - ${error}`
    );
    next(error);
  }
};

exports.workflowsGET = async function (args, res, next) {
  try {
    const files = await DataHandlerFileSystem.getFilesFromRootPath(
      config.fileSystem.workflowsPath
    );
    logger.info(`[WorkflowService] workflowsGET - get workflows: ${files}`);
    res.end(JSON.stringify(files));
  } catch (error) {
    logger.error(
      `[WorkflowService] workflowsGET - failed to get workflows: ${error}`
    );
    next(error);
  }
};

exports.workflowsDELETE = async function (args, res, next) {
  const workflowName = args;
  const workflowsPath = config.fileSystem.workflowsPath;
  try {
    const fileExists = await DataHandlerFileSystem.fileExists(
      workflowsPath,
      workflowName,
      "json"
    );
    fileExists
      ? await DataHandlerFileSystem.removeFile(
          workflowsPath,
          workflowName,
          "json"
        )
      : res.end("Not found");

    logger.info(
      `[WorkflowService] workflowsDELETE - workflow: ${workflowName} deleted`
    );
    res.statusCode = 202;
    res.end("Deleted");
  } catch (error) {
    logger.info(
      `[WorkflowService] workflowsDELETE - workflow: ${workflowName} failed to delete - ${error}`
    );
    next(error);
  }
};
