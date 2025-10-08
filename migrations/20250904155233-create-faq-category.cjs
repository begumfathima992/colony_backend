'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('faqCategory', {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('faqCategory');
  }
};
