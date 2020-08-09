const { MCLogger } = require("@map-colonies/mc-logger");
const service = require("../package.json");
const config = require("config");

const loggerConf = {
  level: config.get("logger.level"),
  log2file: config.get("logger.log2file"),
};

const logger = new MCLogger(loggerConf, service);

module.exports = logger;

