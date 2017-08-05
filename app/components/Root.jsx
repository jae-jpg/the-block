import React, { Component } from 'react';
import axios from 'axios';
import jsonp from 'jsonp';
import store from '../store'
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import InputForm from './InputForm'


export default class Root extends Component {
  constructor(){
    super();
    this.state = store.getState();
  }

  componentDidMount(){
    this.unsubscribe = store.subscribe(() => {
      this.setState(store.getState());
    });
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  render() {
    const {cityList} = this.state;
    return (
      <div className="root-container">
        <h1 className="root-item">Where would you like to live?</h1>
        <input autoFocus className="root-item root-input"></input>
      </div>
    )
  }
}

/**
 * GOOGLE PLACE SEARCH
 * 
 *     const apiRequest = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyCMnsW-JGKwjLVFI5bVH7g0eS_5nCKcbwg&location=40.705086,-74.009151&radius=500&type=lodging'
    
    var map;
    var service;
    var infowindow;

    function initialize() {
      var pyrmont = new google.maps.LatLng(40.705086,-74.009151);

      map = new google.maps.Map(document.getElementById('main'), {
          center: pyrmont,
          zoom: 15
        });

      var request = {
        location: pyrmont,
        radius: '1500',
        type: ['lodging'],
        keyword: 'area'
      };

      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, search);
    }

    initialize();

    function search(results, status){
      console.log('all places results', results);
      var placeIds = results.reduce(function(acc, el){
        return acc.concat(el.place_id);
      }, []);
      console.log('place ids only:', placeIds);

      var request = {
        placeId: placeIds[0]
      };

      placeIds.forEach(placeId => {
        service.getDetails({placeId}, details);

        function details(place, status) {
          console.log('place details:', place);
          console.log('place detail reviews', place.reviews);
        }
      })
    }
 * 
 */

//  // OLD JSX
//          <ul className="root-item cities-list">
//           {
//             cityList.map(city => 
//               <li className="cities-item" key={city.id}><Link to={`/city/${city.id}`}>{city.name}</Link></li>
//             )
//           }
//         </ul>