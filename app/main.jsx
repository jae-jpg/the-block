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
import Navbar from './components/Navbar';
import About from './components/About';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: "#EDB67B",
    primary2Color: "#EDB67B",
    primary3Color: "#EDB67B",
    accent1Color: "#EDB67B",
    accent2Color: "#EDB67B",
    accent3Color: "#EDB67B" 
  },
  dropDownMenu: {
    accentColor: '#EDB67B'
  },
});

render (
  <Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>  
      <Router>
        <div className="main">
          <div className="footer">
            <Navbar />
          </div>
          <div className="content">
            <Switch>
              <Route path='/city/:cityId' component={SingleCityContainer}/>
              <Route path='/about' component={About}/>
              <Route path='/test' component={Results}/>
              <Route component={Root}/>
            </Switch>
          </div>
        </div>
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('main')
)