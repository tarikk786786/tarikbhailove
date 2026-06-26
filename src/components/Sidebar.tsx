import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Settings, Plus, X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        animate={{ x: isOpen ? 0 : (window.innerWidth < 768 ? -320 : 0) }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className={`fixed md:relative top-0 left-0 h-full z-50 w-64 glass-panel border-r border-white/5 flex flex-col pt-6 pb-6 px-4 shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center shadow-[0_0_15px_rgba(255,213,79,0.4)] shrink-0">
              <span className="font-bold text-primary text-xs tracking-tighter">TB</span>
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide text-white leading-tight">TARIK BHAI</h1>
              <p className="text-[9px] text-accent/80 uppercase tracking-widest font-mono mt-0.5">Workspace</p>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden p-1 text-text-dim hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

      <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-cyan-400 text-primary font-bold hover:bg-cyan-300 transition-colors mb-6 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
        <Plus size={18} />
        <span className="text-sm tracking-wide">New Session</span>
      </button>

      <div className="flex-1 space-y-1 overflow-y-auto pr-1">
        <div className="text-[10px] font-bold text-cyan-400/50 uppercase tracking-widest mb-3 px-2">Active Protocols</div>
        
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-300 group relative backdrop-blur-sm">
          <MessageSquare size={16} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <span className="text-sm font-medium truncate">Master Core</span>
          <motion.div 
            layoutId="active-indicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"
          />
        </button>
      </div>

        <div className="mt-4 pt-4 border-t border-white/5">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-dim hover:bg-white/5 hover:text-white transition-all group mb-2">
            <Settings size={16} className="group-hover:text-white" />
            <span className="text-sm font-medium">Settings</span>
          </button>
          
          <div className="p-3 rounded-xl bg-card/50 border border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-secondary to-accent p-[1px] shrink-0">
              <div className="w-full h-full bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">U</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">User Workspace</p>
              <p className="text-[10px] text-success flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success"></span> Online
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
