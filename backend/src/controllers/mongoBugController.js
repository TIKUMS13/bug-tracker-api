const MongoBug = require('../../mongoModels/MongoBug');

const MongoBugController = {

    // GET /mongo/bugs — все баги (админ — все, user — свои + где есть доступ)
    getAll: async (req, res, next) => {
        try {
            let filter = {};
            if (req.user.role !== 'admin') {
                filter = {
                    $or: [
                        { ownerId: req.user.id },
                        { 'sharedWith.email': req.user.email }
                    ]
                };
            }
            const bugs = await MongoBug.find(filter).sort({ createdAt: 1 });
            res.json(bugs);
        } catch (error) { next(error); }
    },

    // GET /mongo/bugs/:id
    getById: async (req, res, next) => {
        try {
            const bug = await MongoBug.findById(req.params.id);
            if (!bug) return res.status(404).json({ error: 'Баг не найден' });

            const hasAccess =
                req.user.role === 'admin' ||
                bug.ownerId === req.user.id ||
                bug.sharedWith.some(a => a.email === req.user.email);

            if (!hasAccess) return res.status(403).json({ error: 'Доступ запрещён' });

            res.json(bug);
        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(400).json({ error: 'Некорректный ID' });
            }
            next(error);
        }
    },

    // POST /mongo/bugs — создать баг
    create: async (req, res, next) => {
        try {
            const { title, description, priority, status, assignee, deadline, tags } = req.body;
            if (!title) return res.status(400).json({ error: 'Поле "title" обязательно' });

            const newBug = await MongoBug.create({
                title,
                description,
                priority,
                status,
                assignee,
                deadline: deadline || null,
                tags: tags || [],
                ownerId: req.user.id,
                ownerEmail: req.user.email,
                sharedWith: [{ email: req.user.email }]
            });

            res.status(201).json(newBug);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    error: Object.values(error.errors).map(e => e.message).join(', ')
                });
            }
            next(error);
        }
    },

    // PUT /mongo/bugs/:id — обновить (с записью истории по status)
    update: async (req, res, next) => {
        try {
            const bug = await MongoBug.findById(req.params.id);
            if (!bug) return res.status(404).json({ error: 'Баг не найден' });

            const hasAccess = req.user.role === 'admin' || bug.ownerId === req.user.id;
            if (!hasAccess) return res.status(403).json({ error: 'Доступ запрещён' });

            if (req.body.status && req.body.status !== bug.status) {
                bug.history.push({
                    changedBy: req.user.email,
                    field: 'status',
                    oldValue: bug.status,
                    newValue: req.body.status
                });
            }

            const allowed = ['title', 'description', 'priority', 'status', 'assignee', 'deadline', 'tags'];
            allowed.forEach(field => {
                if (req.body[field] !== undefined) bug[field] = req.body[field];
            });

            await bug.save();
            res.json(bug);
        } catch (error) {
            if (error.name === 'CastError') return res.status(400).json({ error: 'Некорректный ID' });
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    error: Object.values(error.errors).map(e => e.message).join(', ')
                });
            }
            next(error);
        }
    },

    // DELETE /mongo/bugs/:id
    delete: async (req, res, next) => {
        try {
            const bug = await MongoBug.findById(req.params.id);
            if (!bug) return res.status(404).json({ error: 'Баг не найден' });

            if (req.user.role !== 'admin' && bug.ownerId !== req.user.id) {
                return res.status(403).json({ error: 'Удалять может только автор или админ' });
            }

            await MongoBug.findByIdAndDelete(req.params.id);
            res.status(204).send();
        } catch (error) {
            if (error.name === 'CastError') return res.status(400).json({ error: 'Некорректный ID' });
            next(error);
        }
    },

    // POST /mongo/bugs/:id/share — выдать доступ по email
    share: async (req, res, next) => {
        try {
            const { email } = req.body;
            if (!email) return res.status(400).json({ error: 'Поле "email" обязательно' });

            const bug = await MongoBug.findById(req.params.id);
            if (!bug) return res.status(404).json({ error: 'Баг не найден' });

            if (req.user.role !== 'admin' && bug.ownerId !== req.user.id) {
                return res.status(403).json({ error: 'Только автор или админ может давать доступ' });
            }

            if (bug.sharedWith.some(a => a.email === email)) {
                return res.status(409).json({ error: 'Доступ уже выдан этому пользователю' });
            }

            bug.sharedWith.push({ email });
            await bug.save();

            res.json({ message: `Доступ выдан пользователю ${email}`, bug });
        } catch (error) {
            if (error.name === 'CastError') return res.status(400).json({ error: 'Некорректный ID' });
            next(error);
        }
    },

    // ===== Работа с вложенными структурами =====

    // POST /mongo/bugs/:id/comments — добавить комментарий
    addComment: async (req, res, next) => {
        try {
            const { text } = req.body;
            if (!text) return res.status(400).json({ error: 'Поле "text" обязательно' });

            const bug = await MongoBug.findById(req.params.id);
            if (!bug) return res.status(404).json({ error: 'Баг не найден' });

            const hasAccess =
                req.user.role === 'admin' ||
                bug.ownerId === req.user.id ||
                bug.sharedWith.some(a => a.email === req.user.email);

            if (!hasAccess) return res.status(403).json({ error: 'Доступ запрещён' });

            bug.comments.push({ author: req.user.email, text });
            await bug.save();

            res.status(201).json({ message: 'Комментарий добавлен', comments: bug.comments });
        } catch (error) {
            if (error.name === 'CastError') return res.status(400).json({ error: 'Некорректный ID' });
            next(error);
        }
    },

    // DELETE /mongo/bugs/:id/comments/:commentId — удалить комментарий
    deleteComment: async (req, res, next) => {
        try {
            const bug = await MongoBug.findById(req.params.id);
            if (!bug) return res.status(404).json({ error: 'Баг не найден' });

            const hasAccess = req.user.role === 'admin' || bug.ownerId === req.user.id;
            if (!hasAccess) return res.status(403).json({ error: 'Доступ запрещён' });

            bug.comments.pull({ _id: req.params.commentId });
            await bug.save();

            res.json({ message: 'Комментарий удалён', comments: bug.comments });
        } catch (error) {
            if (error.name === 'CastError') return res.status(400).json({ error: 'Некорректный ID' });
            next(error);
        }
    }
};

module.exports = MongoBugController;