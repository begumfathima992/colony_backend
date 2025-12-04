'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('paymentdetails', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false
      },

      cardNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },

      expiryDate: {
        type: Sequelize.STRING,  
        allowNull: false
      },

      cvvNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },

      extraDetails: {
        type: Sequelize.JSONB,
        allowNull: true
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('paymentdetails');
  }
};
