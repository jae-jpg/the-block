const Sequelize = require('sequelize');
const db = require('../db');

module.exports = db.define('city', {
  name: Sequelize.STRING,
  neighborlandId: Sequelize.STRING
});