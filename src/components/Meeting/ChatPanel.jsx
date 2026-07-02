// src/components/Meeting/ChatPanel.jsx

import { Send, X } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

const URL_REGEX = /(https?:\/\/[^\s]+)/g;
const DANGEROUS_PROTOCOL = /^javascript:/i;

function isSafeUrl(url) {
  return !DANGEROUS_PROTOCOL.test(url.trim());
}

function ChatMessageRow({ msg, isMine }) {
  const parts = useMemo(() => msg.content.split(URL_REGEX), [msg.content]);

  return (
    <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-semibold text-indigo-400">{isMine ? 'You' : msg.senderDisplayName}</span>
        <span className="text-[10px] text-zinc-500">
          {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <div
        className={`mt-1 px-3 py-1.5 rounded-lg text-sm max-w-[240px] break-words ${
          isMine ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-100'
        }`}
      >
        {parts.map((part, idx) => {
          if (URL_REGEX.test(part)) {
            return (
              <a
                key={idx}
                href={isSafeUrl(part) ? part : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-80 break-all"
                onClick={(e) => { if (!isSafeUrl(part)) e.preventDefault(); }}
              >
                {part}
              </a>
            );
          }
          return <span key={idx}>{part}</span>;
        })}
      </div>
    </div>
  );
}

const MemoizedChatMessage = memo(ChatMessageRow);

export const ChatPanel = memo(function ChatPanel({ messages, onSend, onClose, selfName, chatEnabled }) {
  const [text, setText] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(() => {
    const t = text.trim();
    if (!t || !chatEnabled) return;
    onSend(t);
    setText('');
  }, [text, chatEnabled, onSend]);

  return (
    <aside className="flex flex-col w-80 border-l border-white/10 bg-zinc-950">
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h3 className="font-semibold text-sm text-zinc-100">Chat</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200">
          <X className="w-4 h-4" />
        </button>
      </header>

      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-xs text-zinc-500 text-center mt-8">No messages yet. Say hi!</p>
        )}
        {messages.map((m, i) => (
          <MemoizedChatMessage
            key={m.id ?? `${i}-${m.sentAt}`}
            msg={m}
            isMine={m.senderDisplayName === selfName}
          />
        ))}
      </div>

      <div className="border-t border-white/10 px-3 py-2 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={chatEnabled ? 'Type a message…' : 'Chat has been disabled'}
          disabled={!chatEnabled}
          className="flex-1 bg-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!chatEnabled}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 rounded-md disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
});
