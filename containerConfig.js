const container = require("kontainer-di");
module.exports = container;

const dataHandlerFileSystem = require("./services/handlers/dataHandlerFileSystem");
const strategoHandler = require("./services/handlers/strategoHandler");
const apiInvoker = require("./services/apiInvoker");
const helper = require("./services/helper/helper");
const errorHandler = require("./errors/errorHandler");

container.register("dataHandlerFileSystem", [], dataHandlerFileSystem);
container.register(
  "strategoHandler",
  ["apiInvoker", "helper"],
  strategoHandler
);
container.register("apiInvoker", [], apiInvoker);
container.register("helper", [], helper);
container.register("errorHandler", [], errorHandler);
