const express = require('express');
const router = express.Router();
const BugController = require('../controllers/bugController');

// Определяем маршруты
router.get('/', BugController.getAll);           // GET /bugs
router.get('/:id', BugController.getById);       // GET /bugs/:id
router.post('/', BugController.create);          // POST /bugs
router.put('/:id', BugController.update);        // PUT /bugs/:id
router.delete('/:id', BugController.delete);     // DELETE /bugs/:id

module.exports = router;