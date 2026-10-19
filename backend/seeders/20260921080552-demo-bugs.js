'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Bugs', [
      {
        title: 'Ошибка входа в систему',
        description: 'Пользователь не может войти, если пароль содержит спецсимволы',
        priority: 'Высокий',
        status: 'Новый',
        assignee: 'Иван Иванов',
        deadline: '2026-10-01',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Не отображается кнопка "Сохранить"',
        description: 'На странице редактирования профиля кнопка исчезает при разрешении экрана меньше 768px',
        priority: 'Средний',
        status: 'В работе',
        assignee: 'Петр Петров',
        deadline: '2026-10-05',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Не сохраняются настройки профиля',
        description: 'При обновлении аватара изменения не сохраняются после перезагрузки страницы',
        priority: 'Высокий',
        status: 'В работе',
        assignee: 'Мария Петрова',
        deadline: '2026-09-30',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Bugs', null, {});
  }
};