import React from 'react';
import store, {newInput, setCriteria, rankNeighborhoods} from '../store'
import { connect } from 'react-redux';
import { Container, Title, Button, Form } from './styled'
import TextField from 'material-ui/TextField';

const textFieldStyle = {
  color: '#CBCBCB',
  fontFamily: 'Montserrat',
  fontSize: '24px',
  textAlign: 'center',
  width: '100%',
  paddingBottom: '6px'
};

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
      <Container>
        <Title>Describe your ideal neighborhood.</Title>
        <Form style={{width: '100%'}} onSubmit={this.handleSubmit}>
          <TextField
            hintText="Try 'lots of parks', or 'good schools'"
            onChange={this.handleChange}
            style={{width: '50%', textAlign: 'center', paddingBottom: '6px'}}
            inputStyle={textFieldStyle}
            hintStyle={textFieldStyle}
            underlineStyle={{borderColor: '#EDB67B'}}
          />
          <Button type="submit"><i className="material-icons">arrow_forward</i></Button>
        </Form>
      </Container>
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