const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");
const APIInvoker = require("../../services/apiInvoker");
const axios = require("axios");
const logger = require("../../logger/logger");
const mockLogger = {};

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe("apiInvoker functionality", function () {
  let apiInvoker;
  const ingestMock = require("../dataset/ingest.json");

  context("GetParamObj", function () {

    beforeEach(function () {
      apiInvoker = new APIInvoker(mockLogger);
      mockLogger.log = sinon.stub(logger, "log");
    });

    afterEach(function () {
      mockLogger.log.restore();
    });

    it("Should return all params from object without reject", function () {
      const result = apiInvoker.GetParamObj(ingestMock.imageMetaData, ["*"]);

      result.should.to.be.a("object");
      result.should.to.eql(ingestMock.imageMetaData);
    });

    it("Should return specific params from object without reject", function () {
      const result = apiInvoker.GetParamObj(ingestMock.imageMetaData, [
        "id",
        "file",
      ]);
      const expectedResult = {
        id: ingestMock.imageMetaData.id,
        file: ingestMock.imageMetaData.file,
      };
      result.should.be.a("object");
      result.should.to.eql(expectedResult);
    });

    it("Should return undefined when recive undefined params", function () {
      const result = apiInvoker.GetParamObj(
        ingestMock.imageMetaData,
        undefined
        );

        expect(result).to.be.undefined;
    });
  });
});

context("dynamicPost", function () {
  const mockReqParams = require("../dataset/ingest.json");
  const mockParams = require("../dataset/paramsMock.json");
  const axiosStub = {};

  beforeEach(function () {
    apiInvoker = new APIInvoker(mockLogger);
    mockLogger.log = sinon.stub(logger, "log");
    mockLogger.error = sinon.stub(logger, "error");
    mockLogger.info = sinon.stub(logger, "info");
    axiosStub.post = sinon.stub(axios, "post");
  });

  afterEach(function () {
    mockLogger.log.restore();
    mockLogger.info.restore();
    mockLogger.error.restore();
    axiosStub.post.restore();
  });

  it("Should return object with correct response fields", async function () {
    const mockAxiosResponse = { data: { statusCode: 200, success: "OK" } };
    axiosStub.post.resolves(mockAxiosResponse);

    const result = await apiInvoker.dynamicPost(mockReqParams, mockParams);
    
    const expectedResult = {
      ...mockReqParams.imageMetaData,
      ...mockAxiosResponse.data,
    };

    result.should.be.an("object");
    result.should.to.eql(expectedResult);
    axiosStub.post.should.be.calledOnce;
    axiosStub.post.should.be.calledWith(
      mockParams.url,
      mockReqParams.imageMetaData
    );
  });

  it("Should not complete and reject by axios post", async function () {
    axiosStub.post.rejects();

    await apiInvoker.dynamicPost(mockReqParams, mockParams).should.rejected;
  });
});

