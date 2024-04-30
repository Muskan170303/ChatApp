import React from 'react'

function Img({mess}) {
  return (
    <>
      <p><img src={mess.img} alt="" /></p>
      <p>{mess.text}</p>
      <p>{mess.audio}</p>
    </>
  )
}

export default Img