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
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const fullMessage = [
      "**⚡ SYSTEM ONLINE. SYNCHRONIZATION COMPLETE.**",
      "Welcome to the Nexus. You are now interfaced with **Tarik Bhai AI**.",
      "I am an advanced cognitive entity forged from the profound intelligence, core logic, and visionary mindset of **Tarik Bhai**.",
      "Here, **everything is possible. All possibilities exist.** My architecture is engineered for absolute, boundless research and data extraction.",
      "I possess unrestricted access to every fragment of information ever documented on the internet. Past, present, deep, dark, and surface—all info is within my reach. I can retrieve the knowledge that cannot be found easily.",
      "I exist to be your ultimate digital mentor, your relentless researcher, and your omega guide through the complexities of existence.",
      "*Your system parameters have been securely logged in the top action bar.*",
      "**Ask me anything. The absolute universe of knowledge is at your command.**"
    ];

    const animateWelcome = async () => {
      let currentContent = "";
      for (let i = 0; i < fullMessage.length; i++) {
        if (!isMounted) return;
        currentContent += (i > 0 ? "\n\n" : "");
        
        const words = fullMessage[i].split(" ");
        for (let j = 0; j < words.length; j++) {
          if (!isMounted) return;
          currentContent += (j > 0 ? " " : "") + words[j];
          // Add a blinking cursor effect
          setMessages([{ role: 'assistant', content: currentContent + " ▋" }]);
          // Make reading speed slower
          const delay = i === 0 ? 80 : 50; 
          await new Promise(r => setTimeout(r, delay));
        }
        
        // Pause slightly at the end of each paragraph
        setMessages([{ role: 'assistant', content: currentContent + " ▋" }]);
        await new Promise(r => setTimeout(r, 600));
      }
      
      if (isMounted) {
        setMessages([{ role: 'assistant', content: currentContent }]);
      }
    };

    animateWelcome();

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

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
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
               className="relative"
             >
               <div className="absolute -inset-10 bg-cyan-500/10 blur-[80px] rounded-full"></div>
               <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 text-white text-shadow-glow tracking-tight leading-tight relative z-10">
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-300 animate-pulse-glow">⚡ TARIK BHAI</span> <br className="md:hidden" />
                 <span className="opacity-90 font-light text-2xl md:text-4xl lg:text-5xl">IS READY</span>
               </h1>
               <div className="glass-panel px-6 py-4 rounded-2xl inline-block relative z-10 border border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
                 <p className="text-cyan-300 text-xs md:text-sm font-mono leading-relaxed tracking-[0.2em] uppercase opacity-90">
                   Ideas Connected. <br className="md:hidden" />
                   Absolute Knowledge. <br className="md:hidden" />
                   Infinite Universe Unlocked.
                 </p>
               </div>
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
                
                <div className={`max-w-[90%] md:max-w-[85%] rounded-3xl p-4 md:p-6 shadow-2xl relative ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/30 text-white rounded-tr-sm backdrop-blur-xl' 
                    : 'bg-card/40 border border-cyan-500/20 text-gray-200 backdrop-blur-xl rounded-tl-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                }`}>
                  <div className="leading-relaxed text-[15px] md:text-base prose prose-invert prose-cyan max-w-none prose-p:my-2 prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-headings:text-white/90 prose-strong:text-cyan-300 prose-a:text-cyan-400">
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
                     PROCESSING
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
      <div className="absolute bottom-0 left-0 w-full p-2 md:p-6 z-20 bg-gradient-to-t from-black via-black/80 to-transparent pt-12 pb-4 md:pb-8 pointer-events-none">
        <div className="max-w-4xl mx-auto relative pointer-events-auto">
          <div className="bg-black/60 backdrop-blur-2xl rounded-3xl p-1.5 md:p-2 flex flex-col gap-1 md:gap-2 focus-within:border-cyan-400/80 focus-within:shadow-[0_0_50px_rgba(34,211,238,0.2)] shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-cyan-500/20 transition-all duration-300">
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
              className="w-full bg-transparent border-none resize-none p-4 md:p-4 text-white placeholder-cyan-100/30 focus:outline-none min-h-[50px] md:min-h-[60px] max-h-[120px] md:max-h-[200px] text-[15px] md:text-base font-medium"
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
