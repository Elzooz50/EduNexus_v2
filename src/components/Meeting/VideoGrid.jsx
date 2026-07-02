// src/components/Meeting/VideoGrid.jsx

import { memo, useEffect, useRef } from 'react';
import { Hand, MicOff, VideoOff } from 'lucide-react';

const VideoTile = memo(function VideoTile({ stream, participant, isLocal = false, label }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      if (videoRef.current.srcObject !== stream) {
        videoRef.current.srcObject = stream;
      }
    }
  }, [stream]);

  const videoOff = participant ? !participant.isVideoEnabled : false;
  const audioOff = participant ? !participant.isAudioEnabled : false;
  const handUp = participant?.isHandRaised;

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-white/5 shadow-lg">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`w-full h-full object-cover ${videoOff ? 'opacity-0' : ''}`}
      />
      {videoOff && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl font-semibold">
            {label.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
        <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-md truncate max-w-[70%]">
          {label} {isLocal && '(You)'}
        </span>
        <div className="flex gap-1 ml-auto">
          {audioOff && (
            <span className="bg-red-500/90 text-white p-1 rounded-md" title="Muted">
              <MicOff className="w-3 h-3" />
            </span>
          )}
          {videoOff && (
            <span className="bg-red-500/90 text-white p-1 rounded-md" title="Camera off">
              <VideoOff className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>

      {handUp && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-black p-1.5 rounded-full animate-bounce">
          <Hand className="w-4 h-4" />
        </div>
      )}
    </div>
  );
});

function VideoGridInner({
  localStream,
  localScreenStream,
  selfName,
  selfIsVideoEnabled,
  selfIsAudioEnabled,
  remoteStreams,
  participants,
}) {
  const tileCount = 1 + (localScreenStream ? 1 : 0) + remoteStreams.length;
  const cols = tileCount <= 1 ? 1 : tileCount <= 4 ? 2 : tileCount <= 9 ? 3 : 4;

  const selfParticipant = {
    participantId: 'self',
    fullName: selfName,
    isAudioEnabled: selfIsAudioEnabled,
    isVideoEnabled: selfIsVideoEnabled,
  };

  return (
    <div
      className="grid gap-3 p-4 flex-1 overflow-auto content-start"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      <VideoTile stream={localStream} isLocal label={selfName} participant={selfParticipant} />

      {localScreenStream && (
        <VideoTile stream={localScreenStream} isLocal label={`${selfName} (Screen)`} participant={{
          participantId: 'self-screen',
          fullName: `${selfName} (Screen)`,
          isAudioEnabled: true,
          isVideoEnabled: true,
        }} />
      )}

      {remoteStreams.map((r) => {
        const isScreen = r.participantId.endsWith('-screen');
        const baseId = isScreen ? r.participantId.replace('-screen', '') : r.participantId;
        const info = participants.get(baseId);
        const label = isScreen
          ? `${info?.fullName || 'Guest'} (Screen)`
          : (info?.fullName || 'Guest');

        return (
          <VideoTile
            key={r.participantId}
            stream={r.stream}
            label={label}
            participant={
              info ? {
                ...info,
                participantId: r.participantId,
                fullName: label,
                isVideoEnabled: isScreen ? true : info.isVideoEnabled,
              } : {
                participantId: r.participantId,
                fullName: label,
                isAudioEnabled: true,
                isVideoEnabled: true,
              }
            }
          />
        );
      })}
    </div>
  );
}

export const VideoGrid = memo(VideoGridInner);
