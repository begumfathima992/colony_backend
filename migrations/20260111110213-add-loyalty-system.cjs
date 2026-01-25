'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Add loyalty_points to Users table
    await queryInterface.addColumn('Users', 'loyalty_points', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });

    // 2. Create LoyaltyLogs table
    await queryInterface.createTable('LoyaltyLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      amount_spent: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      points_earned: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('LoyaltyLogs');
    await queryInterface.removeColumn('Users', 'loyalty_points');
  }
};