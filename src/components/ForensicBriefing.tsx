import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gauge, ShieldAlert, Sparkles, BrainCircuit, Activity, Check, Radio, Play, ChevronRight, HelpCircle } from "lucide-react";
import { NCERTLine, InteractiveForensics, ClearanceLevel } from "../types";

interface ForensicBriefingProps {
  line: NCERTLine;
  clearanceLevel: ClearanceLevel;
  onExecuteRecovery: () => void;
  onLineUpdated: (updatedLine: NCERTLine) => void;
}

export default function ForensicBriefing({ line, clearanceLevel, onExecuteRecovery, onLineUpdated }: ForensicBriefingProps) {
  console.log("Rendering ForensicBriefing component");
  const [forensicsData, setForensicsData] = useState<InteractiveForensics | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [activeAISubTab, setActiveAISubTab] = useState<"reasoning" | "traps">("reasoning");

  // Load or fetch forensic data when line targets change
  useEffect(() => {
    let active = true;
    const fetchLineForensics = async () => {
      setLoadingAI(true);
      try {
        const response = await fetch("/api/forensics/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lineId: line.id,
            lineText: line.lineText,
            chapterName: line.chapterName,
            metadata: {
              volume: line.volume,
              pageNumber: line.pageNumber,
              lineNumber: line.lineNumber,
              frequency: line.frequency
            }
          })
        });

        const result = await response.json();
        if (active) {
          if (response.ok && result.status === "SUCCESS") {
            setForensicsData(result.data);
          } else {
            console.warn("Forensic analysis returned error state");
          }
        }
      } catch (err) {
        console.warn("Failed to query forensics backend API:", err);
      } finally {
        if (active) setLoadingAI(false);
      }
    };

    fetchLineForensics();

    return () => {
      active = false;
    };
  }, [line.id]);

  // Handle local state updates (Mastered, Weak, Critical)
  const handleMasteryShift = (newStatus: "mastered" | "weak" | "critical") => {
    let score = 20;
    if (newStatus === "mastered") score = 100;
    else if (newStatus === "weak") score = 50;

    onLineUpdated({
      ...line,
      masteryStatus: newStatus,
      confidenceScore: score,
      lastRecallTimestamp: new Date().toISOString()
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 h-full overflow-hidden animate-fade-in">
      
      {/* 1. MISSION HERO BRIEFING PANEL (Takes 65% of screen horizontal space: xl:col-span-8) */}
      <div id="mission-hero-console" className="xl:col-span-8 flex flex-col justify-between border border-[#2B7FFF]/30 bg-[#090E17]/95 p-4 md:p-5 rounded-xl md:rounded-[20px] overflow-y-auto relative shadow-2xl">
        
        {/* Luminous target scanner beam effect in background */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/40 to-transparent animate-pulse"></div>
        
        {/* Header telemetry coordinates */}
        <div id="target-telemetry-pill-row" className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <Radio className="text-red-500 w-4 h-4 animate-ping" />
            <span className="text-[10px] text-red-400 uppercase font-black tracking-widest flex items-center gap-1">
              MISSION BRIEFING <span className="text-slate-500">//</span> PRIME TARGET INDEXED
            </span>
          </div>
          
          <div id="ncert-exact-coordinate" className="text-[10px] bg-slate-950 px-2.5 py-1 text-[#2B7FFF] border border-[#2B7FFF]/40 border-dashed rounded-none font-mono tracking-wider font-bold">
            PAGE [ <span className="text-white font-black">{line.pageNumber}</span> ] <span className="text-slate-600">//</span> LINE [ <span className="text-white font-black">{line.lineNumber}</span> ] <span className="text-slate-600">//</span> CHAPTER [ <span className="text-amber-500 font-bold">{line.chapterId.toUpperCase()}</span> ]
          </div>
        </div>

        {/* NCERT Exact Sentence with huge typography and absolute emphasis */}
        <div id="ncert-bulletin-center" className="my-auto py-2 space-y-3.5">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[10px] uppercase font-black tracking-wider pl-1.5 border-l-2 border-l-red-500">
              NCERT STATUTORY FOCUS PHRASE
            </span>
            <span className="text-[8px] bg-red-950/40 text-red-400 border border-red-900 px-1 font-bold">HIGH MEMORY ATTENTION REQUIRED</span>
          </div>
          
          <blockquote className="text-xl md:text-3.5xl font-sans font-extrabold text-white tracking-wide leading-relaxed bg-[#05070B] p-5 md:p-6 border-l-4 border-red-600 border-r border-t border-b border-slate-900/60 shadow-inner">
            "{line.lineText}"
          </blockquote>
          
          <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono italic">
            <span>&emsp;&emsp;&mdash; NCERT Textbook Definition ({line.chapterName})</span>
            <span className="text-[9px] text-[#2D7FFF] not-italic font-bold">STATUS: UNRESOLVED VECTOR MATRIX</span>
          </div>
        </div>

        {/* WHY THIS LINE NOW Section - Directly Under the Quote */}
        <div className="mt-4 border-t border-slate-900 pt-4">
          <div className="text-[10px] text-[#2B7FFF] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5 leading-none">
            <span className="w-1.5 h-1.5 bg-[#2B7FFF] rounded-none inline-block"></span>
            <span>WHY THIS LINE NOW (OPERATIONAL RISK STATUS)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* PYQ frequency */}
            <div className="bg-[#05070B]/50 p-3 border border-slate-900/80 hover:border-[#2B7FFF]/20 transition-all">
              <span className="text-slate-500 block text-[8px] font-black uppercase tracking-wider mb-1">PYQ FREQUENCY WEIGHT</span>
              <span className="text-slate-200 text-base font-black font-mono leading-none flex items-baseline gap-1">
                {line.frequency} <span className="text-[10px] text-slate-500 font-sans font-medium uppercase">Years Recurrent</span>
              </span>
              <span className="text-[9px] text-[#2D7FFF] block mt-1 font-mono">&gt; Verified Board Core focus</span>
            </div>
            {/* Recall decay */}
            <div className="bg-[#05070B]/50 p-3 border border-slate-900/80 hover:border-red-950/30 transition-all">
              <span className="text-slate-500 block text-[8px] font-black uppercase tracking-wider mb-1">RECALL DECAY PROBABILITY</span>
              <span className="text-red-500 text-base font-black font-mono leading-none flex items-baseline gap-1">
                {line.recallRisk}% <span className="text-[10px] text-slate-500 font-sans font-medium uppercase">Decayed</span>
              </span>
              <span className="text-[9px] text-red-400 block mt-1 font-mono">&gt; High danger recall fade</span>
            </div>
            {/* Marks potential */}
            <div className="bg-[#05070B]/50 p-3 border border-slate-900/80 hover:border-amber-950/30 transition-all">
              <span className="text-slate-500 block text-[8px] font-black uppercase tracking-wider mb-1">MARKS AT STAKE</span>
              <span className="text-amber-500 text-base font-black font-mono leading-none flex items-baseline gap-1">
                +4 <span className="text-[10px] text-slate-500 font-sans font-medium uppercase">Marks Weight</span>
              </span>
              <span className="text-[9px] text-amber-400 block mt-1 font-mono">&gt; Competitive Rank Impact</span>
            </div>
          </div>
        </div>

        {/* MISSION OUTCOME Section - Directly Under Why This Line Now */}
        <div className="mt-4 border-t border-slate-900 pt-4">
          <div className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5 leading-none">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-none inline-block"></span>
            <span>EXPECTED MISSION RECOVERY OUTCOMES</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Marks Gain */}
            <div className="bg-[#05070B]/40 p-2.5 border border-slate-900/70">
              <span className="text-slate-500 block text-[8px] font-medium tracking-wider uppercase mb-1">MARKS SECURED</span>
              <span className="text-emerald-400 text-xs font-black font-mono">+4 MARKS GAIN</span>
            </div>
            {/* Rank Improvement */}
            <div className="bg-[#05070B]/40 p-2.5 border border-slate-900/70">
              <span className="text-slate-500 block text-[8px] font-medium tracking-wider uppercase mb-1">RANK DELTA POTENTIAL</span>
              <span className="text-white text-xs font-black font-mono">+{line.expectedRankDelta} NEIGHBOR SHIFTS</span>
            </div>
            {/* Recall Probability */}
            <div className="bg-[#05070B]/40 p-2.5 border border-slate-900/70">
              <span className="text-slate-500 block text-[8px] font-medium tracking-wider uppercase mb-1">OCCURRENCE PROBABILITY</span>
              <span className="text-amber-500 text-xs font-black font-mono">{line.predictedOccurrenceProb}% CHANCE</span>
            </div>
            {/* Decay Window */}
            <div className="bg-[#05070B]/40 p-2.5 border border-slate-900/70">
              <span className="text-slate-500 block text-[8px] font-medium tracking-wider uppercase mb-1">RECALL ATTRIBUTION ERROR</span>
              <span className="text-red-400 text-[10px] font-black leading-none font-sans block mt-0.5 uppercase tracking-wide">RECODE CURRENTLY</span>
            </div>
          </div>
        </div>

        {/* Action Panel and Primary Launchers */}
        <div id="briefing-action-bar" className="border-t border-slate-800/80 pt-4 mt-4 space-y-3 shrink-0">
          
           {/* Primary CTA button - Glowing launcher */}
          <div className="flex flex-col sm:flex-row gap-3">
            
            <button
              onClick={onExecuteRecovery}
              id="execute-recovery-btn"
              className="flex-1 bg-red-600 hover:bg-red-500 text-white h-12 px-6 text-sm font-black uppercase tracking-widest rounded-xl cursor-pointer shadow-lg shadow-red-950/40 flex items-center justify-center gap-2.5 relative group border border-red-500/30 overflow-hidden transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-amber-500 to-red-600 opacity-0 group-hover:opacity-15 transition-opacity duration-300"></div>
              <Play className="w-4 h-4 animate-pulse fill-white text-white" /> 
              <span>EXECUTE RECOVERY PROTOCOL [ACTIVE RECALL]</span>
            </button>

            <button
              onClick={() => handleMasteryShift("mastered")}
              id="mark-mastered-btn"
              className="px-5 h-12 border border-emerald-500/30 hover:border-emerald-500 text-slate-300 hover:text-white hover:bg-emerald-950/25 bg-slate-950/40 text-xs font-black uppercase tracking-widest rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5 font-sans"
            >
              <Check className="w-4 h-4 text-emerald-400" /> SECURE CONCEPTS MASTERED
            </button>

          </div>

        </div>

      </div>

      {/* 2. FORENSICS INTEL SIDEBAR: OPERATIONS CONTROL & LIVE AI INSIGHTS (xl:col-span-4) */}
      <div id="cognition-forensics-sidebar" className="xl:col-span-4 flex flex-col gap-4 overflow-y-auto">
        
        {/* State Verification Log Card */}
        <div className="border border-slate-800/80 bg-[#090E17]/85 p-4 rounded-xl space-y-3.5 shrink-0 shadow-lg">
          
          <div className="text-xs text-slate-400 font-black uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-1.5 leading-none">
            <Gauge className="w-3.5 h-3.5 text-[#2B7FFF]" /> 
            <span>State Verification Console</span>
          </div>

          {/* Active Slider indicator */}
          <div className="bg-[#05070B] p-2.5 border border-slate-900 rounded-lg font-mono text-[9px] leading-tight text-white space-y-1">
            <span className="text-slate-500 block uppercase font-bold text-[8px] tracking-wider">ACTIVE RECALL COEFFICIENT:</span>
            <div className="flex justify-between items-baseline">
              <span className="text-slate-300">Confidence Factor:</span>
              <span className="text-[#2B7FFF] text-xs font-black font-mono">{line.confidenceScore}%</span>
            </div>
          </div>

          {/* Quick Mastery status updates */}
          <div className="space-y-1.5">
            <span className="text-[8px] text-slate-500 font-black uppercase tracking-wider block">Operator Override Decrypt:</span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => handleMasteryShift("critical")}
                className={`py-1.5 text-[9px] font-black uppercase cursor-pointer rounded-lg border transition-all text-center min-h-[36px] flex items-center justify-center ${
                  line.masteryStatus === "critical"
                    ? "bg-rose-950/40 border-rose-500 text-rose-400"
                    : "border-slate-800/60 text-slate-500 hover:text-[#2B7FFF]"
                }`}
              >
                Critical
              </button>
              
              <button
                onClick={() => handleMasteryShift("weak")}
                className={`py-1.5 text-[9px] font-black uppercase cursor-pointer rounded-lg border transition-all text-center min-h-[36px] flex items-center justify-center ${
                  line.masteryStatus === "weak"
                    ? "bg-amber-950/40 border-amber-500 text-amber-400"
                    : "border-slate-800/60 text-slate-500 hover:text-[#2B7FFF]"
                }`}
              >
                Weak
              </button>

              <button
                onClick={() => handleMasteryShift("mastered")}
                className={`py-1.5 text-[9px] font-black uppercase cursor-pointer rounded-lg border transition-all text-center min-h-[36px] flex items-center justify-center ${
                  line.masteryStatus === "mastered"
                    ? "bg-emerald-950/40 border-emerald-500 text-emerald-400"
                    : "border-slate-800/60 text-slate-500 hover:text-[#2B7FFF]"
                }`}
              >
                Mastered
              </button>
            </div>
          </div>

          {/* Sparkline Decay curve waveform */}
          <div className="bg-slate-950 border border-slate-900/60 p-2 text-center rounded-lg font-mono">
            <span className="text-[8px] text-slate-500 uppercase block mb-1 text-left font-black tracking-wider">Active Forged Recall Decay Waveform</span>
            <svg viewBox="0 0 160 36" className="w-full h-10 stroke-current">
              <line x1="0" y1="5" x2="160" y2="5" stroke="#1e293b" strokeDasharray="2,2" />
              <line x1="0" y1="18" x2="160" y2="18" stroke="#1e293b" strokeDasharray="2,2" />
              <line x1="0" y1="31" x2="160" y2="31" stroke="#1e293b" strokeDasharray="2,2" />
              <path 
                d={`M 0 5 Q 40 ${12 + (line.recallRisk * 0.18)} 160 ${36 - (line.recallRisk * 0.3)}`}
                fill="none" 
                stroke={line.recallRisk > 70 ? "#EF4444" : "#10B981"} 
                strokeWidth="1.5" 
              />
              <circle cx="160" cy={36 - (line.recallRisk * 0.3)} r="2.5" fill="#2B7FFF" className="animate-pulse" />
            </svg>
            <div className="flex justify-between text-[8px] text-slate-600 mt-1 uppercase font-semibold">
              <span>FORGED (DAY 0)</span>
              <span>DECAY TIMEOUT</span>
            </div>
          </div>

        </div>

        {/* Live AI Reasoning Panel */}
        <div id="ai-reasoning-panel" className="flex-1 border border-slate-800 bg-[#090E17]/85 p-4 rounded-xl flex flex-col justify-between overflow-hidden shadow-lg min-h-[160px]">
          
          <div className="space-y-2.5 flex-1 flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="text-xs text-white font-black uppercase tracking-widest border-b border-slate-800 pb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 shrink-0">
                <BrainCircuit className="w-4 h-4 text-purple-400 rotate-180 animate-pulse" />
                <span>Forensic AI Intelligence</span>
              </span>
              
              <span className="text-[8px] border border-blue-900 bg-blue-950/30 text-[#2B7FFF] uppercase px-1 py-0.5 font-bold shrink-0">
                {clearanceLevel === "ELITE_CLEARANCE" ? "GEMINI LIVE" : "STATION STATIC"}
              </span>
            </div>

            {/* Sub-tabs inside Artificial Intelligence layer */}
            <div className="flex gap-2 text-[9px] uppercase font-black shrink-0">
              <button
                onClick={() => setActiveAISubTab("reasoning")}
                className={`pb-0.5 cursor-pointer transition-colors ${
                  activeAISubTab === "reasoning"
                    ? "text-[#2B7FFF] border-b border-[#2B7FFF]"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                [ Forensic Insight ]
              </button>
              <button
                onClick={() => setActiveAISubTab("traps")}
                className={`pb-0.5 cursor-pointer transition-colors ${
                  activeAISubTab === "traps"
                    ? "text-red-400 border-b border-red-500"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                [ Examiner Traps ]
              </button>
            </div>

            {/* Decoded content panel */}
            <div className="flex-1 overflow-y-auto pr-1">
              <AnimatePresence mode="wait">
                {loadingAI ? (
                  <motion.div
                    key="ai-loading-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center p-4 text-center space-y-2"
                  >
                    <div className="w-5 h-5 border border-[#2B7FFF]/20 border-t-[#2B7FFF] animate-spin rounded-full"></div>
                    <span className="text-[8px] text-slate-500 animate-pulse uppercase tracking-wider font-bold">
                      DECRYPTION ACTIVE...
                    </span>
                  </motion.div>
                ) : forensicsData ? (
                  <motion.div
                    key="ai-content-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10.5px] leading-relaxed font-sans text-slate-300"
                  >
                    {activeAISubTab === "reasoning" ? (
                      <div className="space-y-2">
                        <p className="bg-slate-950/50 p-2 border border-slate-900 leading-normal italic text-slate-200">
                          {forensicsData.importanceReasoning}
                        </p>
                        <div className="bg-[#05070B] p-2 border border-slate-900/60 font-mono text-[8px] flex justify-between items-center text-[#2B7FFF]">
                          <span>VERIFIED PAPERS appearances:</span>
                          <span className="font-extrabold text-white">{forensicsData.historicalAppearances}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {forensicsData.commonExaminerTraps.map((trap, idx) => (
                          <div key={idx} className="bg-rose-950/20 border border-rose-950/60 p-2 flex items-start gap-1.5 text-rose-300 text-[10px] leading-normal">
                            <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                            <span>{trap}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="text-[9px] text-slate-500 py-4 text-center">
                    Select a chromosome node on the right for deep AI insights.
                  </div>
                )}
              </AnimatePresence>
            </div>

          </div>

          <div className="border-t border-slate-900 pt-2 shrink-0 flex items-center justify-between text-[8px] text-slate-600 font-mono">
            <span>SYS REGULARIZATION_LOCK: EXTREME</span>
            <span className="text-slate-500">Volume {line.volume}</span>
          </div>

        </div>

      </div>

    </div>
  );
}
