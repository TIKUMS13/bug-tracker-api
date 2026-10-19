require('dotenv').config();
const express = require('express');
const app = express();

const { sequelize } = require('./models');
const bugRoutes = require('./src/routes/bugRoutes');
const authRoutes = require('./src/routes/authRoutes');  // ← НОВОЕ
const errorHandler = require('./src/middleware/errorHandler');

app.use(express.json());

// Публичные маршруты
app.use('/auth', authRoutes);   // ← НОВОЕ

// Защищённые маршруты (баги доступны только авторизованным)
const authMiddleware = require('./src/middleware/auth');
app.use('/bugs', authMiddleware, bugRoutes);  // ← ЗАЩИЩЕНО!

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        await sequelize.authenticate();
        console.log('✅ Подключение к PostgreSQL установлено');

        app.listen(PORT, () => {
            console.log(`🚀 Сервер Bug Tracker запущен на http://localhost:${PORT}`);
            console.log(`\n🔐 Auth эндпоинты:`);
            console.log(`  POST   /auth/register  - регистрация`);
            console.log(`  POST   /auth/login     - вход`);
            console.log(`  GET    /auth/profile   - профиль (JWT)`);
            console.log(`  GET    /auth/users     - все пользователи (admin)`);
            console.log(`\n🐛 Bug эндпоинты (требуется JWT):`);
            console.log(`  GET    /bugs      - список багов`);
            console.log(`  GET    /bugs/:id  - баг по ID`);
            console.log(`  POST   /bugs      - создать баг`);
            console.log(`  PUT    /bugs/:id  - обновить баг`);
            console.log(`  DELETE /bugs/:id  - удалить баг`);
        });
    } catch (error) {
        console.error('❌ Ошибка подключения к БД:', error.message);
        process.exit(1);
    }
}

start();