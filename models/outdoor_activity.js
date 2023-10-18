'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Outdoor_activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Outdoor_activity.belongsTo(models.Contact);
    }
  }
  Outdoor_activity.init({
    id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    name: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Outdoor_activity',
  });
  return Outdoor_activity;
};