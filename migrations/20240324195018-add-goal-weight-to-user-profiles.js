'use strict';

module.exports = {
  /**
   * Function to run when the migration is applied
   * @param {QueryInterface} queryInterface - The interface that communicates with the db
   * @param {Sequelize} Sequelize - The Sequelize library
   */
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('UserProfiles', // name of the Source model
      'goalWeight', // name of the key we're adding 
      {
        type: Sequelize.FLOAT,
        allowNull: true,
        after: "weight" // places the new column after the `weight` column in the table (MySQL/MariaDB only)
      }
    );
  },

  /**
   * Function to run when the migration is reverted
   * @param {QueryInterface} queryInterface - The interface that communicates with the db
   * @param {Sequelize} Sequelize - The Sequelize library
   */
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('UserProfiles', 'goalWeight');
  }
};