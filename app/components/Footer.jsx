import React from 'react';
import {Link} from 'react-router-dom';

export default function Footer(){
  return (
    <div className="footer-container">
      <div className="footer-side">
        {/* CHANGE link to include both h3 and img*/}
        <Link to="/"><img className="home" src="/images/home.svg"/></Link>
        <h3 className="the-block">The Block</h3>
      </div>
      <div className="footer-side">
        {/* CHANGE link to include both h3 and img*/}
        <h3 className="start-over">Start Over</h3>
        <Link to="/"><img className="fa-spin-hover" src="/images/arrows.svg"/></Link>
      </div>
    </div>
  )
}