const BugModel = require('../models/bugModel');

// Контроллер - обрабатывает запросы и вызывает модель
const BugController = {
    // GET /bugs - получить все баги
    getAll: (req, res) => {
        const bugs = BugModel.getAll();
        res.json(bugs);
    },

    // GET /bugs/:id - получить баг по ID
    getById: (req, res) => {
        const id = parseInt(req.params.id);
        const bug = BugModel.getById(id);
        
        if (!bug) {
            return res.status(404).json({ error: 'Баг с таким ID не найден' });
        }
        
        res.json(bug);
    },

    // POST /bugs - создать новый баг
    create: (req, res) => {
        const { title, description, priority, assignee } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: 'Поле "title" (название) обязательно' });
        }
        
        const newBug = BugModel.create({ title, description, priority, assignee });
        res.status(201).json(newBug);
    },

    // PUT /bugs/:id - обновить баг
    update: (req, res) => {
        const id = parseInt(req.params.id);
        const { title, description, priority, status, assignee } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: 'Поле "title" (название) обязательно' });
        }
        
        const updatedBug = BugModel.update(id, { title, description, priority, status, assignee });
        
        if (!updatedBug) {
            return res.status(404).json({ error: 'Баг с таким ID не найден' });
        }
        
        res.json(updatedBug);
    },

    // DELETE /bugs/:id - удалить баг
    delete: (req, res) => {
        const id = parseInt(req.params.id);
        const deleted = BugModel.delete(id);
        
        if (!deleted) {
            return res.status(404).json({ error: 'Баг с таким ID не найден' });
        }
        
        res.status(204).send();
    }
};

module.exports = BugController;