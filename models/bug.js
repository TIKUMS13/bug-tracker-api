'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Bug extends Model {
    static associate(models) {
      // Здесь будут связи (например, с User)
      // Пока пусто — добавим в следующих лабораторных
    }
  }

  Bug.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Название не может быть пустым' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: 'Описание отсутствует'
    },
    priority: {
      type: DataTypes.STRING,
      defaultValue: 'Средний',
      validate: {
        isIn: {
          args: [['Низкий', 'Средний', 'Высокий']],
          msg: 'Приоритет должен быть: Низкий, Средний или Высокий'
        }
      }
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Новый',
      validate: {
        isIn: {
          args: [['Новый', 'В работе', 'Готов']],
          msg: 'Статус должен быть: Новый, В работе или Готов'
        }
      }
    },
    assignee: {
      type: DataTypes.STRING,
      defaultValue: 'Не назначен'
    },
    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Bug',
  });

  return Bug;
};