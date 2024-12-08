'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Series extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Series.init({
    title: DataTypes.STRING,
    release_year: DataTypes.INTEGER,
    seasons: DataTypes.INTEGER,
    country: DataTypes.STRING,
    genre: DataTypes.STRING,
    director: DataTypes.STRING,
    status: DataTypes.STRING,
    review: DataTypes.TEXT,
    rating: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Series',
  });
  return Series;
};