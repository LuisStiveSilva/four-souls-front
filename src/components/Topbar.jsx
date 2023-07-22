import React from 'react'
import { Link } from "react-router-dom";
import '../styles/topbar.css'

function Topbar() {
  return (
    <div className='topbar'>
      <p>
        <Link className='link' to={`/four-souls-front`}>Inicio</Link>
      </p>
      <p>
        <Link className='link' to={`/four-souls-front/tournaments`}>Resultados</Link>
      </p>
    </div>
  )
}

export default Topbar
