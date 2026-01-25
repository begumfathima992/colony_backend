'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('reservations', 'stripeCustomersID', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: [],
    });

    await queryInterface.addColumn('reservations', 'stripePaymentMethodsID', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: [],
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('reservations', 'stripeCustomersID');
    await queryInterface.removeColumn('reservations', 'stripePaymentMethodsID');
  },
};
