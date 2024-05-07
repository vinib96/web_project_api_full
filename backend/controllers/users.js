const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

const bcrypt = require('bcrypt');

const User = require('../models/user');

dotenv.config();

const { JWT_SECRET } = process.env;

const ERROR_NOT_FOUND = 404;
const ERROR_FETCH = 500;
const ERROR_INVALID_DATA = 400;

module.exports.getUsers = (req, res) => {
  User.find({})

    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_FETCH).send({ message: 'Error' }));
};

module.exports.getUsersById = (req, res) => {
  User.findById(req.params.userId)
    .then((users) => {
      if (users) {
        res.send({ data: users });
      } else {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'ID do usuário não encontrado' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_INVALID_DATA).send({ message: 'Dados inválidos' });
      } else {
        res.status(ERROR_FETCH).send({ message: 'Error' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INVALID_DATA).send({ message: 'Dados inválidos' });
      } else {
        res.status(ERROR_FETCH).send({ message: 'Error' });
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        const error = new Error('Email ou senha incorretos.');
        error.status = 404;
        throw error;
      }

      return bcrypt.compare(password, user.password).then((isMatched) => {
        if (!isMatched) {
          const error = new Error('Email ou senha incorretos.');
          error.status = 401;
          throw error;
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: '7d',
        });
        res.status(200).send({ token });
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INVALID_DATA).send({ message: 'Dados inválidos' });
      } else {
        res.status(ERROR_FETCH).send({ message: 'Error' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INVALID_DATA).send({ message: 'Dados inválidos' });
      } else {
        res.status(ERROR_FETCH).send({ message: 'Error' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INVALID_DATA).send({ message: 'Dados inválidos' });
      } else {
        res.status(ERROR_FETCH).send({ message: 'Error' });
      }
    });
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((users) => {
      if (users) {
        res.send({ data: users });
      } else {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'ID do usuário não encontrado' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_INVALID_DATA).send({ message: 'Dados inválidos' });
      } else {
        res.status(ERROR_FETCH).send({ message: 'Error' });
      }
    });
};
