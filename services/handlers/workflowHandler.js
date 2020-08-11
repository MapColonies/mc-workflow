const path = require("path");
const config = require("config");
const bluebird = require("bluebird");
const IngestWorkflow = require("../../services/workflows/ingestWorkflow");
const workflowError = require("../../errors/workflowError");
const fs = bluebird.promisifyAll(require("graceful-fs"));
const workflows = {};

module.exports = class WorkflowHandler {
  constructor(apiInvoker, helper, logger) {
    this._apiInvoker = apiInvoker;
    this._helper = helper;
    this._logger = logger;
    this._workflows = workflows;
  }
  async init() {
    try {
      await this.configureAsync();
    } catch (err) {
      throw err;
    }
  }

  async configureAsync() {
    const rootpath = path.resolve(config.fileSystem.workflowsPath);
    try {
      const files = await fs.readdirAsync(rootpath);
      for (const file of files) {
        if (path.extname(file) === ".json") {
          const filepath = path.join(rootpath, file);
          // load workflow to array.
          this._workflows[file] = JSON.parse(await fs.readFileAsync(filepath));
        }
      }
      this._logger.info(
        `[workflowHandler] configureAsync - Done load workflows from ${rootpath}`
      );
    } catch (err) {
      this._logger.error(
        `[workflowHandler] configureAsync - Failed load workflows from ${rootpath} - ${err}`
      );
    }
  }
  
  async handleJobByIngestWorkflow(job) {
    try {
      const workflow = new IngestWorkflow(job, this._apiInvoker, this._helper, this._logger);
      await workflow.checkIngestValidation(job);
      const selectedWorkflow = this._workflows[`${job.action}.json`];
      // Process the data through the selected workflow if exists.
      return selectedWorkflow
        ? await workflow.build(selectedWorkflow)
        : this.workflowNotExistsError(`workflow is not exists`);
    } catch (err) {
      throw err;
    }
  }

  workflowNotExistsError(message) {
    throw new workflowError(message);
  }

  loadWorkflow(workflow) {
    this._workflows[`${workflow.name}.json`] = workflow;
  }
};

