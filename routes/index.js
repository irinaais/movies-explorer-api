const router = require('express').Router();
const { registerValidator, authValidator } = require('../middlewares/validation');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signup', registerValidator, createUser);
router.post('/signin', authValidator, login);

router.use(auth);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Указанная страница не найдена'));
});

module.exports = router;
