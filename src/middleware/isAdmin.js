const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Требуется авторизация' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ запрещён. Требуются права администратора' });
    }

    next();
};

module.exports = isAdmin;