require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
const { limiter } = require('./middlewares/limiter');
const handleError = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { MONGO_URL_DEV } = require('./utils/config');

const { PORT = 3001, MONGO_URL = MONGO_URL_DEV } = process.env;
const app = express();

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log('Connected to moviesdb');

  await app.listen(PORT);
  console.log(`Server listen on ${PORT}`);
}

main();

app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

// удалить после успешного прохождения ревью
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  console.error(err);
  handleError(err, res, next);
});
