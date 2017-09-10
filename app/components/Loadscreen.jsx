import React from 'react';
import {connect} from 'react-redux'
import Transition from 'react-motion-ui-pack';
import { spring } from 'react-motion';
import { Container, Title } from './styled'

function Loadscreen(props){
  function loadMessage(){
    switch (props.status) {
      case 'Loading neighborhoods':
        return 'Fetching your future neighborhoods...'
      case 'Getting comparisons 1':
        return 'Gathering data...'
      case 'Getting comparisons 2':
        return 'Ranking neighborhoods...'
      case 'Getting comparisons 3':
        return 'Tallying up the score (any minute now...)'
      default:
        return ''
    }
  }
  
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
      <Container key="3">
        <Title className="loading1">Loading...</Title>
        <h2 className="loading2">{loadMessage()}</h2>
        <img className="icon" src="/images/Eclipse.svg"/>
      </Container>
    </Transition>
  )
}

function mapState(state){
  return {
    status: state.status
  }
};

export default connect(mapState)(Loadscreen);