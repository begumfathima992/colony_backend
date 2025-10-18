'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reservations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false, // ✅ required: reservation must belong to a user
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false, // ✅ required
      },
      time: {
        type: Sequelize.STRING,
        allowNull: false, // ✅ required
      },
      partySize: {
        type: Sequelize.INTEGER,
        allowNull: false, // ✅ required
        defaultValue: 1, // minimum of 1 person
      },
      tableNumber: {
        type: Sequelize.INTEGER,
        allowNull: true, // ✅ optional (manager can assign later)
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true, // ✅ optional user note
      },
      paymentIntentId: {
        type: Sequelize.STRING,
        allowNull: true, // ✅ optional if payment not yet made
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'cancelled'),
        defaultValue: 'pending',
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
    await queryInterface.dropTable('reservations');
  },
};
