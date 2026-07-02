// src/hooks/useMediaStream.js

import { useCallback, useEffect, useRef, useState } from 'react';

export function useMediaStream() {
  const [stream, setStream] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [error, setError] = useState(null);
  const [screenStream, setScreenStream] = useState(null);

  const cameraStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const screenEndedHandlerRef = useRef(null);
  const audioEnabledRef = useRef(true);
  const videoEnabledRef = useRef(true);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
        });
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        cameraStreamRef.current = s;
        setStream(s);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(`Could not access camera/microphone: ${msg}`);
      }
    }

    init();
    return () => {
      cancelled = true;
      cameraStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      if (screenEndedHandlerRef.current) {
        screenEndedHandlerRef.current = null;
      }
    };
  }, []);

  const toggleAudio = useCallback(() => {
    const s = cameraStreamRef.current;
    if (!s) return;
    const next = !audioEnabledRef.current;
    audioEnabledRef.current = next;
    s.getAudioTracks().forEach((t) => (t.enabled = next));
    setAudioEnabled(next);
  }, []);

  const toggleVideo = useCallback(() => {
    const s = cameraStreamRef.current;
    if (!s) return;
    const next = !videoEnabledRef.current;
    videoEnabledRef.current = next;
    s.getVideoTracks().forEach((t) => (t.enabled = next));
    setVideoEnabled(next);
  }, []);

  const stopScreenShare = useCallback(async () => {
    const tracks = screenStreamRef.current?.getTracks();
    if (tracks) {
      tracks.forEach((t) => {
        t.removeEventListener('ended', stopScreenShare);
        t.stop();
      });
    }
    if (screenEndedHandlerRef.current) {
      screenEndedHandlerRef.current = null;
    }
    screenStreamRef.current = null;
    setScreenStream(null);
    setIsSharingScreen(false);
    return null;
  }, []);

  const startScreenShare = useCallback(async () => {
    try {
      const screen = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 15 } },
        audio: false,
      });
      screenStreamRef.current = screen;
      setScreenStream(screen);
      const [videoTrack] = screen.getVideoTracks();

      const onEnded = () => { stopScreenShare(); };
      screenEndedHandlerRef.current = onEnded;
      videoTrack.addEventListener('ended', onEnded);

      setIsSharingScreen(true);
      return videoTrack;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(`Could not start screen share: ${msg}`);
      return null;
    }
  }, [stopScreenShare]);

  return {
    stream,
    audioEnabled,
    videoEnabled,
    isSharingScreen,
    error,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    screenStream,
  };
}
