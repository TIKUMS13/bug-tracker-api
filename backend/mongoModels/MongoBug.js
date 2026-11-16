const mongoose = require('mongoose');

// Вложенная схема комментария (subdocument)
const commentSchema = new mongoose.Schema({
    author: { type: String, required: true },   // email автора
    text:   { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, { _id: true });

// Вложенная схема записи истории изменений
const historyEntrySchema = new mongoose.Schema({
    changedBy: String,
    field:     String,
    oldValue:  String,
    newValue:  String,
    changedAt: { type: Date, default: Date.now }
}, { _id: false });

// Вложенная схема "доступа" (аналог таблицы BugAccess в PostgreSQL)
const accessSchema = new mongoose.Schema({
    email: String,
    grantedAt: { type: Date, default: Date.now }
}, { _id: false });

const mongoBugSchema = new mongoose.Schema({
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: 'Описание отсутствует' },
    priority: {
        type: String,
        enum: ['Низкий', 'Средний', 'Высокий'],
        default: 'Средний'
    },
    status: {
        type: String,
        enum: ['Новый', 'В работе', 'Готов'],
        default: 'Новый'
    },
    assignee:  { type: String, default: 'Не назначен' },
    deadline:  { type: Date, default: null },
    ownerId:   { type: Number, required: true }, // id пользователя из PostgreSQL
    ownerEmail:{ type: String, required: true },

    // Вложенные массивы — главное отличие от реляционной модели
    comments: [commentSchema],
    history:  [historyEntrySchema],
    sharedWith: [accessSchema],
    tags:     [String],

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MongoBug', mongoBugSchema);