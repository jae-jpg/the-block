import React, { Component } from 'react';
import axios from 'axios';
import jsonp from 'jsonp';
import store from '../store'
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import InputForm from './InputForm';
import Dropdown from './Dropdown';
import Transition from 'react-motion-ui-pack';
import { spring } from 'react-motion';

export default class Root extends Component {
  constructor(){
    super();
    this.state = store.getState();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    this.unsubscribe = store.subscribe(() => {
      this.setState(store.getState());
    });
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  handleSubmit(event){
    event.preventDefault();
    this.props.history.push(`/city/${this.state.currentCity.id}`);
  }

  render() {
    const {cityList} = this.state;

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
            <Dropdown cityList={this.state.cityList}/>
            <button type="submit" className="root-submit-button"></button>
          </form>
        </div>
      </Transition>
    )
  }
}