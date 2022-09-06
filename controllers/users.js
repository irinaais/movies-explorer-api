const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const ValidationError = require('../errors/ValidationError');
const AuthError = require('../errors/AuthError');
const {
  CONFLICT_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
  BAD_EMAIL_OR_PASSWORD,
  AUTH_SUCCESSFUL,
  USER_NOT_FOUND,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET = 'dev-key' } = process.env;

module.exports.createUser = (req, res, next) => {
  const { name, email } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => User.findOne({ _id: user._id }))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(CONFLICT_ERROR_MESSAGE));
      } else if (err.name === 'ValidationError') {
        next(new ValidationError(VALIDATION_ERROR_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const key = NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET;
      const token = jwt.sign({ _id: user._id }, key, { expiresIn: '7d' });
      res.send({ message: AUTH_SUCCESSFUL, token });
    })
    .catch((err) => {
      if (err.message === 'IncorrectEmail') {
        next(new AuthError(BAD_EMAIL_OR_PASSWORD));
      }
      next(err);
    });
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(USER_NOT_FOUND));
      }
      return res.send({ email: user.email, name: user.name });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(USER_NOT_FOUND));
      }
      return res.send({ email: user.email, name: user.name });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(VALIDATION_ERROR_MESSAGE));
      } else {
        next(err);
      }
    });
};
