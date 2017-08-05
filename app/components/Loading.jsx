import React from 'react'

export default function Loading(props){
  return (
    <div>
      <h3>Load screen...</h3>
      <span>Phase: {props.status}</span>
    </div>
  )
}