const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Authentication routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// User CRUD operations
router.get('/', userController.getUsers);
router.get('/:userId', userController.getUserProfile);
router.get('/id/:id', userController.getUserById);
router.put('/:userId', userController.updateUser);
router.put('/id/:id', userController.updateUserById);
router.delete('/:userId', userController.deleteUser);
router.delete('/id/:id', userController.deleteUserById);

module.exports = router;
