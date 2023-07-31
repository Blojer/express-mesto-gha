const cardsRoutes = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardsRoutes.get('/', getCards);

cardsRoutes.post('/', createCard);

cardsRoutes.delete('/:cardId', deleteCard);

cardsRoutes.put('/:cardId/likes', likeCard);

cardsRoutes.delete('/:cardId/likes', dislikeCard);

module.exports = cardsRoutes;
