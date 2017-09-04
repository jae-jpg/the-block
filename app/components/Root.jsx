import React, { Component } from 'react';
import store, {getCities} from '../store'
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import Dropdown from './Dropdown';
import Transition from 'react-motion-ui-pack';
import { spring } from 'react-motion';
import { Container, Title, Form, Button } from './styled'

class Root extends Component {
  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    this.props.getCities();
  }

  handleSubmit(event){
    event.preventDefault();
    if (this.props.city.id !== undefined) {
      this.props.history.push(`/city/${this.props.city.id}`);
    }
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
        <Container key="1">
          <Title className="root-item">Where would you like to live?</Title>
          <Form onSubmit={this.handleSubmit}>
            <Dropdown />
            <Button type="submit" className="root-submit-button"><i className="material-icons">arrow_forward</i></Button>
          </Form>
        </Container>
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

function mapDispatch(dispatch){
  return {
    getCities: function(){dispatch(getCities())}
  }
}

export default connect(mapState, mapDispatch)(Root);