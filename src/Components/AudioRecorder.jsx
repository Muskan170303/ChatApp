// AudioRecorder.jsx
import React, { useEffect, useRef, useState } from 'react';
import recfile from './AudioRecorderProcess.jsx';

function AudioRecorder() {
  const recorderNode = useRef(null);
  const audioContext = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedData, setRecordedData] = useState([]);

  const handleWorkletMessage = (event) => {
    const { data } = event;
    if (data.type === 'data') {
      setRecordedData(data.data);
      setIsRecording(false);
    }
  };

  const startRecording = () => {
    if (recorderNode.current) {
      recorderNode.current.port.postMessage({ type: 'start' });
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recorderNode.current) {
      recorderNode.current.port.postMessage({ type: 'stop' });
    }
  };

  useEffect(() => {
    const initRecorder = async () => {
      audioContext.current = new AudioContext();
      await audioContext.current.audioWorklet.addModule(recfile);
      recorderNode.current = new AudioWorkletNode(audioContext.current, 'audioRecorderProcessor');
      recorderNode.current.port.onmessage = handleWorkletMessage;
      // Connect recorderNode to other nodes in your audio graph if needed
      // audioSourceNode.connect(recorderNode);
    };

    initRecorder();

    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      <div>
        {recordedData.length > 0 && (
          <audio controls>
            <source src={URL.createObjectURL(new Blob([new Float32Array(recordedData)]))} type="audio" />
          </audio>
        )}
      </div>
    </div>
  );
}

export default AudioRecorder;
