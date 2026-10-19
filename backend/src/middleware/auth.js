const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Извлекаем токен из заголовка Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'Требуется авторизация (нет заголовка)' });
        }

        // Формат: "Bearer <token>"
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ error: 'Неверный формат токена. Используйте: Bearer <token>' });
        }

        const token = parts[1];

        // Верификация токена
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Прикрепляем данные пользователя к запросу
        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Токен истёк' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Неверный токен' });
        }
        return res.status(401).json({ error: 'Ошибка аутентификации' });
    }
};

module.exports = authMiddleware;