const path = require("path");
const config = require("config");
const bluebird = require("bluebird");
const IngestWorkflow = require("../workflows/ingestWorkflow");
const fs = bluebird.promisifyAll(require("graceful-fs"));
const workflows = {};

module.exports = class WorkflowHandler {
  constructor(apiInvoker, helper) {
    this._apiInvoker = apiInvoker;
    this._helper = helper;
  }
  async init() {
    try {
      await this.configureAsync();
    } catch (err) {
      throw err;
    }
  }

  async configureAsync() {
    let rootpath = path.resolve(config.fileSystem.workflowsPath);
    try {
      const files = await fs.readdirAsync(rootpath);
      if (!files.includes("default.json")) {
        throw new Error("workflow default.json not exist");
      }
      for (let file of files) {
        if (path.extname(file) === ".json") {
          //TODO: add load workflow logger
          const filepath = path.join(rootpath, file);
          // Load workflow to array.
          workflows[file] = JSON.parse(await fs.readFileAsync(filepath));
        }
      }
      // TODO: add logger for done load files
      console.log(`Done load workflow from ${rootpath}`);
    } catch (err) {
      console.log(err);
    }
  }

  async handleJobByIngestWorkflow(job) {
    try {
      const workflow = new IngestWorkflow(job, this._apiInvoker, this._helper);
      // workflow.checkWorkflowValidation(job);
      const selectedWorkflow =
        workflows[`${job.workflowName}.json`] || workflows["default.json"];
      // Process the frame through the selected workflow.
      const finalFrame = await workflow.build(selectedWorkflow);
      return finalFrame;
    } catch (err) {
      throw err;
    }
  }
};
