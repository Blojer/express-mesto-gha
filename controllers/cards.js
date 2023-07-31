// module.exports.createCard = (req, res) => {
//   console.log(req.user._id);
//   console.log(req.user._id);
// };

const Card = require('../models/card');

function getCards(_req, res) {
  return Card.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Передача некоректых данных', err,
        });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}

function createCard(req, res) {
  console.log(req.body);
  console.log(req.user._id);
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Передача некоректых данных', err,
        });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка', err });
      }
    });
}

function deleteCard(req, res) {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      console.log(card);
      card.deleteOne();
      res.send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      console.log(err);
      if (!cardId) {
        res.status(404).send({ message: 'карточки с указанным id не найдено' });
      }
    });
}

function likeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then(res.send({ message: 'Like' }))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Передача некоректых данных' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}

function dislikeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then(res.send({ message: 'Dislike' }))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Передача некоректых данных' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
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