// src/hooks/useSFU.js

import { useCallback, useEffect, useRef, useState } from 'react';
import * as mediasoupClient from 'mediasoup-client';
import { HubEvents } from '../services/meetingEvents';

const SFU_BASE_URL = import.meta.env.VITE_SFU_URL || 'http://localhost:3001';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://edunexus.runasp.net/api';

export function useSFU({ connection, selfParticipantId, localStream, screenStream, meetingId }) {
  const [remoteStreams, setRemoteStreams] = useState([]);
  const remoteStreamsRef = useRef([]);

  const deviceRef = useRef(null);
  const sendTransportRef = useRef(null);
  const recvTransportRef = useRef(null);
  const producersRef = useRef(new Map());
  const consumersRef = useRef(new Map());
  const initializedRef = useRef(false);
  const [sfuReady, setSfuReady] = useState(false);
  const sfuApiCallRef = useRef(null);
  const prevScreenStreamRef = useRef(null);

  const apiCall = useCallback(async (path, body, method = 'POST') => {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API ${path} failed: ${res.status} ${text}`);
    }

    return res.json();
  }, []);

  const consumeProducer = useCallback(async (producer, sfuApiCall) => {
    const device = deviceRef.current;
    const recvTransport = recvTransportRef.current;
    if (!device || !recvTransport) return;

    if (producer.participantId === selfParticipantId) return;

    try {
      const consumerData = await sfuApiCall(`/api/rooms/${meetingId}/consumers`, {
        participantId: selfParticipantId,
        producerId: producer.producerId,
        rtpCapabilities: device.rtpCapabilities,
      });

      const consumer = await recvTransport.consume({
        id: consumerData.id,
        producerId: consumerData.producerId,
        kind: consumerData.kind,
        rtpParameters: consumerData.rtpParameters,
      });

      consumersRef.current.set(consumerData.producerId, { consumer, participantId: producer.participantId });

      const streamId = producer.kind === 'video' && (producer.appData?.source === 'screen')
        ? `${producer.participantId}-screen`
        : producer.participantId;

      setRemoteStreams((prev) => {
        const existing = prev.find((r) => r.participantId === streamId);
        if (existing) {
          const track = consumer.track;
          if (!existing.stream.getTrackById(track.id)) {
            existing.stream.addTrack(track);
          }
          return prev;
        }
        const stream = new MediaStream([consumer.track]);
        console.log('[SFU] Remote streams updated:', prev.length + 1, 'streams');
        return [...prev, { participantId: streamId, stream }];
      });
    } catch (err) {
      console.error('[SFU] Failed to consume producer:', err);
    }
  }, [meetingId, selfParticipantId]);

  const closeConsumer = useCallback((streamId) => {
    const entriesToRemove = [];
    consumersRef.current.forEach((entry, producerId) => {
      if (entry.participantId === streamId) {
        entry.consumer.close();
        entriesToRemove.push(producerId);
      }
    });
    entriesToRemove.forEach(id => consumersRef.current.delete(id));

    setRemoteStreams((prev) => {
      const filtered = prev.filter((r) => r.participantId !== streamId);
      remoteStreamsRef.current = filtered;
      return filtered;
    });
  }, []);

  const produceTracks = useCallback(async () => {
    const sendTransport = sendTransportRef.current;
    console.log('[SFU] produceTracks called', {
      hasSendTransport: !!sendTransport,
      hasLocalStream: !!localStream,
      audioTracks: localStream?.getAudioTracks().length,
      videoTracks: localStream?.getVideoTracks().length,
      selfParticipantId,
    });
    if (!sendTransport) return;

    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack && !producersRef.current.has(`audio-${selfParticipantId}`)) {
        try {
          const producer = await sendTransport.produce({ track: audioTrack, appData: { source: 'mic' } });
          producersRef.current.set(`audio-${selfParticipantId}`, producer);
          console.log('[SFU] Audio producer created:', producer.id);
        } catch (err) {
          console.error('[SFU] Failed to produce audio:', err);
        }
      }

      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack && !producersRef.current.has(`video-${selfParticipantId}`)) {
        try {
          const producer = await sendTransport.produce({ track: videoTrack, appData: { source: 'camera' } });
          producersRef.current.set(`video-${selfParticipantId}`, producer);
          console.log('[SFU] Video producer created:', producer.id);
        } catch (err) {
          console.error('[SFU] Failed to produce video:', err);
        }
      }
    }

    if (screenStream) {
      const screenTrack = screenStream.getVideoTracks()[0];
      if (screenTrack && !producersRef.current.has(`screen-${selfParticipantId}`)) {
        try {
          const producer = await sendTransport.produce({ track: screenTrack, appData: { source: 'screen' } });
          producersRef.current.set(`screen-${selfParticipantId}`, producer);
          console.log('[SFU] Screen producer created:', producer.id);
        } catch (err) {
          console.error('[SFU] Failed to produce screen:', err);
        }
      }
    }
  }, [localStream, screenStream, selfParticipantId]);

  const initializeSFU = useCallback(async () => {
    if (!meetingId || !selfParticipantId || initializedRef.current) return;

    try {
      const joinResponse = await apiCall(`/api/sfu/join/${meetingId}`, {
        participantId: selfParticipantId,
      });

      const { token, sfuBaseUrl, joinResponse: sfu } = joinResponse;
      localStorage.setItem('sfuToken', token);

      const sfuApiCall = async (path, body) => {
        const res = await fetch(`${sfuBaseUrl}${path}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`SFU ${path} failed: ${res.status} ${text}`);
        }
        return res.json();
      };

      sfuApiCallRef.current = sfuApiCall;

      const device = new mediasoupClient.Device();
      deviceRef.current = device;

      await device.load({ routerRtpCapabilities: sfu.rtpCapabilities });

      const sendTransport = device.createSendTransport(sfu.sendTransport);
      sendTransportRef.current = sendTransport;

      sendTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          await sfuApiCall(`/api/rooms/${meetingId}/transports/${sfu.sendTransport.id}/connect-send`, {
            participantId: selfParticipantId,
            dtlsParameters,
          });
          callback();
        } catch (error) {
          errback(error);
        }
      });

      sendTransport.on('produce', async ({ kind, rtpParameters, appData }, callback, errback) => {
        try {
          const res = await sfuApiCall(`/api/rooms/${meetingId}/producers`, {
            participantId: selfParticipantId,
            kind,
            rtpParameters,
            appData,
          });
          callback({ id: res.id });
        } catch (error) {
          errback(error);
        }
      });

      const recvTransport = device.createRecvTransport(sfu.recvTransport);
      recvTransportRef.current = recvTransport;

      recvTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          await sfuApiCall(`/api/rooms/${meetingId}/transports/${sfu.recvTransport.id}/connect-recv`, {
            participantId: selfParticipantId,
            dtlsParameters,
          });
          callback();
        } catch (error) {
          errback(error);
        }
      });

      initializedRef.current = true;
      setSfuReady(true);

      for (const producer of sfu.existingProducers || []) {
        await consumeProducer(producer, sfuApiCall);
      }
    } catch (err) {
      console.error('[SFU] Failed to initialize:', err);
    }
  }, [meetingId, selfParticipantId, connection, apiCall, consumeProducer]);

  useEffect(() => {
    if (sfuReady && (localStream || screenStream)) {
      produceTracks();
    }
  }, [sfuReady, localStream, screenStream, produceTracks]);

  useEffect(() => {
    const wasSharing = prevScreenStreamRef.current !== null;
    const isSharing = screenStream !== null;
    prevScreenStreamRef.current = screenStream;

    if (wasSharing && !isSharing && selfParticipantId) {
      const screenKey = `screen-${selfParticipantId}`;
      const producer = producersRef.current.get(screenKey);

      if (producer && meetingId) {
        producersRef.current.delete(screenKey);

        const token = localStorage.getItem('accessToken');
        fetch(`${API_BASE_URL}/api/sfu/close-producer/${meetingId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            participantId: selfParticipantId,
            producerId: producer.id,
          }),
        }).catch((err) => {
          console.error('[SFU] Failed to close screen producer via backend:', err);
        });

        try { producer.close(); } catch (err) { console.warn('Failed to close producer:', err); }
      } else if (producer) {
        producersRef.current.delete(screenKey);
        try { producer.close(); } catch (err) { console.warn('Failed to close producer:', err); }
      }
    }
  }, [screenStream, selfParticipantId, meetingId]);

  useEffect(() => {
    if (!connection || !meetingId) return;

    const handleSfuProducerCreated = async (data) => {
      const sfuApiCall = sfuApiCallRef.current;
      if (!sfuApiCall) return;
      await consumeProducer(
        { producerId: data.producerId, participantId: data.participantId, kind: data.kind, appData: data.appData || {} },
        sfuApiCall
      );
    };

    const handleSfuProducerClosed = (data) => {
      const isScreen = data.appData?.source === 'screen';
      const streamId = isScreen ? `${data.participantId}-screen` : data.participantId;
      closeConsumer(streamId);
    };

    connection.on(HubEvents.SfuProducerCreated, handleSfuProducerCreated);
    connection.on(HubEvents.SfuProducerClosed, handleSfuProducerClosed);

    return () => {
      connection.off(HubEvents.SfuProducerCreated, handleSfuProducerCreated);
      connection.off(HubEvents.SfuProducerClosed, handleSfuProducerClosed);
    };
  }, [connection, meetingId, consumeProducer, closeConsumer]);

  useEffect(() => {
    return () => {
      sendTransportRef.current?.close();
      recvTransportRef.current?.close();
      producersRef.current.forEach((p) => p.close());
      consumersRef.current.forEach(({ consumer }) => consumer.close());
      producersRef.current.clear();
      consumersRef.current.clear();
      remoteStreamsRef.current = [];
    };
  }, []);

  return { remoteStreams, initializeSFU };
}
