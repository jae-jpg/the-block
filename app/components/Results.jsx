import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

function Results(props){

  const testData1 = [
    {alternate_url: "http://neighborland.com/neighborhoods/nyc-battery-park-city",
    id: "nyc-battery-park-city",
    name: "Battery Park City",
    url: "http://neighborland.com/api/v1/neighborhoods/nyc-battery-park-city",
    wikiImage: "https://upload.wikimedia.org/wikipedia/commons/7/71/Columbus_Monument_(New_York_City)_-_DSC05923.JPG",
    wikiSnippet: " Battery Park City is a mainly residential 92-acre (37 ha) planned community on the west side of the southern tip of the island of Manhattan in New York",
    wikiTitle: "Battery%20Park%20City"}
  ]
  const testData2 = [
    {alternate_url: "http://neighborland.com/neighborhoods/nyc-battery-park-city",
    id: "1",
    name: "Battery Park City",
    url: "http://neighborland.com/api/v1/neighborhoods/nyc-battery-park-city",
    wikiImage: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Battery_Park_City_8971.JPG",
    wikiSnippet: " Battery Park City is a mainly residential 92-acre (37 ha) planned community on the west side of the southern tip of the island of Manhattan in New York",
    wikiTitle: "Battery%20Park%20City"},
    {alternate_url: "http://neighborland.com/neighborhoods/nyc-battery-park-city",
    id: "2",
    name: "Battery Park City",
    url: "http://neighborland.com/api/v1/neighborhoods/nyc-battery-park-city",
    wikiImage: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Battery_Park_City_8971.JPG",
    wikiSnippet: " Battery Park City is a mainly residential 92-acre (37 ha) planned community on the west side of the southern tip of the island of Manhattan in New York",
    wikiTitle: "Battery%20Park%20City"},
    {alternate_url: "http://neighborland.com/neighborhoods/nyc-battery-park-city",
    id: "3",
    name: "Battery Park City",
    url: "http://neighborland.com/api/v1/neighborhoods/nyc-battery-park-city",
    wikiImage: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Battery_Park_City_8971.JPG",
    wikiSnippet: " Battery Park City is a mainly residential 92-acre (37 ha) planned community on the west side of the southern tip of the island of Manhattan in New York",
    wikiTitle: "Battery%20Park%20City"},
  ]

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
                  <h3 className="number">#1</h3>
                  <h3 className="neighborhood">{neighborhood.name.toUpperCase()}</h3>
                  <p className="description">{neighborhood.wikiSnippet}...</p>
                  <br/>
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
                  <h3 className="number">#{idx + 2}</h3>
                  <h3 className="neighborhood">{neighborhood.name.toUpperCase()}</h3>
                  <p className="description">{neighborhood.wikiSnippet}...</p>
                  <br/>
                  <span className="explore"><a href={`https://en.wikipedia.org/wiki/${neighborhood.wikiTitle}`}>EXPLORE</a></span>
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