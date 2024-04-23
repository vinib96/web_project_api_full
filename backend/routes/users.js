const router = require('express').Router();
const celebrate = require('celebrate');
const Joi = require('joi');

const userController = require('../controllers/users');

router.post(
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

router.get('/users', userController.getUsers);

router.get('/users/:userId', userController.getUsersById);

router.patch('/users/me', userController.updateUser);

router.patch('/users/me/avatar', userController.updateAvatar);

module.exports = router;
