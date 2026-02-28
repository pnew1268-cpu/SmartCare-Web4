const { Sequelize } = require('sequelize');
// Use MySQL by default. Fall back to SQLite when environment explicitly requests it.
const path = require('path');

const DB_DIALECT = process.env.DB_DIALECT || 'mysql';

let sequelize;
if (DB_DIALECT === 'sqlite') {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, 'database.sqlite'),
        logging: false
    });
} else {
    // MySQL configuration - pick up credentials from environment where possible
    const DB_HOST = process.env.DB_HOST || 'localhost';
    const DB_USER = process.env.DB_USER || 'medapp';
    const DB_PASS = process.env.MYSQL_PASSWORD || process.env.DB_PASS || 'your_mysql_password_here';

    const DB_NAME = process.env.DB_NAME || 'medical_system';
    const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);

    // Build a connection URI to ensure special characters in the password are handled correctly
    const encodedPass = encodeURIComponent(DB_PASS);
    const uri = `mysql://${DB_USER}:${encodedPass}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
    console.log('Using DB URI:', `mysql://${DB_USER}:*****@${DB_HOST}:${DB_PORT}/${DB_NAME}`);

    sequelize = new Sequelize(uri, {
        dialect: 'mysql',
        dialectModule: require('mysql2'),
        logging: false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        dialectOptions: {
            connectTimeout: 60000
        }
    });
}

module.exports = sequelize;
