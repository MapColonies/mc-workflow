module.exports = class errorHandler {
  handleError = (error) => {
    return {
      status: error.status,
      message: error.message
    };
  };
};
