import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/* ══════════════════════════════════════════════════════════════
   CHAT MESSAGES — Futuristic holographic chat bubbles
══════════════════════════════════════════════════════════════ */

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

function formatTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function ChatMessages({ messages, isLoading, messagesEndRef }: ChatMessagesProps) {
  return (
    <>
      {messages.map((msg, idx) => (
        <div key={idx} className={`msg-row ${msg.role}`}>
          <div className={`msg-avi ${msg.role === 'user' ? 'user' : 'ai'}`}>
            {msg.role === 'user' ? '👤' : '🤖'}
          </div>

          <div className="msg-body">
            <div className="msg-meta">
              {msg.role === 'user' ? 'YOU' : 'TARIK BHAI AI'} &nbsp;·&nbsp; {formatTime()}
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
          </div>
        </div>
      ))}

      {/* Typing indicator */}
      {isLoading && (
        <div className="msg-row">
          <div className="msg-avi ai">🤖</div>
          <div className="msg-body">
            <div className="msg-meta">TARIK BHAI AI · Processing</div>
            <div className="bubble ai">
              <div className="typing-bubble">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
            <div className="thinking-text">◈ Accessing knowledge matrix…</div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} style={{ height: 1 }} />
    </>
  );
}
