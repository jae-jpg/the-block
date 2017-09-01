import React, { Component } from 'react';
import axios from 'axios';
import jsonp from 'jsonp';
import store, {setCity, getCityNeighborhoods, clearState, getCities} from '../store'
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import InputForm from './InputForm';
import Dropdown from './Dropdown';
import Transition from 'react-motion-ui-pack';
import { spring } from 'react-motion';

class Root extends Component {
  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    store.dispatch(getCities());
  }

  handleSubmit(event){
    event.preventDefault();
    this.props.history.push(`/city/${this.props.city.id}`);
    store.dispatch(getCityNeighborhoods(this.props.city.id));
  }

  render() {
    const {cities} = this.props;

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
        <div key="1" className="root-container">
          <h1 className="root-item">Where would you like to live?</h1>
          <form className="root-form" onSubmit={this.handleSubmit}>
            <Dropdown />
            <button type="submit" className="root-submit-button"><i className="fa fa-arrow-right white"></i></button>
          </form>
        </div>
      </Transition>
    )
  }
}

function mapState(state){
  return {
    cities: state.cityList,
    city: state.city
  }
}

export default connect(mapState)(Root);