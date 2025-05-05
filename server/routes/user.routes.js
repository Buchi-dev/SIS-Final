const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Authentication routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// User CRUD operations
router.get('/', userController.getUsers);
router.get('/:userId', userController.getUserProfile);
router.put('/:userId', userController.updateUser);
router.delete('/:userId', userController.deleteUser);

module.exports = router;
