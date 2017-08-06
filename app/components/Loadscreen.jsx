import React from 'react';
import {connect} from 'react-redux'

function Loadscreen(props){
  function loadMessage(){
    switch (props.status) {
      case 'Loading neighborhoods':
        return 'Fetching your future neighborhoods...'
      case 'Loading results':
        return 'Tallying up the results...'
      default:
        return ''
    }
  }
  
  return (
    <div className="loading-container">
      <h1>Loading...</h1>
      <h3>{loadMessage()}</h3>
      <img className="icon" src="/images/Eclipse.svg"/>
    </div>
  )
}

function mapState(state){
  return {
    status: state.status
  }
};

export default connect(mapState)(Loadscreen);