const express = require('express');

const { celebrate, errors } = require('celebrate');

const Joi = require('joi');

const userController = require('./controllers/users');

const authorization = require('./middlewares/auth');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

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

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().optional().min(2).max(30),
      about: Joi.string().optional().min(2).max(30),
      avatar: Joi.string().optional().uri(),
    }),
  }),
  userController.createUser
);
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  userController.login
);
app.use(authorization);

app.use(usersRoute);
app.use(cardsRoute);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Ocorreu um erro no servidor' : message,
  });
  next(new Error('Erro de autorização'));
});
app.listen(PORT);
