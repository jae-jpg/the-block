'use strict'
const api = require('express').Router()
const axios = require('axios');
const sanitizeHtml = require('sanitize-html')
const md5 = require('md5');
const Neighborhood = require('./db/models/neighborhood');
const City = require('./db/models/city');


api.get('/city', (req, res) => {
	City.findAll()
	.then(cities => {
		res.send(cities);
	})
})

// get list of neighborhoods for a particular city
api.get('/city/:cityId/neighborhoods', (req, res) => {
	const cityId = req.params.cityId;
	Neighborhood.findAll({
		where: {cityId}
	})
	.then(neighborhoods => {
		res.send(neighborhoods);
	})
})

api.post('/comparisons/overall', (req, res) => {
	const {criterium, neighborhoods, option1} = req.body;
	let query = [];

	neighborhoods.forEach(neighborhood => {
		const singleQuery = [{"text": criterium}, {"text": neighborhood[option1]}]
		query.push(singleQuery);
	})

	axios.post(
		`http://api.cortical.io:80/rest/compare/bulk?retina_name=en_associative`,
		query,
		{headers: {'api-key': process.env.CORTICAL_KEY}
	})
	.then(apiRes => {
		res.send(apiRes.data);
	})
	.catch(err => {
		console.log(err);
	})
});

module.exports = api;