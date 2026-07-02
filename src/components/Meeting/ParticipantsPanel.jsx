// src/components/Meeting/ParticipantsPanel.jsx

import { memo } from 'react';
import { Crown, Hand, MicOff, UserX, Video, VideoOff, X } from 'lucide-react';

export const ParticipantsPanel = memo(function ParticipantsPanel({
  selfId,
  hostId,
  participants,
  isHost,
  onKick,
  onClose,
}) {
  const list = Array.from(participants.values());

  return (
    <aside className="flex flex-col w-72 border-l border-white/10 bg-zinc-950">
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h3 className="font-semibold text-sm text-zinc-100">Participants ({list.length})</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200">
          <X className="w-4 h-4" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {list.map((p) => {
          const isSelf = p.participantId === selfId;
          const isHostRow = p.participantId === hostId;
          return (
            <div
              key={p.participantId}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-900 group"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                {p.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 text-sm text-zinc-100 truncate">
                  <span className="truncate">{p.fullName}</span>
                  {isSelf && <span className="text-xs text-zinc-500">(you)</span>}
                  {isHostRow && <Crown className="w-3 h-3 text-yellow-400" />}
                </div>
              </div>
              <div className="flex items-center gap-1 text-zinc-500">
                {!p.isAudioEnabled && <MicOff className="w-3.5 h-3.5 text-red-400" />}
                {p.isVideoEnabled ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5 text-red-400" />}
                {p.isHandRaised && <Hand className="w-3.5 h-3.5 text-yellow-400" />}
              </div>
              {isHost && !isSelf && !isHostRow && (
                <button
                  onClick={() => onKick(p.participantId)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                  title="Remove from meeting"
                >
                  <UserX className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
});
