const container = require("kontainer-di");
module.exports = container;

const dataHandlerFileSystem = require("./services/dataHandlerFileSystem");
const strategoHandler = require("./services/strategoHandler");
const apiInvoker = require("./services/apiInvoker");
const helper = require("./services/helper");
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
