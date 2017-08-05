import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import store, {setCity, getCityNeighborhoods, getNeighborhoodExtracts} from '../store'
import InputForm from './InputForm';
import Results from './Results';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Transition from 'react-motion-ui-pack';
import { spring } from 'react-motion';

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
    // store.dispatch(getCityNeighborhoods(this.props.match.params.cityId))
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  render(){
    return (
      <Transition
        component={false}
        enter={{
          opacity: 1,
          translateX: spring(0, {stiffness: 400, damping: 20})
        }}
        leave={{
          opacity: 0,
          translateX: 250
        }}
      >
        <div key="2">
          <div className="neighborhoods-header">
            <h1>Welcome to {this.state.currentCity.name}</h1>
            <InputForm/>
          </div>
          <Results />
        </div>
      </Transition>
    )
  }
}