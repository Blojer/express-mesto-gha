const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

function getCards(_req, res, next) {
  return Card.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Передача некоректых данных'));
      }
      next(err);
    });
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Передача некоректых данных'));
        // res.status(400).send({
        //   message: 'Передача некоректых данных', err,
        // });
      }
      next(err);
      // res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
}

function deleteCard(req, res, next) {
  const { cardId } = req.params;

  Card.findById(cardId).orFail(new NotFoundError('Карточки с таким id не найдено'))
    .then((card) => {
      console.log(card.owner, req.user._id);
      if (card.owner !== req.user._id) {
        const err = new Error('Недостаточно прав для удаления');
        err.statusCode = 403;
        next();
      }
      card.deleteOne();
      res.send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректное id карточки'));
        // res.status(400).send({ message: 'Некорректное id карточки' });
      }
      next(err);
    });
}

function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Передан несуществующий id карточки'));
        // res.status(404).send({ message: 'Передан несуществующий id карточки' });
        // return;
      }
      res.send(card);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передача некоректых данных'));
        // res.status(400).send({ message: 'Передача некоректых данных' });
      }
      next(err);
      // res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
}

function dislikeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Передан несуществующий id карточки'));
        // res.status(404).send({ message: 'Передан несуществующий id карточки' });
        // return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передача некоректых данных'));
        // res.status(400).send({ message: 'Передача некоректых данных' });
      } if (!req.params.cardId) {
        return next(new NotFoundError('Передан несуществующий id карточки'));
        // res.status(404).send({ message: 'Передан несуществующий id карточки' });
      }
      next(err);
      // res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
}
module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
