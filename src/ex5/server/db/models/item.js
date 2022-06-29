'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Item.init({
    text: DataTypes.STRING,
    isNew: DataTypes.BOOLEAN,
    status: DataTypes.BOOLEAN,
    done: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};
