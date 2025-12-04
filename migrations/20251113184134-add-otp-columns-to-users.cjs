'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('users');

    // Add otp only if it does not exist
    if (!table.otp) {
      await queryInterface.addColumn('users', 'otp', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    // Add otpExpiry only if it does not exist
    if (!table.otpExpiry) {
      await queryInterface.addColumn('users', 'otpExpiry', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'otp');
    await queryInterface.removeColumn('users', 'otpExpiry');
  },
};
