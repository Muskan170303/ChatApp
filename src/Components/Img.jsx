import React from 'react'

function Img({mess}) {
  return (
    <>
      <p><img src={mess.img} alt="" /> <p>{mess.text}</p></p>
    </>
  )
}

export default Img