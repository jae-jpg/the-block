'use strict'
import React from 'react'
import {render} from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter as Router, Route, Switch } from 'react-router-dom';


import store from './store'
import Root from './components/Root'
import SingleCity from './components/SingleCity' 

render (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path='/city/:cityId' component={SingleCity}/>
        <Route component={Root}/>
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('main')
)