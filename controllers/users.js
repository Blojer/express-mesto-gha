const User = require('../models/user');

function getUsers(_req, res) {
  return User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Передача некоректых данных' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
}

function getUser(req, res) {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователя с таким id не найдено' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(400).send({ message: 'Некорректный id' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Передача некоректых данных' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}

function updateUser(req, res) {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about, avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: true, // если пользователь не найден, он будет создан
  })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Передача некоректых данных' });
      } if (!req.user._id) {
        res.status(404).send({ message: 'Пользователя с таким id не найдено' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}

function updateAvatar(req, res) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { ...req.body, avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: true, // если пользователь не найден, он будет создан
  })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Передача некоректых данных' });
      } if (!req.user._id) {
        res.status(404).send({ message: 'Пользователя с таким id не найдено' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
