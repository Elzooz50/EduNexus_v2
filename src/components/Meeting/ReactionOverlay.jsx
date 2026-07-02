// src/components/Meeting/ReactionOverlay.jsx

import { memo, useEffect, useState } from 'react';

export const ReactionOverlay = memo(function ReactionOverlay({ reactions, onExpire }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
      {reactions.map((r) => (
        <ReactionBubble key={r.id} reaction={r} onExpire={onExpire} />
      ))}
    </div>
  );
});

function ReactionBubble({ reaction, onExpire }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => onExpire(reaction.id), 3000);
    setTick(1);
    return () => clearTimeout(t);
  }, [reaction.id, onExpire]);

  return (
    <div
      className="absolute bottom-24 flex flex-col items-center animate-float"
      style={{ left: `${reaction.left}%` }}
    >
      <span className="text-5xl drop-shadow-lg">{reaction.emoji}</span>
      <span className="text-xs text-white bg-black/50 px-2 py-0.5 rounded-full mt-1">{reaction.name}</span>
    </div>
  );
}
