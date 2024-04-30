import { useEffect, useRef, useState } from 'react';

function AudioRecorderProcess() {
  const recorderNode = useRef(null);
  const [recordedData, setRecordedData] = useState([]);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    let audioContext = new AudioContext();

    async function initRecorder() {
      await audioContext.audioWorklet.addModule('./AudioRecorderProcess.jsx');
      recorderNode.current = new AudioWorkletNode(audioContext, 'audioRecorderProcessor');

      recorderNode.current.port.onmessage = (event) => {
        const { data } = event;
        if (data.type === 'data') {
          setRecordedData(data.data);
          setRecording(false);
        }
      };
    }

    initRecorder();

    return () => {
      if (audioContext) {
        audioContext.close();
        audioContext = null;
      }
    };
  }, []);

  const startRecording = () => {
    if (recorderNode.current) {
      recorderNode.current.port.postMessage({ type: 'start' });
      setRecording(true);
    }
  };

  const stopRecording = () => {
    if (recorderNode.current) {
      recorderNode.current.port.postMessage({ type: 'stop' });
    }
  };

  return { recorderNode, recordedData, recording, startRecording, stopRecording };
}

export default AudioRecorderProcess;
