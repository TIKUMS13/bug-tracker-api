'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BugAccess extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BugAccess.init({
    userId: DataTypes.INTEGER,
    bugId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'BugAccess',
  });
  return BugAccess;
};