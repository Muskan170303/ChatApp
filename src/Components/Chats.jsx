import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Chats() {
  const [chats,setChats]=useState({});
  const {currUser,chatSelected, setChatSelection}= useContext(AuthContext)
  const {dispatch,data}=useContext(ChatContext)
  
  useEffect(()=>{
    const getChats=()=>{
      const unSub=onSnapshot(doc(db,"userChats",currUser.uid),(doc)=>{
        setChats(doc.data());
      });
      return()=>{unSub()};
    }
    currUser.uid && getChats();
  },[currUser.uid]);

  const handleSelect= async (u)=>{
    !chatSelected && setChatSelection(true) 
    // console.log(u); 
    await dispatch({type:"CHANGE_USER", payload:u})
    // console.log(data.chatId+".unread")
    ChangeRead(u)
  }
  // console.log(data.chatId)
  const ChangeRead= async(u)=>{
    let chatId = currUser.uid>u.uid
    ?currUser.uid+u.uid
    :u.uid+currUser.uid
      await updateDoc(doc(db,"userChats",currUser.uid),{
          [chatId+".unread"]:0 
      })
    // console.log(chatId+".unread")
  }
  

  return (
    <div className='chats'>
      {chats && Object.entries(chats)?.sort((a,b)=>b[1].date-a[1].date).map((chat)=>(
        <div className='userChat' key={chat[0]} onClick={()=>handleSelect(chat[1].userInfo)}>
          <img src={chat[1].userInfo.photoURL} alt="" />
          <div className='userChatInfo'>

            <div className='div1'>
              <span>{chat[1].userInfo.displayName}</span>
              <p>{chat[1].lastMessage? chat[1].lastMessage.text:""}</p>
            </div>
            <div className='div2'>
              <span className='time'><>{new Intl.DateTimeFormat('en-IS', {timeZone:"Asia/Kolkata",hour: '2-digit', minute: '2-digit'}).format(chat.date)}</></span>
              {/* <p><>{chat.unread?chat.unread:null}</></p> */}
              {chat[1].unread==0?null:<p><>{chat[1].unread}</></p>}
            </div>

          </div>
        </div>
      ))}
    </div>
  )
}

export default Chats