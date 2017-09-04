import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Rank, Neighborhood, Description} from './styled' 

function Results(props){
  return (
    <ReactCSSTransitionGroup
      transitionName="example"
      transitionAppear={true}
      transitionAppearTimeout={500}
      transitionEnter={false}
      transitionLeave={false}
    >
      <div className="results-container">
      <h1>Have you considered...</h1>
        <div className="top-result-container">
          {
            props.topResult.map(neighborhood => (
              <div
                key={neighborhood.id}
                className="secondary-results-item"       
              >
                <div className="secondary-results-content">
                  <Rank>#1</Rank>
                  <Neighborhood>{neighborhood.name.toUpperCase()}</Neighborhood>
                  <Description>{neighborhood.wikiSnippet}...</Description>
                  <a href={`https://en.wikipedia.org/wiki/${neighborhood.wikiTitle}`}><p className="explore">EXPLORE</p></a>
                </div>
              </div>
            ))
          }
        </div>
        <div className="top-result-container">
          {
            props.neighborhoods.map((neighborhood, idx) => (
              <div
                key={neighborhood.id}
                className="secondary-results-item"       
              >
                <div className="secondary-results-content">
                  <Rank>#{idx + 2}</Rank>
                  <Neighborhood>{neighborhood.name.toUpperCase()}</Neighborhood>
                  <Description>{neighborhood.wikiSnippet}...</Description>
                  <a href={`https://en.wikipedia.org/wiki/${neighborhood.wikiTitle}`}><p className="explore">EXPLORE</p></a>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </ReactCSSTransitionGroup>
  )
}

function mapState(state){
  return {
    allNeighborhoods: state.currentCityNeighborhoods,
    topResult: state.currentCityNeighborhoods.slice(0, 1),
    neighborhoods: state.currentCityNeighborhoods.slice(1, 4)
  }
}

export default connect(mapState)(Results);

// MORE OPTIONS
      // <div className="secondary-results-container">
      //   {
      //     testData2.map(neighborhood => (
      //       <div
      //         key={neighborhood.id}
      //         className="secondary-results-item"       
      //       >
      //         <img src={neighborhood.wikiImage}/>
      //         <div className="secondary-results-content">
      //           <h3>{neighborhood.name.toUpperCase()}</h3>
      //           <span>{neighborhood.wikiSnippet}...</span>
      //         </div>
      //       </div>
      //     ))
      //   }
      // </div>