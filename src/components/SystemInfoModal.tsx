import { motion, AnimatePresence } from 'motion/react';
import { X, Cpu, Network, Monitor, Globe, HardDrive } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SystemInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SystemInfoModal({ isOpen, onClose }: SystemInfoModalProps) {
  const [systemInfo, setSystemInfo] = useState<any>({});

  useEffect(() => {
    if (isOpen) {
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

      fetch('/api/system-info')
        .then(res => res.json())
        .then(data => {
          setSystemInfo({
            ip: data.ip || 'Encrypted/Hidden',
            os: `${os} (${platform})`,
            browser,
            resolution: `${screenW}x${screenH}`,
            language: lang,
            timeZone,
            network,
            userAgent: ua
          });
        })
        .catch(() => {
          setSystemInfo({
            ip: 'Encrypted/Hidden',
            os: `${os} (${platform})`,
            browser,
            resolution: `${screenW}x${screenH}`,
            language: lang,
            timeZone,
            network,
            userAgent: ua
          });
        });
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#0a0e17] border border-cyan-500/30 rounded-2xl shadow-[0_0_40px_rgba(34,211,238,0.15)] overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600" />
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Cpu className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-wide">System Details</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 font-mono text-sm">
                <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400/70 flex items-center gap-2"><Globe size={14} /> IP Address</span>
                    <span className="text-white font-medium">{systemInfo.ip || 'Scanning...'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400/70 flex items-center gap-2"><HardDrive size={14} /> OS</span>
                    <span className="text-white font-medium">{systemInfo.os || 'Scanning...'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400/70 flex items-center gap-2"><Monitor size={14} /> Resolution</span>
                    <span className="text-white font-medium">{systemInfo.resolution || 'Scanning...'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400/70 flex items-center gap-2"><Network size={14} /> Network</span>
                    <span className="text-white font-medium">{systemInfo.network || 'Scanning...'}</span>
                  </div>
                </div>

                <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400/70">Browser</span>
                    <span className="text-white font-medium">{systemInfo.browser || 'Scanning...'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400/70">Timezone</span>
                    <span className="text-white font-medium">{systemInfo.timeZone || 'Scanning...'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400/70">Language</span>
                    <span className="text-white font-medium">{systemInfo.language || 'Scanning...'}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
