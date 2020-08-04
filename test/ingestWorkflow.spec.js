// "use strict";
// const chai = require("chai");
// const chaiAsPromised = require("chai-as-promised");
// const expect = chai.expect;
// const sinon = require("sinon");
// const container = require("../containerConfig");
// const IngestWorkflow = require("../services/workflows/ingestWorkflow");

// chai.use(chaiAsPromised);

// describe("workflow funtionality", function () {
//   const ingest = require("./dataset/ingest.json");
//   const flow = require("./workflows/create.json");
//   const workflow = new IngestWorkflow(
//     ingest,
//     container.get("apiInvoker"),
//     container.get("helper"),
//     container.get("logger")
//   );
//   let backupMetadata = sinon.stub();
//   let dynamicActivity = sinon.stub();

//   beforeEach(function () {
//     backupMetadata = sinon.stub(workflow, "backupMetadata");
//     dynamicActivity = sinon.stub(workflow, "dynamicActivity");
//   });
//   afterEach(function () {
//     backupMetadata.restore();
//     dynamicActivity.restore();
//   });
//   // it.only("should run in specific order",async function () {
//   //  await workflow.build(flow).should.be.fu;    // return expect(workflow.build(flow)).to.eventually.be.fulfilled.then(ingest => {
//   //   //   expect(ingest.id).to.be.a('object')
//   //   // });
//   // });
// });
