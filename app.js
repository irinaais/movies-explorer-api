require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const NotFoundError = require('./errors/NotFoundError');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { registerValidator, authValidator } = require('./middlewares/validation');
const handleError = require('./middlewares/handleError');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

async function main() {
  await mongoose.connect('mongodb://localhost:27017/bitfilmsdb');
  console.log('Connected to bitfilmsdb');

  await app.listen(PORT);
  console.log(`Server listen on ${PORT}`);
}

main();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

// удалить после успешного прохождения ревью
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', registerValidator, createUser);
app.post('/signin', authValidator, login);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use((req, res, next) => {
  next(new NotFoundError('Указанная страница не найдена'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  console.error(err);
  handleError(err, res, next);
});
