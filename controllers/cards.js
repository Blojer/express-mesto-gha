const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

function getCards(_req, res, next) {
  return Card.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Передача некоректых данных'));
      } else { next(err); }
    });
}

function deleteCard(req, res, next) {
  const { cardId } = req.params;

  Card.findById(cardId).orFail(new NotFoundError('Карточки с таким id не найдено'))
    .then((card) => {
      console.log(card.owner, req.user._id);
      if (card.owner !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав');
      } else {
        card.deleteOne();
        res.send({ message: 'Карточка удалена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректное id карточки'));
      } else {
        next(err);
      }
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
        throw new NotFoundError('Передан несуществующий id карточки');
      } else { res.send(card); }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передача некоректых данных'));
      } else {
        next(err);
      }
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
        throw new NotFoundError('Передан несуществующий id карточки');
      } else { res.send(card); }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передача некоректых данных'));
      } else {
        next(err);
      }
    });
}
module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
