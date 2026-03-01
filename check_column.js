const sequelize = require('./db');
(async () => {
    try {
        const [results] = await sequelize.query("SHOW COLUMNS FROM Users LIKE 'specializationCode'");
        console.log('column info', results);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
})();
