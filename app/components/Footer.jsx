import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {getCities} from '../store';
import {NavLink} from './styled';


export default function Footer (){
  return (
    <div className="footer-container">
      <div className="footer-side">
        <Link to="/"><NavLink>The Block</NavLink></Link>
      </div>
      <div className="footer-side">
        <Link to="/"><NavLink>Start Over</NavLink></Link>
      </div>
    </div>
  )
}