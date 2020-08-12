const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");
const IngestWorkflow = require("../../../services/workflows/ingestWorkflow");
const WorkflowHandler = require("../../../services/handlers/workflowHandler");

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

const mockLogger = {};
const mockHelper = {};
const mockApiInvoker = {};

describe("workflowHandler functionality", function () {
  let workflowHandler;
  let ingestValidationStub;

  const mockJob = require("../../dataset/ingest.json");

  context("handleJobByIngestWorkflow", function () {
    mockWorkflow = require("../../dataset/create.json");

    beforeEach(function () {
      ingestValidationStub = sinon.stub(
        IngestWorkflow.prototype,
        "checkIngestValidation"
      );
      buildStub = sinon.stub(IngestWorkflow.prototype, "build");

      workflowHandler = new WorkflowHandler(
        mockApiInvoker,
        mockHelper,
        mockLogger
      );
    });

    afterEach(function () {
      ingestValidationStub.restore();
      buildStub.restore();
    });

    it("Should process the file through the selected workflow if exists", async function () {
      workflowHandler.loadWorkflow(mockWorkflow);
      await workflowHandler.handleJobByIngestWorkflow(mockJob).should.be.fulfilled;
      ingestValidationStub.should.calledOnce;
      buildStub.should.calledOnce;
    });

    it("Should throw an error by pass not exists workflow", async function () {
      workflowHandler.loadWorkflow(mockWorkflow);
      mockJob.action = "notExists";
      await workflowHandler.handleJobByIngestWorkflow(mockJob).should.be.rejectedWith(`workflow "${mockJob.action}" is not exists`);
      ingestValidationStub.should.calledOnce;
      buildStub.should.not.called;
    });
  });
});
