const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");
const Helper = require("../../../services/helper/helper");
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();


describe("helper functionality", function () {
  context("objectContainsFields", function () {
      let helper;
    it("Should return true if object is contains the correct fields", function () {
      helper = new Helper();
      const mockWorkflowObject = require("../../dataset/create.json");
      const mockFields = ["sky"];
      const result = helper.objectContainsFields(mockWorkflowObject, mockFields);
      expect(result).to.be.a("string");
      expect(result).to.not.be.undefined;

    });
    it("Should return false if object is not contains the correct fields", function () {
        helper = new Helper();
        const mockWorkflowObject = require("../../dataset/create.json");
        const mockFields = ["name", "activities"];
        const result = helper.objectContainsFields(mockWorkflowObject, mockFields);
        expect(result).to.be.undefined;
      });
  });
});

