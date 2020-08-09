"use strict";

const Ingest = require("../services/IngestService.js");

module.exports.ingestPOST = function ingestPOST(req, res, next) {
  Ingest.ingestPOST(req.swagger.params["body"].value, res, next);
};

