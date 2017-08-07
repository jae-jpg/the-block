import React from 'react';
import {connect} from 'react-redux'
import Transition from 'react-motion-ui-pack';
import { spring } from 'react-motion';

function Loadscreen(props){
  function loadMessage(){
    switch (props.status) {
      case 'Loading neighborhoods':
        return 'Fetching your future neighborhoods...'
      case 'Getting comparisons 1':
        return 'Gathering data...'
      case 'Getting comparisons 2':
        return 'Picking the best neighborhoods...'
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
      <div key="3" className="loading-container">
        <h1 className="loading1">Loading...</h1>
        <h2 className="loading2">{loadMessage()}</h2>
        <img className="icon" src="/images/Eclipse.svg"/>
      </div>
    </Transition>
  )
}

function mapState(state){
  return {
    status: state.status
  }
};

export default connect(mapState)(Loadscreen);

// OLD CODE
// import React from 'react';
// import {connect} from 'react-redux'
// import Transition from 'react-motion-ui-pack';
// import { spring } from 'react-motion';

// function Loadscreen(props){
//   function loadMessage(){
//     switch (props.status) {
//       case 'Loading neighborhoods':
//         return 'Fetching your future neighborhoods...'
//       case 'Getting comparisons 1':
//         return 'Picking the best neighborhoods...'
//       case 'Getting comparisons 2':
//         return 'Tallying up the score (any minute now...)'
//       default:
//         return ''
//     }
//   }
  
//   return (
//     <div className="loading-container">
//       <h1 className="loading1">Loading...</h1>
//       <h2 className="loading2">{loadMessage()}</h2>
//       <img className="icon" src="/images/Eclipse.svg"/>
//     </div>
//   )
// }

// function mapState(state){
//   return {
//     status: state.status
//   }
// };

// function TransitionLoadscreen(props){
//   return (
//       <Transition
//         component={false}
//         enter={{
//           opacity: 1,
//           translateX: spring(0, {stiffness: 400, damping: 20})
//         }}
//         leave={{
//           opacity: 0,
//           translateX: 250
//         }}
//       >
//       <Loadscreen key="3" status={props.status}/>
//       </Transition>
//   )
// }

// export default connect(mapState)(TransitionLoadscreen);