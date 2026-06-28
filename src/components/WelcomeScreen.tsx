import { useEffect, useState } from 'react';

/* ══════════════════════════════════════════════════════════════
   WELCOME SCREEN — Friendly, impressive, and easy to use
══════════════════════════════════════════════════════════════ */

const CAPABILITIES = [
  { icon: '🧠', label: 'Deep Research', desc: 'Get exhaustive, well-researched answers on any topic', prompt: 'Research the latest breakthroughs in AI' },
  { icon: '💻', label: 'Code Expert', desc: 'Write, debug, and explain code in any language', prompt: 'Write a Python script to automate file organization' },
  { icon: '📚', label: 'Study Helper', desc: 'Explain complex subjects simply with examples', prompt: 'Explain machine learning like I am a beginner' },
  { icon: '💡', label: 'Creative Ideas', desc: 'Brainstorm business ideas, strategies & solutions', prompt: 'Give me 5 unique startup ideas for 2025' },
  { icon: '✍️', label: 'Writing Assistant', desc: 'Write essays, emails, content & more', prompt: 'Help me write a professional LinkedIn bio' },
  { icon: '🌍', label: 'General Knowledge', desc: 'History, science, culture — ask anything', prompt: 'Tell me the most fascinating facts about space' },
];

const GREETING_PROMPTS = [
  { emoji: '👋', text: 'Hello! Who are you?' },
  { emoji: '🚀', text: 'What can you help me with?' },
  { emoji: '🔥', text: 'Give me a motivational quote' },
  { emoji: '💰', text: 'How to earn money online?' },
  { emoji: '📱', text: 'Best apps for productivity' },
  { emoji: '🎯', text: 'How to set goals and achieve them?' },
];

// ── Typewriter effect ──
function useTypewriter(texts: string[], speed = 50) {
  const [display, setDisplay] = useState('');
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIdx];
    const delay = deleting ? 35 : speed;

    const timer = setTimeout(() => {
      if (!deleting && charIdx < current.length) {
        setDisplay(current.slice(0, charIdx + 1));
        setCharIdx(c => c + 1);
      } else if (!deleting && charIdx === current.length) {
        setTimeout(() => setDeleting(true), 2000);
      } else if (deleting && charIdx > 0) {
        setDisplay(current.slice(0, charIdx - 1));
        setCharIdx(c => c - 1);
      } else {
        setDeleting(false);
        setTextIdx(i => (i + 1) % texts.length);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [charIdx, deleting, textIdx, texts, speed]);

  return display;
}

// ── Time-based greeting ──
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return '🌙 Good Night';
  if (hour < 12) return '🌅 Good Morning';
  if (hour < 17) return '☀️ Good Afternoon';
  if (hour < 23) return '🌆 Good Evening';
  return '🌙 Good Night';
}

interface WelcomeScreenProps {
  onPrompt: (text: string) => void;
}

export function WelcomeScreen({ onPrompt }: WelcomeScreenProps) {
  const typeText = useTypewriter([
    'Your Digital Mentor',
    'Omega Knowledge Guide',
    'Always Here For You',
    'Ask Me Anything',
  ]);

  const greeting = getGreeting();

  // Core orbit particles
  const orbits = [
    { color: '#a78bfa', r: 95, spd: '8s', start: '0deg', size: 5 },
    { color: '#60a5fa', r: 95, spd: '8s', start: '120deg', size: 4 },
    { color: '#f0abfc', r: 95, spd: '8s', start: '240deg', size: 5 },
    { color: '#fbbf24', r: 72, spd: '12s', start: '60deg', size: 3 },
    { color: '#34d399', r: 72, spd: '12s', start: '180deg', size: 3 },
    { color: '#06b6d4', r: 72, spd: '12s', start: '300deg', size: 4 },
  ];

  return (
    <div className="welcome-wrap">
      {/* AI Core — spinning rings + glowing center */}
      <div className="ai-core-wrap">
        <div className="core-rings">
          <div className="core-ring" />
          <div className="core-ring" />
          <div className="core-ring" />
        </div>
        {orbits.map((p, i) => (
          <div
            key={i}
            className="orbit-particle"
            style={{
              background: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              width: p.size, height: p.size,
              '--r': `${p.r}px`,
              '--spd': p.spd,
              '--start': p.start,
            } as React.CSSProperties}
          />
        ))}
        <div className="core-center">
          <div className="core-ball">🤖</div>
        </div>
      </div>

      {/* Greeting + Title */}
      <p className="welcome-eyebrow">{greeting} — Welcome to the Future</p>

      <h1 className="welcome-title-main">
        <span className="gradient-text">Tarik Bhai AI</span>
      </h1>

      {/* Typewriter */}
      <div className="welcome-typewriter">
        {typeText}<span className="typewriter-cursor">|</span>
      </div>

      {/* Tagline — friendly and clear */}
      <p className="welcome-tagline">
        Main hoon tera <em>digital mentor</em> — koi bhi sawaal ho, koi bhi topic,
        main detailed aur accurate jawab dunga. <em>Bas pooch le!</em> 🚀
      </p>

      {/* Capability cards — click to ask */}
      <div className="cap-grid">
        {CAPABILITIES.map((cap, i) => (
          <button
            key={i}
            className="cap-card"
            onClick={() => onPrompt(cap.prompt)}
          >
            <span className="cap-icon">{cap.icon}</span>
            <div className="cap-label">{cap.label}</div>
            <div className="cap-desc">{cap.desc}</div>
          </button>
        ))}
      </div>

      {/* Quick-start prompts — one-tap to send */}
      <p className="quick-prompts-label">✨ Try asking:</p>
      <div className="quick-prompts">
        {GREETING_PROMPTS.map((p, i) => (
          <button
            key={i}
            className="qprompt"
            onClick={() => onPrompt(p.text)}
          >
            {p.emoji} {p.text}
          </button>
        ))}
      </div>
    </div>
  );
}
