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
        <h1>Single City Neighborhoods:</h1>
          <InputForm/>
          <ul>
            {
              this.state.currentCityNeighborhoods.map(neighborhood => 
                <li key={neighborhood.id}>{neighborhood.name}</li>
              )
            }
          </ul>
      </div>
    )
  }
}