'use strict'
import React from 'react'
import {render} from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter as Router, Route, Switch } from 'react-router-dom';


import store from './store'
import Root from './components/Root'
import SingleCity from './components/SingleCity'
import SingleCityContainer from './components/SingleCityContainer'
import Results from './components/Results';
import Loadscreen from './components/Loadscreen';
import Footer from './components/Footer';

render (
  <Provider store={store}>
    <Router>
      <div className="main">
        <div className="content">
          <Switch>
            <Route path='/city/:cityId' component={SingleCityContainer}/>
            <Route path='/test' component={Results}/>
            <Route component={Root}/>
          </Switch>
        </div>
        <div className="footer">
          <Footer />
        </div>
      </div>
    </Router>
  </Provider>,
  document.getElementById('main')
)