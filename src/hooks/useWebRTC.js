// src/hooks/useWebRTC.js

import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
];

const getIceServers = () => {
  const env = import.meta.env.VITE_ICE_SERVERS;
  if (env) {
    try {
      return JSON.parse(env);
    } catch (e) {
      console.warn('Failed to parse VITE_ICE_SERVERS environment variable:', e);
    }
  }
  return DEFAULT_ICE_SERVERS;
};

const ICE_SERVERS = getIceServers();

export function useWebRTC({ connection, selfParticipantId, localStream, screenStream, registerSignalHandler }) {
  const [remoteStreams, setRemoteStreams] = useState([]);
  const peersRef = useRef(new Map());
  const remoteStreamsRef = useRef([]);
  const stableSelfId = useRef(selfParticipantId);
  stableSelfId.current = selfParticipantId;

  const getOrCreatePeerState = useCallback((remoteId) => {
    const existing = peersRef.current.get(remoteId);
    if (existing) return existing;

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    pc.addTransceiver('audio', { direction: 'sendrecv' });
    pc.addTransceiver('video', { direction: 'sendrecv' });
    pc.addTransceiver('video', { direction: 'sendrecv' });

    const state = {
      pc,
      makingOffer: false,
      ignoreOffer: false,
      pendingCandidates: [],
    };

    pc.onnegotiationneeded = async () => {
      if (!connection) return;
      try {
        state.makingOffer = true;
        await pc.setLocalDescription();
        const msg = {
          type: 'offer',
          to: remoteId,
          sdp: pc.localDescription?.sdp,
        };
        await connection.invoke('SendSignal', remoteId, msg);
      } catch (err) {
        console.error(`[WebRTC] negotiationneeded error for ${remoteId}:`, err);
      } finally {
        state.makingOffer = false;
      }
    };

    pc.onicecandidate = (ev) => {
      if (ev.candidate && connection) {
        connection.invoke('SendSignal', remoteId, {
          type: 'candidate',
          to: remoteId,
          candidate: ev.candidate.toJSON(),
        }).catch(() => {});
      }
    };

    pc.ontrack = (ev) => {
      const transceivers = pc.getTransceivers();
      const index = transceivers.indexOf(ev.transceiver);
      const id = index === 2 ? `${remoteId}-screen` : remoteId;

      setRemoteStreams((prev) => {
        const idx = prev.findIndex((r) => r.participantId === id);
        if (idx !== -1) {
          const existingStream = prev[idx].stream;
          if (!existingStream.getTrackById(ev.track.id)) {
            existingStream.addTrack(ev.track);
          }
          return prev;
        }
        const stream = new MediaStream([ev.track]);
        return [...prev, { participantId: id, stream }];
      });
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        closePeerInner(remoteId);
      }
    };

    peersRef.current.set(remoteId, state);
    return state;
  }, [connection]);

  const syncTracks = useCallback(() => {
    const audioTrack = localStream?.getAudioTracks()[0] || null;
    const videoTrack = localStream?.getVideoTracks()[0] || null;
    const screenTrack = screenStream?.getVideoTracks()[0] || null;

    peersRef.current.forEach((state) => {
      const { pc } = state;
      const transceivers = pc.getTransceivers();
      if (transceivers.length < 3) return;

      if (transceivers[0].sender.track !== audioTrack) {
        transceivers[0].sender.replaceTrack(audioTrack).catch(() => {});
      }
      if (transceivers[1].sender.track !== videoTrack) {
        transceivers[1].sender.replaceTrack(videoTrack).catch(() => {});
      }
      if (transceivers[2].sender.track !== screenTrack) {
        transceivers[2].sender.replaceTrack(screenTrack).catch(() => {});
      }
    });
  }, [localStream, screenStream]);

  useEffect(() => {
    syncTracks();
  }, [syncTracks]);

  const closePeerInner = useCallback((remoteId) => {
    const state = peersRef.current.get(remoteId);
    if (state) {
      state.pc.close();
      peersRef.current.delete(remoteId);
    }

    const filtered = remoteStreamsRef.current.filter((r) => !r.participantId.startsWith(remoteId));
    remoteStreamsRef.current = filtered;
    setRemoteStreams(filtered);
  }, []);

  const closePeer = useCallback((remoteId) => {
    closePeerInner(remoteId);
  }, [closePeerInner]);

  useEffect(() => {
    if (!connection || !selfParticipantId) return;

    const handler = async (msg) => {
      const remoteId = msg.from;
      if (!remoteId) return;

      const state = getOrCreatePeerState(remoteId);
      const { pc } = state;
      const polite = (stableSelfId.current || '') < remoteId;

      try {
        if (msg.type === 'offer' && msg.sdp) {
          const offerCollision = state.makingOffer || pc.signalingState !== 'stable';
          state.ignoreOffer = !polite && offerCollision;
          if (state.ignoreOffer) return;

          await pc.setRemoteDescription({ type: 'offer', sdp: msg.sdp });

          for (const c of state.pendingCandidates) {
            await pc.addIceCandidate(c).catch(() => {});
          }
          state.pendingCandidates = [];

          await pc.setLocalDescription();
          const reply = {
            type: 'answer',
            to: remoteId,
            sdp: pc.localDescription?.sdp,
          };
          await connection.invoke('SendSignal', remoteId, reply);

        } else if (msg.type === 'answer' && msg.sdp) {
          await pc.setRemoteDescription({ type: 'answer', sdp: msg.sdp });

          for (const c of state.pendingCandidates) {
            await pc.addIceCandidate(c).catch(() => {});
          }
          state.pendingCandidates = [];

        } else if (msg.type === 'candidate' && msg.candidate) {
          if (pc.remoteDescription?.type) {
            await pc.addIceCandidate(msg.candidate).catch((e) => {
              if (!state.ignoreOffer) {
                console.warn(`[WebRTC] addIceCandidate error for ${remoteId}:`, e);
              }
            });
          } else {
            state.pendingCandidates.push(msg.candidate);
          }
        }
      } catch (err) {
        console.error(`[WebRTC] Error handling signal from ${remoteId}:`, err);
      }
    };

    registerSignalHandler(handler);
  }, [connection, selfParticipantId, getOrCreatePeerState, registerSignalHandler]);

  const connectToParticipant = useCallback(
    async (remoteId) => {
      if (!selfParticipantId || remoteId === selfParticipantId) return;
      if (peersRef.current.has(remoteId)) return;
      getOrCreatePeerState(remoteId);
    },
    [selfParticipantId, getOrCreatePeerState],
  );

  const replaceOutgoingVideoTrack = useCallback((newTrack) => {
    peersRef.current.forEach((state) => {
      const transceivers = state.pc.getTransceivers();
      if (transceivers[1]) {
        transceivers[1].sender.replaceTrack(newTrack).catch(() => {});
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      peersRef.current.forEach((state) => state.pc.close());
      peersRef.current.clear();
      remoteStreamsRef.current = [];
    };
  }, []);

  return { remoteStreams, connectToParticipant, closePeer, replaceOutgoingVideoTrack };
}
