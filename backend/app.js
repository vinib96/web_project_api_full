const express = require('express');

const { errors } = require('celebrate');

const { validateSignUp, validateLogin } = require('./utils/validation');

const userController = require('./controllers/users');

const authorization = require('./middlewares/auth');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/aroundb');

const app = express();

const usersRoute = require('./routes/users');

const cardsRoute = require('./routes/cards');

const { PORT = 3000 } = process.env;

app.use(express.json());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('O servidor travará agora');
  }, 0);
});
app.use(requestLogger);
app.post('/signup', validateSignUp, userController.createUser);
app.post('/signin', validateLogin, userController.login);
app.use(authorization);
app.use(usersRoute);
app.use(cardsRoute);
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Ocorreu um erro no servidor' : message,
  });
  next(new Error('Erro de autorização'));
});
app.listen(PORT);
