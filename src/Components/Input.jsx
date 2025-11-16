import React, { useContext, useState, useRef, useEffect } from 'react';
import Img from '../images/img.png';
import Camera from '../images/camera.png';
import Send from '../images/plane.jpeg';
import Rec from '../images/microphone.png'
import Rec_red from '../images/rec_red.png'
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';
import { doc, arrayUnion, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import vmsg from 'vmsg';
import CameraCapture from './CameraCapture';

function Input() {
  const [messageType, setMessageType] = useState('TEXT'); // {'TEXT', 'IMAGE', 'IMAGE_WITH_TEXT', 'AUDIO', 'DOCUMENT'}
  const [text, setText] = useState('');
  const [imgFile, setImgFile] = useState(null); // State to hold the selected image file
  const [imgUrl, setImgUrl] = useState(null); // State to hold the image URL for display

  const { currUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const recorderRef = useRef(new vmsg.Recorder({ wasmURL: 'https://unpkg.com/vmsg@0.3.0/vmsg.wasm' }));
  const [showCamera, setShowCamera] = useState(false); // State to manage camera open/close
  const [cameraCaptureData, setCameraCaptureData] = useState(null); // State to hold captured camera data
  const [sendButton, setSendButton] = useState(false);
  const [showSendOptions, setShowSendOptions] = useState(false);

  const handleKey = (e) => {
    if (e.code === 'Enter') {
      handleSend();
    }
  };

  const handleSend = async () => {
    if (text.trim() === '' && !imgFile && !recordings.length && !cameraCaptureData) {
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

    if (imgFile) {
      const imgStorageRef = ref(storage, uuid()); // Generate a unique storage reference
      await uploadBytes(imgStorageRef, imgFile).then((snapshot) => getDownloadURL(snapshot.ref)).then((downloadURL) => {
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

    if (cameraCaptureData) {
      messageData.img = cameraCaptureData; // Assuming cameraCaptureData holds the captured image or video URL
    }

    await updateDoc(doc(db, 'chats', data.chatId), { messages: arrayUnion(messageData) });

    await updateDoc(doc(db, 'userChats', currUser.uid), {
      [`${data.chatId}.lastMessage`]: { text: text.trim() },
      [`${data.chatId}.date`]: serverTimestamp(),
    });

    await updateDoc(doc(db, 'userChats', data.user.uid), {
      [`${data.chatId}.lastMessage`]: { text: text.trim() },
      [`${data.chatId}.date`]: serverTimestamp(),
      [`${data.chatId}.unread`]: increment(1),
    });

    setText('');
    setImgFile(null);
    setImgUrl(null);
    setRecordings([]);
    // Reset camera capture data
    setCameraCaptureData(null);
    setSendButton(false);
  };

  const record = async () => {
    setIsLoading(true);

    if (isRecording) {
      try {
        const blob = await recorderRef.current.stopRecording();
        setRecordings([URL.createObjectURL(blob)]);
        setIsRecording(false);
          setSendButton(true);
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

  const handleCapture = (data) => {
    if (data.startsWith('data:image')) {
      // If it's an image, set it as the image file and URL state
      setImgFile(data);
      setImgUrl(data); // Update imgUrl to display the captured image
      setCameraCaptureData(null); // Reset camera data
    } else if (data.startsWith('data:video')) {
      // If it's a video, send it as part of the message data
      setCameraCaptureData(data);
      setImgFile(null); // Reset image file data
    } else {
      // Handle other types of data, if needed
    }
    setShowCamera(false); // Close the camera
  };
  
  const toggleSendOptionPopup = () => {
    setShowSendOptions(!showSendOptions);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSendOptions && !event.target.closest('.send-options')) {
        setShowSendOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSendOptions]);

  const checkInput = (value) => {
    if(value.trim()!==''){
      setSendButton(true);
    }else{
      setSendButton(false);
    }
  }

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgFile(file);
        setImgUrl(reader.result);
      };
      reader.readAsDataURL(file);
      toggleSendOptionPopup();
      setSendButton(true);
    }
  };

  const clearRecording = () => {
    setRecordings([]);
    setSendButton(false);
  }

  return (
    <div className="input">
      <div className="send-options" onClick={toggleSendOptionPopup}>
        +
        <div className="send-option-popup" style={{ display: showSendOptions ? 'block' : 'none' }}>
          <div className="option" onClick={() => {toggleSendOptionPopup();return setShowCamera(true)}}>
            <img src={Camera} alt="" /> Camera
          </div>
          <label className="option" htmlFor="image">
            <img src={Img} alt="" /> Photo/Video
          </label>
          <input type="file" style={{ display: 'none' }} id="image" accept="image/*,video/*" onChange={handleImgChange} />

          <label className="option" htmlFor="document">
            <img src={Img} alt="" /> Document
          </label>
          <input type="file" style={{ display: 'none' }} id="document" onChange={handleImgChange} />
        </div>
      </div>
      <input type="text" value={text} placeholder="Type something" onChange={(e) => {checkInput(e.target.value);return setText(e.target.value)}} onKeyDown={handleKey} />
      <div className="send">
        <button id="rec" onClick={record} style={{display:"none"}} disabled={isLoading}></button>
        <label htmlFor="rec" className={`${sendButton ? 'btn-hidden' : 'btn-visible'}`}>
        {isRecording ? <img src={Rec_red} alt="" /> : <img src={Rec} alt="" />}
        </label>
        { recordings.length>0 && <span className="button" onClick={clearRecording}>X</span> }
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {recordings.map((url, index) => (
            <li key={index}>
              <audio src={url} controls />
            </li>
          ))}
        </ul>

        {imgUrl && <img src={imgUrl} alt="Selected Image" />}
 {/* Display the selected image */}
        {/* <img src={Camera} alt="Camera Icon" className="camera-icon" onClick={() => setShowCamera(!showCamera)} />
        <div className='camera-container'>
          {showCamera && <CameraCapture onClose={() => setShowCamera(false)} onCapture={handleCapture} />}
        </div> */}
        <img className={`button ${sendButton ? 'btn-visible' : 'btn-hidden'}`} onClick={handleSend} src={Send} alt="Send Message" />
      </div>
    </div>
  );
}

export default Input;
