require('dotenv').config();
const express = require('express');
const app = express();

const { sequelize } = require('./models');
const bugRoutes = require('./src/routes/bugRoutes');
const errorHandler = require('./src/middleware/errorHandler');

// Middleware для парсинга JSON
app.use(express.json());

// Маршруты
app.use('/bugs', bugRoutes);

// Глобальный обработчик ошибок (должен быть последним!)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Подключение к БД и запуск сервера
async function start() {
    try {
        await sequelize.authenticate();
        console.log('✅ Подключение к PostgreSQL установлено');

        app.listen(PORT, () => {
            console.log(`🚀 Сервер Bug Tracker запущен на http://localhost:${PORT}`);
            console.log(`Доступные эндпоинты:`);
            console.log(`  GET    /bugs      - список всех багов`);
            console.log(`  GET    /bugs/:id  - конкретный баг`);
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