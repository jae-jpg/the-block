'use strict'
const api = require('express').Router()
const axios = require('axios');
const sanitizeHtml = require('sanitize-html')
const md5 = require('md5');
const Neighborhood = require('./db/models/neighborhood');
const City = require('./db/models/city');

api.get('/hello', (req, res) => res.send({hello: 'world'}))

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
		{headers: {'api-key': '64d8f960-6cae-11e7-b22d-93a4ae922ff1'}
	})
	.then(apiRes => {
		res.send(apiRes.data);
	})
	.catch(err => {
		console.log(err);
	})
});

module.exports = api

	// 	return axios.get(`https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${wikiTitle}&prop=pageimages`)
	// })
	// .then(apiRes => {
	// 	const pages = apiRes.data.query.pages;
	// 	const keys = Object.keys(pages);
	// 	const pageImage = pages[keys[0]].pageimage;
	// 	if (pageImage) {
	// 		const hashedImage = md5(pageImage)

	// 		const wikiImage = `https://upload.wikimedia.org/wikipedia/commons/${hashedImage[0]}/${hashedImage[0]}${hashedImage[1]}/${pageImage}`
	// 		result.wikiImage = wikiImage;
	// 	} else {
	// 		result.wikiImage = 'http://img-aws.ehowcdn.com/560x560p/photos.demandstudios.com/getty/article/152/77/87578869.jpg';
	// 	}