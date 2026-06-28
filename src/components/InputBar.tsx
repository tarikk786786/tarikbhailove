import React from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';

/* ══════════════════════════════════════════════════════════════
   INPUT BAR — Clean, friendly, easy to use
══════════════════════════════════════════════════════════════ */

interface InputBarProps {
  input: string;
  setInput: (v: string) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onSubmit: (e: React.FormEvent) => void;
  messageCount: number;
}

export function InputBar({ input, setInput, isLoading, inputRef, onSubmit, messageCount }: InputBarProps) {
  const MAX = 2000;
  const overLimit = input.length > MAX;

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

  const placeholder = messageCount === 0
    ? 'Ask me anything — coding, research, ideas, life advice…'
    : 'Type your next message…';

  return (
    <div className="input-zone glass">
      <form className="input-form" onSubmit={onSubmit}>
        {/* Sparkle icon */}
        <div className="input-sparkle">
          <Sparkles size={18} />
        </div>

        <input
          ref={inputRef}
          type="text"
          className="input-field"
          placeholder={placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={isLoading}
          maxLength={MAX + 50}
          autoFocus
          aria-label="Message input"
          id="message-input"
        />

        {/* Character count (only when close to limit) */}
        {input.length > 1500 && (
          <span className="char-counter" style={{ color: overLimit ? '#ef4444' : input.length > 1800 ? '#f59e0b' : undefined }}>
            {input.length}/{MAX}
          </span>
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
          Press Enter to send
        </span>
        <span className="input-hint">
          Tarik Bhai AI · Beyond Space Beyond Time
        </span>
      </div>
    </div>
  );
}
