import { motion, AnimatePresence } from 'motion/react';
import { Menu, Info, Clock, Zap, Cpu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AboutModal } from './AboutModal';
import { SystemInfoModal } from './SystemInfoModal';

interface TopbarProps {
  onMenuClick: () => void;
}

const SUPPORTIVE_MESSAGES = [
  "I believe in you, yaar. You've got this!",
  "Always here to support you. Keep pushing forward!",
  "Your potential is limitless. Don't stop now!",
  "Tension mat le, I'm with you on this journey!",
  "Every step you take is progress. Keep shining!",
  "You're stronger than you think. I believe in your success!",
  "I am always here for you. Trust yourself!"
];

export function Topbar({ onMenuClick }: TopbarProps) {
  const [time, setTime] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSystemInfoOpen, setIsSystemInfoOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportTimeout, setSupportTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleThunderClick = () => {
    const randomMessage = SUPPORTIVE_MESSAGES[Math.floor(Math.random() * SUPPORTIVE_MESSAGES.length)];
    setSupportMessage(randomMessage);
    
    if (supportTimeout) {
      clearTimeout(supportTimeout);
    }
    
    const timeout = setTimeout(() => {
      setSupportMessage('');
    }, 4000);
    setSupportTimeout(timeout);
  };

  return (
    <>
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-16 glass z-10 flex items-center justify-between px-4 md:px-6 shrink-0 border-b border-white/10 relative shadow-md"
      >
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={handleThunderClick}
            className="flex items-center gap-2 text-cyan-400 font-bold tracking-widest text-sm md:text-base mr-2 hover:text-white transition-colors cursor-pointer outline-none"
          >
            <Zap size={18} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" />
            <span className="hidden sm:block uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Tarik Bhai AI</span>
          </button>
        </div>

        {/* Cool Center Clock */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center justify-center px-4 md:px-8 py-1.5 md:py-2 rounded-2xl bg-black/60 border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-lg">
            <div className="flex items-center gap-2 text-sm md:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)] font-mono tracking-[0.2em]">
              <Clock size={16} className="text-cyan-400 animate-pulse hidden sm:block" />
              <span>{time}</span>
            </div>
            <div className="text-[9px] md:text-[11px] font-mono text-cyan-400/80 tracking-[0.3em] uppercase mt-0.5 md:mt-1">
              {dateStr}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-5 flex-1 justify-end">
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-text-dim mr-2 bg-black/20 px-3 py-1 rounded-full border border-white/5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
            <span className="text-green-400/90 tracking-wider">SYSTEM SECURE</span>
          </div>

          <button 
            onClick={() => setIsSystemInfoOpen(true)}
            title="System Details"
            className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full text-cyan-400 hover:text-white transition-all bg-cyan-950/30 border border-cyan-500/30 hover:bg-cyan-900/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]"
          >
            <Cpu size={16} />
          </button>

          <button 
            onClick={() => setIsAboutOpen(true)}
            title="About Tarik Bhai"
            className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full text-cyan-400 hover:text-white transition-all bg-cyan-950/30 border border-cyan-500/30 hover:bg-cyan-900/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]"
          >
            <Info size={16} />
          </button>
        </div>
      </motion.header>
      
      <SystemInfoModal isOpen={isSystemInfoOpen} onClose={() => setIsSystemInfoOpen(false)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      <AnimatePresence>
        {supportMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-20 left-1/2 z-50 flex items-center gap-3 px-6 py-3 bg-black/80 border border-cyan-500/50 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.4)]"
          >
            <Zap size={16} className="text-yellow-400 animate-pulse" />
            <span className="text-cyan-50 text-sm md:text-base font-medium tracking-wide">
              {supportMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
