const { Sequelize } = require('sequelize');
const sequelize = require('./db');
const User = require('./models/User');
(async () => {
  await sequelize.authenticate();
  const users = await User.findAll({ where: { [Sequelize.Op.or]: [{ phone: '01099999999' }, { id: '30000000000001' }] } });
  console.log('found users', users.map(u => u.toJSON()));
  process.exit(0);
})();