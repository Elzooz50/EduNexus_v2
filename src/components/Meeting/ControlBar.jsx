// src/components/Meeting/ControlBar.jsx

import {
  Circle,
  Hand,
  Lock,
  LogOut,
  MessageSquare,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  Smile,
  StopCircle,
  Unlock,
  Users,
  Video,
  VideoOff,
  VolumeX,
} from 'lucide-react';
import { useState, memo } from 'react';

const REACTIONS = ['👍', '❤️', '😂', '🎉', '👏', '🤔'];

function ToolButton({ active, danger, label, children, onClick, disabled }) {
  const base = 'flex flex-col items-center justify-center w-16 h-14 rounded-lg transition-colors text-xs gap-1';
  const style = danger
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : active
      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200';
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${style} disabled:opacity-40`} title={label}>
      {children}
      <span>{label}</span>
    </button>
  );
}

export const ControlBar = memo(function ControlBar(props) {
  const [showReactions, setShowReactions] = useState(false);

  return (
    <div className="relative flex items-center justify-center gap-2 flex-wrap px-4 py-3 bg-zinc-950 border-t border-white/5">
      <ToolButton active={props.audioEnabled} danger={!props.audioEnabled} label="Mic" onClick={props.onToggleAudio}>
        {props.audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
      </ToolButton>

      <ToolButton active={props.videoEnabled} danger={!props.videoEnabled} label="Camera" onClick={props.onToggleVideo}>
        {props.videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
      </ToolButton>

      <ToolButton active={props.isSharingScreen} label={props.isSharingScreen ? 'Stop share' : 'Share'} onClick={props.onToggleScreenShare}>
        <MonitorUp className="w-5 h-5" />
      </ToolButton>

      <ToolButton active={props.isHandRaised} label="Raise hand" onClick={props.onToggleHand}>
        <Hand className="w-5 h-5" />
      </ToolButton>

      <div className="relative">
        <ToolButton label="React" onClick={() => setShowReactions((v) => !v)}>
          <Smile className="w-5 h-5" />
        </ToolButton>
        {showReactions && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/10 rounded-lg p-2 flex gap-1 shadow-xl z-20">
            {REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  props.onReaction(emoji);
                  setShowReactions(false);
                }}
                className="text-2xl p-1.5 hover:bg-zinc-800 rounded-md"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      <ToolButton active={props.isRecording} danger={props.isRecording} label={props.isRecording ? 'Stop rec' : 'Record'} onClick={props.onToggleRecording}>
        {props.isRecording ? <StopCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
      </ToolButton>

      <div className="w-px h-10 bg-white/10 mx-1" />

      <ToolButton label="Chat" onClick={props.onToggleChatPanel}>
        <MessageSquare className="w-5 h-5" />
      </ToolButton>

      <ToolButton label="People" onClick={props.onToggleParticipantsPanel}>
        <Users className="w-5 h-5" />
      </ToolButton>

      {props.extraRight}

      {props.isHost && (
        <>
          <div className="w-px h-10 bg-white/10 mx-1" />
          <ToolButton label="Mute all" onClick={props.onMuteAll}>
            <VolumeX className="w-5 h-5" />
          </ToolButton>
          <ToolButton active={props.meetingLocked} label={props.meetingLocked ? 'Unlock' : 'Lock'} onClick={props.onToggleLock}>
            {props.meetingLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
          </ToolButton>
          <ToolButton active={!props.chatEnabled} label={props.chatEnabled ? 'Mute chat' : 'Enable chat'} onClick={props.onToggleChatForEveryone}>
            <MessageSquare className="w-5 h-5" />
          </ToolButton>
          <ToolButton danger label="End" onClick={props.onEndMeeting}>
            <PhoneOff className="w-5 h-5" />
          </ToolButton>
        </>
      )}

      <div className="w-px h-10 bg-white/10 mx-1" />

      <ToolButton danger label="Leave" onClick={props.onLeave}>
        <LogOut className="w-5 h-5" />
      </ToolButton>
    </div>
  );
});
