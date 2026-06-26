import { motion } from 'motion/react';
import { 
  MessageSquare, Bot, Code, Search,
  ChevronRight, Sparkles
} from 'lucide-react';
import { View } from '../types';

interface WelcomeProps {
  onNavigate: (view: View) => void;
}

export function Welcome({ onNavigate }: WelcomeProps) {
  const cards = [
    { id: 'chat', title: 'Workspace', desc: 'General intelligence & reasoning', icon: MessageSquare, color: 'from-accent to-orange-500' },
    { id: 'agents', title: 'Specialized Agents', desc: 'Deploy task-specific units', icon: Bot, color: 'from-accent-secondary to-blue-600' },
    { id: 'code', title: 'Code Studio', desc: 'Build, debug, and ship faster', icon: Code, color: 'from-purple-500 to-pink-500' },
    { id: 'research', title: 'Deep Research', desc: 'Synthesize complex info', icon: Search, color: 'from-success to-emerald-700' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-medium mb-6">
            <Sparkles size={12} />
            <span>Workspace Online</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Welcome to <span className="text-gradient-gold">Tarik Bhai</span>
          </h1>
          <p className="text-lg md:text-xl text-text-dim font-light tracking-wide">
            One Workspace. Unlimited Intelligence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              onClick={() => onNavigate(card.id as View)}
              className="glass p-6 rounded-2xl cursor-pointer group hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`}></div>
              
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} p-[1px]`}>
                    <div className="w-full h-full bg-card rounded-xl flex items-center justify-center">
                      <card.icon size={20} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-accent transition-colors">{card.title}</h3>
                    <p className="text-sm text-text-dim">{card.desc}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent/50 group-hover:bg-accent/10 transition-all">
                  <ChevronRight size={16} className="text-text-dim group-hover:text-accent" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="glass rounded-2xl p-6 md:p-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent pointer-events-none"></div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Initialize New Project</h2>
              <p className="text-text-dim text-sm max-w-md">Start a new intelligent workspace with pre-configured agents, memory, and tool integrations.</p>
            </div>
            <button className="glass-button px-6 py-3 rounded-xl text-white font-medium flex items-center gap-2 shrink-0">
              <span className="text-accent font-bold text-xl leading-none mb-0.5">+</span> Create Workspace
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
