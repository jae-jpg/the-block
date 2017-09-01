const Sequelize = require('sequelize');
const db = require('../db');

module.exports = db.define('neighborhood', {
  name: Sequelize.STRING,
  neighborlandId: Sequelize.STRING,
  url: Sequelize.STRING,
  alternate_url: Sequelize.STRING,
  wikiImage: Sequelize.STRING,
  wikiSnippet: Sequelize.TEXT,
  wikiText: Sequelize.TEXT,
  wikiTitle: Sequelize.STRING
});