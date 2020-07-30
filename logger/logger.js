const { MCLogger } = require("@map-colonies/mc-logger");
const service = require('../package.json');

const config = {
  level: "info",
  log2file: true,
};

const logger = new MCLogger(config, service);

module.exports = logger;
