const container = require("kontainer-di");
const mockApiInvoker = {
  dynamicPost: function () {
    return Promise.resolve();
  },
};

function configureForTesting() {
  const logger = require("../logger/logger");
  container.reset();
  
  container.registerModule("apiInvoker", [], mockApiInvoker);
  container.registerModule("logger", [], logger);
}


module.exports = container;
module.exports.configureForTesting = configureForTesting;
