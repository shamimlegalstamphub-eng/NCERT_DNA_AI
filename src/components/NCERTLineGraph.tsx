import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GitFork, Award, Flame, Zap, ShieldAlert, Sparkles, 
  Search, ArrowRight, Grid3X3, Layers, BookOpen, Thermometer
} from "lucide-react";
import { NCERTLine } from "../types";

interface NCERTLineGraphProps {
  lines: NCERTLine[];
  onLineSelected: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

interface RelationshipNode {
  id: string;
  sourceLine: string;
  targetLine: string;
  relationship: string;
  strength: "High" | "Medium" | "Low";
}

export default function NCERTLineGraph({ lines, onLineSelected, setActiveTab }: NCERTLineGraphProps) {
  const [selectedLineId, setSelectedLineId] = useState<string>("morphology-01");
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const [selectedHeatBlock, setSelectedHeatBlock] = useState<NCERTLine | null>(lines[0]);

  // High quality sample line relationship map (Step 4)
  const relations: RelationshipNode[] = [
    {
      id: "r1",
      sourceLine: "morphology-01",
      targetLine: "morphology-02",
      relationship: "Anatomical differentiation of exarch xylem in roots vs endarch xylem in stems",
      strength: "High"
    },
    {
      id: "r2",
      sourceLine: "cell-02",
      targetLine: "cell-05",
      relationship: "Tonoplast active proton pumping coupled to ATP synthase gradient",
      strength: "High"
    },
    {
      id: "r3",
      sourceLine: "molecular-05",
      targetLine: "molecular-01",
      relationship: "Basal transcription of Lac Operon required to permit lactose entry permease",
      strength: "Medium"
    },
    {
      id: "r4",
      sourceLine: "morphology-02",
      targetLine: "cell-02",
      relationship: "Turgor pressure of vacuoles maintaining structural integrity of cells in parenchyma stems",
      strength: "Medium"
    }
  ];

  const activeLine = lines.find(l => l.id === selectedLineId) || lines[0];

  // Importance Heatmap color mapper
  const getHeatmapColor = (frequency: number, expectedProb: number) => {
    const score = frequency * 2 + expectedProb; // arbitrary weight index
    if (score > 100) return "bg-rose-500 border-rose-400 text-rose-100 shadow-[0_0_10px_rgba(244,63,94,0.3)]";
    if (score > 85) return "bg-orange-500 border-orange-400 text-orange-100";
    if (score > 60) return "bg-amber-500 border-amber-400 text-amber-950";
    if (score > 40) return "bg-teal-500 border-teal-400 text-teal-950";
    return "bg-slate-800 border-slate-700 text-slate-400";
  };

  return (
    <div className="space-y-6 h-full overflow-y-auto pr-1 font-sans text-slate-800">
      
      {/* Title Header */}
      <div className="border-b border-slate-100 pb-4 flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-rose-50 text-rose-600 rounded-xl">
              <GitFork className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-base font-poppins font-black text-slate-900 tracking-tight uppercase">
              NCERT Line Relationship & High-Yield Heatmap
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">
            Discover core interconnectivity across anatomy, cytology, and genetics. Tap heatblocks or relationships to analyze rank delta.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Line Heatmap Visualization */}
        <div className="lg:col-span-6 bg-slate-900 text-white rounded-[20px] p-5 border border-slate-800 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4 text-rose-500 animate-pulse" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Importance Genome Heatmap
              </h3>
            </div>
            <div className="flex gap-2 text-[8px] font-mono">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-rose-500 inline-block"></span> CORE</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-500 inline-block"></span> HIGH</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 inline-block"></span> MEDIUM</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-teal-500 inline-block"></span> LOW</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
            Each heatblock represents an official high-yield NCERT Biology line. Tap a block to load its relationship map, mock PYQ records, and examiner traps.
          </p>

          {/* Heatmap Grid */}
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2.5 pt-2">
            {lines.map((line) => {
              const isActive = selectedHeatBlock?.id === line.id;
              return (
                <div
                  key={line.id}
                  onMouseEnter={() => setHoveredBlock(line.id)}
                  onMouseLeave={() => setHoveredBlock(null)}
                  onClick={() => {
                    setSelectedHeatBlock(line);
                    setSelectedLineId(line.id);
                  }}
                  className={`aspect-square rounded-lg border flex flex-col items-center justify-center cursor-pointer transition-all ${getHeatmapColor(line.frequency, line.predictedOccurrenceProb)} ${
                    isActive ? "scale-110 ring-2 ring-white border-white z-10" : "hover:scale-105"
                  }`}
                >
                  <span className="text-[9px] font-mono font-black">{line.id.substring(0, 3).toUpperCase()}</span>
                  <span className="text-[7px] font-mono font-medium opacity-60">P{line.pageNumber}</span>
                </div>
              );
            })}
          </div>

          {/* Hover tooltips / details */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl min-h-[50px] text-[10px] font-mono flex items-center justify-between gap-4">
            {selectedHeatBlock ? (
              <div className="space-y-1 w-full">
                <div className="flex justify-between text-slate-400 font-bold">
                  <span className="text-rose-400 uppercase">{selectedHeatBlock.chapterName} (Page {selectedHeatBlock.pageNumber})</span>
                  <span>FREQ: {selectedHeatBlock.frequency}x NEET Hits</span>
                </div>
                <p className="text-white font-semibold truncate">"{selectedHeatBlock.lineText}"</p>
              </div>
            ) : (
              <span className="text-slate-500">Tap any genome heatblock to run telemetry metrics.</span>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Line Relationship Map */}
        <div className="lg:col-span-6 bg-white border border-slate-100 rounded-[20px] p-5 space-y-5 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-poppins font-bold text-slate-800 uppercase tracking-tight">
                Interconnected Line Relations
              </h3>
            </div>
            <span className="text-[9px] font-mono font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
              ACTIVE NODE
            </span>
          </div>

          {/* Core active node visual block */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-[15px] space-y-3 relative overflow-hidden">
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-rose-50 text-rose-600 px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase">
              <Thermometer className="w-2.5 h-2.5" /> High Yield
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-400 font-mono uppercase">
                {activeLine.chapterName} • Page {activeLine.pageNumber} • Line {activeLine.lineNumber}
              </span>
              <h4 className="text-xs font-bold text-slate-900 leading-relaxed font-serif">
                "{activeLine.lineText}"
              </h4>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono font-bold pt-2 border-t border-slate-200/50 text-slate-500">
              <div>
                <span className="block text-[8px] text-slate-400">EXPECTED PROB</span>
                <span className="text-indigo-600">{activeLine.predictedOccurrenceProb}%</span>
              </div>
              <div>
                <span className="block text-[8px] text-slate-400">RANK DELTA</span>
                <span className="text-emerald-600">+{activeLine.expectedRankDelta} Rank</span>
              </div>
              <div>
                <span className="block text-[8px] text-slate-400">DECAY WARNING</span>
                <span className="text-rose-600">{activeLine.recallRisk}%</span>
              </div>
            </div>
          </div>

          {/* Related Concepts list */}
          <div className="space-y-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Dynamic Connection Pathways (Cross-Syllabus Mapping)
            </span>

            <div className="space-y-2.5">
              {relations
                .filter(r => r.sourceLine === activeLine.id || r.targetLine === activeLine.id)
                .map((rel) => (
                  <div key={rel.id} className="p-3 bg-indigo-50/25 border border-indigo-100/50 rounded-xl space-y-1.5 hover:bg-indigo-50/50 transition-colors">
                    <div className="flex justify-between items-center text-[9px] font-mono font-bold">
                      <span className="text-indigo-600 uppercase">CONNECTION STRENGTH: {rel.strength}</span>
                      <span className="text-slate-400">RELATIONAL LOG</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {rel.relationship}
                    </p>
                    <div className="flex justify-between items-center text-[10px] font-mono pt-1.5 border-t border-slate-100/60">
                      <span className="text-slate-400">RELATED: {rel.sourceLine === activeLine.id ? rel.targetLine : rel.sourceLine}</span>
                      <button
                        onClick={() => {
                          const otherId = rel.sourceLine === activeLine.id ? rel.targetLine : rel.sourceLine;
                          setSelectedLineId(otherId);
                        }}
                        className="text-indigo-600 hover:text-indigo-700 font-bold uppercase flex items-center gap-1 cursor-pointer"
                      >
                        Traverse Node <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

              {relations.filter(r => r.sourceLine === activeLine.id || r.targetLine === activeLine.id).length === 0 && (
                <div className="p-4 border border-dashed border-slate-100 rounded-xl bg-slate-50/50 text-center text-xs text-slate-400">
                  <p className="font-medium text-slate-500">Autonomous Core Node</p>
                  <p className="text-[10px] text-slate-400">Explore neighbor statements in the Heatmap grid to form cognitive connections.</p>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onLineSelected(activeLine.id);
                setActiveTab("pyq");
              }}
              className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" /> Previous Questions
            </button>
            <button
              onClick={() => {
                onLineSelected(activeLine.id);
                setActiveTab("predictive");
              }}
              className="flex-1 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-xs border border-indigo-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-600" /> Expected Questions
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
