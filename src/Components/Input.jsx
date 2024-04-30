import React, { useContext, useState,useRef } from 'react'
import Img from '../images/img.png'
import Attach from '../images/attach.png'
import Send from '../images/plane.jpeg'
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';
import { FieldValue, Timestamp, arrayUnion, doc, increment, serverTimestamp, updateDoc } from 'firebase/firestore';
import {v4 as uuid} from "uuid"
import { db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import vmsg from 'vmsg';

function Input() {

  const [text,setText]=useState("");
  const [img,setImg]=useState(null);

  const {currUser}=useContext(AuthContext);
  const {data}=useContext(ChatContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const recorderRef = useRef(new vmsg.Recorder({
    wasmURL: 'https://unpkg.com/vmsg@0.3.0/vmsg.wasm',
  }));

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
              date:new Date().getTime(),
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
    // console.log("increament")

    setText("");
    setImg(null);
    
  }
  const record=async(e)=>{
    setIsLoading(true);

    if (isRecording) {
      try {
        const blob = await recorderRef.current.stopRecording();
        setRecordings([...recordings, URL.createObjectURL(blob)]);
        setIsRecording(false);
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    } else {
      try {
        await recorderRef.current.initAudio();
        await recorderRef.current.initWorker();
        recorderRef.current.startRecording();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    }
    setIsLoading(false);
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
        <button onClick={record} disabled={isLoading}>
        {isRecording ? 'Stop' : 'Record'}
        
        </button>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {recordings.map((url, index) => (
          <li key={index}>
            <audio src={url} controls />
          </li>
        ))}
      </ul>
        <img className='button' onClick={handleSend} src={Send} alt="" />

      </div>
    </div>
  )
}

export default Input



// import React, { useState, useContext, useRef } from 'react';
// import Img from '../images/img.png';
// import Attach from '../images/attach.png';
// import Send from '../images/plane.jpeg';
// import { AuthContext } from '../Context/AuthContext';
// import { ChatContext } from '../Context/ChatContext';
// import { FieldValue, Timestamp, arrayUnion, doc, increment, serverTimestamp, updateDoc } from 'firebase/firestore';
// import { v4 as uuid } from 'uuid';
// import { db, storage } from '../firebase';
// import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
// import vmsg from 'vmsg';

// function Input() {
//   const [text, setText] = useState('');
//   const [img, setImg] = useState(null);

//   const { currUser } = useContext(AuthContext);
//   const { data } = useContext(ChatContext);

//   const [isLoading, setIsLoading] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordings, setRecordings] = useState([]);
//   const recorderRef = useRef(null);


//   const initializeRecorder = async () => {
//     try {
//       if (!recorderRef.current) {
//         const Recorder = vmsg.Recorder;
//         if (typeof Recorder === 'function') {
//           // Check if Recorder is a class constructor
//           recorderRef.current = new Recorder({
//             wasmURL: 'https://unpkg.com/vmsg@0.3.0/vmsg.wasm',
//           });
//         } else {
//           throw new Error('Failed to initialize Recorder.');
//         }
//       }
//     } catch (error) {
//       console.error('Error initializing recorder:', error);
//     }
//   };
  
  
  

//   const handleKey = (e) => {
//     e.code === 'Enter' && handleSend();
//   };

//   const updateChatMessages = async (messageData) => {
//     // Update chat messages logic goes here
//     try {
//       await updateDoc(doc(db, 'chats', data.chatId), {
//         messages: arrayUnion({
//           id: uuid(),
//           senderId: currUser.uid,
//           date: new Date().getTime(),
//           ...messageData,
//         }),
//       });

//       await updateDoc(doc(db, 'userChats', currUser.uid), {
//         [`${data.chatId}.lastMessage`]: { text },
//         [`${data.chatId}.date`]: serverTimestamp(),
//       });

//       await updateDoc(doc(db, 'userChats', data.user.uid), {
//         [`${data.chatId}.lastMessage`]: { text },
//         [`${data.chatId}.date`]: serverTimestamp(),
//         [`${data.chatId}.unread`]: increment(1),
//       });
//     } catch (error) {
//       console.error('Error updating chat messages:', error);
//     }
//   };

//   const handleSend = async () => {
//     try {
//       if (recordings.length > 0) {
//         const uploadPromises = recordings.map(async (recording) => {
//           const storageRef = ref(storage, uuid());
//           const recordingBlob = await fetch(recording).then((res) => res.blob());
//           await uploadBytes(storageRef, recordingBlob);
//           return getDownloadURL(storageRef);
//         });
//         const downloadURLs = await Promise.all(uploadPromises);
        
//         // Update chat messages with audio URLs
//         await updateChatMessages({ text, audio: downloadURLs });
//       } else {
//         // Handle sending text messages
//         await updateChatMessages({ text });
//       }
  
//       // Reset input fields after sending
//       resetInputs();
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   const resetInputs = () => {
//     setText('');
//     setImg(null);
//     setRecordings([]);
//     setIsRecording(false);
//   };

//   const record = async () => {
//     setIsLoading(true);
  
//     try {
//       await initializeRecorder();
  
//       if (recorderRef.current) {
//         if (isRecording) {
//           const blob = await recorderRef.current.stopRecording();
//           setRecordings([...recordings, URL.createObjectURL(blob)]);
//           setIsRecording(false);
//         } else {
//           await recorderRef.current.initAudio();
//           await recorderRef.current.initWorker();
//           await recorderRef.current.startRecording();
//           setIsRecording(true);
//         }
//       } else {
//         console.error('Recorder not initialized properly.');
//       }
//     } catch (error) {
//       console.error('Error recording:', error);
//     }
  
//     setIsLoading(false);
//   };
  

  
  

//   return (
//     <div className='input'>
//       <input type="text" value={text} placeholder='Type something' onChange={e => setText(e.target.value)} onKeyDown={handleKey} />
//       <div className='send'>
//         <img src={Img} alt="" />
//         <input type="file" style={{ display: 'none' }} id="file" onChange={e => setImg(e.target.files[0])} />
//         <label htmlFor="file">
//           <img src={Attach} alt="" />
//         </label>

//         <button onClick={record} disabled={isLoading}>
//           {isRecording ? 'Stop' : 'Record'}
//         </button>

//         <ul style={{ listStyle: 'none', padding: 0 }}>
//           {recordings.map((url, index) => (
//             <li key={index}>
//               <audio src={url} controls />
//             </li>
//           ))}
//         </ul>
//         <img className='button' onClick={handleSend} src={Send} alt="" />
//       </div>
//     </div>
//   );
// }

// export default Input;
