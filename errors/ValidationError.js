const { BAD_REQUEST_CODE } = require('../utils/constants');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST_CODE;
  }
}

module.exports = ValidationError;
