module.exports = class workflowError extends Error {
  constructor(...params) {
    super(...params);
    this.name = "workflowError";
  }
};

