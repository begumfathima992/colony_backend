'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('faqQuestionAnswer', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      category_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      question: {
        type: Sequelize.STRING,
        allowNull: false
      },
      answer: {
        type: Sequelize.STRING,
        allowNull: false
      },
      order_no: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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
    await queryInterface.dropTable('faqQuestionAnswer');
  }
};
