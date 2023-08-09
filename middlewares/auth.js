const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

function auth(req, res, next) {
  const { token } = req.cookies;

  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;
  return next();
}

module.exports = auth;
