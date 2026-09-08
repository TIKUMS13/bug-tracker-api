const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Подключаем маршруты
const bugRoutes = require('./src/routes/bugRoutes');
app.use('/bugs', bugRoutes);

// Подключаем обработчик ошибок
const errorHandler = require('./src/middleware/errorHandler');
app.use(errorHandler);

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер Bug Tracker запущен на http://localhost:${PORT}`);
    console.log(`Доступные эндпоинты:`);
    console.log(`  GET    /bugs      - список всех багов`);
    console.log(`  GET    /bugs/:id  - конкретный баг`);
    console.log(`  POST   /bugs      - создать баг`);
    console.log(`  PUT    /bugs/:id  - обновить баг`);
    console.log(`  DELETE /bugs/:id  - удалить баг`);
});