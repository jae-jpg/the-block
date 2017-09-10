import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Container, Rank, Neighborhood, Description, Row, Card} from './styled' 

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
      <Container>
      <h1>Have you considered...</h1>
        <Row>
          {
            testData1.map(neighborhood => (
              <Card key={neighborhood.id}>
                <Rank>#1</Rank>
                <Neighborhood>{neighborhood.name.toUpperCase()}</Neighborhood>
                <Description>{neighborhood.wikiSnippet}...</Description>
                <a href={`https://en.wikipedia.org/wiki/${neighborhood.wikiTitle}`}><p className="explore">EXPLORE</p></a>
              </Card>
            ))
          }
        </Row>
        <Row>
          {
            testData2.map((neighborhood, idx) => (
              <Card key={neighborhood.id}>
                <Rank>#{idx + 2}</Rank>
                <Neighborhood>{neighborhood.name.toUpperCase()}</Neighborhood>
                <Description>{neighborhood.wikiSnippet}...</Description>
                <a href={`https://en.wikipedia.org/wiki/${neighborhood.wikiTitle}`}><p className="explore">EXPLORE</p></a>
              </Card>
            ))
          }
        </Row>
      </Container>
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
