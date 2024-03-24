'use strict';

const { QueryTypes } = require('sequelize');
const { sequelize } = require('./models/index'); // Import your Sequelize instance

(async () => {
  try {
    // Run a raw SQL query to alter the table and add the missing column
    await sequelize.query(`
      ALTER TABLE UserWorkouts
      ADD COLUMN externalWorkoutId VARCHAR(255) NOT NULL;
    `, { type: QueryTypes.RAW });

    console.log('Migration successful: Added externalWorkoutId column to UserWorkouts table');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Ensure sequelize connection is closed after migration
    await sequelize.close();
  }
})();