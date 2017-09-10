import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import IconButton from 'material-ui/IconButton';
import {Container, Text, Em} from './styled' 

export default function About(){
  return (
    <ReactCSSTransitionGroup
      transitionName="example"
      transitionAppear={true}
      transitionAppearTimeout={500}
      transitionEnter={false}
      transitionLeave={false}
    >
      <Container>
        <Text>
          Welcome to the Block, a flexible, <Em> natural language processing</Em> recommendation engine to help you find the best neighborhood for your lifestyle.
          The Block measures the <Em>semantic similarity</Em> between user input and location data in order to determine the best match for its users.
          Made possible with <Em>API integration</Em> from <a href="https://www.mediawiki.org/wiki/API:Main_page">Wikipedia</a> and <a href="http://www.cortical.io/">Cortical.io</a> APIs.
        </Text>
        <Text><strong>Stack:</strong> Express, Sequelize, React, Redux</Text>
        <Text>Created by Jessica Blake</Text>

        <Container row>
        <a href="https://www.linkedin.com/in/blakejessica/">
          <IconButton
            iconStyle={{ fontSize: "24px"}}
            iconClassName="fa fa-linkedin">
          </IconButton>        
        </a>
        <a href="https://github.com/jcblake14/the-block">
          <IconButton
            iconStyle={{ fontSize: "24px"}}
            iconClassName="fa fa-github">
          </IconButton>
        </a>
        </Container>

      </Container>
    </ReactCSSTransitionGroup>
  )
}