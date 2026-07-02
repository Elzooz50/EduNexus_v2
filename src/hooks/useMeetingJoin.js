// src/hooks/useMeetingJoin.js

import { useEffect, useRef, useState } from 'react';
import { HubConnectionState } from '@microsoft/signalr';

export function useMeetingJoin({
  connection,
  connectionState,
  user,
  meetingId,
  createIfMissing,
  displayName,
  mediaAudioEnabled,
  mediaVideoEnabled,
  upsertParticipant,
}) {
  const [selfParticipantId, setSelfParticipantId] = useState(null);
  const [hostId, setHostId] = useState(null);
  const [joinError, setJoinError] = useState(null);
  const joinAttemptedRef = useRef(false);

  useEffect(() => {
    if (!connection || connectionState !== HubConnectionState.Connected) return;
    if (!user?.email) return;
    if (joinAttemptedRef.current) return;
    joinAttemptedRef.current = true;

    const go = async () => {
      try {
        if (createIfMissing) {
          const res = await connection.invoke(
            'CreateMeeting',
            displayName || `${user.name}'s meeting`,
            user.email,
          );
          if (res?.meetingId) {
            setHostId(res.hostId ?? null);
            setSelfParticipantId(user.id);
            upsertParticipant({
              participantId: user.id,
              fullName: user.name,
              isAudioEnabled: mediaAudioEnabled,
              isVideoEnabled: mediaVideoEnabled,
              isScreenSharing: false,
              isHandRaised: false,
            });
          }
        } else {
          await connection.invoke('JoinMeeting', meetingId, user.email);
          setSelfParticipantId(user.id);
          upsertParticipant({
            participantId: user.id,
            fullName: user.name,
            isAudioEnabled: mediaAudioEnabled,
            isVideoEnabled: mediaVideoEnabled,
            isScreenSharing: false,
            isHandRaised: false,
          });
        }
      } catch (err) {
        setJoinError(err instanceof Error ? err.message : String(err));
      }
    };
    go();
  }, [connection, connectionState, user, meetingId, createIfMissing, displayName, upsertParticipant, mediaAudioEnabled, mediaVideoEnabled]);

  return { selfParticipantId, hostId, joinError };
}
