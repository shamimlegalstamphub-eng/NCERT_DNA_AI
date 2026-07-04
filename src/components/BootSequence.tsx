import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Shield, Cpu, Database, Binary, Activity } from "lucide-react";

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  console.log("Rendering BootSequence component");
  const [logs, setLogs] = useState<string[]>([]);
  const [percent, setPercent] = useState<number>(0);
  const [bootPhase, setBootPhase] = useState<number>(0); // 0: progress, 1: handshake, 2: completed
  const [initFailed, setInitFailed] = useState<boolean>(false);

  const bootStageMsgs = [
    "SYS_INIT: NCERT DNA INTELLIGENCE MODULE v18.4_FLAGSHIP",
    "DECRYPTING: Core NCERT NEET biology curriculum datasets...",
    "HANDSHAKE: Securing telemetry links with server-side nodes... [OK]",
    "MAPPING: Generating DNA high-yield grid layout maps [Vol I & II]...",
    "PREDICTIVE: Activating forensic PYQ regression and trend calculators...",
    "COGNITIVE: Initializing active recall Recovery Protocol engines...",
    "CLEARANCE: Ready for Retina clearance identification verification..."
  ];

  useEffect(() => {
    // Staggered log printing - accelerated to fit within 1.5 seconds
    let currentLogIndex = 0;
    const logInterval = setInterval(() => {
      if (currentLogIndex < bootStageMsgs.length) {
        setLogs(prev => [...prev, bootStageMsgs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(logInterval);
        setBootPhase(1);
      }
    }, 160);

    // Continuous progress percentage count
    const duration = 1600; // Fast loading time
    const start = Date.now();

    // Timeout fallback of 2.5 seconds to show "ENTER SYSTEM" button if any lag is detected
    const safetyTimeout = setTimeout(() => {
      setInitFailed(true);
      setBootPhase(1);
    }, 2500);

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - start;
      const computedPercent = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setPercent(computedPercent);
      if (computedPercent >= 100) {
        clearInterval(progressInterval);
        clearTimeout(safetyTimeout);
        setBootPhase(1);
        
        // Auto navigate after completion
        const autoNavTimer = setTimeout(() => {
          onComplete();
        }, 150);
      }
    }, 30);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
      clearTimeout(safetyTimeout);
    };
  }, []);

  return (
    <div id="boot-container" className="fixed inset-0 bg-[#05070B] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0A1224] via-[#05070B] to-[#010204] flex items-center justify-center font-mono overflow-hidden">
      {/* Visual Terminal Grid Accent Backplate */}
      <div className="absolute inset-0 opacity-12 bg-grid/10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(43, 127, 255, 0.15) 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
      
      {/* Ambient scanning lines overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.01)_0%,_transparent_100%)]"></div>
      
      <div className="relative w-full max-w-2xl px-6 py-8 border border-slate-800/80 bg-[#090E17]/90 rounded-none shadow-2xl shadow-blue-950/20 max-h-[85vh] flex flex-col justify-between">
        
        {/* Terminal Header Info */}
        <div id="boot-header" className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
            <span className="font-bold tracking-widest text-[#2B7FFF]">NCERT_DNA_AI // SYSV18</span>
          </div>
          <div className="text-slate-500">
            PORT: 3000 // CORE: ONLINE
          </div>
        </div>

        {/* Central Boot Graphic / Metrics */}
        <div id="boot-status" className="flex flex-col items-center justify-center my-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative w-24 h-24 mb-4 flex items-center justify-center border border-dashed border-blue-500/30 rounded-full"
          >
            {/* Rotating Outer Radar Scanner */}
            <div className="absolute inset-0 border-t-2 border-blue-500 animate-spin rounded-full"></div>
            {/* Center Terminal Icon */}
            <Activity className="w-10 h-10 text-[#2B7FFF] animate-pulse" />
          </motion.div>
          <div className="text-lg font-bold text-white tracking-widest mb-1">DECIPHERING BIOLOGY GENOME</div>
          <div className="text-xs text-blue-400/80 uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <Binary className="w-3.5 h-3.5 animate-bounce" /> Loading: {percent}%
          </div>
          
          {/* Progress Bar Container */}
          <div className="w-full bg-slate-900 h-1 mt-4 relative overflow-hidden border border-slate-800">
            <motion.div 
              className="bg-gradient-to-r from-blue-600 via-[#2B7FFF] to-blue-400 h-full"
              initial={{ width: "0%" }}
              animate={{ width: `${percent}%` }}
              transition={{ ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Terminal Log Output Window */}
        <div id="boot-terminal-pane" className="flex-1 bg-slate-950/80 border border-slate-900 p-4 h-48 overflow-y-auto mb-6 text-[11px] leading-relaxed text-slate-300 scrollbar-none custom-terminal-logs">
          <AnimatePresence>
            {logs.map((log, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-2 mb-1 pl-1 border-l border-blue-500/20"
              >
                <span className="text-[#2B7FFF] select-none">&gt;</span>
                <span>{log}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {percent < 100 && (
            <div className="flex items-center gap-1 text-blue-400 mt-2 animate-pulse">
              <span>_</span>
            </div>
          )}
        </div>

        {/* Action Phase Bar */}
        <div id="boot-footer" className="border-t border-slate-800 pt-4 flex justify-between items-center text-xs">
          <div className="text-slate-500 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5" /> SECURE HANDSHAKE: STANDBY
          </div>
          <div>
            <AnimatePresence>
              {(bootPhase === 1 || initFailed) && (
                <motion.button
                  key="auth-bypass-btn"
                  id="initiate-handshake-btn"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onComplete}
                  className={`px-4 py-2 border text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg ${
                    initFailed
                      ? "border-amber-500 text-amber-500 bg-amber-950/20 hover:bg-amber-600 hover:text-white"
                      : "border-[#2B7FFF] text-white bg-[#2B7FFF]/20 hover:bg-[#2B7FFF]/40 shadow-blue-950/40"
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" /> {initFailed ? "ENTER SYSTEM" : "DECRYPT COMPLETED // ACCESS PORTAL"}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
