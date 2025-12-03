const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', userController.authenticateToken, userController.getProfile);
router.put('/profile', userController.authenticateToken, userController.updateProfile);
router.put('/fcm-token', userController.authenticateToken, userController.updateFCMToken);
router.get('/:id', userController.authenticateToken, userController.getUserById);

module.exports = router;