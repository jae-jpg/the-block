import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import store, {setCity, getCityNeighborhoods, getNeighborhoodExtracts} from '../store'
import InputForm from './InputForm';

export default class SingleCity extends React.Component {
  constructor(props){
    super(props);
    this.state = store.getState();
  }

  componentDidMount(){
    this.unsubscribe = store.subscribe(() => {
      this.setState(store.getState());
    })
    store.dispatch(setCity(this.props.match.params.cityId))
    store.dispatch(getCityNeighborhoods(this.props.match.params.cityId))
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  render(){
    return (
      <div>
        <div className="neighborhoods-header">
          <h1>Welcome to {this.state.currentCity.name}</h1>
          <InputForm/>
        </div>
        <div className="neighborhoods-list">
          {
            this.state.currentCityNeighborhoods.map(neighborhood => 
              <div className="neighborhoods-item" key={neighborhood.id}>
                <span>{neighborhood.name}</span>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

// NEIGHBORHOODS LIST JSX