const router = require('express').Router();
const { sendMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { movieIdValidator, createMoviesValidator } = require('../middlewares/validation');

router.get('/', sendMovies);
router.post('/', createMoviesValidator, createMovie);
router.delete('/:movieId', movieIdValidator, deleteMovie);

module.exports = router;
