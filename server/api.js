'use strict'
const api = require('express').Router()
const db = require('../db')
const axios = require('axios');
const sanitizeHtml = require('sanitize-html')
const md5 = require('md5');

api.get('/hello', (req, res) => res.send({hello: 'world'}))

// get list of neighborhoods for a particular city
api.get('/city/:cityId/neighborhoods', (req, res) => {
	const cityId = req.params.cityId;
	axios.get(`https://neighborland.com/api/v1/cities/${cityId}/neighborhoods`)
	.then(response => {
		res.send(response.data);
	})
	.catch(err => {
		console.log(err);
	})
})

// get the wikipedia article for all neighborhoods in a city and place on neighborhoods object
api.post('/city/:cityId/neighborhoods/wikiData', (req, res) => {
	// extract the neighborhood and city name, and replace all spaces with %20 for insertion into query string
	let {neighborhood, city} = req.body;
	let neighborhoodName = neighborhood.name.replace(/ /g, '%20').replace(/-/g, '%E2%80%93');
	city.name = city.name.replace(/ /g, '%20');

	let result = {};
	let test = '';

	// make query to wikipedia to get the top results for that neighborhood name, city name, and the word 'neighborhood'
	axios.get(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${neighborhoodName}%20neighborhood%20${city.name}&format=json`)
	.then(apiRes => {
		const queryResult = apiRes.data.query.search;
		
		// find the first result that doesn't include 'list', 'station', or 'neighborhoods' in the title
		const article = queryResult.find(article => {
			return article.title.includes('List') === false &&
			article.title.includes('Station') === false &&
			article.title.includes('Neighborhoods') === false &&
			article.title.includes('rebranding') === false &&
			article.title.includes('disambiguation') === false &&
			article.title.includes('Yorkville, New York') === false
		})
		let wikiTitle = article.title.replace(/ /g, '%20').replace('–', '%E2%80%93');;
		const wikiSnippet = sanitizeHtml(article.snippet, {
			allowedTags: [],
			allowedAttributes: []
		});

		result.wikiTitle = wikiTitle;
		result.wikiSnippet = wikiSnippet;
		test = `https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${wikiTitle}&prop=pageimages`;

		return axios.get(`https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${wikiTitle}&prop=pageimages`)
	})
	.then(apiRes => {
		const pages = apiRes.data.query.pages;
		const keys = Object.keys(pages);
		const pageImage = pages[keys[0]].pageimage;
		if (pageImage) {
			const hashedImage = md5(pageImage)

			const wikiImage = `https://upload.wikimedia.org/wikipedia/commons/${hashedImage[0]}/${hashedImage[0]}${hashedImage[1]}/${pageImage}`
			result.wikiImage = wikiImage;
		} else {
			result.wikiImage = 'http://img-aws.ehowcdn.com/560x560p/photos.demandstudios.com/getty/article/152/77/87578869.jpg';
		}
		
		return axios.get(`https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${result.wikiTitle}&prop=revisions&rvprop=content`)
	})
	.then(apiRes => {
		const pages = apiRes.data.query.pages;
		const keys = Object.keys(pages);
		const text = pages[keys[0]].revisions[0]['*'];
		const wikiText = sanitizeHtml(text, {
			allowedTags: [],
			allowedAttributes: []
		}).replace(/\{\{Infobox(.*?)\}\}|\[http(.*?)\]/g, '').replace(/\{\{(.*?)\}\}/g, '').replace(/\n|\|thumb(.*?)px\||\|/g, ' ').replace(/&quot;|\[\[|\]\]|'''|File:|.jpg|.png/g, '').slice(0, 8000);
		result.wikiText = wikiText;
		res.send(result);
	})
	.catch(err => {
		console.log('request failed at neighborhood:', neighborhood.name);
		console.log(err);
	})
})

api.post('/comparisons/overall', (req, res) => {
	const {criterium, neighborhoods, option1} = req.body;
	let query = [];

	neighborhoods.forEach(neighborhood => {
		const singleQuery = [{"text": criterium.name}, {"text": neighborhood[option1]}]
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