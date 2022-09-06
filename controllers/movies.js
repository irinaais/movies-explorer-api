const Movie = require('../models/movie');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const {
  NOT_SAVED_FILMS,
  FILM_NOT_FOUND,
  VALIDATION_ERROR_MESSAGE,
  FORBIDDEN_ERROR_MESSAGE,
} = require('../utils/constants');

module.exports.sendMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      if (!movies) {
        throw new NotFoundError(NOT_SAVED_FILMS);
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
    trailerLink,
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
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: ownerId,
  })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(FILM_NOT_FOUND);
      }
      return res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(VALIDATION_ERROR_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (movie == null || !movie) {
        throw new NotFoundError(FILM_NOT_FOUND);
      } else if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError(FORBIDDEN_ERROR_MESSAGE);
      }
      return movie.remove()
        .then(() => res.send({ data: movie }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(VALIDATION_ERROR_MESSAGE));
      } else {
        next(err);
      }
    });
};
