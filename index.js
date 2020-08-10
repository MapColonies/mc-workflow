"use strict";

const fs = require("fs"),
  path = require("path"),
  http = require("http");

const app = require("connect")();
const swaggerTools = require("swagger-tools");
const jsyaml = require("js-yaml");
const config = require("config");
const container = require("./containerConfig");
const serverPort = config.get("server.port");
const workflowHandler = container.get("workflowHandler");
const handleError = require("./errors/handleError");
const logger = container.get("logger");
const { Probe } = require('@map-colonies/mc-probe');

// swaggerRouter configuration
const options = {
  swaggerUi: path.join(__dirname, "/swagger.json"),
  controllers: path.join(__dirname, "./controllers"),
  useStubs: process.env.NODE_ENV === "development", // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const spec = fs.readFileSync(path.join(__dirname, "api/swagger.yaml"), "utf8");
const swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  app.use((err, req, res, next) => {
    const error = handleError(err);
    res.statusCode = error.status;
    res.end(error.message);
  });

  (async () => {
    try {
      await workflowHandler.init();
    } catch (err) {
      throw err;
    }
  })();

  const probConfig = {};
  const probe = new Probe(logger, probConfig);
  probe
    .start(app, config.get("server.port"))
    .then(() => {
      probe.readyFlag = true;
    })
    .catch(() => {
      probe.liveFlag = false;
    });
});
