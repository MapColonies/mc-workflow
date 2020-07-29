"use strict";

const container = require("../containerConfig");
const config = require("config");
const { ingestPOST } = require("./IngestService");
const DataHandlerFileSystem = container.get("dataHandlerFileSystem");
const apiInvoker = container.get("apiInvoker");
const helper = container.get("helper");
const ingestWorkflow = require("../services/workflows/ingestWorkflow");
/**
 * create workflow
 *
 * body Workflow create new workflow based on json schema
 * no response value expected for this operation
 **/
exports.workflowsPOST = async function (args, res, next) {
  try {
    const incWorkflow = args;
    const jsonWorkflowData = JSON.stringify(incWorkflow);
    const workflow = new ingestWorkflow({}, apiInvoker, helper);
    await workflow.checkWorkflowValidation(incWorkflow);
    await DataHandlerFileSystem.writeFile(
      config.get("fileSystem.workflowsPath"),
      incWorkflow.name,
      jsonWorkflowData,
      "json"
    );
    //TODO: add logger
    res.statusCode = 201;
    res.end("Created");
  } catch (error) {
    next(error);
    //TODO: add logger
  }
};

exports.workflowsGET = async function (args, res, next) {
  try {
    const files = await DataHandlerFileSystem.getFilesFromRootPath(
      config.fileSystem.workflowsPath
    );
    //TODO: add logger
    res.end(JSON.stringify(files));
  } catch (error) {
    next(error);
    //TODO: add logger
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

    //TODO: add logger
    res.statusCode = 202;
    res.end("Deleted");
  } catch (error) {
    next(error);
    // //TODO: add logger
  }
};
