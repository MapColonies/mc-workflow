const workflowError = require("./workflowError");

const handleError = (error) => {
  if (error instanceof Error) {
    if (error.response) {
      const err = {
        message: error.response.data.message,
        status: error.response.data.statusCode,
        name: error.name,
      };
      return err;
    } else if (error instanceof workflowError) {
      const err = {
        message: error.message,
        name: error.name,
        status: 400,
      };
      return err;
    } else {
      const err = {
        message: error.message,
        name: error.name,
        status: 500,
      };
      return err;
    }
  }
};
module.exports = handleError;

