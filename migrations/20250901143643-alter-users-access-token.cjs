// 'use strict';

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     /**
//      * Add altering commands here.
//      *
//      * Example:
//      * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
//      */
//   },

//   async down (queryInterface, Sequelize) {
//     /**
//      * Add reverting commands here.
//      *
//      * Example:
//      * await queryInterface.dropTable('users');
//      */
//   }
// };



'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'access_token', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'access_token', {
      type: Sequelize.STRING(255), // rollback
      allowNull: true,
    });
  }
};
