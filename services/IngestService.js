"use strict";

const container = require("../containerConfig");
const config = require("config");
const workflowHandler = container.get("workflowHandler");
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
    //TODO: add logger
    res.statusCode = 201;
    res.end(JSON.stringify(result));
  } catch (err) {
    console.log("ingestService: ", err.message);
    //TODO: add logger
  }
};
