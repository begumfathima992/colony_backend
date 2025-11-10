'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lounges', {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      l_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      l_time: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      l_partysize: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      l_paymentintentid: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      loungeid: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      l_customerid: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      l_paymethodid: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      l_clientsercret: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      l_emeralkey: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      l_cancellationpolicy: {
        type: Sequelize.JSONB, // ✅ use JSONB for structured policy data
        allowNull: true,
      },
      l_cancellationaccepted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('lounges');
  },
};
