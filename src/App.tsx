import { useState } from 'react';
import { CinematicBoot } from './components/CinematicBoot';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Chat } from './components/Chat';
import { AnimatePresence, motion } from 'motion/react';

import { CosmosBackground } from './components/CosmosBackground';
import { useAnimatedFavicon } from './hooks/useAnimatedFavicon';

export default function App() {
  useAnimatedFavicon();
  const [bootPhase, setBootPhase] = useState<'booting' | 'app'>('booting');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-[100dvh] w-full flex bg-[#020205] text-white overflow-hidden selection:bg-accent/30 font-sans relative">
      <AnimatePresence mode="wait">
        {bootPhase === 'booting' && (
          <CinematicBoot key="boot" onComplete={() => setBootPhase('app')} />
        )}
      </AnimatePresence>

      {/* Global Background Elements */}
      {bootPhase === 'app' && <CosmosBackground />}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col relative z-10 min-w-0">
        {bootPhase === 'app' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Topbar onMenuClick={() => setSidebarOpen(true)} />
          </motion.div>
        )}
        <main className="flex-1 relative overflow-hidden flex flex-col">
          {bootPhase === 'app' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="w-full h-full flex flex-col"
            >
              <Chat />
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
