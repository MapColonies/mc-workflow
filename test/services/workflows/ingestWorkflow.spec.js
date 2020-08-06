const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
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
  const mockJob = require("../../dataset/ingest.json");
  let ingestWorkflow;
  context("objectContainsFields", function () {
    beforeEach(function () {
      ingestWorkflow = new IngestWorkflow(mockJob, mockApiInvoker, mockHelper);
      mockHelper.objectContainsFields = sinon.stub(
        new Helper(),
        "objectContainsFields"
      );
    });
    afterEach(function () {
      mockHelper.objectContainsFields.restore();
    });
    it("Should pass validation while running flow", async function () {
      mockHelper.objectContainsFields.resolves(true);
      await ingestWorkflow.checkIngestValidation(mockJob).should.not.rejected;
    });
    it("Should reject validation with missing fields error", async function () {
      mockHelper.objectContainsFields.rejectes;
      await ingestWorkflow
        .checkIngestValidation(mockJob)
        .should.rejectedWith(
          "Ingest validation - missing fields in root workflow"
        );
    });
  });
  // context("workflowBuild", function(){
  //     const mockWorkflow = require('../../workflows/create.json');

  //     beforeEach(function(){
  //         mockHelper.objectContainsFields = sinon.stub(new Helper(), "objectContainsFields");
  //         ingestWorkflow = new IngestWorkflow(mockJob, mockApiInvoker, mockHelper, mockLogger);
  //         mockjWorkflow.order = sinon.stub(jWorkflow, "order");
  //         mockLogger.log = sinon.stub(logger, "log");
  //         mockLogger.info = sinon.stub(logger, "info");
  //         mockLogger.error = sinon.stub(logger, "error");
  //     })
  //     afterEach(function(){
  //         mockjWorkflow.order.restore();
  //         mockLogger.log.restore();
  //         mockLogger.info.restore();
  //         mockLogger.error.restore();
  //         mockHelper.objectContainsFields.restore();
  //     })
  //     it("Should run flow in specific order",async function(){
  //         const andThen = sinon.stub();
  //         mockjWorkflow.order({andThen: andThen});
  //         mockHelper.objectContainsFields.returns(true);
  //         await ingestWorkflow.build(mockWorkflow).should.not.rejected;
  //         mockjWorkflow.orderStub.should.be.called;
  //     })
  // })
  context("getActivity", function () {
    const mockWorkflow = require("../../dataset/create.json");
    let ingestWorkflow;
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
    const mockjob = require('../../dataset/ingest.json');
    beforeEach(function () {
        workflow = new IngestWorkflow(mockjob, mockApiInvoker, mockHelper, mockLogger);
        mockHelper.objectContainsFields = sinon.stub(
            new Helper(),
            "objectContainsFields"
            );
        });
        afterEach(function(){
            mockHelper.objectContainsFields.restore();
        });
        it("Should return missing activity because activity is not exist",async function(){
        const mockMissingActivity = require('../../dataset/missingActivity.json');
        mockHelper.objectContainsFields.returns(true);
        await workflow.checkWorkflowValidation(mockMissingActivity).should.be.rejectedWith(
            `Workflow validation - There is no activity for ${mockMissingActivity.activities[2].name}`
        );
      });
      it("Should return invalid workflow because dynamic activity action is not exist",async function(){
        const missingDynamicActivityAction = require('../../dataset/invalidDyanmicActivity.json');
        mockHelper.objectContainsFields.returns(true);
        await workflow.checkWorkflowValidation(missingDynamicActivityAction).should.be.rejectedWith(
            "Workflow validation - dynamic activity missing fields"
        );
      });
      it("Should return invalid workflow because dynamic activity name is not exist",async function(){
        const activityNoName = require('../../dataset/activityNoName.json');
        mockHelper.objectContainsFields.returns(true);
        await workflow.checkWorkflowValidation(activityNoName).should.be.rejectedWith(
            `Workflow validation - activity in ${activityNoName.name} workflow has no name`
        );
      });
  });
})
