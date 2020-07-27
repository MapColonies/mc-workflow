"use strict";

const container = require("../containerConfig");
const config = require("config");
const StrategoHandler = container.get("strategoHandler");
/**
 * create ingest
 *
 * body ingest create new ingest
 * no response value expected for this operation
 **/
exports.ingestPOST = async function (args, res, next) {
  try {
    const ingestedFile = args;
    await StrategoHandler.handleJobByIngestWorkflow(ingestedFile);
    //TODO: add logger
    res.statusCode = 201;
    res.end("Created");
  } catch (err) {
    // res.statusCode = err.status;
    // res.end(err.message);
    console.log("ingestService: ",err);
    //TODO: add logger
  }
};
