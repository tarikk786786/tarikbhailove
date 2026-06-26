import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CosmicBackground }  from './components/CosmicBackground';
import { CursorGlow }        from './components/CursorGlow';
import { WelcomeScreen }     from './components/WelcomeScreen';
import { ChatMessages, type Message } from './components/ChatMessages';
import { InputBar }          from './components/InputBar';

/* ══════════════════════════════════════════════════════════════
   TARIK BHAI AI — Main Application
   Beyond Space • Beyond Time • Beyond Comprehension
══════════════════════════════════════════════════════════════ */

export default function App() {
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId]               = useState(() => Math.random().toString(36).slice(2, 8).toUpperCase());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);
  const msgsAreaRef    = useRef<HTMLDivElement>(null);

  // Smooth scroll to bottom
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 60);
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isLoading, scrollToBottom]);

  // Core send function
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: trimmed }]);
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

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

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
                  next[next.length - 1] = { role: 'assistant', content: ai };
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
          content: '⚠️ **Connection disrupted.** The knowledge matrix encountered an error. Please try again.\n\n*Tarik Bhai AI systems are self-healing and will be ready momentarily.*',
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Layer 0: Cosmic animated background */}
      <CosmicBackground />

      {/* Layer 1: Custom cursor */}
      <CursorGlow />

      {/* Layer 2: App shell */}
      <div className="app-shell">

        {/* Header */}
        <header className="app-header glass">
          <div className="header-core">
            <div className="header-core-ring" />
            <div className="header-core-inner">🤖</div>
          </div>

          <div className="header-info">
            <div className="header-title">Tarik Bhai AI</div>
            <div className="header-sub">Beyond Space • Beyond Time • Omega Knowledge System</div>
          </div>

          <div className="header-status">
            <div className="model-badge">Llama-3.1</div>
            <div className="status-indicator">
              <div className="status-pulse" />
              Online
            </div>
          </div>
        </header>

        {/* Messages / Welcome */}
        <div className="messages-area" ref={msgsAreaRef}>
          {messages.length === 0 ? (
            <WelcomeScreen
              onPrompt={text => {
                setInput(text);
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
            />
          ) : (
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
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
        />
      </div>
    </>
  );
}
