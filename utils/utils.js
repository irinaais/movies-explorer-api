const { JWT_SECRET_DEV } = require('./config');

const { NODE_ENV, JWT_SECRET } = process.env;

function getJwtToken() {
  if (NODE_ENV === 'production') {
    if (!JWT_SECRET) {
      throw new Error('Отсутствует JWT-token');
    }
    return JWT_SECRET;
  }
  return JWT_SECRET_DEV;
}

module.exports = { getJwtToken };
