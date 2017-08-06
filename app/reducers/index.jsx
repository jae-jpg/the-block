import { combineReducers } from 'redux'
import axios from 'axios';
import _ from 'lodash';

const initialState = {
  cityList: [
    {name: 'Boston', id: 'bos'},    
    {name: 'Chicago', id: 'chi'},
    {name: 'Denver', id: 'den'},
    {name: 'Houston', id: 'hou'},
    {name: 'Los Angeles', id: 'la'},
    {name: 'New York City', id: 'nyc'},
    {name: 'Philadelphia', id: 'philly'},
    {name: 'San Francisco', id: 'sf'},
    {name: 'Seattle', id: 'sea'},
    {name: 'Washington, DC', id: 'dc'},
  ],
  currentCity: {},
  currentCityNeighborhoods: [],
  input: '',
  neighborhoodSections: [],
  criteria: [],
  status: 'Loading neighborhoods',
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
const SET_STATUS = 'SET_STATUS';
const CLEAR_STATE = 'CLEAR_STATE';

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

export function setStatus(status){
  return {type: SET_STATUS, status}
}

export function clearState(){
  return {type: CLEAR_STATE}
}

// thunk creators
export function getCityNeighborhoods(cityId){
  return function(dispatch, getState){
    return axios.get(`api/city/${cityId}/neighborhoods`)
    .then(res => {
      dispatch(setStatus('Loading neighborhoods'));
      dispatch(setCityNeighborhoods(res.data));
      dispatch(getNeighborhoodData(getState().currentCity, getState().currentCityNeighborhoods))
    })
  }
}

export function getNeighborhoodData(city, neighborhoods){
  return function(dispatch){

    let promises = [];
    neighborhoods.forEach((neighborhood, idx) => {
      let promise = axios.post(`api/city/${city.id}/neighborhoods/wikiData`, {neighborhood, city})
      promises.push(promise);
    })

    Promise.all(promises)
    .then(res => {
      let newNeighborhoods = _.cloneDeep(neighborhoods);
      newNeighborhoods = newNeighborhoods.map((neighborhood, idx) => {
        neighborhood.wikiTitle = res[idx].data.wikiTitle;
        neighborhood.wikiSnippet = res[idx].data.wikiSnippet;
        neighborhood.wikiImage = res[idx].data.wikiImage;
        neighborhood.wikiText = res[idx].data.wikiText;
        return neighborhood;
      })

      dispatch(updateNeighborhoods(newNeighborhoods));
      dispatch(setStatus('Neighborhoods loaded'));
    })
  }
}

export function rankNeighborhoods(){
  return function(dispatch){
    dispatch(getIndividualComparisons('wikiSnippet', 'wikiText'));
  }
}

export function getIndividualComparisons(option1, option2){
  return function (dispatch, getState){
    let neighborhoods = _.cloneDeep(getState().currentCityNeighborhoods);
    const criteria = getState().criteria;
    const scores = option1 === 'wikiSnippet' ? 'snippetScores' : 'textScores';
    const avgScore = option1 === 'wikiSnippet' ? 'averageSnippetScore' : 'averageTextScore';

    let promises = [];
    
    criteria.forEach(criterium => {
      const promise = axios.post(`/api/comparisons/overall`, {criterium, neighborhoods, option1})
      promises.push(promise)
    })
    
    Promise.all(promises)
    .then(res => {
      criteria.forEach((criterium, criteriumIdx) => {
        neighborhoods = neighborhoods.map((neighborhood, neighborhoodIdx) => {
          if (!neighborhood[scores]) neighborhood[scores] = [];
          // console.log(criterium.name, neighborhood.name, res[criteriumIdx].data[neighborhoodIdx])
          neighborhood[scores].push(res[criteriumIdx].data[neighborhoodIdx].weightedScoring);
          return neighborhood;
        })
      })

      if (option2) {
        neighborhoods = neighborhoods.map(neighborhood => {
          neighborhood[avgScore] = findAverage(neighborhood[scores])
          return neighborhood;
        });
        dispatch(updateNeighborhoods(neighborhoods));
        dispatch(getIndividualComparisons(option2));
      } else {
        neighborhoods = neighborhoods.map(neighborhood => {
          neighborhood[avgScore] = findAverage(neighborhood[scores])
          return neighborhood;
        });

        const groupAverage = findAverage(neighborhoods.map(n => (((n.averageSnippetScore) + (n.averageTextScore * 4)) / 5)))
        console.log('group average', groupAverage)
        neighborhoods = sortByScore(neighborhoods, groupAverage);
        dispatch(updateNeighborhoods(neighborhoods));
        dispatch(setStatus('Results loaded'));
      }
    })
  } 
}

function findAverage(array){
  if (array && array.length) {
    return array.reduce((acc, el) => {
      return acc + el;
    }) / array.length;
  } else {
    return 0;
  } 
}

function sortByScore(neighborhoods, groupAverage){
  return neighborhoods.sort((a, b) => {
    const aDiff = Math.abs(a.averageSnippetScore - a.averageTextScore);
    const bDiff = Math.abs(b.averageSnippetScore - b.averageTextScore);

    let aCalc = (((a.averageSnippetScore) + (a.averageTextScore * 4)) / 5);
    let bCalc = (((b.averageSnippetScore) + (b.averageTextScore * 4)) / 5);

    aCalc = aDiff > 5 && aCalc < groupAverage || aDiff > 6 && aCalc < groupAverage * 1.17 || aDiff > 6.75 && aCalc < groupAverage * 1.22 ? aCalc / aDiff : aCalc;
    bCalc = bDiff > 5 && bCalc < groupAverage || bDiff > 6 && bCalc < groupAverage * 1.17 || bDiff > 6.75 && bCalc < groupAverage * 1.22 ? bCalc / bDiff : bCalc;
    console.log(a.name, 'aCalc', aCalc, 'aDiff', aDiff);

    return bCalc - aCalc;
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
      return Object.assign({}, state, {neighborhoodSections: newNeighborhoodSections});
    case SET_STATUS:
      return Object.assign({}, state, {status: action.status});
    case UPDATE_NEIGHBORHOODS:
      return Object.assign({}, state, {currentCityNeighborhoods: action.neighborhoods});
    case CLEAR_STATE:
      return Object.assign({}, initialState);
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

// THIS IS NOT BEING USED ANYMORE
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

// PROMISE ALL OPTION FOR GET SECTION CONTENT
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

// CRITERIA BASED APPROACH WHERE I NEED TO FIND THE SCORES FOR EACH NEIGHBORHOOD
// function findScores(wikiTitle, criteria){
//   var scores = [];

//   criteria.forEach(criterium => {
//     criterium.sectionsToSearch.forEach(section => {
//       let criteriaInstances = section.neighborhoods.filter(neighborhood => {
//         return neighborhood.neighborhood === wikiTitle;
//       })
//       criteriaInstances.forEach(instance => {
//         scores.push(instance.score);
//       })
//     })
//   })
//   return scores;
// }

// IF I USE THIS, I NEED TO MODIFY WHAT'S BEING USED IN THE REQUEST BODY API ROUTE
// export function getOverallComparisons(){
//   return function (dispatch, getState){
//     let neighborhoods = _.cloneDeep(getState().currentCityNeighborhoods);
//     const input = getState().input;
    
//     axios.post(`/api/comparisons/overall`, {input, neighborhoods})
//     .then(res => {
//       let newNeighborhoods = neighborhoods.map((neighborhood, idx) => {
//         neighborhood.overallScore = res.data[idx].weightedScoring;
//         return neighborhood;
//       })

//       neighborhoods = sortByScore(neighborhoods);
//       dispatch(updateNeighborhoods(neighborhoods));
//       dispatch(setStatus('Results loaded'));
//     })
//   }
// }
