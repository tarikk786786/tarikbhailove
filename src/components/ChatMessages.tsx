import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, RotateCcw } from 'lucide-react';

/* ══════════════════════════════════════════════════════════════
   CHAT MESSAGES — Friendly, readable, with copy & retry
══════════════════════════════════════════════════════════════ */

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onRetry?: (msgIndex: number) => void;
}

function formatTimestamp(ts?: number) {
  const d = ts ? new Date(ts) : new Date();
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// Copy button for code blocks and AI messages
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { }
  };

  return (
    <button
      className="copy-btn"
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
      aria-label="Copy"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      <span>{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  );
}

// Random thinking messages
const THINKING_MESSAGES = [
  '🧠 Thinking deeply…',
  '🔍 Researching your question…',
  '⚡ Processing with care…',
  '📚 Finding the best answer…',
  '🌌 Accessing knowledge matrix…',
];

export function ChatMessages({ messages, isLoading, messagesEndRef, onRetry }: ChatMessagesProps) {
  const thinkingMsg = useRef(THINKING_MESSAGES[Math.floor(Math.random() * THINKING_MESSAGES.length)]);

  // Pick new thinking message when loading starts
  if (isLoading) {
    thinkingMsg.current = THINKING_MESSAGES[Math.floor(Math.random() * THINKING_MESSAGES.length)];
  }

  return (
    <>
      {messages.map((msg, idx) => (
        <div key={idx} className={`msg-row ${msg.role}`}>
          <div className={`msg-avi ${msg.role === 'user' ? 'user' : 'ai'}`}>
            {msg.role === 'user' ? '👤' : '🤖'}
          </div>

          <div className="msg-body">
            <div className="msg-meta">
              <span className="msg-name">
                {msg.role === 'user' ? 'You' : 'Tarik Bhai AI'}
              </span>
              <span className="msg-time">{formatTimestamp(msg.timestamp)}</span>
            </div>

            <div className={`bubble ${msg.role === 'user' ? 'user' : 'ai'}`}>
              {msg.role === 'assistant' ? (
                <div className="prose">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content || '▊'}
                  </ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>

            {/* Action buttons for AI messages */}
            {msg.role === 'assistant' && msg.content && !isLoading && (
              <div className="msg-actions">
                <CopyButton text={msg.content} />
                {onRetry && idx === messages.length - 1 && (
                  <button
                    className="retry-btn"
                    onClick={() => onRetry(idx)}
                    title="Regenerate response"
                  >
                    <RotateCcw size={13} />
                    <span>Retry</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Typing indicator */}
      {isLoading && (
        <div className="msg-row">
          <div className="msg-avi ai">🤖</div>
          <div className="msg-body">
            <div className="msg-meta">
              <span className="msg-name">Tarik Bhai AI</span>
              <span className="msg-time">typing…</span>
            </div>
            <div className="bubble ai">
              <div className="typing-bubble">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
            <div className="thinking-text">{thinkingMsg.current}</div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} style={{ height: 1 }} />
    </>
  );
}
