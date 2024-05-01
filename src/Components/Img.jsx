import React, { useState } from 'react'

function Img({mess,handleclick}) {
  return (
    <>
      <p><img src={mess.img} alt="" onClick={()=>{handleclick()}} /></p>
      <p>{mess.text}</p>
    </>
  )
}

export default Img