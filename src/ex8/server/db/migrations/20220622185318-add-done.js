'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Items',
      'done',
      Sequelize.DATE
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'Items',
      'done'
    );
  }
};
