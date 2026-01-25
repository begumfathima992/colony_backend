'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.STRING(20),
      defaultValue: 'customer',
      allowNull: false,
    });

    await queryInterface.addColumn('users', 'staff_login_id', {
      type: Sequelize.STRING(20),
      unique: true,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'role');
    await queryInterface.removeColumn('users', 'staff_login_id');
  }
};