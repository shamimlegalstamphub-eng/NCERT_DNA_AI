import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, BrainCircuit, Lightbulb, AlertTriangle, ListChecks, 
  RefreshCw, Play, Info, FileText, ChevronRight 
} from "lucide-react";
import { NCERTLine } from "../types";

interface AIExplainProps {
  activeLine: NCERTLine;
}

export default function AIExplain({ activeLine }: AIExplainProps) {
  console.log("Rendering AIExplain component");
  const [activeSubTab, setActiveSubTab] = useState<"insights" | "mnemonics" | "mistakes">("insights");
  const [loading, setLoading] = useState(false);
  const [explainData, setExplainData] = useState<any>(null);

  // Fetch or retrieve concept briefings matching the line ID
  useEffect(() => {
    let active = true;
    const fetchExplain = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/forensics/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lineId: activeLine.id,
            lineText: activeLine.lineText,
            chapterName: activeLine.chapterName,
            metadata: {
              volume: activeLine.volume,
              pageNumber: activeLine.pageNumber,
              lineNumber: activeLine.lineNumber,
              frequency: activeLine.frequency
            }
          })
        });

        const result = await response.json();
        if (active) {
          if (response.ok && result.status === "SUCCESS") {
            setExplainData(result.data);
          }
        }
      } catch (err) {
        console.warn("AI explain fetching error:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchExplain();
    return () => {
      active = false;
    };
  }, [activeLine.id]);

  const fallbackData = {
    importanceReasoning: "This textbook statement is structurally critical for active recall concepts. Examiners target these details in state and national board screenings.",
    commonExaminerTraps: [
      "Asserting that transport mechanisms are passive instead of active.",
      "Swapping key developmental phases such as endarch and exarch patterns."
    ]
  };

  const dataToUse = explainData || fallbackData;

  // Custom visual memory mnemonics
  const getMnemonic = (lineId: string) => {
    switch (lineId) {
      case "morphology-01":
        return {
          title: "Root Exarch Mnemonic",
          phrase: "R-E-P: Roots have Exarch primary xylem placing Protoxylem peripheral.",
          visual: "Visualize a tree Root with its youngest xylem nodes (Protoxylem) clustered outermost at the Peripheral margins, expanding inwards.",
          trap: "Stems are Endarch (Protoxylem lies Centrally/Internally)."
        };
      case "cell-02":
        return {
          title: "Tonoplast Solute Mnemonic",
          phrase: "T-A-G: Tonoplast Actively pumps against Gradients into vacuoles.",
          visual: "Picture a biological microscopic pump (Tonoplast) utilizing ATP currency to push ions against a heavy resistance force.",
          trap: "Do not declare vacuole solute diffusion passive."
        };
      case "molecular-05":
        return {
          title: "Lac Operon Basal Mnemonic",
          phrase: "L-O-B: Lac Operon Background basal level is always alive.",
          visual: "Imagine a computer on 'standby' mode—it must remain slightly powered on (basal transcription) so that it can immediately boot up when a file (lactose) is plugged in.",
          trap: "Bacterial cells completely shutting down the operon are blind to induction."
        };
      default:
        return {
          title: "General Recall Booster",
          phrase: "N-C-E-R-T: National Core Exam Recalls Targeted literal text.",
          visual: "Read with extreme granularity, noting transition adjectives and absolute prepositions.",
          trap: "Paraphrased study materials strip direct high-yield scoring keywords."
        };
    }
  };

  const currentMnemonic = getMnemonic(activeLine.id);

  return (
    <div className="bg-white border border-slate-100 rounded-xl md:rounded-[20px] p-4 md:p-6 shadow-sm h-full min-h-0 flex flex-col justify-between">
      
      {/* Title section */}
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-sm font-poppins font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-amber-500 animate-pulse" /> Feature 5 — AI Explain Center
          </h2>
          <p className="text-[10px] text-slate-400 font-medium">Cognitive Concept Decoding, Mnemonics & Mistake Highlights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start flex-1 min-h-0 overflow-y-auto py-4">
        
        {/* LEFT COMPARTMENT: AI INSIGHT INTERFACES */}
        <div className="md:col-span-8 space-y-4">
          
          {/* Internal sub navigation tabs */}
          <div className="flex border-b border-slate-100 pb-2 gap-4 text-xs font-bold text-slate-500">
            <button
              onClick={() => setActiveSubTab("insights")}
              className={`pb-1 cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeSubTab === "insights" ? "text-primary border-b-2 border-primary" : "hover:text-slate-800"
              }`}
            >
              <BrainCircuit className="w-4 h-4 text-primary" /> Concept Decoding
            </button>
            <button
              onClick={() => setActiveSubTab("mnemonics")}
              className={`pb-1 cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeSubTab === "mnemonics" ? "text-amber-600 border-b-2 border-amber-500" : "hover:text-slate-800"
              }`}
            >
              <Lightbulb className="w-4 h-4 text-amber-500" /> Memory Mnemonics
            </button>
            <button
              onClick={() => setActiveSubTab("mistakes")}
              className={`pb-1 cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeSubTab === "mistakes" ? "text-rose-600 border-b-2 border-rose-500" : "hover:text-slate-800"
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-rose-500" /> Common Mistakes
            </button>
          </div>

          <div className="min-h-[180px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
                <div className="w-6 h-6 border-2 border-t-transparent border-primary animate-spin rounded-full"></div>
                <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">GENERATING DEEP COGNITIVE EXPLAIN...</span>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSubTab}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4 text-xs leading-relaxed font-sans text-slate-700 font-medium"
                >
                  {activeSubTab === "insights" && (
                    <div className="bg-slate-50 p-4 rounded-[15px] border border-slate-100 space-y-3">
                      <div className="flex items-center gap-1 text-slate-800 font-poppins font-bold">
                        <span>Why This Matters For NEET:</span>
                      </div>
                      <p className="text-slate-600 italic leading-relaxed text-xs">
                        {dataToUse.importanceReasoning}
                      </p>
                      <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200/50 font-mono text-[9px] text-slate-500">
                        <Info className="w-3.5 h-3.5 text-primary" />
                        <span>Syllabus Category: High-Yield Core Biological Fact</span>
                      </div>
                    </div>
                  )}

                  {activeSubTab === "mnemonics" && (
                    <div className="space-y-4">
                      <div className="bg-amber-50/50 p-4 rounded-[15px] border border-amber-100 space-y-2">
                        <h4 className="text-amber-800 font-bold font-poppins text-xs">{currentMnemonic.title}</h4>
                        <p className="text-amber-900 font-bold italic">"{currentMnemonic.phrase}"</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Visual Memory Anchor</span>
                        <p className="text-slate-600 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100 text-[11px]">
                          {currentMnemonic.visual}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeSubTab === "mistakes" && (
                    <div className="space-y-3">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Examiner Trap Matrix</span>
                      <div className="grid grid-cols-1 gap-2">
                        {dataToUse.commonExaminerTraps.map((trap: string, i: number) => (
                          <div key={i} className="bg-rose-50 border border-rose-100 p-3 rounded-[12px] flex items-start gap-2 text-rose-700">
                            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-rose-800">Trap #{i+1}</p>
                              <p className="text-[11px] font-medium leading-relaxed mt-0.5">{trap}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

        </div>

        {/* RIGHT COMPARTMENT: QUICK REVISION SHEET */}
        <div className="md:col-span-4 bg-white border border-slate-100 rounded-[20px] p-5 shadow-xs space-y-4">
          
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block border-b border-slate-100 pb-2">
            GENOME BRIEF SUMMARY
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-600 font-medium">
            <p>
              Mastering direct textbook lines forms the primary differentiator for securing ranks under 1,000 in NEET exams. 
            </p>
            <p className="bg-primary/5 p-3 rounded-xl text-primary font-semibold text-[11px] border border-primary/10">
              Never skip vocabulary elements. Focus on action mechanisms, directional flows, and cellular compartments.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Revision Goals</span>
            <div className="flex items-center gap-2 text-[10px] text-slate-700">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span>
              <span>Confirm 100% literal recall</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-700">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span>
              <span>Explain to a peer under 30s</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
