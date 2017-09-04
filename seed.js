const db = require('./server/db');
const City = require('./server/db/models/city');
const Neighborhood = require('./server/db/models/neighborhood');
const axios = require('axios');
const sanitizeHtml = require('sanitize-html')
const md5 = require('md5');const Promise = require('bluebird');
console.log('process db url:', process.env.DATABASE_URL)

const cities = [
  {name: 'Boston', neighborlandId: 'bos'},    
  {name: 'Chicago', neighborlandId: 'chi'},
  {name: 'Denver', neighborlandId: 'den'},
  {name: 'Houston', neighborlandId: 'hou'},
  {name: 'Los Angeles', neighborlandId: 'la'},
  {name: 'New York', neighborlandId: 'nyc'},
  // {name: 'Philadelphia', neighborlandId: 'philly'},
  {name: 'San Francisco', neighborlandId: 'sf'},
  {name: 'Seattle', neighborlandId: 'sea'},
  {name: 'Washington, DC', neighborlandId: 'dc'},
];

const seed = function(){
  let cityPromises = cities.map(city => {
    return createCity(city)
  })
  return Promise.all(cityPromises);
};

const getWikiData = function(neighborhood, city, id){
  let promises = [];
  let neighborhoodName = neighborhood.name.replace(/ /g, '%20').replace(/-/g, '%E2%80%93');
	city.name = city.name.replace(/ /g, '%20');

  let result = {
    name: neighborhood.name,
    neighborlandId: neighborhood.id,
    cityId: id
  };
	let test = '';

	// make query to wikipedia to get the top results for that neighborhood name, city name, and the word 'neighborhood'
	return axios.get(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${neighborhoodName}%20neighborhood%20${city.name}&format=json`)
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
    if (article === undefined) return
		let wikiTitle = article.title.replace(/ /g, '%20').replace('–', '%E2%80%93');;
		let wikiSnippet = sanitizeHtml(article.snippet, {
			allowedTags: [],
			allowedAttributes: []
		}).replace(/(\d+)\; -(\d+).(\d+)/g, '').replace(/-(\d+).(\d+)/g, '').replace(/&quot;/g, '').replace(/°N 73\.987°W\ufeff \/ 40\. /g, '');

		let characters = '0123456789./%-';
		while (characters.includes(wikiSnippet[0])) {
			wikiSnippet = wikiSnippet.slice(1);
		}

		result.wikiTitle = wikiTitle;
		result.wikiSnippet = wikiSnippet;
		
		return axios.get(`https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${result.wikiTitle}&prop=revisions&rvprop=content`)
	})
	.then(apiRes => {
		const pages = apiRes.data.query.pages;
    const keys = Object.keys(pages);
    if (keys === undefined) return
    if (pages[keys[0]].revisions === undefined) return
		const text = pages[keys[0]].revisions[0]['*'];
		const wikiText = sanitizeHtml(text, {
			allowedTags: [],
			allowedAttributes: []
    }).replace(/\{\{Infobox NRHP/g, '').replace(/\n|\|thumb(.*?)px\||\|/g, ' ').replace(/\{\{(.*?)\}\}|\[http(.*?)\]|&quot;|\[\[|\]\]|'''|File:|.jpg|.png|.gif/g, '').slice(0, 3500);
    result.wikiText = wikiText;  
    return result;
  })
}


const createCity = function(city){
  let cityInstanceId;
  return City.create(city)
  .then(cityInstance => {
    cityInstanceId = cityInstance.id;
    return axios.get(`https://neighborland.com/api/v1/cities/${cityInstance.neighborlandId}/neighborhoods`)
  })
  .then(neighborhoods => {
    let neighborhoodRequests = neighborhoods.data.map(neighborhood => {
      return getWikiData(neighborhood, city, cityInstanceId)
    })
    return Promise.all(neighborhoodRequests);
  })
  .then(results => {
    let promises = results.map(result => Neighborhood.create(result));
    return Promise.all(promises);
  })
}

const main = () => {
  console.log('Syncing db...');
  db.sync({ force: true })
    .then(() => {
      console.log('Seeding databse...');
      return seed();
    })
    .catch(err => {
      console.log('Error while seeding');
      console.log(err.stack);
    })
    .then(() => {
      db.close();
      return null;
    });
};

main();
