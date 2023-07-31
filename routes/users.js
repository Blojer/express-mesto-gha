const usersRoutes = require('express').Router();
const {
  getUsers, getUser, createUser, updateUser, updateAvatar,
} = require('../controllers/users');

usersRoutes.get('/', getUsers);

usersRoutes.get('/:userId', getUser);

usersRoutes.post('/', createUser);

usersRoutes.patch('/me', updateUser);

usersRoutes.patch('/me/avatar', updateAvatar);

module.exports = usersRoutes;
