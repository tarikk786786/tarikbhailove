import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo } from 'react';

const WORDS = [
  "Limitless Knowledge", "Infinite Wisdom", "Physics", "Astronomy",
  "Cyber Security", "Programming", "Innovation", "Engineering",
  "Science", "Research", "Deep Exploration", "Discovery",
  "Algorithms", "Mathematics", "Quantum Theory", "Space Exploration",
  "Design", "Automation", "Creativity", "Future Concepts"
];

const PREVIEWS = [
  "✓ Knowledge Connected",
  "✓ Research Updated",
  "✓ Ideas Organized",
  "✓ New Concepts Visualized",
  "✓ Information Streams Active",
  "✓ Neural Matrix Expanding",
  "✓ Creative Workspace Ready",
  "✓ Core Intelligence Stable"
];

const COLORS = [
  '#3b82f6', // Tech - Blue
  '#8b5cf6', // Science - Purple
  '#10b981', // Eng - Green
  '#eab308', // Math - Yellow
  '#ef4444', // Creativity - Red
  '#ffffff', // Research - White
  '#f97316'  // Innovation - Orange
];

// Scene 1: Cosmic Darkness
function CosmicDarkness() {
  const stars = useMemo(() => Array.from({ length: 250 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 5
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div 
        initial={{ scale: 1 }}
        animate={{ scale: 1.2 }}
        transition={{ duration: 30, ease: "linear" }}
        className="absolute inset-0"
      >
        {stars.map(s => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0.1, 0.7] }}
            transition={{ duration: 4 + Math.random() * 3, delay: s.delay, repeat: Infinity }}
            className="absolute rounded-full bg-white"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          />
        ))}
        {/* Massive Spiral Galaxy */}
        <motion.div
          initial={{ opacity: 0, rotateZ: 0, rotateX: 60 }}
          animate={{ opacity: 0.5, rotateZ: 360 }}
          transition={{ duration: 60, ease: "linear", opacity: { duration: 4 } }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] max-w-[1500px] max-h-[1500px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.05) 40%, transparent 70%)',
            filter: 'blur(60px)'
          }}
        />
      </motion.div>
    </div>
  );
}

// Scene 2: Information Awakening
function InformationAwakening() {
  const particles = useMemo(() => Array.from({ length: 150 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: Math.random() * 3 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.8, 0], scale: [0, 1.5, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity }}
          className="absolute rounded-full shadow-[0_0_10px_currentColor]"
          style={{ 
            left: `${p.x}%`, 
            top: `${p.y}%`, 
            width: p.size, 
            height: p.size,
            backgroundColor: p.color,
            color: p.color
          }}
        />
      ))}
    </div>
  );
}

// Scene 3: Cosmic Information Stream
function InformationStreams() {
  const streams = useMemo(() => Array.from({ length: 60 }).map((_, i) => {
    const isWord = Math.random() > 0.6;
    const content = isWord ? WORDS[Math.floor(Math.random() * WORDS.length)] : ['{ }', '</>', '∑', '∆', 'π', '0101', '∞', '⚡'][Math.floor(Math.random() * 8)];
    const angle = Math.random() * Math.PI * 2;
    const distance = 400 + Math.random() * 600;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      id: i,
      content,
      angle,
      distance,
      color,
      delay: Math.random() * 4,
      duration: 4 + Math.random() * 3
    };
  }), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
      {streams.map(s => (
        <motion.div
          key={s.id}
          initial={{ 
            opacity: 0, 
            x: Math.cos(s.angle) * s.distance, 
            y: Math.sin(s.angle) * s.distance,
            scale: 0.5,
            rotate: Math.random() * 90 - 45
          }}
          animate={{ 
            opacity: [0, 1, 1, 0], 
            x: 0, 
            y: 0,
            scale: 1,
            rotate: 0
          }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
          className="absolute font-mono whitespace-nowrap text-xs md:text-sm text-shadow-glow"
          style={{ 
            color: s.color,
            textShadow: `0 0 15px ${s.color}`
          }}
        >
          {s.content}
        </motion.div>
      ))}
    </div>
  );
}

// Scene 5: Quantum Core
function QuantumCore() {
  return (
    <motion.div 
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 3, ease: "easeOut" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 flex items-center justify-center pointer-events-none"
    >
      {/* Neural Network Rings */}
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border border-blue-400/30 shadow-[0_0_50px_rgba(59,130,246,0.3)]" style={{ borderStyle: 'dashed' }}></motion.div>
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-4 rounded-full border-2 border-purple-400/30 shadow-[0_0_50px_rgba(139,92,246,0.3)]" style={{ borderStyle: 'dotted' }}></motion.div>
      
      {/* Crystal Sphere */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.9, 0.7] }} 
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-tr from-blue-600/40 via-purple-600/40 to-white/30 blur-xl backdrop-blur-3xl border border-white/20"
      ></motion.div>

      {/* Central Light / Pulse */}
      <motion.div 
        animate={{ boxShadow: ['0 0 40px rgba(255,255,255,0.5)', '0 0 80px rgba(255,255,255,1)', '0 0 40px rgba(255,255,255,0.5)'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-[0_0_60px_rgba(255,255,255,1)]"
      ></motion.div>
    </motion.div>
  );
}

// Scene 6: Live Preview
function LivePreviews() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center animate-rotate-slow" style={{ animationDuration: '35s' }}>
      {PREVIEWS.map((text, i) => {
        const angle = (i * 360) / PREVIEWS.length;
        const radius = 280; // Distance from center
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;
        
        return (
          <div 
            key={i} 
            className="absolute"
            style={{ transform: `translate(${x}px, ${y}px)` }}
          >
            {/* Reverse rotation keeps text upright */}
            <div className="animate-reverse-rotate-slow" style={{ animationDuration: '35s' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 1, delay: i * 0.4, ease: "easeOut" }}
                className="px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg text-xs md:text-sm font-mono text-green-400 shadow-[0_0_30px_rgba(16,185,129,0.2)] whitespace-nowrap"
              >
                {text}
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CinematicBoot({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Scene 1: Cosmic Darkness (0-3s)
    // Scene 2: Information Awakening (3-7s)
    // Scene 3+4: Cosmic Information Stream (7-12s)
    // Scene 5: Quantum Core (12-16s)
    // Scene 6: Live Preview (16-24s)
    // Scene 7: Complete (24s+)
    
    const sequence = [
      { p: 1, t: 0 },
      { p: 2, t: 400 },
      { p: 3, t: 1000 },
      { p: 4, t: 1600 },
      { p: 5, t: 2200 },
      { p: 6, t: 3000 }
    ];

    const timeouts = sequence.map(seq => setTimeout(() => {
      setPhase(seq.p);
      if (seq.p === 6) {
        setTimeout(onComplete, 800); // Give time for flash transition
      }
    }, seq.t));

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#010103] overflow-hidden flex items-center justify-center">
      <AnimatePresence>
        <CosmicDarkness key="darkness" />

        {phase >= 2 && phase < 6 && (
          <motion.div key="awakening" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2 }}>
            <InformationAwakening />
          </motion.div>
        )}

        {phase >= 3 && phase < 6 && (
          <motion.div key="streams" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2 }}>
            <InformationStreams />
          </motion.div>
        )}

        {phase >= 4 && (
          <motion.div key="core" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2 }}>
            <QuantumCore />
          </motion.div>
        )}

        {phase >= 5 && phase < 6 && (
          <LivePreviews key="previews" />
        )}

      </AnimatePresence>

      {/* Screen flash transitioning out */}
      <AnimatePresence>
        {phase === 6 && (
          <motion.div 
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-white z-[110] mix-blend-overlay pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
