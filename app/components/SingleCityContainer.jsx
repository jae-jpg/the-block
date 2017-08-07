import React from 'react';
import { connect } from 'react-redux'
import Loadscreen from './Loadscreen'
import SingleCity from './SingleCity'
import Results from './Results'
import store, {setCity, getCityNeighborhoods, clearState} from '../store'

export default class SingleCityContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = store.getState();
    this.renderComponent = this.renderComponent.bind(this)
  }

  componentDidMount(){
    this.unsubscribe = store.subscribe(() => {
      this.setState(store.getState());
    })
    store.dispatch(setCity(this.props.match.params.cityId))
    store.dispatch(getCityNeighborhoods(this.props.match.params.cityId))
  }

  componentWillUnmount(){
    this.unsubscribe();
    store.dispatch(clearState());
  }
  
  renderComponent(){
    switch (this.state.status) {
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