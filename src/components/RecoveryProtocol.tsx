import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Flame, Clock, ShieldCheck, Heart, RefreshCw, ChevronRight, 
  Sparkles, CheckCircle2, Star, ListCollapse, AlertTriangle
} from "lucide-react";
import { NCERTLine } from "../types";

interface RecoveryProtocolProps {
  lines: NCERTLine[];
  onLineSelected: (id: string) => void;
  onLineUpdated: (updatedLine: NCERTLine) => void;
}

export default function RecoveryProtocol({ lines, onLineSelected, onLineUpdated }: RecoveryProtocolProps) {
  console.log("Rendering RecoveryProtocol component");
  
  // Isolate lines with weak or critical status as targets for recovery
  const weakLines = lines.filter(l => l.masteryStatus === "weak" || l.masteryStatus === "critical");
  const fallbackLines = lines.slice(0, 3);
  const targets = weakLines.length > 0 ? weakLines : fallbackLines;

  const [activeIndex, setActiveIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const currentTarget = targets[activeIndex % targets.length];

  // Recovery metrics simulation
  const recoveryScore = Math.floor(100 - (lines.filter(l => l.masteryStatus !== "mastered").length * 8));
  const timeEstimate = Math.max(5, lines.filter(l => l.masteryStatus !== "mastered").length * 4);

  const handleRateMastery = (status: "mastered" | "weak" | "critical") => {
    let score = 20;
    if (status === "mastered") score = 100;
    else if (status === "weak") score = 50;

    onLineUpdated({
      ...currentTarget,
      masteryStatus: status,
      confidenceScore: score,
      lastRecallTimestamp: new Date().toISOString()
    });

    setShowAnswer(false);
    if (activeIndex + 1 >= targets.length) {
      setSessionCompleted(true);
    } else {
      setActiveIndex(prev => prev + 1);
    }
  };

  const handleRestartSession = () => {
    setActiveIndex(0);
    setSessionCompleted(false);
    setShowAnswer(false);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl md:rounded-[20px] p-4 md:p-6 shadow-sm h-full min-h-0 flex flex-col justify-between">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-sm font-poppins font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Flame className="w-4.5 h-4.5 text-primary animate-pulse" /> Feature 6 — Cognitive Recovery Protocol
          </h2>
          <p className="text-[10px] text-slate-400 font-medium">Flashcard Recall Loop to Rescue Weak & Decayed Memory Nodes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start flex-1 min-h-0 overflow-y-auto py-4">
        
        {/* LEFT COMPARTMENT: COGNITIVE ACTIVE RECALL FLASHCARD */}
        <div className="md:col-span-8 bg-slate-50 border border-slate-100 rounded-xl md:rounded-[20px] p-4 md:p-5 space-y-4">
          
          {sessionCompleted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-10 space-y-4"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-poppins font-bold text-slate-900">Recovery Session Completed Successfully</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                You have targeted and updated your weakest NCERT lines. Continue running recall loops to secure high confidence.
              </p>
              <button
                onClick={handleRestartSession}
                className="px-4 py-2 bg-primary hover:bg-primary/95 text-white font-semibold rounded-[12px] text-xs transition-colors cursor-pointer"
              >
                Synthesize New Recovery Queue
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {/* Card Meta Indicator */}
              <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-200/50 pb-2">
                <span className="font-mono">CARD {activeIndex + 1} OF {targets.length}</span>
                <span className="font-bold uppercase text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full font-mono">
                  {currentTarget.masteryStatus.toUpperCase()} FOCUS
                </span>
              </div>

              {/* Question / Prompt Layer */}
              <div className="space-y-3">
                <span className="text-[9px] text-primary font-bold uppercase tracking-wider block font-mono">NCERT recall Prompt</span>
                <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed font-poppins">
                  Can you recall the exact details, coordinates, or biological importance of the textbook statement found in:
                  <br />
                  <strong className="text-primary mt-1.5 inline-block text-xs uppercase bg-primary/10 px-2 py-0.5 rounded-lg">
                    {currentTarget.chapterName} • Page {currentTarget.pageNumber} • Line {currentTarget.lineNumber}
                  </strong>
                </p>
              </div>

              {/* Answer revealing card */}
              <div className="pt-2">
                {showAnswer ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="p-4 bg-white border border-slate-200 rounded-[15px] space-y-3"
                  >
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">EXACT TEXTBOOK PHRASE:</span>
                      <p className="text-xs font-semibold text-slate-800 italic leading-relaxed">
                        "{currentTarget.lineText}"
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">How well did you recall this statement?</span>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleRateMastery("critical")}
                          className="py-2.5 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-500 font-bold rounded-lg text-[9px] uppercase cursor-pointer min-h-[44px] flex items-center justify-center text-center"
                        >
                          Weak Recall
                        </button>
                        <button
                          onClick={() => handleRateMastery("weak")}
                          className="py-2.5 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 text-amber-500 font-bold rounded-lg text-[9px] uppercase cursor-pointer min-h-[44px] flex items-center justify-center text-center"
                        >
                          Medium Recall
                        </button>
                        <button
                          onClick={() => handleRateMastery("mastered")}
                          className="py-2.5 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-emerald-500 font-bold rounded-lg text-[9px] uppercase cursor-pointer min-h-[44px] flex items-center justify-center text-center"
                        >
                          Perfect Recall
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="w-full py-4 bg-primary hover:bg-primary/95 text-white font-poppins font-bold rounded-[15px] text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/10 min-h-[48px]"
                  >
                    Reveal Aligned NCERT Text
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COMPARTMENT: STATUS MONITOR */}
        <div className="md:col-span-4 bg-white border border-slate-100 rounded-xl md:rounded-[20px] p-4 md:p-5 shadow-xs space-y-4 font-mono">
          
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block border-b border-slate-100 pb-2">
            RECOVERY METRICS
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Health Score */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-[12px] space-y-1">
              <span className="text-[9px] text-slate-500 block uppercase font-bold">COGNITIVE HEALTH SCORE</span>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-800 font-extrabold text-sm">{recoveryScore}%</span>
                <span className="text-[10px] text-emerald-500 uppercase font-bold">STABLE</span>
              </div>
            </div>

            {/* Time commitments */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-[12px] space-y-1">
              <span className="text-[9px] text-slate-500 block uppercase font-bold">ESTIMATED REVISION COMMITMENT</span>
              <div className="flex items-center gap-1.5 text-primary text-sm font-extrabold">
                <Clock className="w-4 h-4" />
                <span>{timeEstimate} minutes left</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 text-[10px] leading-relaxed text-slate-500">
            <span className="text-slate-400 font-bold uppercase block">Revision Advice</span>
            <p>
              Daily spaced repetition keeps retention rates above 90%, neutralizing standard exam recall decay.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
