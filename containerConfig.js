const container = require("kontainer-di");
module.exports = container;

const dataHandlerFileSystem = require("./services/handlers/dataHandlerFileSystem");
const workflowHandler = require("./services/handlers/workflowHandler");
const apiInvoker = require("./services/apiInvoker");
const helper = require("./services/helper/helper");
const logger = require("./logger/logger");

container.register("logger", [], logger);
container.register("dataHandlerFileSystem", ["logger"], dataHandlerFileSystem);
container.register("workflowHandler", ["apiInvoker", "helper", "logger"], workflowHandler);
container.register("apiInvoker", ["logger"], apiInvoker);
container.register("helper", [], helper);

