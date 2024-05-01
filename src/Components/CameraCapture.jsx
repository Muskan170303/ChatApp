import React, { useEffect, useRef, useState } from 'react';

function CameraCapture({ onClose, onCapture }) {
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    const constraints = { video: true };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        mediaStreamRef.current = stream;
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error accessing webcam:', error);
        onClose(); // Notify parent component to close the camera
      });

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [onClose]);

  const handleCaptureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const capturedData = canvas.toDataURL('image/png');
      onCapture(capturedData); // Pass captured data to parent component
    }
  };

  const handleStartRecording = () => {
    if (mediaStreamRef.current) {
      mediaRecorderRef.current = new MediaRecorder(mediaStreamRef.current);
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      chunksRef.current.push(event.data);
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      chunksRef.current = [];
      onCapture(URL.createObjectURL(blob)); // Pass captured video URL to parent component
    }
  };

  const handleClose = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
    onClose(); // Notify parent component to close the camera
  };

  return (
    <div className="camera-capture">
      <video ref={videoRef} autoPlay />
      <button onClick={handleCaptureImage}>Capture Image</button>
      <button onClick={isRecording ? handleStopRecording : handleStartRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <button onClick={handleClose}>Close</button>
    </div>
  );
}

export default CameraCapture;
