const { Bug, User, Sequelize } = require('../../models');

const BugController = {
    // GET /bugs - получить баги (свои + те, к которым дан доступ)
    getAll: async (req, res, next) => {
    try {
        let whereClause = {};
        
        // Если не админ — показываем только свои или те, где есть доступ
        if (req.user.role !== 'admin') {
            whereClause = {
                [Sequelize.Op.or]: [
                    { userId: req.user.id },
                    { '$sharedWith.id$': req.user.id }
                ]
            };
        }

        const bugs = await Bug.findAll({
            where: whereClause,
            include: [{ 
                model: User, 
                as: 'sharedWith', 
                attributes: ['id', 'email'], 
                through: { attributes: [] },
                required: false // <-- ВАЖНО: используем LEFT JOIN вместо INNER JOIN
            }],
            order: [['id', 'ASC']]
        });
        res.json(bugs);
    } catch (error) { 
        console.error("ОШИБКА БД:", error); // Выведем детали в консоль
        next(error); 
    }
},

    // GET /bugs/:id
    getById: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const bug = await Bug.findByPk(id, {
                include: [{ model: User, as: 'sharedWith', attributes: ['id', 'email'] }]
            });

            if (!bug) return res.status(404).json({ error: 'Баг не найден' });

            const hasAccess = req.user.role === 'admin' || 
                              bug.userId === req.user.id || 
                              bug.sharedWith.some(u => u.id === req.user.id);

            if (!hasAccess) return res.status(403).json({ error: 'Доступ запрещён' });
            
            res.json(bug);
        } catch (error) { next(error); }
    },

    // POST /bugs - создать баг
    create: async (req, res, next) => {
        try {
            const { title, description, priority, assignee, deadline } = req.body;
            if (!title) return res.status(400).json({ error: 'Поле "title" обязательно' });

            const newBug = await Bug.create({
                title, description, priority, assignee, deadline,
                userId: req.user.id
            });

            // Сразу даем доступ создателю через таблицу связей
            await newBug.addSharedWith(req.user.id);

            res.status(201).json(newBug);
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
            }
            next(error);
        }
    },

    // PUT /bugs/:id
    update: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const bug = await Bug.findByPk(id);
            if (!bug) return res.status(404).json({ error: 'Баг не найден' });

            // Обновлять может админ, автор или тот, кому дали доступ
            const hasAccess = req.user.role === 'admin' || bug.userId === req.user.id;
            // (Для упрощения дадим обновлять только автору и админу, кому дали доступ - только смотреть)
            if (!hasAccess) return res.status(403).json({ error: 'Доступ запрещён' });

            await bug.update(req.body);
            res.json(bug);
        } catch (error) { next(error); }
    },

    // DELETE /bugs/:id
    delete: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const bug = await Bug.findByPk(id);
            if (!bug) return res.status(404).json({ error: 'Баг не найден' });

            if (req.user.role !== 'admin' && bug.userId !== req.user.id) {
                return res.status(403).json({ error: 'Удалять может только автор или админ' });
            }

            await bug.destroy();
            res.status(204).send();
        } catch (error) { next(error); }
    },

    // POST /bugs/:id/share - выдать доступ другому юзеру
    share: async (req, res, next) => {
        try {
            const bug = await Bug.findByPk(req.params.id);
            const { email } = req.body;

            if (!bug) return res.status(404).json({ error: 'Баг не найден' });
            if (req.user.role !== 'admin' && bug.userId !== req.user.id) {
                return res.status(403).json({ error: 'Только автор или админ может давать доступ' });
            }

            const targetUser = await User.findOne({ where: { email } });
            if (!targetUser) return res.status(404).json({ error: 'Пользователь с таким email не найден' });

            await bug.addSharedWith(targetUser.id);
            res.json({ message: `Доступ выдан пользователю ${email}` });
        } catch (error) { next(error); }
    }
};

module.exports = BugController; 