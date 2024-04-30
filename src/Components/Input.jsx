// import React, { useContext, useState,useRef } from 'react'
// import Img from '../images/img.png'
// import Attach from '../images/attach.png'
// import Send from '../images/plane.jpeg'
// import { AuthContext } from '../Context/AuthContext';
// import { ChatContext } from '../Context/ChatContext';
// import { FieldValue, Timestamp, arrayUnion, doc, increment, serverTimestamp, updateDoc } from 'firebase/firestore';
// import {v4 as uuid} from "uuid"
// import { db, storage } from '../firebase';
// import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
// import vmsg from 'vmsg';

// function Input() {

//   const [text,setText]=useState("");
//   const [img,setImg]=useState(null);

//   const {currUser}=useContext(AuthContext);
//   const {data}=useContext(ChatContext);

//   const [isLoading, setIsLoading] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordings, setRecordings] = useState([]);
//   const recorderRef = useRef(new vmsg.Recorder({
//     wasmURL: 'https://unpkg.com/vmsg@0.3.0/vmsg.wasm',
//   }));

//   const handlekey=(e)=>{
//     e.code === "Enter" && handleSend();
//   }
//   const handleSend=async(e)=>{
//     if(img){
//       const storageRef = ref(storage, uuid());
      
//       uploadBytes(storageRef, img)
//         .then((snapshot) => {
//           return getDownloadURL(snapshot.ref);
//         })
//         .then(async (downloadURL) => {
//           console.log("Download URL", downloadURL);
//           await updateDoc(doc(db,"chats",data.chatId),{
//             messages:arrayUnion({
//               id:uuid(),
//               text,
//               senderId:currUser.uid,
//               date:new Date().getTime(),
//               img:downloadURL
//             })
//           })
//         });

//     }else{
//       await updateDoc(doc(db,"chats",data.chatId),{
//         messages:arrayUnion({
//           id:uuid(),
//           text,
//           senderId:currUser.uid,
//           date:new Date().getTime(),
//         }),
//       })
//     }
//     await updateDoc(doc(db,"userChats",currUser.uid),{
//       [data.chatId+".lastMessage"]:{text},
//       [data.chatId+".date"]:serverTimestamp()
//     })
//     await updateDoc(doc(db,"userChats",data.user.uid),{
//       [data.chatId+".lastMessage"]:{text},
//       [data.chatId+".date"]:serverTimestamp(),
//       [data.chatId+".unread"]:increment(1)
//     })
//     // console.log("increament")

//     setText("");
//     setImg(null);
    
//   }
//   const record=async(e)=>{
//     setIsLoading(true);

//     if (isRecording) {
//       try {
//         const blob = await recorderRef.current.stopRecording();
//         setRecordings([...recordings, URL.createObjectURL(blob)]);
//         setIsRecording(false);
//       } catch (error) {
//         console.error('Error stopping recording:', error);
//       }
//     } else {
//       try {
//         await recorderRef.current.initAudio();
//         await recorderRef.current.initWorker();
//         recorderRef.current.startRecording();
//         setIsRecording(true);
//       } catch (error) {
//         console.error('Error starting recording:', error);
//       }
//     }
//     setIsLoading(false);
//   }

//   return (
//     <div className='input'>
//       <input type="text" value={text} placeholder='Type something' onChange={e=>setText(e.target.value)} onKeyDown={handlekey} />
//       <div className='send'>
//         <img src={Img} alt="" />
//         <input type="file" style={{display:'none'}} id="file" onChange={e=>setImg(e.target.files[0])} />
//         <label htmlFor="file">
//           <img src={Attach} alt="" />
//         </label>
//         <button onClick={record} disabled={isLoading}>
//         {isRecording ? 'Stop' : 'Record'}
        
//         </button>
//       <ul style={{ listStyle: 'none', padding: 0 }}>
//         {recordings.map((url, index) => (
//           <li key={index}>
//             <audio src={url} controls />
//           </li>
//         ))}
//       </ul>
//         <img className='button' onClick={handleSend} src={Send} alt="" />

//       </div>
//     </div>
//   )
// }

// export default Input
import React, { useContext, useState, useRef } from 'react';
import Img from '../images/img.png';
import Attach from '../images/attach.png';
import Send from '../images/plane.jpeg';
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';
import { doc, arrayUnion, serverTimestamp, updateDoc } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import vmsg from 'vmsg';

function Input() {
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);

  const { currUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const recorderRef = useRef(new vmsg.Recorder({ wasmURL: 'https://unpkg.com/vmsg@0.3.0/vmsg.wasm' }));

  const handleKey = (e) => {
    if (e.code === 'Enter') {
      handleSend();
    }
  };

  const handleSend = async () => {
    if (text.trim() === '' && !img && !recordings.length) {
      return; // Prevent sending empty messages
    }

    let messageData = {
      id: uuid(),
      senderId: currUser.uid,
      date: new Date().getTime(),
    };

    if (text.trim() !== '') {
      messageData.text = text.trim();
    }

    if (img) {
      const imgStorageRef = ref(storage, uuid()); // Generate a unique storage reference
      await uploadBytes(imgStorageRef, img).then((snapshot) => getDownloadURL(snapshot.ref)).then((downloadURL) => {
        messageData.img = downloadURL;
      });
    }

    if (recordings.length > 0) {
      const audioBlob = await fetch(recordings[0]).then((res) => res.blob()); // Fetch the audio blob
      const audioStorageRef = ref(storage, uuid()); // Generate a unique storage reference for audio
      await uploadBytes(audioStorageRef, audioBlob).then((snapshot) => getDownloadURL(snapshot.ref)).then((downloadURL) => {
        messageData.audio = downloadURL;
      });
    }

    await updateDoc(doc(db, 'chats', data.chatId), { messages: arrayUnion(messageData) });

    await updateDoc(doc(db, 'userChats', currUser.uid), {
      [`${data.chatId}.lastMessage`]: { text: text.trim() },
      [`${data.chatId}.date`]: serverTimestamp(),
    });

    await updateDoc(doc(db, 'userChats', data.user.uid), {
      [`${data.chatId}.lastMessage`]: { text: text.trim() },
      [`${data.chatId}.date`]: serverTimestamp(),
      [`${data.chatId}.unread`]: 1,
    });

    setText('');
    setImg(null);
    setRecordings([]);
  };

  const record = async () => {
    setIsLoading(true);

    if (isRecording) {
      try {
        const blob = await recorderRef.current.stopRecording();
        setRecordings([URL.createObjectURL(blob)]);
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
  };

  return (
    <div className="input">
      <input type="text" value={text} placeholder="Type something" onChange={(e) => setText(e.target.value)} onKeyDown={handleKey} />
      <div className="send">
        <img src={Img} alt="" />
        <input type="file" style={{ display: 'none' }} id="file" onChange={(e) => setImg(e.target.files[0])} />
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
        <img className="button" onClick={handleSend} src={Send} alt="" />
      </div>
    </div>
  );
}

export default Input;
