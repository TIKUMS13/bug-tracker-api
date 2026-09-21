const errorHandler = (err, req, res, next) => {
    console.error('Ошибка:', err.stack);

    res.status(500).json({
        error: 'Внутренняя ошибка сервера',
        message: err.message
    });
};

module.exports = errorHandler;