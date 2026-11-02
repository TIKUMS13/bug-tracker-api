'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Связь: У пользователя много созданных багов
      User.hasMany(models.Bug, { foreignKey: 'userId', as: 'bugs' });
      // Связь: Пользователю доступно много багов
      User.belongsToMany(models.Bug, { 
        through: 'BugAccess', 
        as: 'sharedBugs', 
        foreignKey: 'userId' 
      });
    }

    toJSON() {
      const values = { ...this.get() };
      delete values.passwordHash;
      return values;
    }
  }

  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: { msg: 'Некорректный email' }, notEmpty: { msg: 'Email обязателен' } }
    },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
      validate: { isIn: { args: [['user', 'admin']], msg: 'Роль должна быть user или admin' } }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};