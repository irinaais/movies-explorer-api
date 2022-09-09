const { EMAIL_IS_TAKEN } = require('../utils/constants');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = EMAIL_IS_TAKEN;
  }
}

module.exports = ConflictError;
