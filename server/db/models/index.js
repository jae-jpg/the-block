const City = require('./city');
const Neighborhood = require('./neighborhood');

Neighborhood.belongsTo(City);

module.exports = {
  City,
  Neighborhood
};