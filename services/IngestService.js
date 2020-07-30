"use strict";

const container = require("../containerConfig");
const workflowHandler = container.get("workflowHandler");
const logger = container.get("logger");

/**
 * create ingest
 *
 * body ingest create new ingest
 * no response value expected for this operation
 **/
exports.ingestPOST = async function (args, res, next) {
  try {
    const ingestedFile = args;
    const result = await workflowHandler.handleJobByIngestWorkflow(
      ingestedFile
    );
    
    logger.info(
      `[ingestService] ingestPOST - Workflow: "${ingestedFile.action}" DONE`
    );

    res.statusCode = 200;
    res.end(JSON.stringify(result));
  } catch (error) {
    logger.error(
      `[ingestService] ingestPOST - Workflow FAILED - Error: ${error.message} `
    );
    next(error);
  }
};
