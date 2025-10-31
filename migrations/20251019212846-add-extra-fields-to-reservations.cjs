'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('reservations', 'dietaryRestrictionByUser', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('reservations', 'dietaryRestrictionByParty', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('reservations', 'occasion', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('reservations', 'cancellationPolicyAccepted', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // ✅ checkbox default = unchecked
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('reservations', 'dietaryRestrictionByUser');
    await queryInterface.removeColumn('reservations', 'dietaryRestrictionByParty');
    await queryInterface.removeColumn('reservations', 'occasion');
    await queryInterface.removeColumn('reservations', 'cancellationPolicyAccepted');
  },
};
