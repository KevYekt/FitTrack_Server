const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.JAWSDB_URL) {
    // Production environment, on Heroku with JawsDB
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
    // Local development environment
    sequelize = new Sequelize('fittrack_db', 'root', 'rootroot', {
        host: 'localhost',
        dialect: 'mysql'
    });
}

module.exports = sequelize;