'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Здесь будет код для миграции "вверх" (изменение таблицы)
    await queryInterface.renameColumn('Music', 'album_title', 'title');
  },

  down: async (queryInterface, Sequelize) => {
    // Если нужно откатить миграцию, то в down изменим название колонки обратно
    await queryInterface.renameColumn('Music', 'title', 'album_title');
  }
};
