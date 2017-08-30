const Sequelize = require('sequelize');
const db = require('../db');

module.exports = db.define('city', {
  name: Sequelize.STRING,
  nlId: Sequelize.STRING
});