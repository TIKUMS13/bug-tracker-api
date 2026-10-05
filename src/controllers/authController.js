const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');

// Генерация JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
};

const AuthController = {
    // POST /auth/register - регистрация
    register: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            // Валидация
            if (!email || !password) {
                return res.status(400).json({ error: 'Email и пароль обязательны' });
            }

            if (password.length < 6) {
                return res.status(400).json({ error: 'Пароль должен быть минимум 6 символов' });
            }

            // Проверка, что email не занят
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
            }

            // Хеширование пароля
            const passwordHash = await bcrypt.hash(password, 10);

            // Создание пользователя
            const user = await User.create({
                email,
                passwordHash,
                role: 'user'
            });

            // Генерация токена
            const token = generateToken(user);

            res.status(201).json({
                message: 'Пользователь зарегистрирован',
                user: user.toJSON(),
                token
            });
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
            }
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({ error: 'Email уже занят' });
            }
            next(error);
        }
    },

    // POST /auth/login - вход
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email и пароль обязательны' });
            }

            // Поиск пользователя
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ error: 'Неверный email или пароль' });
            }

            // Проверка пароля
            const isValidPassword = await bcrypt.compare(password, user.passwordHash);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Неверный email или пароль' });
            }

            // Генерация токена
            const token = generateToken(user);

            res.json({
                message: 'Вход выполнен',
                user: user.toJSON(),
                token
            });
        } catch (error) {
            next(error);
        }
    },

    // GET /auth/profile - данные текущего пользователя (защищённый)
    getProfile: async (req, res, next) => {
        try {
            const user = await User.findByPk(req.user.id);
            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }
            res.json(user.toJSON());
        } catch (error) {
            next(error);
        }
    },

    // GET /auth/users - список всех пользователей (только admin)
    getAllUsers: async (req, res, next) => {
        try {
            const users = await User.findAll({
                attributes: { exclude: ['passwordHash'] },
                order: [['id', 'ASC']]
            });
            res.json(users);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = AuthController;