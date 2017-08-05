import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setCity } from '../store';

function RootDropdown(props) {
  const cityList = props.cityList.map(city => {
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
      options={cityList}
      onChange={props.handleChange}
    />
  )
}

function mapDispatch(dispatch, ownProps){
  return {
    handleChange: function(event, data){
      dispatch(setCity(data.value));
    }
  }
}

export default connect(null, mapDispatch)(RootDropdown);