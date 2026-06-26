import { motion } from 'motion/react';
import { 
  Paperclip, Send, Sparkles, 
  Bot, User, Zap
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function Chat() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [progressState, setProgressState] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    
    const runSystemScan = async () => {
      if (!isMounted) return;
      
      const ua = navigator.userAgent;
      const platform = navigator.platform || (navigator as any).userAgentData?.platform || 'Unknown';
      const lang = navigator.language;
      const screenW = window.screen.width;
      const screenH = window.screen.height;
      let timeZone = 'Unknown';
      try {
        timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      } catch (e) {}
      
      const nav = navigator as any;
      const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
      const network = connection ? `${connection.effectiveType || 'unknown'} (${connection.downlink || 0}Mbps)` : 'Unknown';
      
      const browser = ua.includes("Edg") ? "Edge" :
                      ua.includes("Firefox") ? "Firefox" : 
                      ua.includes("Chrome") ? "Chrome" : 
                      ua.includes("Safari") ? "Safari" : "Other";
                      
      const os = ua.includes("Windows") ? "Windows" : 
                 ua.includes("Mac") ? "MacOS" : 
                 ua.includes("Linux") ? "Linux" : 
                 ua.includes("Android") ? "Android" : 
                 ua.includes("iPhone") || ua.includes("iPad") ? "iOS" : "Unknown";

      // 1. Initial State
      setMessages([{ role: 'assistant', content: '> **Establishing secure connection...**' }]);
      await new Promise(r => setTimeout(r, 600));
      if (!isMounted) return;
      
      // 2. Fetching IP
      setMessages([{ role: 'assistant', content: '> **Establishing secure connection...**\n> Locating network details...' }]);
      let ip = "Tracing IP...";
      try {
        const res = await fetch('/api/system-info');
        const data = await res.json();
        ip = data.ip || "Unknown";
      } catch (err) {
        ip = "Encrypted/Hidden";
      }
      if (!isMounted) return;

      // 3. Scanning parts
      const scanSteps = [
        `> IP Located: ` + ip,
        `> OS Fingerprint: ` + os,
        `> Browser Hash: ` + browser,
        `> Screen Vector: ` + `${screenW}x${screenH}`,
      ];
      
      let currentContent = `> **Establishing secure connection...**\n> Locating network details...`;
      
      for (const step of scanSteps) {
        currentContent += `\n` + step;
        setMessages([{ role: 'assistant', content: currentContent }]);
        await new Promise(r => setTimeout(r, 400));
        if (!isMounted) return;
      }

      await new Promise(r => setTimeout(r, 500));
      if (!isMounted) return;

      // 4. Final
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
      const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
      
      const finalMsg = `${timeStr}\n${dateStr}\n\n**Welcome! Connection Securely Established.**\n\nIt's a pleasure to have you here, yaar. I've humbly noted down a few basic system details just so I can better assist you during our chat. Here is a quick look at your digital footprint:\n\n* **IP Address:** ` + ip + `\n* **Operating System:** ` + os + ` (` + platform + `)\n* **Browser:** ` + browser + `\n* **Screen Resolution:** ` + screenW + `x` + screenH + `\n* **Language:** ` + lang + `\n* **Timezone:** ` + timeZone + `\n* **Network:** ` + network + `\n* **User Agent Fingerprint:** \n  \`\`\`` + ua + `\`\`\`\n\nI am ready to answer anything in the universe. If the detail exists online, I will find it for you. How can I guide you today?`;
      setMessages([{ role: 'assistant', content: finalMsg }]);
    };

    runSystemScan();
    
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, progressState]);

  useEffect(() => {
    if (!isTyping) {
      setProgressState('');
      return;
    }
    
    const states = [
      '⚡ Understanding...',
      '🧠 Analyzing...',
      '📚 Organizing Information...',
      '✨ Building Response...',
    ];
    let i = 0;
    setProgressState(states[0]);
    const interval = setInterval(() => {
      i = (i + 1) % states.length;
      setProgressState(states[i]);
    }, 800);
    return () => clearInterval(interval);
  }, [isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input;
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);
    window.dispatchEvent(new Event('ai-thinking-start'));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');

      if (reader) {
        let aiText = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.text) {
                  aiText += data.text;
                  setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1].content = aiText;
                    return updated;
                  });
                }
              } catch (e) {
                console.error("Error parsing stream data:", e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please check your API key in Settings > Secrets or ensure the server is running.' }]);
    } finally {
      setIsTyping(false);
      window.dispatchEvent(new Event('ai-thinking-end'));
    }
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-transparent">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6 lg:p-10 z-10 scroll-smooth pb-40 md:pb-48">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-4 pb-20">
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
             >
               <h1 className="text-3xl md:text-5xl font-light mb-4 text-white/90 text-shadow-glow tracking-wider">⚡ YOUR BROTHER, TARIK BHAI, IS READY</h1>
               <p className="text-accent text-xs md:text-sm font-mono mt-6 leading-relaxed tracking-widest opacity-90 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                 Ideas Connected. <br/>
                 Absolute Knowledge Accessed. <br/>
                 The Infinite Information Universe Unlocked.
               </p>
             </motion.div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full space-y-6 md:space-y-8">
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 md:gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-card border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.2)] mt-1 animate-pulse-glow">
                    <Bot size={18} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  </div>
                )}
                
                <div className={`max-w-[88%] md:max-w-[80%] rounded-2xl p-4 md:p-5 ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-white rounded-tr-sm shadow-xl backdrop-blur-md' 
                    : 'bg-transparent text-gray-200'
                }`}>
                  <div className="leading-relaxed text-sm md:text-base prose prose-invert max-w-none">
                    <Markdown remarkPlugins={[remarkGfm]}>{msg.content}</Markdown>
                  </div>
                </div>
                
                {msg.role === 'user' && (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-1 shadow-lg backdrop-blur-md">
                    <User size={18} className="text-white" />
                  </div>
                )}
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 md:gap-4 justify-start"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-card border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,217,255,0.2)] mt-1 animate-pulse-glow">
                  <Bot size={18} className="text-cyan-400" />
                </div>
                <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-black/40 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)] text-sm text-cyan-400 font-mono relative overflow-hidden group backdrop-blur-md">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full animate-[shimmer_1s_infinite]" />
                  <span className="flex items-center gap-3 relative z-10 font-bold tracking-wider uppercase text-[11px] md:text-xs">
                     <div className="relative flex h-3 w-3">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 shadow-[0_0_8px_#22d3ee]"></span>
                     </div>
                     {progressState}
                     <span className="flex gap-1 ml-1">
                        <span className="w-1.5 h-1.5 bg-cyan-400/80 rounded-full animate-bounce shadow-[0_0_5px_#22d3ee]" style={{ animationDelay: '0ms', animationDuration: '600ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-cyan-400/80 rounded-full animate-bounce shadow-[0_0_5px_#22d3ee]" style={{ animationDelay: '150ms', animationDuration: '600ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-cyan-400/80 rounded-full animate-bounce shadow-[0_0_5px_#22d3ee]" style={{ animationDelay: '300ms', animationDuration: '600ms' }}></span>
                     </span>
                  </span>
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 w-full p-3 md:p-6 z-20 bg-gradient-to-t from-primary via-primary/90 to-transparent pt-12 pb-4 md:pb-8 pointer-events-none">
        <div className="max-w-4xl mx-auto relative pointer-events-auto">
          <div className="glass-panel rounded-3xl p-1.5 md:p-2 flex flex-col gap-1 md:gap-2 focus-within:border-cyan-400/50 focus-within:shadow-[0_0_40px_rgba(34,211,238,0.25)] shadow-2xl transition-all duration-300">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask Tarik Bhai anything..."
              className="w-full bg-transparent border-none resize-none p-3 md:p-4 text-white placeholder-cyan-100/30 focus:outline-none min-h-[50px] md:min-h-[60px] max-h-[150px] md:max-h-[200px] text-sm md:text-base font-medium"
              rows={1}
            />
            
            <div className="flex items-center justify-between px-2 pb-2">
              <div className="flex items-center gap-0.5 md:gap-1">
                {/* Removed Attachment and Auto-Route per user request */}
              </div>
              
              <div className="flex items-center gap-1 md:gap-2">
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="p-2 md:p-3 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-400 hover:text-black disabled:opacity-30 disabled:hover:bg-cyan-500/20 disabled:hover:text-cyan-400 transition-all border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)] disabled:shadow-none cursor-pointer"
                >
                  <Send size={18} className={`md:w-[20px] md:h-[20px] ${input.trim() ? "translate-x-0.5 -translate-y-0.5" : ""}`} />
                </button>
              </div>
            </div>
          </div>
          <div className="text-center mt-2 md:mt-3 text-[9px] md:text-[10px] text-text-dim/60 font-mono tracking-wide uppercase pb-1 md:pb-0">
          </div>
        </div>
      </div>
    </div>
  );
}
