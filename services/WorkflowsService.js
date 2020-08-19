"use strict";

const ingestWorkflow = require("../services/workflows/ingestWorkflow");
const container = require("../containerConfig");
const config = require("config");
const DataHandlerFileSystem = container.get("dataHandlerFileSystem");
const apiInvoker = container.get("apiInvoker");
const helper = container.get("helper");
const logger = container.get("logger");
const workflowHandler = container.get("workflowHandler");
/**
 * create workflow
 *
 * body Workflow create new workflow based on json schema
 * no response value expected for this operation
 **/
exports.workflowsPOST = async function (args, res, next) {
  const incomingWorkflow = args;
  try {
    logger.info(
      `[WorkflowService] workflowPOST - create workflow: ${incomingWorkflow.name} in progress`
    );
    const jsonWorkflowData = JSON.stringify(incomingWorkflow);
    const workflow = new ingestWorkflow({}, apiInvoker, helper);

    await workflow.checkWorkflowValidation(incomingWorkflow);
    await DataHandlerFileSystem.writeFile(
      config.get("fileSystem.workflowsPath"),
      incomingWorkflow.name,
      jsonWorkflowData,
      "json"
    );

    workflowHandler.loadWorkflow(incomingWorkflow);
    logger.info(
      `[WorkflowService] workflowPOST - workflow: ${incomingWorkflow.name} created`
    );
    res.statusCode = 201;
    res.end("Created");
  } catch (error) {
    logger.error(
      `[WorkflowService] workflowPOST - failed to create workflow: ${incomingWorkflow.name} - ${error}`
    );
    next(error);
  }
};

exports.workflowsGET = async function (args, res, next) {
  try {
    logger.info(`[WorkflowService] workflowsGET - Get workflows from ${config.fileSystem.workflowsPath} in progress from `)
    const files = await DataHandlerFileSystem.getFilesFromRootPath(
      config.fileSystem.workflowsPath
      );
      logger.info(`[WorkflowService] workflowsGET - workflows: ${files}`);
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
    logger.info(
      `[WorkflowService] workflowsDELETE - delete workflow: "${workflowName}" in progress`
    );
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
      `[WorkflowService] workflowsDELETE - workflow: "${workflowName}" deleted`
    );
    res.statusCode = 202;
    res.end("Deleted");
  } catch (error) {
    logger.info(
      `[WorkflowService] workflowsDELETE - workflow: "${workflowName}" failed to delete - ${error}`
    );
    next(error);
  }
};

