import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import store, {setCity, getCityNeighborhoods, getNeighborhoodExtracts} from '../store'
import InputForm from './InputForm';
import Results from './Results';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Transition from 'react-motion-ui-pack';
import { spring } from 'react-motion';
import {Container} from './styled' 


export default class SingleCity extends React.Component {
  constructor(props){
    super(props);
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
        <Container key="2">
          <InputForm/>
        </Container>
      </Transition>
    )
  }
}

