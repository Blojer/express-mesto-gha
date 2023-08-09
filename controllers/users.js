const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');

function getUsers(_req, res, next) {
  return User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Передача некоректых данных'));
        // res.status(400).send({ message: 'Передача некоректых данных' });
      } else {
        next(err);
      }
      // res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
}

function getUser(req, res, next) {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      console.log(user);
      if (!user) {
        console.log(user);
        throw new NotFoundError('Пользователя с таким id не найдено');
      } else { res.status(200).send(user); }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Некорректный id'));
        // res.status(400).send({ message: 'Некорректный id' });
      } else {
        next(err);
      }
      // res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
}

function getUserInfo(req, res, next) {
  User.findById(req.user._id)
    // .onFail(new NotFoundError('Пользователя с таким id не найдено'))
    .then((user) => res.send(user))
    .catch(next);
}

function createUser(req, res, next) {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10).then((hash) => User.create({
    name, about, avatar, email, password: hash,
  }))
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Передача некоректых данных'));
        // res.status(400).send({ message: 'Передача некоректых данных' });
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
        // const err = new Error('Пользователь с таким email уже существует');
        // err.statusCode = 409;

        // next(err);
      } else {
        next(err);
      }
    });
}

function updateUser(req, res, next) {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about, avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: true, // если пользователь не найден, он будет создан
  })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Передача некоректых данных'));
        // res.status(400).send({ message: 'Передача некоректых данных' });
      } if (!req.user._id) {
        next(new NotFoundError('Пользователя с таким id не найдено'));
        // res.status(404).send({ message: 'Пользователя с таким id не найдено' });
      } else {
        next(err);
      }
    });
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { ...req.body, avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: true, // если пользователь не найден, он будет создан
  })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Передача некоректых данных'));
        // res.status(400).send({ message: 'Передача некоректых данных' });
      } if (!req.user._id) {
        next(new NotFoundError('Пользователя с таким id не найдено'));
        // res.status(404).send({ message: 'Пользователя с таким id не найдено' });
      } else {
        next(err);
      }
    });
}

function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password).then((user) => {
    const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

    res.cookie('token', token);
    // вернём токен
    return res.send({ token });
  })
    .catch(next);
}

module.exports = {
  getUsers,
  getUser,
  getUserInfo,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
