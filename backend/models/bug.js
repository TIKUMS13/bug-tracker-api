'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Bug extends Model {
    static associate(models) {
      // Связь: Баг принадлежит создателю
      Bug.belongsTo(models.User, { foreignKey: 'userId', as: 'author' });
      // Связь: Баг доступен многим пользователям
      Bug.belongsToMany(models.User, { 
        through: 'BugAccess', 
        as: 'sharedWith', 
        foreignKey: 'bugId' 
      });
    }
  }

  Bug.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Название не может быть пустым' } }
    },
    description: { type: DataTypes.TEXT, defaultValue: 'Описание отсутствует' },
    priority: {
      type: DataTypes.STRING,
      defaultValue: 'Средний',
      validate: { isIn: { args: [['Низкий', 'Средний', 'Высокий']], msg: 'Неверный приоритет' } }
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Новый',
      validate: { isIn: { args: [['Новый', 'В работе', 'Готов']], msg: 'Неверный статус' } }
    },
    assignee: { type: DataTypes.STRING, defaultValue: 'Не назначен' },
    deadline: { type: DataTypes.DATEONLY, allowNull: true }
  }, {
    sequelize,
    modelName: 'Bug',
  });

  return Bug;
};