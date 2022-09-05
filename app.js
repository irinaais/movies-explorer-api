require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const NotFoundError = require('./errors/NotFoundError');

const handleError = require('./middlewares/handleError');

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

// удалить после успешного прохождения ревью
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use((req, res, next) => {
  next(new NotFoundError('Указанная страница не найдена'));
});

app.use(errors());

app.use((err, req, res, next) => {
  console.error(err);
  handleError(err, res, next);
});
