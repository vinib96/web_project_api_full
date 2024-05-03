const router = require('express').Router();

const { validateProfile, validateAvatar } = require('../utils/validation');

const userController = require('../controllers/users');

router.get('/users', userController.getUsers);

router.get('/users/me', userController.getCurrentUser);

router.get('/users/:userId', userController.getUsersById);

router.patch('/users/me', validateProfile, userController.updateUser);

router.patch('/users/me/avatar', validateAvatar, userController.updateAvatar);

module.exports = router;
