const { celebrate } = require('celebrate');

const Joi = require('joi');

const validator = require('validator');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

const validateSignUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().optional().min(2).max(30),
    about: Joi.string().optional().min(2).max(30),
    avatar: Joi.string().optional().custom(validateURL),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateURL),
  }),
});

const validateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().optional().min(2).max(30),
    about: Joi.string().optional().min(2).max(30),
  }),
});

const validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().optional().custom(validateURL),
  }),
});

module.exports = {
  validateSignUp,
  validateLogin,
  validateCreateCard,
  validateProfile,
  validateAvatar,
};
