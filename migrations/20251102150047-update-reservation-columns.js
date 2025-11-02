'use strict';

export default {
  async up(queryInterface, Sequelize) {
    // ✅ Add new columns
    await queryInterface.addColumn('reservations', 'extraOptions', {
      type: Sequelize.JSONB,
      allowNull: true,
    });

    await queryInterface.addColumn('reservations', 'cancellationPolicy', {
      type: Sequelize.JSONB,
      allowNull: true,
    });

    // ✅ Rename a column
    await queryInterface.renameColumn('reservations', 'partySize', 'party_size');

    // ✅ Remove a column (optional)
    await queryInterface.removeColumn('reservations', 'dietaryRestrictionByParty');
  },

  async down(queryInterface, Sequelize) {
    // Revert the changes (undo migration)

    await queryInterface.removeColumn('reservations', 'extraOptions');
    await queryInterface.removeColumn('reservations', 'cancellationPolicy');
    await queryInterface.renameColumn('reservations', 'party_size', 'partySize');

    await queryInterface.addColumn('reservations', 'dietaryRestrictionByParty', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
