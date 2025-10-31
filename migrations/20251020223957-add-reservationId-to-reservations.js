'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('reservations', 'reservationId', {
    type: Sequelize.STRING,   // or Sequelize.UUID for unique IDs
    allowNull: true,          // optional, can set false if required
    unique: true,             // optional: ensures no duplicates
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('reservations', 'reservationId');
}
