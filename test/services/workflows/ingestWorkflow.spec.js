const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");
const Helper = require("../../../services/helper/helper");
const IngestWorkflow = require("../../../services/workflows/ingestWorkflow");
const logger = require("../../../logger/logger");
const jWorkflow = require("jWorkflow");
const mockLogger = {};
const mockApiInvoker = {};
const mockHelper = {};
const mockjWorkflow = {};

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe("ingestWorkflow functionality", function () {
  let ingestWorkflow;
  const mockJob = require("../../dataset/ingest.json");

  context("checkIngestValidation", function () {
    
    beforeEach(function () {
      ingestWorkflow = new IngestWorkflow(
        mockJob,
        mockApiInvoker,
        mockHelper,
        mockLogger
      );

      mockHelper.objectContainsFields = sinon.stub(
        new Helper(),
        "objectContainsFields"
      );
    });

    afterEach(function () {
      mockHelper.objectContainsFields.restore();
    });

    it("Should pass validation while running flow", async function () {
      mockHelper.objectContainsFields.returns(undefined);

      await ingestWorkflow.checkIngestValidation(mockJob).should.not.rejected;
    });

    it("Should reject validation with missing field error", async function () {
      const missingField = "missingField";

      mockHelper.objectContainsFields.returns(missingField);

      await ingestWorkflow
        .checkIngestValidation(missingField)
        .should.rejectedWith(
          `Ingest validation - missing fields in root ingest json: "${missingField}"`
        );
    });
  });

  context("build", function () {
    const mockWorkflow = require("../../dataset/create.json");
    let backUpMetaData;
    let dynamicActivity;

    beforeEach(function () {
      ingestWorkflow = new IngestWorkflow(
        mockJob,
        mockApiInvoker,
        mockHelper,
        mockLogger
      );

      mockHelper.objectContainsFields = sinon.stub(new Helper(),"objectContainsFields");

      backUpMetaData = sinon.spy(ingestWorkflow, "backupMetadata");
      dynamicActivity = sinon.spy(ingestWorkflow, "dynamicActivity");
      mockjWorkflow.order = sinon.stub(jWorkflow, "order");
      mockLogger.info = sinon.stub(logger, "info");
      mockLogger.log = sinon.stub(logger, "log");
      mockLogger.error = sinon.stub(logger, "error");
    });

    afterEach(function () {
      mockjWorkflow.order.restore();
      mockLogger.info.restore();
      mockLogger.log.restore();
      mockLogger.error.restore();
      mockHelper.objectContainsFields.restore();
    });

    it("Should run flow in specific order with no rejects", async function () {
      const andThenStub = sinon.stub();
      const startStub = sinon.stub();

      mockHelper.objectContainsFields.returns(undefined);
      mockjWorkflow.order.returns({ andThen: andThenStub, start: startStub});
      startStub.callsFake((obj) => {obj.callback('result')});

      await ingestWorkflow.build(mockWorkflow);
      backUpMetaData.should.be.called;
      dynamicActivity.should.be.calledAfter(backUpMetaData);
      startStub.should.be.called;

      return Promise.resolve();
    });
  });

  context("getActivity", function () {
    let ingestWorkflow;
    const mockWorkflow = require("../../dataset/create.json");

    beforeEach(function () {
      ingestWorkflow = new IngestWorkflow(mockJob, mockApiInvoker, mockHelper);
    });

    it("Should return exists function by the workflow activities", function () {
      const result = ingestWorkflow.getActivity(mockWorkflow.activities[0]);
      result.should.be.instanceOf(Function);
    });
  });

  context("checkWorkflowValidation", function () {
    let workflow;
    const mockjob = require("../../dataset/ingest.json");

    beforeEach(function () {
      workflow = new IngestWorkflow(
        mockjob,
        mockApiInvoker,
        mockHelper,
        mockLogger
      );

      mockHelper.objectContainsFields = sinon.stub(
        new Helper(),
        "objectContainsFields"
      );
    });

    afterEach(function () {
      mockHelper.objectContainsFields.restore();
    });

    it("Should return missing activity because activity is not exist", async function () {
      const mockMissingActivity = require("../../dataset/missingActivity.json");
      mockHelper.objectContainsFields.returns(undefined);

      await workflow
        .checkWorkflowValidation(mockMissingActivity)
        .should.be.rejectedWith(
          `Workflow validation - There is no activity for "${mockMissingActivity.activities[2].name}"`
        );
    });

    it("Should return invalid workflow because dynamic activity field 'action' is not exist", async function () {
      const missingDynamicActivityAction = require("../../dataset/invalidDyanmicActivity.json");
      const missingDynamicActivity = "action";
      mockHelper.objectContainsFields.returns(missingDynamicActivity);

      await workflow
        .checkWorkflowValidation(missingDynamicActivityAction)
        .should.be.rejectedWith(
          `workflow "${missingDynamicActivityAction.name}" is missing field: "${missingDynamicActivity}"`
        );
    });

    it("Should return invalid workflow because dynamic activity name is not exist", async function () {
      const activityNoName = require("../../dataset/activityNoName.json");
      mockHelper.objectContainsFields.returns(undefined);

      await workflow
        .checkWorkflowValidation(activityNoName)
        .should.be.rejectedWith(
          `Workflow validation - activity in "${activityNoName.name}" workflow has no name`
        );
    });
  });
});

