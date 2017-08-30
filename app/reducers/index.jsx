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
    {name: 'New York', id: 'nyc'},
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
}

// action types
const SET_CITY = 'SET_CITY';
const SET_CITY_NEIGHBORHOODS = 'SET_CITY_NEIGHBORHOODS';
const NEW_INPUT = 'NEW_INPUT';
const SET_CRITERIA = 'SET_CRITERIA'
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

export function newInput(input){
  return {type: NEW_INPUT, input}
}

export function setCriteria(){
  return {type: SET_CRITERIA}
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
    dispatch(setStatus('Getting comparisons 1'))
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
      dispatch(setStatus('Getting comparisons 2'))
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
        // console.log('group average', groupAverage)
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
    // console.log(a.name, 'aCalc prior', aCalc)

    aCalc = aDiff > 5 && aCalc < groupAverage || aDiff > 6 && aCalc < groupAverage * 1.178 || aDiff > 6.75 && aCalc < groupAverage * 1.22? aCalc / aDiff : aCalc;
    bCalc = bDiff > 5 && bCalc < groupAverage || bDiff > 6 && bCalc < groupAverage * 1.178 || bDiff > 6.75 && bCalc < groupAverage * 1.22? bCalc / bDiff : bCalc;
    // console.log(a.name, 'aCalc', aCalc, 'aDiff', aDiff);

    return bCalc - aCalc;
  })
}

const rootReducer = function(state = initialState, action) {
  switch(action.type) {
    case SET_CITY:
      return Object.assign({}, state, {currentCity: state.cityList.find(city => city.id === action.cityId)});
    case SET_CITY_NEIGHBORHOODS:
      return Object.assign({}, state, {currentCityNeighborhoods: action.neighborhoods});
    case NEW_INPUT:
      return Object.assign({}, state, {input: action.input});
    case SET_CRITERIA:
      let newCriteria = state.input.split(', ');
      newCriteria = newCriteria.map(criterium => ({name: criterium, sectionsToSearch: []}))
      return Object.assign({}, state, {criteria: newCriteria});
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