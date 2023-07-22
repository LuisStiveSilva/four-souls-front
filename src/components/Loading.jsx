import React from 'react'
import '../styles/loading.css'

function Loading() {
  return (
    <div className='loading'>
      <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  )
}

export default Loading
