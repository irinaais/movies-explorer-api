const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const ValidationError = require('../errors/ValidationError');
const {
  CONFLICT_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
  AUTH_SUCCESSFUL,
  USER_NOT_FOUND,
} = require('../utils/constants');
const { getJwtToken } = require('../utils/utils');

module.exports.createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ name, email, password: hash });
    const user2 = await User.findOne({ _id: user._id });
    res.send({ data: user2 });
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError(CONFLICT_ERROR_MESSAGE));
    } else if (err.name === 'ValidationError') {
      next(new ValidationError(VALIDATION_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, getJwtToken(), { expiresIn: '7d' });
    res.send({ message: AUTH_SUCCESSFUL, token });
  } catch (err) {
    next(err);
  }
};

module.exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND);
    }
    res.send({ email: user.email, name: user.name });
  } catch (err) {
    next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND);
    }
    res.send({ email: user.email, name: user.name });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError(VALIDATION_ERROR_MESSAGE));
    } else if (err.code === 11000) {
      next(new ConflictError(CONFLICT_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};
