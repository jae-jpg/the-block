import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import { setCity, getCityNeighborhoods } from '../store';

const styles = {
  customWidth: {
    width: '25vw',
  }
};

function RootDropdown(props) {
  return (
    <div>
      <DropDownMenu
        value={props.city && props.city.id || 0}
        onChange={props.handleChange}
        autoWidth={false}
        style={styles.customWidth}
        labelStyle={{color: '#CBCBCB', fontFamily: 'Montserrat', fontSize: '24px'}}
        maxHeight={200}>
          <MenuItem value={0} primaryText="Choose a city" style={{fontFamily: 'Montserrat'}}/>
          {props.cities.map(city => {
            return (<MenuItem key={city.id} value={city.id} primaryText={city.name} style={{fontFamily: 'Montserrat'}}/>)
          })}
      </DropDownMenu>
    </div>
  )
}

function mapState(state){
  return {
    cities: state.cities,
    city: state.city
  }
}

function mapDispatch(dispatch, ownProps){
  return {
    handleChange: function(event, index){
      dispatch(setCity(index));
    }
  }
}

export default connect(mapState, mapDispatch)(RootDropdown);