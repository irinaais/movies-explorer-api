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

module.exports.sendMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    if (!movies) {
      throw new NotFoundError(NOT_SAVED_FILMS);
    }
    res.send(movies);
  } catch (err) {
    next(err);
  }
};

module.exports.createMovie = async (req, res, next) => {
  try {
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
    const movie = await Movie.create({
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
    });
    if (!movie) {
      throw new NotFoundError(FILM_NOT_FOUND);
    }
    res.send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError(VALIDATION_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      throw new NotFoundError(FILM_NOT_FOUND);
    } else if (!movie.owner.equals(req.user._id)) {
      throw new ForbiddenError(FORBIDDEN_ERROR_MESSAGE);
    }
    await movie.remove();
    res.send({ data: movie });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidationError(VALIDATION_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};
