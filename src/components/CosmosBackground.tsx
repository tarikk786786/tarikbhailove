import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useMemo } from 'react';
import { 
  Code, Bot, Globe, Smartphone, Shield, Brain, 
  Database, Book, FlaskConical, Calculator, Briefcase, Palette 
} from 'lucide-react';

const CONSTELLATIONS = [
  { icon: Code, label: "Software Engineering", color: "text-blue-400", bg: "bg-blue-400/20" },
  { icon: Bot, label: "Intelligence", color: "text-purple-400", bg: "bg-purple-400/20" },
  { icon: Globe, label: "Web", color: "text-cyan-400", bg: "bg-cyan-400/20" },
  { icon: Smartphone, label: "Mobile", color: "text-green-400", bg: "bg-green-400/20" },
  { icon: Shield, label: "Security", color: "text-red-400", bg: "bg-red-400/20" },
  { icon: Brain, label: "Machine Learning", color: "text-pink-400", bg: "bg-pink-400/20" },
  { icon: Database, label: "Data Science", color: "text-yellow-400", bg: "bg-yellow-400/20" },
  { icon: Book, label: "Literature", color: "text-emerald-400", bg: "bg-emerald-400/20" },
  { icon: FlaskConical, label: "Science", color: "text-indigo-400", bg: "bg-indigo-400/20" },
  { icon: Calculator, label: "Math", color: "text-violet-400", bg: "bg-violet-400/20" },
  { icon: Briefcase, label: "Business", color: "text-amber-400", bg: "bg-amber-400/20" },
  { icon: Palette, label: "Design", color: "text-rose-400", bg: "bg-rose-400/20" },
];

const WORDS = [
  "Artificial Intelligence", "Quantum", "Forensics", "Cybersecurity",
  "Neural Networks", "Data", "Research", "Science",
  "Engineering", "Astrophysics", "Algorithms", "Mathematics",
  "Deep Learning", "Cryptography", "Innovation"
];

function BinaryRain() {
  const columns = useMemo(() => Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 6,
    chars: Array.from({ length: 6 + Math.floor(Math.random() * 10) }).map(() => Math.random() > 0.5 ? '1' : '0')
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }}>
      {columns.map(col => (
        <motion.div
          key={col.id}
          initial={{ y: '-100vh' }}
          animate={{ y: '100vh' }}
          transition={{ duration: col.duration, delay: col.delay, repeat: Infinity, ease: 'linear' }}
          className="absolute text-green-500/80 font-mono text-[10px] flex flex-col items-center"
          style={{ left: `${col.left}%` }}
        >
          {col.chars.map((char, i) => (
            <span key={i} style={{ opacity: Math.max(0.1, 1 - (i / col.chars.length)) }}>{char}</span>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

function HexGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='103.92304845413264' viewBox='0 0 60 103.92304845413264' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 103.92304845413264L0 86.60254037844386L0 51.96152422706632L30 34.64101615137754L60 51.96152422706632L60 86.60254037844386Z M30 0L0 17.32050807568877L0 51.96152422706632L30 34.64101615137754L60 51.96152422706632L60 17.32050807568877Z M30 69.28203230275508L0 51.96152422706632L30 34.64101615137754L60 51.96152422706632Z' fill='none' stroke='%23ffffff' stroke-width='1' stroke-opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 103.92px',
          maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 80%)'
        }}
      />
    </div>
  );
}

function FloatingNodes() {
  const nodes = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    startX: Math.random() * 100,
    startY: Math.random() * 100,
    duration: 20 + Math.random() * 30,
    delay: Math.random() * 5
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {nodes.map(n => (
        <motion.div
          key={n.id}
          animate={{
            x: [`${n.startX}vw`, `${(n.startX + 20) % 100}vw`, `${(n.startX - 10 + 100) % 100}vw`, `${n.startX}vw`],
            y: [`${n.startY}vh`, `${(n.startY - 20 + 100) % 100}vh`, `${(n.startY + 15) % 100}vh`, `${n.startY}vh`],
            opacity: [0.1, 0.6, 0.1]
          }}
          transition={{ duration: n.duration, repeat: Infinity, ease: "linear" }}
          className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"
        />
      ))}
    </div>
  );
}

function Starfield() {
  const stars = useMemo(() => {
    return Array.from({ length: 250 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: 0.1,
          }}
          animate={{
            opacity: [0.1, 0.8, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function DataStreams() {
  const streams = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    content: Math.random() > 0.5 ? WORDS[Math.floor(Math.random() * WORDS.length)] : ['0101', '∑', '∆', '⚡', '∞', '</>'][Math.floor(Math.random() * 6)],
    angle: Math.random() * Math.PI * 2,
    distance: 350 + Math.random() * 500,
    delay: Math.random() * 15,
    duration: 15 + Math.random() * 10
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
      {streams.map(s => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, x: Math.cos(s.angle) * s.distance, y: Math.sin(s.angle) * s.distance }}
          animate={{ opacity: [0, 0.6, 0], x: 0, y: 0 }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "linear" }}
          className="absolute font-mono text-[10px] md:text-xs text-accent/60 whitespace-nowrap shadow-[0_0_10px_rgba(255,213,79,0.3)]"
          style={{ transform: `rotate(${s.angle + Math.PI}rad)` }}
        >
          {s.content}
        </motion.div>
      ))}
    </div>
  );
}

export function CosmosBackground() {
  const [scene, setScene] = useState(0);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsThinking(true);
    const handleEnd = () => setIsThinking(false);

    window.addEventListener('ai-thinking-start', handleStart);
    window.addEventListener('ai-thinking-end', handleEnd);

    const timer1 = setTimeout(() => setScene(1), 2000); // Earth -> Cosmos
    const timer2 = setTimeout(() => setScene(2), 5000); // Pulses
    const timer3 = setTimeout(() => setScene(3), 8000); // Constellations
    
    return () => {
      window.removeEventListener('ai-thinking-start', handleStart);
      window.removeEventListener('ai-thinking-end', handleEnd);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-[#020205] overflow-hidden perspective-1000">
      <HexGrid />
      <BinaryRain />
      <Starfield />
      <DataStreams />
      <FloatingNodes />

      {/* Aurora Waves / Nebula */}
      <div className="absolute inset-0 opacity-30 mix-blend-screen pointer-events-none">
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(120,0,255,0.15)_0%,transparent_70%)] rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] left-[-10%] w-[90vw] h-[90vw] max-w-[900px] max-h-[900px] bg-[radial-gradient(ellipse_at_center,rgba(0,200,255,0.15)_0%,transparent_70%)] rounded-full blur-[100px]"
        />
      </div>

      {/* Constellations */}
      <AnimatePresence>
        {scene >= 3 && CONSTELLATIONS.map((constellation, i) => {
          const angle = (i * 360) / CONSTELLATIONS.length;
          const radius = 280 + Math.random() * 120;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;
          const delay = i * 0.1;

          return (
            <motion.div
              key={constellation.label}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{ opacity: 1, scale: 1, x, y: y - 40 }} // Adjust Y for centering
              transition={{ duration: 1.5, delay, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 flex items-center gap-2 pointer-events-none"
              style={{ marginLeft: '-16px', marginTop: '-16px' }}
            >
              {/* Connection Line to Center */}
              <motion.svg 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: delay + 1 }}
                className="absolute top-4 left-4 overflow-visible pointer-events-none -z-10"
              >
                <line x1="0" y1="0" x2={-x} y2={-y} stroke="url(#gradient)" strokeWidth="1.5" strokeDasharray="4 4">
                  <animate attributeName="stroke-dashoffset" values="8;0" dur="2s" repeatCount="indefinite" />
                </line>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD54F" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </motion.svg>

              <div className={`w-10 h-10 rounded-full ${constellation.bg} border border-white/20 flex items-center justify-center backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.1)] animate-float`} style={{ animationDelay: `${i * 0.5}s` }}>
                <constellation.icon size={18} className={constellation.color} />
              </div>
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 0.9, x: 0 }}
                transition={{ delay: delay + 0.5 }}
                className="text-xs font-mono tracking-wider uppercase text-white/90 whitespace-nowrap hidden md:block"
                style={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}
              >
                {constellation.label}
              </motion.span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
