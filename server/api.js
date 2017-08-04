'use strict'
const api = require('express').Router()
const db = require('../db')
const axios = require('axios');
const sanitizeHtml = require('sanitize-html')
const nodeSummary = require('node-summary');

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
api.post('/city/:cityId/neighborhoods/wikiTitle', (req, res) => {
	// extract the neighborhood and city name, and replace all spaces with %20 for insertion into query string
	let {neighborhood, city} = req.body;
	neighborhood.name = neighborhood.name.replace(/ /g, '%20');
	city.name = city.name.replace(/ /g, '%20');

	// make query to wikipedia to get the top results for that neighborhood name, city name, and the word 'neighborhood'
	axios.get(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${neighborhood.name}%20neighborhood%20${city.name}&format=json`)
	.then(apiRes => {
		const queryResult = apiRes.data.query.search;
		
		// find the first result that doesn't include 'list' or 'station' in the title
		const article = queryResult.find(article => article.title.includes('List') === false && article.title.includes('Station') === false)
		const searchTitle = article.title.replace(/ /g, '%20');
		res.send(searchTitle);
	})
	.catch(err => {
		console.log(err);
	})
})

api.post('/city/:cityId/neighborhoods/wikiExtract', (req, res) => {
	let {neighborhood, city} = req.body;
	// make wikipedia request for the article extract
	axios.get(`https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${neighborhood.wikiTitle}&prop=extracts`)
	.then(apiRes => {
		const pages = apiRes.data.query.pages;
		const keys = Object.keys(pages);
		const extract = pages[keys[0]].extract;
		const sanitizedExtract = sanitizeHtml(extract, {
			allowedTags: [],
			allowedAttributes: []
		}).replace(/\n/g, ' ');
		res.send(sanitizedExtract);
	})
	.catch(err => {
		console.log('Wiki extract request failed at neighborhood:', neighborhood.name)
	})
})

api.post('/city/:cityId/neighborhoods/wikiSections', (req, res) => {
	let {neighborhood, city} = req.body;
	axios.get(`https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${neighborhood.wikiTitle}&prop=sections`)
	.then(apiRes => {
		let sections = apiRes.data.parse.sections;
		// instead of just mapping this to the section headings, map it to a series of objects like {title: 'section title', idx: 'section idx'}
		sections = sections.map(section => ({title: section.line, idx: section.index}));
		// sections = sections.map(section => section.line);
		res.send(sections);
	})
})

api.post('/city/:cityId/comparisons/sectionTitles', (req, res) => {
	let {criterium, sectionTitles} = req.body;

	const query = sectionTitles.map(section => {
		return [{"text": criterium.name}, {"text": section}]
	});

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


api.post('/city/:cityId/sectionContent', (req, res) => {
	const {section, neighborhood, sectionIndex, neighborhoodIndex} = req.body;
	const wikiTitle = neighborhood.neighborhood;
	const wikiIndex = neighborhood.idx;

	axios.get(`https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${wikiTitle}&prop=text&section=${wikiIndex}`)
	.then(apiRes => {
		const sectionContent = apiRes.data.parse.text['*'];
		const sanitizedContent = sanitizeHtml(sectionContent, {
			allowedTags: [],
			allowedAttributes: []
		}).replace(/\n/g, ' ').replace(/&quot;|\[edit\]/g, '').replace(/\[[0-9]*\]/g, '');
		nodeSummary.summarize(wikiTitle, sanitizedContent, function(err, summary){
			if (err) console.log('no good');
			else res.send({content: summary, sectionIndex, neighborhoodIndex});
		})
		
	})
	.catch(err => {
		console.log(err);
	})
});

// BULK OPTION
api.post('/comparisons/sectionContent', (req, res) => {
	const {criteria} = req.body;
	let queryObject = {}
	let query = [];

// 	// build a query for each criteria against each of the section content for the neighborhoods to search
	criteria.forEach(criterium => {
		criterium.sectionsToSearch.forEach(section => {
			section.neighborhoods.forEach(neighborhood => {
				const singleQuery = [{"text": criterium.name}, {"text": neighborhood.content}];
				query.push(singleQuery);
			})
		})
	})

	axios.post(
		`http://api.cortical.io:80/rest/compare/bulk?retina_name=en_synonymous`,
		query,
		{headers: {'api-key': '64d8f960-6cae-11e7-b22d-93a4ae922ff1'}
	})
	.then(apiRes => {
		res.send(apiRes.data);
	})
});


// PROMISE ALL OPTION
// api.post('/comparisons/sectionContent', (req, res) => {
// 	const {criteriumName, section} = req.body;
// 	let query = [];

// 	// build a query for each criteria against each of the section content for the neighborhoods to search
// 	section.neighborhoods.forEach(neighborhood => {
// 		const neighborhoodContent = neighborhood.content;

// 		const text1 = {"text": criteriumName};
// 		const text2 = {"text": neighborhoodContent}
// 		const singleQuery = [text1, text2];
// 		console.log(singleQuery);
// 		query.push(singleQuery);
// 	})

// 	axios.post(
// 		`http://api.cortical.io:80/rest/compare/bulk?retina_name=en_associative`,
// 		query,
// 		{headers: {'api-key': '64d8f960-6cae-11e7-b22d-93a4ae922ff1'}
// 	})
// 	.then(apiRes => {
// 		res.send(apiRes.data);
// 	})
// 	.catch(err => {
// 		console.log(err);
// 	})
// });

api.post('/neighborhoods/fingerprints', (req, res) => {
	let {neighborhood, input} = req.body;
	
	// FIX THIS!!!!!!!!! SHOULDN'T HAVE TO RUN THIS LOGIC!!! MAYBE FINETUNE METHOD OF GETTING THE WIKI ARTICLE

	if (neighborhood.wikiExtract) {
		const text1 = {"text": input};
		const text2 = {"text": neighborhood.wikiExtract}

		axios.post(
			`http://api.cortical.io:80/rest/compare?retina_name=en_associative`,
			[text1, text2],
			{headers: {'api-key': '64d8f960-6cae-11e7-b22d-93a4ae922ff1'}
		})
		.then(apiRes => {
			res.send(apiRes.data);
		})
		.catch(err => {
			console.log(err);
		})
	} else {
		res.send(null);
	}
});




module.exports = api