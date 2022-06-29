'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addIndex(
      'Items',
      ['text'],
      {
        name: 'text_index',
        unique: true
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('Items', 'text_index');
  }
};
