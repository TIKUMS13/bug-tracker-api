const express = require('express');
const router = express.Router();
const MongoBugController = require('../controllers/mongoBugController');

// CRUD
router.get('/', MongoBugController.getAll);
router.get('/:id', MongoBugController.getById);
router.post('/', MongoBugController.create);
router.put('/:id', MongoBugController.update);
router.delete('/:id', MongoBugController.delete);

// Шаринг
router.post('/:id/share', MongoBugController.share);

// Работа с вложенными структурами
router.post('/:id/comments', MongoBugController.addComment);
router.delete('/:id/comments/:commentId', MongoBugController.deleteComment);

module.exports = router;