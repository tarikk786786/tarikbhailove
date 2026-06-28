import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CosmicBackground }  from './components/CosmicBackground';
import { CursorGlow }        from './components/CursorGlow';
import { WelcomeScreen }     from './components/WelcomeScreen';
import { ChatMessages, type Message } from './components/ChatMessages';
import { InputBar }          from './components/InputBar';
import { Trash2 } from 'lucide-react';

/* ══════════════════════════════════════════════════════════════
   TARIK BHAI AI — Main Application
   Best • Easy • Advanced • Accurate • Friendly
══════════════════════════════════════════════════════════════ */

export default function App() {
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);
  const msgsAreaRef    = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 60);
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isLoading, scrollToBottom]);

  // Send message
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setInput('');
    const userMsg: Message = { role: 'user', content: trimmed, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: trimmed }],
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (!res.body) throw new Error('No stream');

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let ai   = '';
      const aiTimestamp = Date.now();

      setMessages(prev => [...prev, { role: 'assistant', content: '', timestamp: aiTimestamp }]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (!value) continue;

        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data: ') && !line.includes('[DONE]')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                ai += data.text;
                setMessages(prev => {
                  const next = [...prev];
                  next[next.length - 1] = { role: 'assistant', content: ai, timestamp: aiTimestamp };
                  return next;
                });
              }
            } catch (_) {}
          }
        }
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ **Oops! Kuch gadbad ho gayi.** Please try again.\n\n*Server se connection lost ho gaya. Ek baar phir se try kar.*',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [messages, isLoading]);

  // Retry last message
  const handleRetry = useCallback((msgIndex: number) => {
    // Find the last user message before this AI response
    let lastUserMsg = '';
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserMsg = messages[i].content;
        break;
      }
    }
    if (!lastUserMsg) return;

    // Remove the last AI response
    setMessages(prev => prev.slice(0, msgIndex));

    // Resend
    setTimeout(() => sendMessage(lastUserMsg), 100);
  }, [messages, sendMessage]);

  // Clear chat
  const clearChat = () => {
    if (messages.length === 0) return;
    setMessages([]);
    setInput('');
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Also send when clicking welcome prompt buttons
  const handlePrompt = useCallback((text: string) => {
    sendMessage(text);
  }, [sendMessage]);

  return (
    <>
      {/* Cosmic animated background */}
      <CosmicBackground />

      {/* Custom cursor (desktop only) */}
      <CursorGlow />

      {/* App */}
      <div className="app-shell">

        {/* Header */}
        <header className="app-header glass">
          <div className="header-core">
            <div className="header-core-ring" />
            <div className="header-core-inner">🤖</div>
          </div>

          <div className="header-info">
            <div className="header-title">Tarik Bhai AI</div>
            <div className="header-sub">Your Digital Mentor • Always Here For You</div>
          </div>

          <div className="header-status">
            <div className="status-indicator">
              <div className="status-pulse" />
              Online
            </div>
            {messages.length > 0 && (
              <button
                className="clear-btn"
                onClick={clearChat}
                title="Clear chat"
                aria-label="Clear chat"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </header>

        {/* Messages / Welcome */}
        <div className="messages-area" ref={msgsAreaRef}>
          {messages.length === 0 ? (
            <WelcomeScreen onPrompt={handlePrompt} />
          ) : (
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
              onRetry={handleRetry}
            />
          )}
        </div>

        {/* Input */}
        <InputBar
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          inputRef={inputRef as React.RefObject<HTMLInputElement>}
          onSubmit={handleSubmit}
          messageCount={messages.length}
        />
      </div>
    </>
  );
}
