import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setCity, getCityNeighborhoods } from '../store';

function RootDropdown(props) {
  const cities = props.cities.map(city => {
    return {
      key: city.id,
      value: city.id,
      text: city.name
    }
  })

  return (
    <Dropdown
      placeholder="Choose a city"
      search
      selection
      options={cities}
      onChange={props.handleChange}
    />
  )
}

function mapState(state){
  return {
    cities: state.cities
  }
}

function mapDispatch(dispatch, ownProps){
  return {
    handleChange: function(event, data){
      dispatch(setCity(data.value));
    }
  }
}

export default connect(mapState, mapDispatch)(RootDropdown);