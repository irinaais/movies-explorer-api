// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
// const ConflictError = require('../errors/ConflictError');
const ValidationError = require('../errors/ValidationError');
// const AuthError = require('../errors/AuthError');

// const { NODE_ENV, JWT_SECRET = 'dev-key' } = process.env;

// module.exports.createUser = (req, res, next) => {
//   const {
//     name, about, avatar, email,
//   } = req.body;
//   bcrypt.hash(req.body.password, 10)
//     .then((hash) => User.create({
//       name, about, avatar, email, password: hash,
//     }))
//     .then((user) => User.findOne({ _id: user._id }))
//     .then((user) => {
//       res.send({ data: user });
//     })
//     .catch((err) => {
//       if (err.code === 11000) {
//         next(new ConflictError('Пользователь с такой почтой уже зарегистрирован'));
//       } else if (err.name === 'ValidationError') {
//         next(new ValidationError('Переданы некорректные данные'));
//       } else {
//         next(err);
//       }
//     });
// };

// module.exports.login = (req, res, next) => {
//   const { email, password } = req.body;
//   return User.findUserByCredentials(email, password)
//     .then((user) => {
//       // const key = JWT_SECRET; // NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET;
//       const key = NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET;
//       const token = jwt.sign({ _id: user._id }, key, { expiresIn: '7d' });
//       // res.cookie('jwt', token, {
//       //   maxAge: 3600000 * 24 * 7,
//       //   httpOnly: true,
//       //   sameSite: true,
//       // });
//       res.send({ message: 'Авторизация прошла успешна', token });
//     })
//     .catch((err) => {
//       if (err.message === 'IncorrectEmail') {
//         next(new AuthError('Неправильный логин или пароль'));
//       }
//       next(err);
//     });
// };

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Указанный пользователь не найден'));
      }
      return res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Указанный пользователь не найден'));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
