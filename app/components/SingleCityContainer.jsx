import React from 'react';
import { connect } from 'react-redux'
import Loadscreen from './Loadscreen'
import SingleCity from './SingleCity'
import Results from './Results'
import store, {setCity, getCityNeighborhoods, clearState} from '../store'

class SingleCityContainer extends React.Component {
  constructor(props){
    super(props);
    this.renderComponent = this.renderComponent.bind(this)
  }

  componentDidMount(){
    const id = this.props.match.params.cityId;
    this.props.getCityNeighborhoods(id);
  }

  componentWillUnmount(){
    store.dispatch(clearState());
  }
  
  renderComponent(){
    switch (this.props.status) {
      case 'Loading neighborhoods':
        return <Loadscreen />
      case 'Neighborhoods loaded':
        return <SingleCity />
      case 'Getting comparisons 1':
        return <Loadscreen/>
      case 'Getting comparisons 2':
        return <Loadscreen/>
      case 'Getting comparisons 3':
        return <Loadscreen/>
      case 'Results loaded':
        return <Results />
      default:
        return <SingleCity />
    }
  }

  render(){
    return (
        this.renderComponent()
    )
  }
}

function mapState(state){
  return {
    city: state.city,
    status: state.status
  }
}

function mapDispatch(dispatch){
  return {
    setCity: function(id){dispatch(setCity(id))}, // will need to use this for page refreshes (as opposed to submits from previous page)
    getCityNeighborhoods: function(id){dispatch(getCityNeighborhoods(id))}
  }
}

export default connect(mapState, mapDispatch)(SingleCityContainer)