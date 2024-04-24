import React, { useContext, useState } from 'react'
import Img from '../images/img.png'
import Attach from '../images/attach.png'
import Send from '../images/plane.jpeg'
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';
import { FieldValue, Timestamp, arrayUnion, doc, increment, serverTimestamp, updateDoc } from 'firebase/firestore';
import {v4 as uuid} from "uuid"
import { db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';

function Input() {

  const [text,setText]=useState("");
  const [img,setImg]=useState(null);

  const {currUser}=useContext(AuthContext);
  const {data}=useContext(ChatContext);

  const handlekey=(e)=>{
    e.code === "Enter" && handleSend();
  }
  const handleSend=async(e)=>{
    if(img){
      const storageRef = ref(storage, uuid());
      
      uploadBytes(storageRef, img)
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        })
        .then(async (downloadURL) => {
          console.log("Download URL", downloadURL);
          await updateDoc(doc(db,"chats",data.chatId),{
            messages:arrayUnion({
              id:uuid(),
              text,
              senderId:currUser.uid,
              date:Timestamp.now(),
              img:downloadURL
            })
          })
        });

    }else{
      await updateDoc(doc(db,"chats",data.chatId),{
        messages:arrayUnion({
          id:uuid(),
          text,
          senderId:currUser.uid,
          date:new Date().getTime(),
        }),
      })
    }

    await updateDoc(doc(db,"userChats",currUser.uid),{
      [data.chatId+".lastMessage"]:{text},
      [data.chatId+".date"]:serverTimestamp()
    })
    await updateDoc(doc(db,"userChats",data.user.uid),{
      [data.chatId+".lastMessage"]:{text},
      [data.chatId+".date"]:serverTimestamp(),
      [data.chatId+".unread"]:increment(1)
    })
    console.log("increament")

    setText("");
    setImg(null);
  }

  return (
    <div className='input'>
      <input type="text" value={text} placeholder='Type something' onChange={e=>setText(e.target.value)} onKeyDown={handlekey} />
      <div className='send'>
        <img src={Img} alt="" />
        <input type="file" style={{display:'none'}} id="file" onChange={e=>setImg(e.target.files[0])} />
        <label htmlFor="file">
          <img src={Attach} alt="" />
        </label>
        
        <img className='button' onClick={handleSend} src={Send} alt="" />

      </div>
    </div>
  )
}

export default Input