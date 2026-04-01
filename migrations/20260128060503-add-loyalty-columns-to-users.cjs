'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add total_spent column
    await queryInterface.addColumn('users', 'total_spent', {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false,
      comment: 'Lifetime spend of the customer'
    });

    // Add loyalty_points column
    await queryInterface.addColumn('users', 'loyalty_points', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
      comment: 'Current balance of loyalty points'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove columns if we need to undo the migration
    await queryInterface.removeColumn('users', 'total_spent');
    await queryInterface.removeColumn('users', 'loyalty_points');
  }
};