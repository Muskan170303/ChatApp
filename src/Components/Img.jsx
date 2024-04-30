import React from 'react'

function Img({mess}) {
  return (
    <>
      <p><img src={mess.img} alt="" /></p>
      <p>{mess.text}</p>
    </>
  )
}

export default Img