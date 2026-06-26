import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// ── Star field generator ──────────────────────────────────────────────────
function StarField() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    dur: Math.random() * 4 + 2,
    delay: Math.random() * 5,
  }));

  return (
    <div className="stars">
      {stars.map(s => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            '--dur': `${s.dur}s`,
            '--delay': `-${s.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ── Suggested prompts ─────────────────────────────────────────────────────
const SUGGESTIONS = [
  '🚀 Explain quantum computing',
  '💡 Business idea generator',
  '🔥 Best coding practices',
  '🌍 World history summary',
  '🧠 How does AI work?',
  '💻 Build a React app',
];

// ── Welcome Screen ────────────────────────────────────────────────────────
function WelcomeScreen({ onSuggestion }: { onSuggestion: (s: string) => void }) {
  return (
    <div className="welcome-screen">
      {/* Avatar */}
      <div className="welcome-avatar">
        <div className="avatar-ring" />
        <div className="avatar-inner">🤖</div>
      </div>

      {/* Title */}
      <h1 className="welcome-title">Tarik Bhai AI</h1>

      {/* Subtitle */}
      <p className="welcome-subtitle">Beyond Space • Beyond Time</p>

      {/* Tagline */}
      <p className="welcome-tagline">
        Your <span>Ultimate Digital Mentor</span> — powered by cutting-edge AI.
        Ask me anything across science, tech, business, coding, history or life.
        I'll deliver <span>deeply researched, exhaustive answers</span> with the warmth of a trusted guide.
      </p>

      {/* Quick-start chips */}
      <div className="welcome-chips">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            className="chip"
            onClick={() => onSuggestion(s.replace(/^[^\s]+\s/, ''))}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Mini stats */}
      <div className="welcome-stats">
        {[
          { n: '∞', label: 'Knowledge' },
          { n: '24/7', label: 'Available' },
          { n: '100+', label: 'Topics' },
        ].map(({ n, label }) => (
          <div key={label} className="stat-item">
            <div className="stat-number">{n}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Typing dots ───────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="typing-dots">
      <span /><span /><span />
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────
function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => { scrollToBottom(); }, [messages, isLoading]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage = text.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }]
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let assistantMessage = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split('\n')) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.text) {
                  assistantMessage += data.text;
                  setMessages(prev => {
                    const next = [...prev];
                    next[next.length - 1].content = assistantMessage;
                    return next;
                  });
                }
              } catch (_) {}
            }
          }
        }
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '⚠️ Something went wrong. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* Animated background */}
      <div className="nebula-bg">
        <div className="nebula-orb" />
        <div className="nebula-orb" />
        <div className="nebula-orb" />
      </div>
      <StarField />

      {/* App shell */}
      <div className="app-shell">

        {/* Header */}
        <header className="app-header glass-panel">
          <div className="header-avatar">🤖</div>
          <div className="header-info">
            <h1>Tarik Bhai AI</h1>
            <p>YOUR DIGITAL MENTOR • OMEGA KNOWLEDGE GUIDE</p>
          </div>
          <div className="header-status">
            <div className="status-dot" />
            Online
          </div>
        </header>

        {/* Messages / Welcome */}
        <div className="messages-area">
          {messages.length === 0 ? (
            <WelcomeScreen onSuggestion={s => { setInput(s); inputRef.current?.focus(); }} />
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`message-row ${msg.role}`}>
                <div className={`msg-avatar ${msg.role === 'user' ? 'user' : 'ai'}`}>
                  {msg.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className={`bubble ${msg.role === 'user' ? 'user' : 'ai'}`}>
                  {msg.role === 'assistant' ? (
                    <div className="prose max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content || '...'}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))
          )}

          {/* Typing indicator */}
          {isLoading && (
            <div className="message-row">
              <div className="msg-avatar ai">🤖</div>
              <div className="bubble ai">
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="input-bar glass-panel">
          <form className="input-form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="input-field"
              placeholder="Ask Tarik Bhai AI anything…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              className="send-btn"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
            >
              {isLoading
                ? <Loader2 size={18} className="animate-spin" />
                : <Send size={18} />
              }
            </button>
          </form>
          <p className="input-hint">
            Press Enter to send • Tarik Bhai AI · Beyond Space Beyond Time
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
