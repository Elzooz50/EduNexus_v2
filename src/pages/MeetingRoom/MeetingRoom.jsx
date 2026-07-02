// src/pages/MeetingRoom/MeetingRoom.jsx

import { useCallback, useEffect, useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { HubConnectionState } from '@microsoft/signalr';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { VideoGrid } from '../../components/Meeting/VideoGrid';
import { ControlBar } from '../../components/Meeting/ControlBar';
import { ChatPanel } from '../../components/Meeting/ChatPanel';
import { ParticipantsPanel } from '../../components/Meeting/ParticipantsPanel';
import { ReactionOverlay } from '../../components/Meeting/ReactionOverlay';
import { QuizPopup } from '../../components/Meeting/QuizPopup';
import { UploadMaterialButton } from '../../components/Meeting/UploadMaterialButton';
import { useMediaStream } from '../../hooks/useMediaStream';
import { useMeetingHub } from '../../hooks/useMeetingHub';
import { useSFU } from '../../hooks/useSFU';
import { MediaCompositor } from '../../services/mediaCompositor';
import { fetchChatHistory, uploadRecording } from '../../services/meetingApi';
import { useMeetingAuth } from '../../hooks/useMeetingAuth';

export default function MeetingRoom() {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  const [searchParams] = useSearchParams();
  const { user: meetingUser, isInstructor: iAmInstructor } = useMeetingAuth();

  const createIfMissing = searchParams.get('create') === '1' || searchParams.get('create') === 'true';
  const displayName = searchParams.get('name') || undefined;

  const [selfParticipantId, setSelfParticipantId] = useState(null);
  const [hostId, setHostId] = useState(null);
  const [participants, setParticipants] = useState(new Map());
  const [chatMessages, setChatMessages] = useState([]);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [meetingLocked, setMeetingLocked] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [reactions, setReactions] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [joinError, setJoinError] = useState(null);
  const [joinLocked, setJoinLocked] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [copied, setCopied] = useState(false);

  const recorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const compositorRef = useRef(null);
  const webrtcSignalHandlerRef = useRef(null);
  const chatMessagesRef = useRef([]);
  const sfuInitializedRef = useRef(false);

  const media = useMediaStream();

  const upsertParticipant = useCallback((p) => {
    setParticipants((prev) => {
      const next = new Map(prev);
      next.set(p.participantId, { ...next.get(p.participantId), ...p });
      return next;
    });
  }, []);

  const removeParticipant = useCallback((id) => {
    setParticipants((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const updateParticipantFlag = useCallback(
    (id, patch) => {
      setParticipants((prev) => {
        const next = new Map(prev);
        const existing = next.get(id);
        if (existing) next.set(id, { ...existing, ...patch });
        return next;
      });
    },
    [],
  );

  const pushReaction = useCallback((emoji, name) => {
    const id = `${Date.now()}-${Math.random()}`;
    const left = 15 + Math.random() * 70;
    setReactions((prev) => [...prev, { id, emoji, name, left }]);
  }, []);

  const handleCopyId = useCallback(() => {
    navigator.clipboard.writeText(meetingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [meetingId]);

  const appendChatMessage = useCallback((msg) => {
    chatMessagesRef.current = [...chatMessagesRef.current, msg];
    setChatMessages(chatMessagesRef.current);
  }, []);

  const hub = useMeetingHub({
    onParticipantJoined: useCallback((p) => {
      upsertParticipant({
        participantId: p.participantId,
        fullName: p.fullName,
        isAudioEnabled: p.isAudioEnabled ?? true,
        isVideoEnabled: p.isVideoEnabled ?? true,
        isScreenSharing: p.isScreenSharing ?? false,
        isHandRaised: p.isHandRaised ?? false,
      });
    }, [upsertParticipant]),
    onParticipantLeft: useCallback((p) => {
      const id = typeof p === 'string' ? p : p?.participantId;
      if (id) removeParticipant(id);
    }, [removeParticipant]),
    onExistingParticipants: useCallback((list) => {
      for (const p of list) {
        upsertParticipant({
          participantId: p.participantId,
          fullName: p.fullName,
          isAudioEnabled: p.isAudioEnabled ?? true,
          isVideoEnabled: p.isVideoEnabled ?? true,
          isScreenSharing: p.isScreenSharing ?? false,
          isHandRaised: p.isHandRaised ?? false,
        });
      }
    }, [upsertParticipant]),
    onReceiveSignal: useCallback((msg) => {
      webrtcSignalHandlerRef.current?.(msg);
    }, []),
    onReceiveScreenSharingSignal: useCallback((msg) => {
      webrtcSignalHandlerRef.current?.(msg);
    }, []),
    onReceiveChatMessage: useCallback((msg) => {
      appendChatMessage({
        senderDisplayName: msg.senderDisplayName ?? msg.SenderDisplayName,
        content: msg.content ?? msg.Content,
        sentAt: msg.sentAt ?? msg.SentAt ?? new Date().toISOString(),
      });
    }, [appendChatMessage]),
    onReceiveMessage: useCallback((msg) => {
      appendChatMessage({
        id: msg.id,
        senderId: msg.senderId,
        senderDisplayName: msg.senderDisplayName,
        content: msg.content,
        sentAt: msg.sentAt ?? new Date().toISOString(),
      });
    }, [appendChatMessage]),
    onParticipantAudioToggled: useCallback((id, enabled) => updateParticipantFlag(id, { isAudioEnabled: enabled }), [updateParticipantFlag]),
    onParticipantVideoToggled: useCallback((id, enabled) => updateParticipantFlag(id, { isVideoEnabled: enabled }), [updateParticipantFlag]),
    onScreenSharingStarted: useCallback((id) => updateParticipantFlag(id, { isScreenSharing: true }), [updateParticipantFlag]),
    onScreenSharingStopped: useCallback((id) => updateParticipantFlag(id, { isScreenSharing: false }), [updateParticipantFlag]),
    onParticipantHandRaised: useCallback((p) => updateParticipantFlag(p.participantId, { isHandRaised: p.raised }), [updateParticipantFlag]),
    onParticipantReaction: useCallback((p) => pushReaction(p.emoji, p.fullName), [pushReaction]),
    onParticipantKicked: useCallback((p) => {
      removeParticipant(p.participantId);
    }, [removeParticipant]),
    onYouWereKicked: useCallback((p) => {
      alert(`You were removed from the meeting by ${p.kickedBy}.`);
      navigate('/');
    }, [navigate]),
    onAllParticipantsMuted: useCallback(() => {
      if (!iAmInstructor && selfParticipantId !== hostId && media.audioEnabled) media.toggleAudio();
    }, [iAmInstructor, selfParticipantId, hostId, media]),
    onMeetingEnded: useCallback(() => {
      alert('Meeting has ended.');
      navigate('/');
    }, [navigate]),
    onMeetingLockToggled: useCallback((p) => setMeetingLocked(p.locked), []),
    onChatToggled: useCallback((p) => setChatEnabled(p.enabled), []),
    onQuizStarted: useCallback((p) => {
      const session = p?.sessionId;
      const q = p?.questions?.[0];
      if (session && q) {
        setActiveQuiz({
          sessionId: session,
          question: {
            id: q.id,
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
          },
        });
      }
    }, []),
    onQuizEnded: useCallback(() => { setActiveQuiz(null); setQuizResults(null); }, []),
    onQuizResultsUpdated: useCallback((results) => setQuizResults(results), []),
    onLectureMaterialAttached: useCallback((p) => {
      console.info('A new lecture material was attached:', p);
    }, []),
  });

  const _registerSignalHandler = useCallback((handler) => {
    webrtcSignalHandlerRef.current = handler;
  }, []);

  const sfu = useSFU({
    connection: hub.connection,
    selfParticipantId,
    localStream: media.stream,
    screenStream: media.screenStream,
    meetingId,
  });

  const webrtcApiRef = useRef(sfu);
  webrtcApiRef.current = sfu;

  const joinAttemptedRef = useRef(false);
  useEffect(() => {
    if (!hub.connection || hub.connectionState !== HubConnectionState.Connected) return;
    if (!meetingUser?.email) return;
    if (joinAttemptedRef.current) return;
    joinAttemptedRef.current = true;

    const go = async () => {
      try {
        if (createIfMissing) {
          const res = await hub.connection.invoke(
            'CreateMeeting',
            displayName || `${meetingUser.name}'s meeting`,
            meetingUser.email,
          );
          if (res?.meetingId) {
            setHostId(res.hostId ?? null);
            setSelfParticipantId(meetingUser.id);
            upsertParticipant({
              participantId: meetingUser.id,
              fullName: meetingUser.name,
              isAudioEnabled: media.audioEnabled,
              isVideoEnabled: media.videoEnabled,
              isScreenSharing: false,
              isHandRaised: false,
            });
          }
        } else {
          await hub.connection.invoke('JoinMeeting', meetingId, meetingUser.email);
          setSelfParticipantId(meetingUser.id);
          upsertParticipant({
            participantId: meetingUser.id,
            fullName: meetingUser.name,
            isAudioEnabled: media.audioEnabled,
            isVideoEnabled: media.videoEnabled,
            isScreenSharing: false,
            isHandRaised: false,
          });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.toLowerCase().includes('locked')) {
          setJoinLocked(true);
        } else {
          setJoinError(msg);
        }
      }
    };
    go();
  }, [hub.connection, hub.connectionState, meetingUser, meetingId, createIfMissing, displayName, upsertParticipant, media.audioEnabled, media.videoEnabled]);

  useEffect(() => {
    if (!selfParticipantId) return;
    if (sfuInitializedRef.current) return;
    sfuInitializedRef.current = true;
    sfu.initializeSFU();
  }, [selfParticipantId, sfu.initializeSFU]);

  useEffect(() => {
    if (!selfParticipantId) return;
    fetchChatHistory(meetingId)
      .then((history) => {
        chatMessagesRef.current = history;
        setChatMessages(history);
      })
      .catch(() => {});
  }, [selfParticipantId, meetingId]);

  const invoke = useCallback(
    async (method, ...args) => {
      if (!hub.connection) return;
      try {
        await hub.connection.invoke(method, ...args);
      } catch (err) {
        console.warn(`${method} failed:`, err);
      }
    },
    [hub.connection],
  );

  const handleToggleAudio = useCallback(async () => {
    media.toggleAudio();
    await invoke('ToggleAudio', !media.audioEnabled);
  }, [media, invoke]);

  const handleToggleVideo = useCallback(async () => {
    media.toggleVideo();
    await invoke('ToggleVideo', !media.videoEnabled);
  }, [media, invoke]);

  const handleToggleScreen = useCallback(async () => {
    if (media.isSharingScreen) {
      await media.stopScreenShare();
      await invoke('StopScreenSharing');
    } else {
      const screenTrack = await media.startScreenShare();
      if (screenTrack) {
        await invoke('StartScreenSharing');
      }
    }
  }, [media, invoke]);

  const handleToggleHand = useCallback(async () => {
    const next = !isHandRaised;
    setIsHandRaised(next);
    await invoke('RaiseHand', next);
  }, [isHandRaised, invoke]);

  const handleReaction = useCallback(async (emoji) => {
    pushReaction(emoji, 'You');
    await invoke('SendReaction', emoji);
  }, [pushReaction, invoke]);

  const handleSendChat = useCallback(async (text) => {
    await invoke('SendChatMessage', text);
  }, [invoke]);

  const handleLeave = useCallback(async () => {
    await invoke('LeaveMeeting');
    navigate('/');
  }, [invoke, navigate]);

  const handleMuteAll = useCallback(async () => {
    await invoke('MuteAllParticipants');
  }, [invoke]);

  const handleEndMeeting = useCallback(async () => {
    if (!confirm('End this meeting for everyone?')) return;
    await invoke('EndMeeting');
  }, [invoke]);

  const handleToggleLock = useCallback(async () => {
    await invoke('LockMeeting', !meetingLocked);
  }, [invoke, meetingLocked]);

  const handleToggleChatForEveryone = useCallback(async () => {
    await invoke('ToggleChat', !chatEnabled);
  }, [invoke, chatEnabled]);

  const handleKick = useCallback(async (participantId) => {
    if (!confirm('Remove this participant from the meeting?')) return;
    await invoke('KickParticipant', participantId);
  }, [invoke]);

  const handleToggleRecording = useCallback(() => {
    if (isRecording) {
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.stop();
      } else {
        setIsRecording(false);
      }
      return;
    }
    if (!media.stream || !media.stream.active || media.stream.getTracks().length === 0) {
      alert('No active media stream to record. Please enable your camera or microphone first.');
      return;
    }

    try {
      if (!compositorRef.current) {
        compositorRef.current = new MediaCompositor();
      }

      const combinedStream = compositorRef.current.start(media.stream, media.screenStream);

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
    } catch (err) {
      console.error('MediaRecorder error:', err);
      alert('Recording is not supported in this browser.');
    }
  }, [isRecording, media.stream, media.screenStream, meetingId]);

  if (joinLocked) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-semibold mb-2">Meeting is locked</h2>
          <p className="text-sm text-zinc-400">This meeting is currently locked by the instructor. Please try again later.</p>
          <button onClick={() => navigate('/')} className="inline-block mt-4 text-indigo-400 hover:text-indigo-300 text-sm">
            &larr; Back to home
          </button>
        </div>
      </div>
    );
  }

  if (joinError) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-semibold mb-2">Couldn&apos;t join the meeting</h2>
          <p className="text-sm text-zinc-400">{joinError}</p>
          <button onClick={() => navigate('/')} className="inline-block mt-4 text-indigo-400 hover:text-indigo-300 text-sm">
            &larr; Back to home
          </button>
        </div>
      </div>
    );
  }

  if (!meetingUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
        <p>Please sign in to join the meeting.</p>
      </div>
    );
  }

  if (media.error) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-semibold mb-2">Camera or microphone blocked</h2>
          <p className="text-sm text-zinc-400">{media.error}</p>
        </div>
      </div>
    );
  }

  const iAmHost = selfParticipantId != null && selfParticipantId === hostId;

  return (
    <div className="h-screen flex flex-col bg-zinc-900 text-zinc-100">
      <header className="flex items-center gap-3 px-4 py-2 bg-zinc-950 border-b border-white/5">
        <span className="font-semibold text-sm text-indigo-400">EduNexus</span>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>Meeting &middot; {meetingId?.slice(0, 8)}&hellip;</span>
          <button
            onClick={handleCopyId}
            className="p-1 hover:bg-white/10 rounded transition-colors flex items-center gap-1 text-zinc-400 hover:text-zinc-200"
            title="Copy Meeting ID"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-green-500" />
                <span className="text-[10px] text-green-500">Copied!</span>
              </>
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
        <span className="ml-auto flex items-center gap-2 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${hub.connectionState === HubConnectionState.Connected
                ? 'bg-green-500'
                : hub.connectionState === HubConnectionState.Reconnecting
                  ? 'bg-yellow-500 animate-pulse'
                  : 'bg-red-500'
              }`}
          />
          <span className="text-zinc-400">{hub.connectionState}</span>
        </span>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <main className="flex-1 flex flex-col relative">
          <ReactionOverlay reactions={reactions} onExpire={(id) => setReactions((prev) => prev.filter((r) => r.id !== id))} />
          <VideoGrid
            localStream={media.stream}
            localScreenStream={media.screenStream}
            selfName={meetingUser.name}
            selfIsAudioEnabled={media.audioEnabled}
            selfIsVideoEnabled={media.videoEnabled}
            remoteStreams={sfu.remoteStreams}
            participants={participants}
          />
        </main>

        {showChat && (
          <ChatPanel
            messages={chatMessages}
            onSend={handleSendChat}
            onClose={() => setShowChat(false)}
            selfName={meetingUser.name}
            chatEnabled={chatEnabled}
          />
        )}

        {showParticipants && (
          <ParticipantsPanel
            selfId={selfParticipantId ?? ''}
            hostId={hostId}
            participants={participants}
            isHost={iAmHost}
            onKick={handleKick}
            onClose={() => setShowParticipants(false)}
          />
        )}
      </div>

      <ControlBar
        audioEnabled={media.audioEnabled}
        videoEnabled={media.videoEnabled}
        isSharingScreen={media.isSharingScreen}
        isHandRaised={isHandRaised}
        isRecording={isRecording}
        isHost={iAmHost || iAmInstructor}
        chatEnabled={chatEnabled}
        meetingLocked={meetingLocked}
        onToggleAudio={handleToggleAudio}
        onToggleVideo={handleToggleVideo}
        onToggleScreenShare={handleToggleScreen}
        onToggleHand={handleToggleHand}
        onReaction={handleReaction}
        onToggleRecording={handleToggleRecording}
        onToggleChatPanel={() => setShowChat((v) => !v)}
        onToggleParticipantsPanel={() => setShowParticipants((v) => !v)}
        onLeave={handleLeave}
        onMuteAll={handleMuteAll}
        onToggleLock={handleToggleLock}
        onToggleChatForEveryone={handleToggleChatForEveryone}
        onEndMeeting={handleEndMeeting}
        extraRight={
          iAmInstructor ? (
            <UploadMaterialButton
              meetingId={meetingId}
              onUploaded={async (url, fileName) => {
                await invoke('SendChatMessage', `I have uploaded a new PDF document: ${fileName} - ${url}`);
              }}
            />
          ) : null
        }
      />

      {activeQuiz && (
        <QuizPopup
          sessionId={activeQuiz.sessionId}
          question={activeQuiz.question}
          isInstructor={iAmInstructor}
          results={quizResults}
          onClose={() => setActiveQuiz(null)}
        />
      )}
    </div>
  );
}
