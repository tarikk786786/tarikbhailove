import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

/* ══════════════════════════════════════════════════════════════
   INPUT BAR — Holographic quantum input interface
══════════════════════════════════════════════════════════════ */

interface InputBarProps {
  input: string;
  setInput: (v: string) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onSubmit: (e: React.FormEvent) => void;
}

export function InputBar({ input, setInput, isLoading, inputRef, onSubmit }: InputBarProps) {
  const MAX = 2000;
  const charPct = (input.length / MAX) * 100;
  const overLimit = input.length > MAX;

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

  return (
    <div className="input-zone glass">
      <form className="input-form" onSubmit={onSubmit}>
        {/* Animated data stream on left edge */}
        <div style={{
          position: 'absolute',
          left: 0, top: 0,
          width: '2px', height: '100%',
          borderRadius: '2px',
          background: 'linear-gradient(to bottom, transparent, rgba(124,58,237,0.7), rgba(6,182,212,0.7), transparent)',
          backgroundSize: '100% 200%',
          animation: 'streamFlow 2.5s ease-in-out infinite',
        }} />

        <input
          ref={inputRef}
          type="text"
          className="input-field"
          placeholder="Ask Tarik Bhai AI anything — from quantum physics to startup strategy…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={isLoading}
          maxLength={MAX + 50}
          autoFocus
          aria-label="Message input"
        />

        {/* Char counter arc */}
        {input.length > 100 && (
          <div style={{ position: 'relative', width: 28, height: 28, flexShrink: 0 }}>
            <svg width="28" height="28" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="14" cy="14" r="11" fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="2" />
              <circle
                cx="14" cy="14" r="11"
                fill="none"
                stroke={overLimit ? '#ef4444' : charPct > 85 ? '#f59e0b' : '#7c3aed'}
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 11}`}
                strokeDashoffset={`${2 * Math.PI * 11 * (1 - Math.min(charPct, 100) / 100)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.3s, stroke 0.3s' }}
              />
            </svg>
          </div>
        )}

        <button
          type="submit"
          className="send-btn"
          disabled={isLoading || !input.trim() || overLimit}
          aria-label="Send message"
          id="send-btn"
        >
          {isLoading
            ? <Loader2 size={18} className="animate-spin" />
            : <Send size={18} />
          }
        </button>
      </form>

      <div className="input-footer">
        <span className="input-hint">
          ↵ Enter to send &nbsp;·&nbsp; Tarik Bhai AI &nbsp;◈&nbsp; Beyond Space Beyond Time
        </span>
        {input.length > 0 && (
          <span className="char-counter" style={{ color: overLimit ? '#ef4444' : undefined }}>
            {input.length}/{MAX}
          </span>
        )}
      </div>
    </div>
  );
}
