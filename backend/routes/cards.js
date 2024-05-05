const router = require('express').Router();

const { validateCreateCard } = require('../utils/validation');

const cardController = require('../controllers/cards');

router.get('/cards', cardController.getCards);

router.delete('/cards/:cardId', cardController.deleteCardsById);

router.post('/cards', validateCreateCard, cardController.createCard);

router.put('/cards/likes/:cardId', cardController.likeCard);

router.delete('/cards/likes/:cardId', cardController.dislikeCard);

module.exports = router;
