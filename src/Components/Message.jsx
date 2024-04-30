import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../Context/AuthContext'
import { ChatContext } from '../Context/ChatContext';
import Arrow from '../images/arrowdown.png'
import Img from './Img';
import ImageModal from './ImageModal';

function Message({message}) {
  const {currUser}=useContext(AuthContext);
  const {data}=useContext(ChatContext);
  const handlePlay = () => {
    const audio = new Audio(message.audio); // Create an audio element with the audio URL
    audio.play(); // Play the audio
  };
  const ref=useRef()
  useEffect(()=>{
    ref.current?.scrollIntoView({behavior:"smooth"})
  },[message])

  const [selected,setselected]=useState(null);
  const openModal = (info) => setselected(info); // Function to open modal
  const closeModal = () => setselected(null); // Function to close modal

  const handleclick=()=>{
    openModal(message);
  }

  return (
    <div ref={ref} className={`message ${message.senderId===currUser.uid && "owner"}`}>
      <div className="messageInfo">
        <img src={message.senderId===currUser.uid ? currUser.photoURL : data.user.photoURL} alt="" />
        
        <span className='timestamp'>{new Intl.DateTimeFormat('en-IS', {timeZone:"Asia/Kolkata",hour: '2-digit', minute: '2-digit'}).format(message.date)}</span>
        {/* <span>{message.data?.toLocalTimeString("en-US")}</span> */}
      </div>
      <div className="messageContent">
        <div>{message.img ? <Img mess={message} handleclick={handleclick} /> : message.audio ? <audio src={message.audio} controls onClick={handlePlay}/> : message.text }<img className='arrow' src={Arrow} alt="" /></div>
          {/* <div className="audio-message">
        <audio src={message.audio} controls onClick={handlePlay}/>
        </div> */}
      </div>
      {selected && <ImageModal info={selected}  onClose={closeModal} />}
    </div>
  )
}

export default Message
