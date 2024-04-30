import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../Context/AuthContext'
import { ChatContext } from '../Context/ChatContext';
import Arrow from '../images/arrowdown.png'
import Img from './Img';

function Message({message}) {
  const {currUser}=useContext(AuthContext);
  const {data}=useContext(ChatContext);

  const ref=useRef()
  useEffect(()=>{
    ref.current?.scrollIntoView({behavior:"smooth"})
  },[message])

  return (
    <div ref={ref} className={`message ${message.senderId===currUser.uid && "owner"}`}>
      <div className="messageInfo">
        <img src={message.senderId===currUser.uid ? currUser.photoURL : data.user.photoURL} alt="" />
        <span className='timestamp'>{new Intl.DateTimeFormat('en-IS', {timeZone:"Asia/Kolkata",hour: '2-digit', minute: '2-digit'}).format(message.date)}</span>
        {/* <span>{message.data?.toLocalTimeString("en-US")}</span> */}
      </div>
      <div className="messageContent">
        <div>{message.img ? <Img mess={message} /> : message.audio ? <Img mess={message}/> : message.text }<img className='arrow' src={Arrow} alt="" /></div>
      </div>
    </div>
  )
}

export default Message