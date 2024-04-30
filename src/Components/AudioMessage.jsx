import React from 'react';

function AudioMessage({ message }) {
  const handlePlay = () => {
    const audio = new Audio(message.audio); // Create an audio element with the audio URL
    audio.play(); // Play the audio
  };

  return (
    <div className="audio-message">
      <button onClick={handlePlay}>Play Audio</button>
    </div>
  );
}

export default AudioMessage;
