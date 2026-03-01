require('dotenv').config();
const sequelize = require('./db');
const Pharmacy = require('./models/Pharmacy');
(async()=>{
  try{
    await sequelize.authenticate();
    const all = await Pharmacy.findAll();
    console.log('total pharmacies', all.length);
    all.forEach(p=>console.log(p.toJSON()));
  } catch(e) { console.error(e);} finally{process.exit(0);}  
})();