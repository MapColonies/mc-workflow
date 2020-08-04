const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const APIInvoker = require("../services/apiInvoker");
const axios = require("axios");
const container = require("./containerConfig");

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe("apiInvoker", function () {
  let GetParamObj = sinon.stub();
  const ingestMock = require("./dataset/ingest.json");

  before(function () {
    container.configureForTesting();
  });

  context("GetParamObj", function () {
    const logger = container.getModule("logger");
    beforeEach(function () {
      const apiInvoker = new APIInvoker(logger);
      GetParamObj = sinon.stub(apiInvoker, "GetParamObj");
    });
    afterEach(function () {
      GetParamObj.restore();
    });
    it("Should return all params from object without reject", function () {
      const result = apiInvoker.GetParamObj(ingestMock.imageMetaData, ["*"]);

      result.should.not.be.undefined;
      result.should.be.a("object");
    });
    it("Should return specific params from object without reject", function () {
      const result = apiInvoker.GetParamObj(ingestMock.imageMetaData, [
        "id",
        "file",
      ]);

      result.should.not.be.undefined;
      result.should.be.a("object");
      result.should.have.property("id");
      result.should.have.property("file");
    });
    it("Should return undefined by pass incorrect params", function () {
      const result = apiInvoker.GetParamObj(
        ingestMock.imageMetaData,
        undefined
      );
      expect(result).to.be.undefined;
    });
  });

  context.only("dynamicPost", function () {
    const apiInvoker = new APIInvoker(logger);
    const logger = container.getModule("logger");

    it("Should makes a dynamicly post with no rejects", async function () {
      const axiosStub = sinon.stub(axios, "default.post");
      axiosStub.resolves({ statusCode: 200, body: "OK" });
      const result = await apiInvoker.dynamicPost(ingestMock, ["*"]);
    });
  });
});
