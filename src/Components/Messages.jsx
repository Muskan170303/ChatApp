import React, { useContext, useEffect, useState } from 'react'
import Message from './Message'
import { ChatContext } from '../Context/ChatContext'
import {doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import hello from '../images/hello.jpg'
import sayhello from '../images/sayhello.png'

function Messages() {

  const [messages,setMessages]=useState([]);
  const {data}=useContext(ChatContext)

  useEffect(()=>{
    const unSub=onSnapshot(doc(db,"chats",data.chatId),(doc)=>{
      doc.exists() && setMessages(doc.data().messages);
    })

    return ()=>{unSub()};
  },[data.chatId])
  return (
    <div className='messages'>
      {(messages.length==0) ? 
        <div className='sayhello'><img src={sayhello} alt="hello" /></div>
      : messages.map(m=>(
        <Message message={m} key={m.id} />
      ))}
    </div>
  )
}

export default Messages