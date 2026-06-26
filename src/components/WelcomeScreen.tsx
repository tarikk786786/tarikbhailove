import { useEffect, useRef, useState } from 'react';

/* ══════════════════════════════════════════════════════════════
   WELCOME SCREEN — Epic animated entrance with AI core visual
══════════════════════════════════════════════════════════════ */

const CAPABILITIES = [
  { icon: '🧠', label: 'Deep Research', desc: 'Exhaustive knowledge from every domain of human understanding' },
  { icon: '💻', label: 'Code Mastery', desc: 'From algorithms to full-stack systems, built with precision' },
  { icon: '🌌', label: 'Science & Tech', desc: 'Quantum physics, AI, space exploration and beyond' },
  { icon: '💡', label: 'Creative Ideas', desc: 'Business, strategy, innovation and problem solving' },
  { icon: '🌍', label: 'World Knowledge', desc: 'History, culture, philosophy and geopolitics' },
  { icon: '⚡', label: 'Instant Answers', desc: 'Complex topics broken down with clarity and depth' },
];

const QUICK_PROMPTS = [
  'Explain quantum entanglement',
  'Build a startup from scratch',
  'How does the universe work?',
  'Best coding practices in 2025',
  'Decode the human brain',
  'Future of AI technology',
];

// Typewriter hook
function useTypewriter(texts: string[], speed = 55) {
  const [display, setDisplay] = useState('');
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIdx];
    const pause = deleting ? 40 : speed;

    const timer = setTimeout(() => {
      if (!deleting && charIdx < current.length) {
        setDisplay(current.slice(0, charIdx + 1));
        setCharIdx(c => c + 1);
      } else if (!deleting && charIdx === current.length) {
        setTimeout(() => setDeleting(true), 2200);
      } else if (deleting && charIdx > 0) {
        setDisplay(current.slice(0, charIdx - 1));
        setCharIdx(c => c - 1);
      } else {
        setDeleting(false);
        setTextIdx(i => (i + 1) % texts.length);
      }
    }, pause);

    return () => clearTimeout(timer);
  }, [charIdx, deleting, textIdx, texts, speed]);

  return display;
}

interface WelcomeScreenProps {
  onPrompt: (text: string) => void;
}

export function WelcomeScreen({ onPrompt }: WelcomeScreenProps) {
  const typeText = useTypewriter([
    'Your Digital Mentor',
    'Omega Knowledge Guide',
    'Beyond Space & Time',
    'Limitless Intelligence',
  ]);

  // Orbit particles
  const orbitParticles = [
    { color: '#a78bfa', r: 95, spd: '8s', start: '0deg', size: 5 },
    { color: '#60a5fa', r: 95, spd: '8s', start: '120deg', size: 4 },
    { color: '#f0abfc', r: 95, spd: '8s', start: '240deg', size: 5 },
    { color: '#fbbf24', r: 72, spd: '12s', start: '60deg', size: 3 },
    { color: '#34d399', r: 72, spd: '12s', start: '180deg', size: 3 },
    { color: '#06b6d4', r: 72, spd: '12s', start: '300deg', size: 4 },
  ];

  return (
    <div className="welcome-wrap">
      {/* AI Core visual */}
      <div className="ai-core-wrap">
        <div className="core-rings">
          <div className="core-ring" />
          <div className="core-ring" />
          <div className="core-ring" />
        </div>

        {/* Orbiting particles */}
        {orbitParticles.map((p, i) => (
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

      {/* Eyebrow */}
      <p className="welcome-eyebrow">◈ Initialized • AI System Online ◈</p>

      {/* Title */}
      <h1 className="welcome-title-main">
        <span className="gradient-text">Tarik Bhai AI</span>
      </h1>

      {/* Typewriter subtitle */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'clamp(0.85rem, 2vw, 1rem)',
        color: 'var(--nebula-3)',
        letterSpacing: '0.08em',
        marginBottom: '1rem',
        height: '1.5em',
        opacity: 0,
        animation: 'fadeUp 0.9s 0.45s var(--ease-out) forwards',
      }}>
        {typeText}<span style={{ animation: 'thinkingFlicker 1s infinite', display: 'inline-block', marginLeft: '1px' }}>▊</span>
      </div>

      {/* Tagline */}
      <p className="welcome-tagline">
        An <em>advanced digital consciousness</em> with mastery over all knowledge —
        science, technology, code, business, history, philosophy and beyond.
        Ask anything. Receive <em>extraordinary answers</em>.
      </p>

      {/* Capabilities grid */}
      <div className="cap-grid">
        {CAPABILITIES.map((cap, i) => (
          <button
            key={i}
            className="cap-card"
            onClick={() => onPrompt(cap.label)}
            style={{ animationDelay: `${0.65 + i * 0.07}s` }}
          >
            <span className="cap-icon">{cap.icon}</span>
            <div className="cap-label">{cap.label}</div>
            <div className="cap-desc">{cap.desc}</div>
          </button>
        ))}
      </div>

      {/* Quick prompts */}
      <div className="quick-prompts">
        {QUICK_PROMPTS.map((p, i) => (
          <button
            key={i}
            className="qprompt"
            onClick={() => onPrompt(p)}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
