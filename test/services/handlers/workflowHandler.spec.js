// const chai = require("chai");
// const sinon = require("sinon");
// const sinonChai = require("sinon-chai");
// const chaiAsPromised = require("chai-as-promised");
// const expect = chai.expect;
// const IngestWorkflow = require("../../../services/workflows/ingestWorkflow");
// const WorkflowHandler = require("../../../services/handlers/workflowHandler");


// chai.use(sinonChai);
// chai.use(chaiAsPromised);
// chai.should();

// const mockLogger = {};
// const mockHelper = {};
// const mockApiInvoker = {};

// describe("workflowHandler functionality", function () {
//   let workflowHandler;
//   let ingestValidationStub;
//   let ingestWorkflowStub;

//   const mockJob = require('../../dataset/ingest.json')

//   context("handleJobByIngestWorkflow", function () {
//     beforeEach(function () {
//         // ingestValidationStub = sinon.stub(IngestWorkflow.prototype, "checkIngestValidation").callsFake(()=> 1);
//         workflowHandler = new WorkflowHandler(mockApiInvoker, mockHelper, mockLogger);


//     });
//     afterEach(function(){
//         // ingestValidationStub.restore();

//     })
//     it("Should process the file through the selected workflow if exists",async function () { 
        
//         // ingestWorkflowStub = sinon.stub(sinon.createStubInstance(IngestWorkflow)).should.be.calledWithNew;
//         const result = await workflowHandler.handleJobByIngestWorkflow(mockJob);
//         console.log(result);

//     });
//   });
// });
