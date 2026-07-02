// src/hooks/useRecording.js

import { useCallback, useRef, useState } from 'react';
import { MediaCompositor } from '../services/mediaCompositor';
import { uploadRecording } from '../services/meetingApi';

export function useRecording(meetingId) {
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const compositorRef = useRef(null);

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    } else {
      setIsRecording(false);
    }
  }, []);

  const startRecording = useCallback(
    (stream, screenStream) => {
      if (!stream || !stream.active || stream.getTracks().length === 0) {
        throw new Error('No active media stream to record.');
      }

      if (!compositorRef.current) {
        compositorRef.current = new MediaCompositor();
      }

      const combinedStream = compositorRef.current.start(stream, screenStream);

      const rec = new MediaRecorder(combinedStream, { mimeType: 'video/webm;codecs=vp8,opus' });
      recordedChunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      rec.onstop = async () => {
        setIsRecording(false);
        compositorRef.current?.stop();

        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const fileName = `recording_${new Date().toISOString().replace(/[:.]/g, '-')}.webm`;
        try {
          await uploadRecording(blob, meetingId, fileName);
        } catch (err) {
          console.error('Upload recording failed:', err);
          alert('Upload failed — the recording is lost.');
        }
      };
      rec.start(1000);
      recorderRef.current = rec;
      setIsRecording(true);
    },
    [meetingId],
  );

  const toggleRecording = useCallback(
    (stream, screenStream) => {
      if (isRecording) {
        stopRecording();
      } else {
        try {
          startRecording(stream, screenStream);
        } catch (err) {
          console.error('MediaRecorder error:', err);
          alert('Recording is not supported in this browser.');
        }
      }
    },
    [isRecording, startRecording, stopRecording],
  );

  return { isRecording, startRecording, stopRecording, toggleRecording };
}
