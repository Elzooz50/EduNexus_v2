// src/hooks/useMeetingHub.js

import { HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HubEvents } from '../services/meetingEvents';
import { getAuthToken } from '../services/authStorage';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://edunexus.runasp.net/api';

export function useMeetingHub(handlersIn) {
  const [connection, setConnection] = useState(null);
  const [connectionState, setConnectionState] = useState(HubConnectionState.Disconnected);
  const handlersRef = useRef(handlersIn);
  handlersRef.current = handlersIn;

  const buildConnection = useCallback(() => {
    const conn = new HubConnectionBuilder()
      .withUrl(`${API_BASE}/meetingHub`, {
        accessTokenFactory: () => getAuthToken() || '',
      })
      .withServerTimeout(60000)
      .withKeepAliveInterval(15000)
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Warning)
      .build();

    const bind = (event, key) => {
      conn.on(event, (...args) => {
        const fn = handlersRef.current[key];
        if (fn) fn(...args);
      });
    };

    bind(HubEvents.ParticipantJoined, 'onParticipantJoined');
    bind(HubEvents.ParticipantLeft, 'onParticipantLeft');
    bind(HubEvents.ExistingParticipants, 'onExistingParticipants');
    bind(HubEvents.ReceiveSignal, 'onReceiveSignal');
    bind(HubEvents.ReceiveScreenSharingSignal, 'onReceiveScreenSharingSignal');
    bind(HubEvents.ReceiveChatMessage, 'onReceiveChatMessage');
    bind(HubEvents.ReceiveMessage, 'onReceiveMessage');
    bind(HubEvents.ParticipantAudioToggled, 'onParticipantAudioToggled');
    bind(HubEvents.ParticipantVideoToggled, 'onParticipantVideoToggled');
    bind(HubEvents.ScreenSharingStarted, 'onScreenSharingStarted');
    bind(HubEvents.ScreenSharingStopped, 'onScreenSharingStopped');
    bind(HubEvents.UserScreenSharing, 'onUserScreenSharing');
    bind(HubEvents.ParticipantHandRaised, 'onParticipantHandRaised');
    bind(HubEvents.ParticipantReaction, 'onParticipantReaction');
    bind(HubEvents.ParticipantKicked, 'onParticipantKicked');
    bind(HubEvents.YouWereKicked, 'onYouWereKicked');
    bind(HubEvents.AllParticipantsMuted, 'onAllParticipantsMuted');
    bind(HubEvents.MeetingEnded, 'onMeetingEnded');
    bind(HubEvents.MeetingLockToggled, 'onMeetingLockToggled');
    bind(HubEvents.ChatToggled, 'onChatToggled');
    bind(HubEvents.QuizStarted, 'onQuizStarted');
    bind(HubEvents.QuizEnded, 'onQuizEnded');
    bind(HubEvents.QuizResultsUpdated, 'onQuizResultsUpdated');
    bind(HubEvents.LectureMaterialAttached, 'onLectureMaterialAttached');
    bind(HubEvents.SfuProducerCreated, 'onSfuProducerCreated');
    bind(HubEvents.SfuProducerClosed, 'onSfuProducerClosed');

    return conn;
  }, []);

  useEffect(() => {
    let stopped = false;

    const conn = buildConnection();

    conn.onreconnecting(() => {
      setConnectionState(HubConnectionState.Reconnecting);
    });

    conn.onreconnected(() => {
      setConnection(conn);
      setConnectionState(HubConnectionState.Connected);
    });

    conn.onclose(() => {
      setConnection(null);
      setConnectionState(HubConnectionState.Disconnected);
    });

    conn
      .start()
      .then(() => {
        if (stopped) {
          conn.stop();
          return;
        }
        setConnection(conn);
        setConnectionState(HubConnectionState.Connected);
      })
      .catch((err) => {
        if (!stopped) console.error('MeetingHub connection failed:', err);
      });

    return () => {
      stopped = true;
      conn.stop().catch(() => {});
    };
  }, [buildConnection]);

  return { connection, connectionState };
}
