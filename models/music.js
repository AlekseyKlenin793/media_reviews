'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Music extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Music.init({
    title: DataTypes.STRING,
    artist: DataTypes.STRING,
    release_year: DataTypes.INTEGER,
    genre: DataTypes.STRING,
    status: DataTypes.STRING,
    review: DataTypes.TEXT,
    rating: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Music',
  });
  return Music;
};