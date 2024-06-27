import React, { useCallback, useRef, useState,useContext } from 'react';
import Webcam from 'react-webcam';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from 'uuid';
import { AuthContext } from '../Context/AuthContext';

const videoConstraints = {
  width: 540,
  facingMode: 'environment',
};

const Camera = () => {
  const webcamRef = useRef(null);
  const [url, setUrl] = useState(null);
  const { currUser, data } = useContext(AuthContext); // Ensure you have access to these contexts

  const capturePhoto = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
  
    // Upload the image to Firebase Storage
    const storageRef = ref(storage, uuid());
    uploadBytes(storageRef, imageSrc, { contentType: 'image/png' })
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then(async (downloadURL) => {
        console.log('Download URL', downloadURL);
        // Check if data and chatId are defined
        if (data && data.chatId) {
          // Update Firestore with the image URL
          await updateDoc(doc(db, 'chats', data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text: '', // Set text as empty since it's an image
              senderId: currUser.uid,
              date: new Date().getTime(),
              img: downloadURL,
            }),
          });
        } else {
          console.error('Error: data or chatId is undefined.');
        }
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
      });
  }, [webcamRef, currUser, data]);
  

  return (
    <>
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat='image/png'
        videoConstraints={videoConstraints}
      />
      <button onClick={capturePhoto}>Capture</button>
      {url && <img src={url} alt="Captured Image" />}
      {/* Add code to display the captured image */}
    </>
  );
};

export default Camera;
