const container = require("kontainer-di");
module.exports = container;

const dataHandlerFileSystem = require("./services/handlers/dataHandlerFileSystem");
const workflowHandler = require("./services/handlers/workflowHandler");
const apiInvoker = require("./services/apiInvoker");
const helper = require("./services/helper/helper");
container.register("dataHandlerFileSystem", [], dataHandlerFileSystem);
container.register(
  "workflowHandler",
  ["apiInvoker", "helper"],
  workflowHandler
);
container.register("apiInvoker", [], apiInvoker);
container.register("helper", [], helper);
