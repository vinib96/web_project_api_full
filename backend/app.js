const express = require('express');

const { errors } = require('celebrate');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/aroundb');

const app = express();
const usersRoute = require('./routes/users');

const cardsRoute = require('./routes/cards');

const { PORT = 3000 } = process.env;
app.use(express.json());
app.use(errors());
app.use((req, res, next) => {
  req.user = {
    _id: '65fcb7b7ec0b3adc3fbba510',
  };

  next();
});

app.use(usersRoute);
app.use(cardsRoute);

app.listen(PORT);
