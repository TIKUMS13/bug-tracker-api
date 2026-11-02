require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const { sequelize } = require('./models');
const bugRoutes = require('./src/routes/bugRoutes');
const authRoutes = require('./src/routes/authRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const authMiddleware = require('./src/middleware/auth');

app.use(cors());
app.use(express.json());

// Маршруты
app.use('/auth', authRoutes);
// Включаем защиту JWT для маршрутов багов
app.use('/bugs', authMiddleware, bugRoutes); 

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        await sequelize.authenticate();
        console.log('✅ Подключение к PostgreSQL установлено');
        app.listen(PORT, () => {
            console.log(`🚀 Сервер Bug Tracker запущен на http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Ошибка подключения к БД:', error.message);
        process.exit(1);
    }
}
start();