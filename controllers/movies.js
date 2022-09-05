const Movie = require('../models/movie');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

// TODO сделать, чтобы возвращались только сохраненные текущим пользователем фильмы

module.exports.sendMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      if (!movies) {
        throw new NotFoundError('Пока нет сохраненных фильмов');
      }
      return res.send(movies);
    })
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const ownerId = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: ownerId,
  })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Указанный фильм не найден');
      }
      return res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (movie == null || !movie) {
        throw new NotFoundError('Указанный фильм не найден');
      } else if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Можно удалить только свой фильм');
      }
      return movie.remove()
        .then(() => res.send({ data: movie }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
