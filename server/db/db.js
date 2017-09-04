const Sequelize = require('sequelize');
console.log('process db url:', process.env.DATABASE_URL)
const db = new Sequelize(
  process.env.DATABASE_URL ||
  'postgres://localhost:5432/block', {
    logging: false
  }
);

module.exports = db;