const { celebrate, Joi } = require('celebrate');

const validateSignUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^((http|https|ftp):\/\/)?(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)/i),
    email: Joi.string().regex(/.+@.+\..+/i).required(),
    password: Joi.string().required().min(4),
  }),
});

const validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().regex(/.+@.+\..+/i),
    password: Joi.string().required().min(4),
  }),
});

module.exports = {
  validateSignUp,
  validateSignIn,

};
