import React,{useContext} from 'react'
import Cam from '../images/cam.png'
import Add from '../images/add.png'
import More from '../images/more.png'
import Messages from './Messages'
import Input from './Input'
import { ChatContext } from '../Context/ChatContext'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { AuthContext } from '../Context/AuthContext'

function Chat() {
  const {data}=useContext(ChatContext)
  return (
    <div className='chat'>
      <div className="chatInfo">
        <h3>{data.user?.displayName}</h3>
        <div className='chatIcons'>
          <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  )
}

export default Chat