const { Bug } = require('../../models');

const BugController = {
    // GET /bugs - получить все баги
    getAll: async (req, res, next) => {
        try {
            const bugs = await Bug.findAll({
                order: [['id', 'ASC']]
            });
            res.json(bugs);
        } catch (error) {
            next(error);
        }
    },

    // GET /bugs/:id - получить баг по ID
    getById: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const bug = await Bug.findByPk(id);

            if (!bug) {
                return res.status(404).json({ error: 'Баг с таким ID не найден' });
            }

            res.json(bug);
        } catch (error) {
            next(error);
        }
    },

    // POST /bugs - создать новый баг
    create: async (req, res, next) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: 'Тело запроса не может быть пустым' });
            }

            const { title, description, priority, assignee, deadline } = req.body;

            if (!title) {
                return res.status(400).json({ error: 'Поле "title" (название) обязательно' });
            }

            const newBug = await Bug.create({
                title,
                description,
                priority,
                assignee,
                deadline
            });

            res.status(201).json(newBug);
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    error: error.errors.map(e => e.message).join(', ')
                });
            }
            next(error);
        }
    },

    // PUT /bugs/:id - обновить баг
    update: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);

            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: 'Тело запроса не может быть пустым' });
            }

            const { title, description, priority, status, assignee, deadline } = req.body;

            if (!title) {
                return res.status(400).json({ error: 'Поле "title" (название) обязательно' });
            }

            const bug = await Bug.findByPk(id);

            if (!bug) {
                return res.status(404).json({ error: 'Баг с таким ID не найден' });
            }

            await bug.update({
                title,
                description,
                priority,
                status,
                assignee,
                deadline
            });

            res.json(bug);
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    error: error.errors.map(e => e.message).join(', ')
                });
            }
            next(error);
        }
    },

    // DELETE /bugs/:id - удалить баг
    delete: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);

            const bug = await Bug.findByPk(id);

            if (!bug) {
                return res.status(404).json({ error: 'Баг с таким ID не найден' });
            }

            await bug.destroy();

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
};

module.exports = BugController;