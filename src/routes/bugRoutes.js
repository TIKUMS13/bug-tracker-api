const express = require('express');
const router = express.Router();
const BugController = require('../controllers/bugController');

router.get('/', BugController.getAll);
router.get('/:id', BugController.getById);
router.post('/', BugController.create);
router.put('/:id', BugController.update);
router.delete('/:id', BugController.delete);

module.exports = router;