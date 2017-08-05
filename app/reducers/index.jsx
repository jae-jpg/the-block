import { combineReducers } from 'redux'
import axios from 'axios';
import _ from 'lodash';

const initialState = {
  cityList: [
    {name: 'Manhattan', id: 'nyc'},
    {name: 'Los Angeles', id: 'la'},
    {name: 'Chicago', id: 'chi'},
    {name: 'Houston', id: 'hou'},
    {name: 'Philadelphia', id: 'philly'},
    {name: 'San Francisco', id: 'sf'},
    {name: 'Seattle', id: 'sea'},
    {name: 'Denver', id: 'den'},
    {name: 'Washington, DC', id: 'dc'},
    {name: 'Boston', id: 'bos'},    
  ],
  currentCity: {},
  currentCityNeighborhoods: [],
  input: '',
  neighborhoodSections: [],
  criteria: [],
  status: 'Loading neighborhoods...'
  // ADD ADDITIONAL FIELDS HERE
}

// action types
const SET_CITY = 'SET_CITY';
const SET_CITY_NEIGHBORHOODS = 'SET_CITY_NEIGHBORHOODS';
const UPDATE_NEIGHBORHOOD = 'UPDATE_NEIGHBORHOOD';
const NEW_INPUT = 'NEW_INPUT';
const ADD_NEIGHBORHOOD_SECTIONS = 'ADD_NEIGHBORHOOD_SECTIONS';
const SET_CRITERIA = 'SET_CRITERIA'
const UPDATE_CRITERIUM = 'UPDATE_CRITERIUM'
const UPDATE_CRITERIA = 'UPDATE_CRITERIA'
const UPDATE_SCORE_AVERAGES = 'UPDATE_SCORE_AVERAGES';
const UPDATE_NEIGHBORHOODS = 'UPDATE_NEIGHBORHOODS';

// action creators
export function setCity(cityId){
  return {type: SET_CITY, cityId}
}

export function setCityNeighborhoods(neighborhoods){
  return {type: SET_CITY_NEIGHBORHOODS, neighborhoods}
}

export function updateNeighborhood(neighborhood, idx){
  return {type: UPDATE_NEIGHBORHOOD, neighborhood, idx}
}

export function newInput(input){
  return {type: NEW_INPUT, input}
}

export function addNeighborhoodSections(sections, neighborhood){
  return {type: ADD_NEIGHBORHOOD_SECTIONS, sections, neighborhood}
}

export function setCriteria(){
  return {type: SET_CRITERIA}
}

export function updateCriterium(criterium, sectionsToSearch){
  return {type: UPDATE_CRITERIUM, criterium, sectionsToSearch}
}

export function updateCriteria(criteria){
  return {type: UPDATE_CRITERIA, criteria}
}

export function updateNeighborhoods(neighborhoods){
  return {type: UPDATE_NEIGHBORHOODS, neighborhoods}
}

// thunk creators

// LOADING THE DATA FOR THE CHOSEN CITY

export function getCityNeighborhoods(cityId){
  return function(dispatch, getState){
    return axios.get(`api/city/${cityId}/neighborhoods`)
    .then(res => {
      dispatch(setCityNeighborhoods(res.data));
      dispatch(getNeighborhoodExtracts(getState().currentCity, getState().currentCityNeighborhoods))
    })
  }
}

export function getNeighborhoodExtracts(city, neighborhoods){
  return function(dispatch){
    neighborhoods.forEach((neighborhood, idx) => {
      return axios.post(`api/city/${city.id}/neighborhoods/wikiTitle`, {neighborhood, city})
      // maybe get rid of the next 3 lines and refactor the last .then
      .then(res => {
        neighborhood.wikiTitle = res.data
        dispatch(getNeighborhoodSections(city, neighborhood))
        // return axios.post(`/api/city/${city.id}/neighborhoods/wikiExtract`, {neighborhood, city})
      })
      // .then(res => {
      //   neighborhood.wikiExtract = res.data;
      // })
    })
  }
}

export function getNeighborhoodSections(city, neighborhood){
  return function(dispatch){
    return axios.post(`/api/city/${city.id}/neighborhoods/wikiSections`, {neighborhood, city})
    .then(res => {
      const sections = res.data;
      // add the neighborhood sections to the state
      dispatch(addNeighborhoodSections(sections, neighborhood))
    })
  }
}

// RECEIVE THE QUERY AND RANKING THE ITEMS

export function rankNeighborhoods(){
  return function(dispatch){
    dispatch(getSectionTitleComparisons());
  }
}



export function getSectionTitleComparisons(){
  return function(dispatch, getState){
    const {currentCity, criteria, neighborhoodSections} = getState();
    const sectionTitles = neighborhoodSections.map(section => section.title)

    let promises = criteria.reduce((acc, criterium, idx) => {
      let promise = axios.post(`/api/city/${currentCity.id}/comparisons/sectionTitles`, {criterium, sectionTitles})
      return acc.concat(promise);
    }, [])

    Promise.all(promises)
    .then(results => {
      let newCriteria = _.cloneDeep(getState().criteria);

      newCriteria.forEach((criterium, criteriumIdx) => {
        let resultsForThisCriteria = results[criteriumIdx].data;
        let sectionsToSearch = neighborhoodSections.map((section, idx) => {
          section.result = resultsForThisCriteria[idx]
          return section;
        }).filter(section => {
          return section.result.overlappingAll > 120;          
        })
        criterium.sectionsToSearch = sectionsToSearch;
      });

      dispatch(updateCriteria(newCriteria));
      dispatch(getSectionContent());
    })
  }
}



export function getSectionContent(){
  return function(dispatch, getState){
    let promises = [];
    const criteria = getState().criteria;

    criteria.forEach(criterium => {
      criterium.sectionsToSearch.forEach((section) => {
        section.neighborhoods.forEach((neighborhood) => {
          let promise = axios.post(`/api/wiki/sectionContent`, {neighborhood})
          promises.push(promise);
        })    
      })
    })

    Promise.all(promises)
    .then(results => {
      let newCriteria = _.cloneDeep(getState().criteria);

      let i = 0;
      newCriteria.forEach((criterium, criteriumIdx) => {
        criterium.sectionsToSearch.forEach((section, sectionIdx) => {
          section.neighborhoods.forEach(neighborhood => {
            neighborhood.content = results[i].data;
            i++;
          })
        })
      })
      dispatch(updateCriteria(newCriteria));
      dispatch(getSectionContentComparisons());
    })
  }
}

// BULK OPTION
export function getSectionContentComparisons(){
  return function(dispatch, getState){
    const criteria = getState().criteria;
    axios.post(`/api/comparisons/sectionContent`, {criteria})
    .then(res => {
      console.log('criteria', res.data);
      let results = res.data;

      let newCriteria = criteria
      let i = 0;
      criteria.forEach((criterium, criteriumIndex) => {
        criterium.sectionsToSearch.forEach((section, sectionIndex) => {
          section.neighborhoods.forEach((neighborhood, neighborhoodIndex) => {
            // console.log('weighted scoring for:', neighborhood.neighborhood, results[i].weightedScoring)
            // console.log('left right scoring for:', neighborhood.neighborhood, results[i].overlappingLeftRight)
            // console.log('right left scoring for:', neighborhood.neighborhood, results[i].overlappingRightLeft)
            newCriteria[criteriumIndex].sectionsToSearch[sectionIndex].neighborhoods[neighborhoodIndex].score = results[i].weightedScoring;
            i++;
          })
        })
      })
      dispatch(updateCriteria(newCriteria))
      dispatch(mapScoresToNeighborhoods());
    })
  }
}



// PROMISE ALL OPTION
// export function getSectionContentComparisons(){
//   return function(dispatch, getState){
//     const criteria = _.cloneDeep(getState().criteria);

//     let promises = [];
//     criteria.forEach(criterium => {
//       criterium.sectionsToSearch.forEach(section => {
//         let promise = axios.post(`/api/comparisons/sectionContent`, {criteriumName: criterium.name, section: section})
//         promises.push(promise);
//       })
//     });

//     Promise.all(promises)
//     .then(results => {
//       let resultsData = results.map(result => {
//         return result.data;
//       })

//       let newCriteria = criteria

//       criteria.forEach((criterium, criteriumIndex) => {
//         criterium.sectionsToSearch.forEach((section, sectionIndex) => {
//           section.neighborhoods.forEach((neighborhood, neighborhoodIndex) => {
//             const score = resultsData[sectionIndex][neighborhoodIndex].weightedScoring;
//             newCriteria[criteriumIndex].sectionsToSearch[sectionIndex].neighborhoods[neighborhoodIndex].score = score;
//           })
//         })
//       })

//       dispatch(updateCriteria(newCriteria))
//       dispatch(mapScoresToNeighborhoods());
//     });
//   }
// }

export function mapScoresToNeighborhoods(){
  return function(dispatch, getState) {    
    // pull the neighborhoods from the current state
    var neighborhoods = _.cloneDeep(getState().currentCityNeighborhoods);
    var criteria = _.cloneDeep(getState().criteria)

    // loop through the state neighborhoods, and find wherever that neighborhood is stored under different criteria
    neighborhoods = neighborhoods.map((neighborhood) => {
      const scores = findScores(neighborhood.wikiTitle, criteria);
      const averageScore = findAverage(scores);
      neighborhood.scores = scores;
      neighborhood.averageScore = averageScore;
      return neighborhood;
    })

    neighborhoods = sortByScore(neighborhoods);
    dispatch(updateNeighborhoods(neighborhoods));
  }
}

function findScores(wikiTitle, criteria){
  var scores = [];

  criteria.forEach(criterium => {
    criterium.sectionsToSearch.forEach(section => {
      let criteriaInstances = section.neighborhoods.filter(neighborhood => {
        return neighborhood.neighborhood === wikiTitle;
      })
      criteriaInstances.forEach(instance => {
        scores.push(instance.score);
      })
    })
  })
  return scores;
}

function findAverage(array){
  if (array.length) {
    return array.reduce((acc, el) => {
      return acc + el;
    }) / array.length;
  } else {
    return 0;
  } 
}

function sortByScore(neighborhoods){
  return neighborhoods.sort((a, b) => {
    return b.averageScore - a.averageScore
  })
}


const rootReducer = function(state = initialState, action) {
  switch(action.type) {
    case SET_CITY:
      return Object.assign({}, state, {currentCity: state.cityList.find(city => city.id === action.cityId)});
    case SET_CITY_NEIGHBORHOODS:
      return Object.assign({}, state, {currentCityNeighborhoods: action.neighborhoods});
    case UPDATE_NEIGHBORHOOD:
      let newNeighborhoods = state.currentCityNeighborhoods;
      newNeighborhoods[action.idx] = action.neighborhood
      return Object.assign({}, state, {currentCityNeighborhoods: newNeighborhoods});
    case NEW_INPUT:
      return Object.assign({}, state, {input: action.input});
    case SET_CRITERIA:
      let newCriteria = state.input.split(', ');
      newCriteria = newCriteria.map(criterium => ({name: criterium, sectionsToSearch: []}))
      return Object.assign({}, state, {criteria: newCriteria});
    case UPDATE_CRITERIUM:
      let updatedCriteria = state.criteria.map(criterium => {
        if (criterium.name === action.criterium.name) criterium.sectionsToSearch = action.sectionsToSearch;
        return criterium;
      });
      return Object.assign({}, state, {criteria: updatedCriteria});
    case UPDATE_CRITERIA:
      return Object.assign({}, state, {criteria: action.criteria});
    case ADD_NEIGHBORHOOD_SECTIONS:
      // pull the sections and neighborhood from the action creator
      let {sections, neighborhood} = action;
      let newNeighborhoodSections = state.neighborhoodSections;

      // map over the sections to check whether that section title already exists in the neighborhoodSections array
      sections.forEach(section => {
        const idx = newNeighborhoodSections.findIndex(existingSection => existingSection.title === section.title)
        if (idx === -1) {
          newNeighborhoodSections.push({title: section.title, neighborhoods: [{neighborhood: neighborhood.wikiTitle, idx: section.idx}]})
        } else {
          newNeighborhoodSections[idx].neighborhoods.push({neighborhood: neighborhood.wikiTitle, idx: section.idx})
        }
      })

      return Object.assign({}, state, {}, {neighborhoodSections: newNeighborhoodSections});
    case UPDATE_NEIGHBORHOODS:
      return Object.assign({}, state, {currentCityNeighborhoods: action.neighborhoods});
    default: return state
  }
};

export default rootReducer;


// OLD CODE

// 1: change this to a promise all
// export function getSectionTitleComparisons(){
//   return function(dispatch, getState){
//     // REFACTOR THESE TO ALL PULL FROM THE GETSTATE RESULT OBJECT
//     const city = getState().currentCity;
//     const criteria = getState().criteria;
//     const sections = getState().neighborhoodSections;
//     const sectionTitles = sections.map(section => section.title)
//     criteria.forEach((criterium, idx) => {
//       return axios.post(`/api/city/${city.id}/comparisons/sectionTitles`, {criterium, sectionTitles})
//       .then(res => {
//         const results = res.data;

//         let sectionsToSearch = sections.map((section, idx) => {
//           section.result = results[idx];
//           return section;
//         }).filter(section => {
//           // console.log('name', section.title, 'overlappingAll', section.result.overlappingAll, 'bool', section.result.overlappingAll > 100)
//           return section.result.overlappingAll > 120;
//         });

//         dispatch(updateCriterium(criterium, sectionsToSearch))
//         dispatch(getSectionContent(criterium, idx));
//       })
//     })
//   }
// }

// export function getSectionContent(criterium, criteriumIndex){
//   return function(dispatch, getState){
//     let promises = [];
    
//     const city = getState().currentCity;
//     const criteria = getState().criteria;

//     criterium.sectionsToSearch.forEach((section, sectionIndex) => {
//       section.neighborhoods.forEach((neighborhood, neighborhoodIndex) => {
//         let promise = axios.post(`/api/city/${city.id}/sectionContent`, {section, neighborhood, sectionIndex, neighborhoodIndex})
//         promises.push(promise);
//       })    
//     })

//     Promise.all(promises)
//     .then(results => {
//       let newCriteria = getState().criteria;
//       results.forEach(result => {
//         let data = result.data;
//         newCriteria[criteriumIndex].sectionsToSearch[data.sectionIndex].neighborhoods[data.neighborhoodIndex].content = data.content;
//       })
//       dispatch(updateCriteria(newCriteria));
//       dispatch(getSectionContentComparisons());
//     })
//   }
// }

// export function getSectionContent(criterium, criteriumIndex){
//   return function(dispatch, getState){
//     const city = getState().currentCity;
//     const criteria = getState().criteria;

//     criterium.sectionsToSearch.forEach((section, sectionIndex) => {
//       section.neighborhoods.forEach((neighborhood, neighborhoodIndex) => {
//         return axios.post(`/api/city/${city.id}/sectionContent`, {criterium, section, neighborhood})
//         .then(res => {
//           let newCriteria = criteria;
//           newCriteria[criteriumIndex].sectionsToSearch[sectionIndex].neighborhoods[neighborhoodIndex].content = res.data;
//           dispatch(updateCriteria(newCriteria));
//         })    
//       })
//     })
//   }
// }


// export function getFingerprintComparison(city, neighborhoods, input){
//   return function(dispatch){
//     neighborhoods.forEach((neighborhood, idx) => {
//       return axios.post(`/api/neighborhoods/fingerprints`, {neighborhood, input})
//       .then(res => {
//         console.log(idx, 'result for:', neighborhood.name, res.data);
//       })
//     })
//   }
// }