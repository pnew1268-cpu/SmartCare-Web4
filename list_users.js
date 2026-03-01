require('dotenv').config();
const sequelize = require('./db');
const User = require('./models/User');
(async()=>{
  try{
    await sequelize.authenticate();
    const all = await User.findAll();
    console.log('total users', all.length);
    all.forEach(u=>console.log(u.toJSON()));
  } catch(e) { console.error(e);} finally{process.exit(0);}  
})();