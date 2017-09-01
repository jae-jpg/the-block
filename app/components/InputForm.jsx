import React from 'react';
import store, {newInput, setCriteria, rankNeighborhoods} from '../store'
import { connect } from 'react-redux';

class InputForm extends React.Component {
  constructor(){
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event){
    const input = event.target.value;
    this.props.newInput(input);
  }

  handleSubmit(event){
    event.preventDefault();
    this.props.setCriteria();
    this.props.rankNeighborhoods();
  }

  render(){
    return (
      <div className="criteria-container">
        <h1 className="criteria-item criteria-question">What are you looking for in a neighborhood?</h1>
        <h3 className="criteria-prompt">You can write anything here! The more ideas the better.</h3>
        <form className="criteria-item criteria-form" onSubmit={this.handleSubmit}>
          <input
            autoFocus
            className="criteria-input"
            onChange={this.handleChange}
          ></input>
          <button type="submit" className="input-submit-button">Submit</button>
        </form>
      </div>
    )
  }
}

function mapState(state){
  return {
    criteria: state.criteria
  }
}

function mapDispatch(dispatch){
  return {
    newInput: function(input){dispatch(newInput(input))},
    setCriteria: function(){dispatch(setCriteria())},
    rankNeighborhoods: function(){dispatch(rankNeighborhoods())}
  }
}

export default connect(mapState, mapDispatch)(InputForm);