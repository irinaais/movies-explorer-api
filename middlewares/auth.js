const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');
const { AUTH_ERROR_MESSAGE } = require('../utils/constants');
const { getJwtToken } = require('../utils/utils');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError(AUTH_ERROR_MESSAGE);
  } else {
    const token = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, getJwtToken());
    } catch (err) {
      console.error(err);
      throw new AuthError(AUTH_ERROR_MESSAGE);
    }
    req.user = payload;
    next();
  }
};
