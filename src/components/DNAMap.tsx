import { useState } from "react";
import { motion } from "motion/react";
import { Grid, Info, Activity, ShieldCheck, RefreshCw } from "lucide-react";
import { NCERTLine, ClearanceLevel } from "../types";
import { MASTER_CHAPTERS, generateAuxiliaryNodes } from "../data";

interface DNAMapProps {
  lines: NCERTLine[];
  activeLineId: string;
  clearanceLevel: ClearanceLevel;
  onLineSelected: (lineId: string) => void;
  onMasteryReset?: () => void;
}

export default function DNAMap({ lines, activeLineId, clearanceLevel, onLineSelected, onMasteryReset }: DNAMapProps) {
  console.log("Rendering DNAMap component");
  const [selectedChapterId, setSelectedChapterId] = useState<string>("ALL");

  // Filter master chapters
  const filteredChapters = selectedChapterId === "ALL" 
    ? MASTER_CHAPTERS 
    : MASTER_CHAPTERS.filter(ch => ch.id === selectedChapterId);

  // Map mastery statuses to corresponding hex styling
  const getStatusColorClass = (status: "mastered" | "weak" | "critical" | "unknown") => {
    switch (status) {
      case "mastered":
        return "bg-emerald-500 text-emerald-950 border-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.15)]";
      case "weak":
        return "bg-amber-500 text-amber-950 border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.15)]";
      case "critical":
        return "bg-rose-500 text-rose-950 border-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.2)]";
      case "unknown":
      default:
        return "bg-blue-950/20 text-blue-400 border-blue-900/60";
    }
  };

  return (
    <div id="dna-map-container" className="border border-slate-800/80 bg-[#090E17]/95 p-4 flex flex-col h-auto lg:h-full font-mono min-h-[400px] rounded-xl md:rounded-[20px] shadow-sm w-full max-w-full overflow-hidden">
      
      {/* Container Head / Filter Rail */}
      <div id="dna-map-filter-header" className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-800 gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Grid className="w-4 h-4 text-[#2B7FFF] animate-pulse" />
          <span className="text-xs font-bold text-white tracking-widest uppercase">
            FORENSIC DNA MAP GENOME
          </span>
        </div>
        
        {/* Reset Trigger (Mock operations override) */}
        {onMasteryReset && (
          <button 
            onClick={onMasteryReset}
            className="text-[9px] border border-slate-800 text-slate-500 hover:text-white hover:border-slate-700 px-1.5 py-0.5 rounded-none uppercase flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-2.5 h-2.5" /> Reload Genome
          </button>
        )}
      </div>

      {/* Selector Rail */}
      <div id="chapter-selection-tabs" className="flex overflow-x-auto gap-1.5 pb-2 border-b border-slate-900 scrollbar-thin">
        <button
          onClick={() => setSelectedChapterId("ALL")}
          className={`px-2 py-0.5 text-[9px] font-bold uppercase cursor-pointer rounded-none tracking-wider whitespace-nowrap transition-colors border ${
            selectedChapterId === "ALL"
              ? "bg-[#2B7FFF]/10 border-[#2B7FFF] text-[#2B7FFF]"
              : "border-slate-800 text-slate-500 hover:text-slate-300"
          }`}
        >
          ALL (VOL I & II)
        </button>
        {MASTER_CHAPTERS.map(ch => (
          <button
            key={ch.id}
            onClick={() => setSelectedChapterId(ch.id)}
            className={`px-2 py-0.5 text-[9px] font-bold uppercase cursor-pointer rounded-none tracking-wider whitespace-nowrap transition-colors border ${
              selectedChapterId === ch.id
                ? "bg-[#2B7FFF]/10 border-[#2B7FFF] text-[#2B7FFF]"
                : "border-slate-800 text-slate-500 hover:text-slate-300"
            }`}
          >
            {ch.id.replace("ch-", "")}: {ch.name.substring(0, 15)}...
          </button>
        ))}
      </div>

      {/* Legend Block */}
      <div id="genome-color-legend" className="flex items-center gap-4 py-3 border-b border-slate-900 text-[10px]">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-emerald-500 rounded-none inline-block"></span>
          <span className="text-slate-400 uppercase">Mastered</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-amber-500 rounded-none inline-block"></span>
          <span className="text-slate-400 uppercase">Weak</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-rose-500 rounded-none inline-block"></span>
          <span className="text-slate-400 uppercase">Critical</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 border border-blue-900 bg-blue-950/20 rounded-none inline-block"></span>
          <span className="text-slate-400 uppercase">Unknown</span>
        </div>
      </div>

      {/* Dynamic Chapter Genome Grids */}
      <div id="genome-grid-list" className="flex-1 overflow-y-auto space-y-4 pt-3 pr-1 scrollbar-thin">
        {filteredChapters.map(chapter => {
          // Find our core NCERT focus lines belonging to this chapter
          const coreChapterLines = lines.filter(l => l.chapterId === chapter.id);
          
          // Generate deterministic auxiliary nodes to render a dense terminal grid layout
          // Limit nodes for standard Guest Preview to optimize render payload, expand if Elite/Student
          const auxNodeCount = clearanceLevel === "GUEST_PREVIEW" ? 12 : 24;
          const auxNodes = generateAuxiliaryNodes(chapter.id, auxNodeCount);

          return (
            <div 
              key={chapter.id} 
              id={`chapter-genome-${chapter.id}`}
              className="border border-slate-900 bg-slate-950/40 p-2.5 rounded-none space-y-2 border-l-2 border-l-[#2B7FFF]/60"
            >
              {/* Chapter Meta Row */}
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-slate-300 truncate tracking-tight uppercase whitespace-nowrap max-w-[190px]">
                  {chapter.name}
                </span>
                <span className="text-slate-500 shrink-0 text-[9px] uppercase font-bold bg-[#090E17] border border-slate-800 px-1">
                  {chapter.volume}
                </span>
              </div>

              {/* Grid block container */}
              <div className="overflow-x-auto w-full scrollbar-none">
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5 pt-1.5 min-w-[340px] xs:min-w-0">
                  
                  {/* 1. Core targeted High-Yield Focus lines */}
                  {coreChapterLines.map((line) => {
                    const isActive = line.id === activeLineId;
                    return (
                      <button
                        key={line.id}
                        onClick={() => onLineSelected(line.id)}
                        title={`NCERT PAGE ${line.pageNumber} LINE ${line.lineNumber}: ${line.lineText}`}
                        className={`h-7 rounded-none border text-[10px] font-bold flex items-center justify-center cursor-pointer transition-all ${getStatusColorClass(line.masteryStatus)} ${
                          isActive 
                            ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-[#05070B] scale-110 z-10 font-black border-white" 
                            : "hover:scale-105"
                        }`}
                      >
                        P{line.pageNumber}
                      </button>
                    );
                  })}

                  {/* 2. Secondary pseudo-interactive Auxiliary Nodes */}
                  {auxNodes.map((node, i) => {
                    const mockLabel = `E${i+1}`;
                    return (
                      <div
                        key={node.id}
                        title={`Secondary focus locus: ${chapter.name} node #${i+1}. Current clearance limits target edits to standard High-Yield core nodes.`}
                        className={`h-7 rounded-none border text-[9px] flex items-center justify-center opacity-40 select-none ${getStatusColorClass(node.state)}`}
                      >
                        {mockLabel}
                      </div>
                    );
                  })}

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Telemetry info block */}
      <div id="dna-map-telemetry-alert" className="border-t border-slate-900 pt-3 mt-3 text-[10px] text-slate-500 flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5 text-[#2B7FFF] shrink-0" />
        <span className="uppercase">
          Click highlighted core blocks (e.g. <span className="text-white font-bold bg-slate-900 border border-slate-800 px-0.5">P85</span>) to target exact NCERT sentence.
        </span>
      </div>

    </div>
  );
}
