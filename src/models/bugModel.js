// Модель данных - управляет коллекцией багов
let bugs = [
    {
        id: 1,
        title: 'Ошибка входа в систему',
        description: 'Пользователь не может войти, если пароль содержит спецсимволы',
        priority: 'Высокий',
        status: 'Новый',
        assignee: 'Иван Иванов'
    },
    {
        id: 2,
        title: 'Не отображается кнопка "Сохранить"',
        description: 'На странице редактирования профиля кнопка исчезает при разрешении экрана меньше 768px',
        priority: 'Средний',
        status: 'В работе',
        assignee: 'Петр Петров'
    }
];

let nextId = 3;

// Функции для работы с коллекцией
const BugModel = {
    // Получить все баги
    getAll: () => {
        return bugs;
    },

    // Получить баг по ID
    getById: (id) => {
        return bugs.find(b => b.id === id);
    },

    // Создать новый баг
    create: (bugData) => {
        const newBug = {
            id: nextId++,
            title: bugData.title,
            description: bugData.description || 'Описание отсутствует',
            priority: bugData.priority || 'Средний',
            status: 'Новый',
            assignee: bugData.assignee || 'Не назначен'
        };
        bugs.push(newBug);
        return newBug;
    },

    // Обновить баг
    update: (id, bugData) => {
        const index = bugs.findIndex(b => b.id === id);
        if (index === -1) return null;
        
        bugs[index] = {
            id: id,
            title: bugData.title,
            description: bugData.description || 'Описание отсутствует',
            priority: bugData.priority || 'Средний',
            status: bugData.status || 'Новый',
            assignee: bugData.assignee || 'Не назначен'
        };
        return bugs[index];
    },

    // Удалить баг
    delete: (id) => {
        const index = bugs.findIndex(b => b.id === id);
        if (index === -1) return false;
        bugs.splice(index, 1);
        return true;
    }
};

module.exports = BugModel;