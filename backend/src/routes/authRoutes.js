const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Публичные маршруты
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Защищённые маршруты (требуется JWT)
router.get('/profile', authMiddleware, AuthController.getProfile);

// Только для администраторов
router.get('/users', authMiddleware, isAdmin, AuthController.getAllUsers);

module.exports = router;