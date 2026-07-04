import { useState, useEffect } from "react";
import { 
  Search, BookOpen, Volume1, Volume2, Filter, Bookmark, FileText, 
  Sparkles, HelpCircle, GraduationCap, ChevronRight, CheckCircle2,
  Clock, Flame, BrainCircuit, Lightbulb, AlertTriangle, History, ShieldAlert,
  Pin, Trash2
} from "lucide-react";
import { NCERTLine } from "../types";
import { MASTER_CHAPTERS } from "../data";
import { logActivity } from "../utils/activityTracker";

interface LineFinderProps {
  lines: NCERTLine[];
  activeLineId: string;
  onLineSelected: (id: string) => void;
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  notes: Record<string, string>;
  saveNote: (id: string, text: string) => void;
  onTriggerAIExplain: () => void;
  onTriggerPYQEngine: () => void;
  onTriggerPredictiveEngine: () => void;
}

export default function LineFinder({
  lines,
  activeLineId,
  onLineSelected,
  bookmarks,
  toggleBookmark,
  notes,
  saveNote,
  onTriggerAIExplain,
  onTriggerPYQEngine,
  onTriggerPredictiveEngine
}: LineFinderProps) {
  console.log("Rendering LineFinder component with advanced search and Memory Engine");
  const [search, setSearch] = useState(() => localStorage.getItem("ncert_dna_search_filter") || "");
  const [selectedVol, setSelectedVol] = useState<"ALL" | "Vol. I" | "Vol. II">(() => (localStorage.getItem("ncert_dna_vol_filter") as any) || "ALL");
  const [selectedChap, setSelectedChap] = useState<string>(() => localStorage.getItem("ncert_dna_chap_filter") || "ALL");
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"GENOME" | "RECENT">("GENOME");
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [recentMemoryLines, setRecentMemoryLines] = useState<any[]>([]);

  // Search History tracking state
  const [searchHistory, setSearchHistory] = useState<{ query: string; pinned: boolean; id: string }[]>(() => {
    const saved = localStorage.getItem("ncert_dna_search_history_v2");
    return saved ? JSON.parse(saved) : [
      { id: "1", query: "tonoplast", pinned: true },
      { id: "2", query: "exarch", pinned: false },
      { id: "3", query: "lac operon", pinned: false }
    ];
  });

  const saveSearchHistory = (history: any[]) => {
    setSearchHistory(history);
    localStorage.setItem("ncert_dna_search_history_v2", JSON.stringify(history));
  };

  const handleAddToHistory = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 3) return;
    if (searchHistory.some(h => h.query.toLowerCase() === trimmed.toLowerCase())) return;
    const updated = [
      { id: Date.now().toString(), query: trimmed, pinned: false },
      ...searchHistory
    ].slice(0, 10);
    saveSearchHistory(updated);

    // Track search activity
    const matchedCount = lines.filter(l => l.lineText.toLowerCase().includes(trimmed.toLowerCase())).length;
    logActivity(
      "revise",
      `Searched "${trimmed}"`,
      `Matched ${matchedCount} coordinate statements across all active chapters.`
    );
  };

  const togglePinSearch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = searchHistory.map(h => h.id === id ? { ...h, pinned: !h.pinned } : h);
    saveSearchHistory(updated);
  };

  const deleteSearchHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = searchHistory.filter(h => h.id !== id);
    saveSearchHistory(updated);
  };

  const clearSearchHistory = () => {
    const updated = searchHistory.filter(h => h.pinned); // Keep pinned searches
    saveSearchHistory(updated);
  };

  const activeLine = lines.find(l => l.id === activeLineId) || lines[0];

  // Load recent lines memory on mount
  useEffect(() => {
    const stored = localStorage.getItem("ncert_dna_recent_memory_lines");
    if (stored) {
      try {
        setRecentMemoryLines(JSON.parse(stored));
      } catch (e) {
        setRecentMemoryLines([]);
      }
    } else {
      // Seed initial mock recent memory scans/finds
      const initial = [
        {
          id: "cell-02",
          lineText: "In plants, the tonoplast facilitates the transport of a number of ions and other materials against concentration gradients into the vacuole.",
          chapterName: "Cell Unit of Life",
          timestamp: "09:34 AM",
          confidence: "99.1% OCR Match"
        },
        {
          id: "morphology-01",
          lineText: "In roots, the primary xylem is exarch, meaning protoxylem lies towards the periphery and metaxylem lies towards the centre.",
          chapterName: "Anatomy of Flowering Plants",
          timestamp: "Yesterday",
          confidence: "98.5% Concept Match"
        }
      ];
      localStorage.setItem("ncert_dna_recent_memory_lines", JSON.stringify(initial));
      setRecentMemoryLines(initial);
    }
  }, []);

  // Selection wrapped with Memory tracking
  const handleSelectLineWithMemory = (id: string) => {
    onLineSelected(id);
    
    // Track in memory list
    const target = lines.find(l => l.id === id);
    if (target) {
      const updated = [
        {
          id: target.id,
          lineText: target.lineText,
          chapterName: target.chapterName,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          confidence: target.predictedOccurrenceProb > 90 ? "99.6% OCR Certified" : "97.4% High Alignment"
        },
        ...recentMemoryLines.filter(item => item.id !== id)
      ].slice(0, 5);

      setRecentMemoryLines(updated);
      localStorage.setItem("ncert_dna_recent_memory_lines", JSON.stringify(updated));
    }
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    localStorage.setItem("ncert_dna_search_filter", val);
  };

  const handleVolChange = (val: "ALL" | "Vol. I" | "Vol. II") => {
    setSelectedVol(val);
    localStorage.setItem("ncert_dna_vol_filter", val);
  };

  const handleChapChange = (val: string) => {
    setSelectedChap(val);
    localStorage.setItem("ncert_dna_chap_filter", val);
  };

  const handleSaveNoteLocal = () => {
    saveNote(activeLine.id, noteText);
    setEditingNote(false);
  };

  const handleStartEditingNote = () => {
    setNoteText(notes[activeLine.id] || "");
    setEditingNote(true);
  };

  // Smart Search: Queries line text, chapter names, concepts, and labels
  const filteredLines = lines.filter(l => {
    const lowerSearch = search.toLowerCase();
    const matchesSearch = 
      l.lineText.toLowerCase().includes(lowerSearch) || 
      l.chapterName.toLowerCase().includes(lowerSearch) ||
      (l.volume && l.volume.toLowerCase().includes(lowerSearch)) ||
      (l.chapterId && l.chapterId.toLowerCase().includes(lowerSearch));

    const matchesVol = selectedVol === "ALL" || l.volume === selectedVol;
    const matchesChap = selectedChap === "ALL" || l.chapterId === selectedChap;
    return matchesSearch && matchesVol && matchesChap;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-full min-h-0">
      
      {/* LEFT COLUMN: QUERY WORKSPACE (lg:col-span-7) */}
      <div className="lg:col-span-7 bg-white border border-slate-100 rounded-xl md:rounded-[20px] p-4 md:p-5 shadow-sm flex flex-col h-auto lg:h-full min-h-0">
        
        {/* Toggle headers (Genome Statements vs Recent Line Memory) */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-4">
          <div className="flex bg-slate-100 rounded-[12px] p-0.5">
            <button
              onClick={() => setActiveWorkspaceTab("GENOME")}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-[9px] cursor-pointer transition-all ${
                activeWorkspaceTab === "GENOME" ? "bg-white text-primary shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              NCERT Statement Database
            </button>
            <button
              onClick={() => setActiveWorkspaceTab("RECENT")}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-[9px] cursor-pointer transition-all flex items-center gap-1 ${
                activeWorkspaceTab === "RECENT" ? "bg-white text-primary shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <History className="w-3.5 h-3.5" /> Recent Searches ({recentMemoryLines.length})
            </button>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">COUNT: {filteredLines.length} STATEMENTS</span>
        </div>

        {activeWorkspaceTab === "GENOME" ? (
          <>
            {/* Search inputs and Filters */}
            <div className="space-y-4 mb-4 shrink-0">
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onBlur={() => handleAddToHistory(search)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddToHistory(search);
                      }
                    }}
                    placeholder="Smart Search: Line, concept, chapter, volume..."
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-[12px] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/25 placeholder-slate-400 min-h-[44px]"
                  />
                </div>

                {searchHistory.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[9px] text-slate-400 font-bold uppercase mr-1 flex items-center gap-1">
                      <History className="w-3 h-3" /> History:
                    </span>
                    {searchHistory.map((h) => (
                      <div 
                        key={h.id} 
                        onClick={() => handleSearchChange(h.query)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold transition-all cursor-pointer ${
                          search.toLowerCase() === h.query.toLowerCase()
                            ? "bg-primary/5 border-primary/35 text-primary"
                            : "bg-slate-50 border-slate-150 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span>{h.query}</span>
                        <button 
                          type="button" 
                          onClick={(e) => togglePinSearch(h.id, e)}
                          className={`p-0.5 rounded transition-colors ${h.pinned ? "text-amber-500" : "text-slate-350 hover:text-amber-500"}`}
                          title={h.pinned ? "Unpin Query" : "Pin Query"}
                        >
                          <Pin className="w-2.5 h-2.5 fill-current" />
                        </button>
                        <button 
                          type="button" 
                          onClick={(e) => deleteSearchHistoryItem(h.id, e)}
                          className="p-0.5 rounded text-slate-350 hover:text-rose-500 transition-colors"
                          title="Delete from history"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                    {searchHistory.some(h => !h.pinned) && (
                      <button 
                        type="button" 
                        onClick={clearSearchHistory}
                        className="text-[9px] text-rose-500 hover:underline font-bold ml-1 cursor-pointer min-h-[25px]"
                      >
                        Clear Recents
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Selector filters */}
              <div className="flex flex-wrap gap-2 pt-1 border-b border-slate-100 pb-3">
                {/* Volume Filters */}
                <div className="flex bg-slate-100 rounded-[10px] p-0.5">
                  {(["ALL", "Vol. I", "Vol. II"] as const).map(vol => (
                    <button
                      key={vol}
                      onClick={() => handleVolChange(vol)}
                      className={`px-3 py-1 text-[9px] font-bold uppercase rounded-[8px] transition-all cursor-pointer min-h-[25px] ${
                        selectedVol === vol ? "bg-white text-primary shadow-xs" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {vol}
                    </button>
                  ))}
                </div>

                {/* Chapter filter selector dropdown */}
                <select
                  value={selectedChap}
                  onChange={(e) => handleChapChange(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-[10px] px-2.5 py-1 text-[9px] font-bold text-slate-600 focus:outline-none cursor-pointer min-h-[30px]"
                >
                  <option value="ALL">All Chapters</option>
                  {MASTER_CHAPTERS.map(ch => (
                    <option key={ch.id} value={ch.id}>{ch.id.replace("ch-", "Ch ")}: {ch.name.substring(0, 20)}...</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Scrollable list items */}
            <div className="flex-1 overflow-y-auto max-h-[350px] lg:max-h-none space-y-3.5 pr-1 scrollbar-thin">
              {filteredLines.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs font-medium space-y-2">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                  <p>No matching biological sentences found. Try refining search queries.</p>
                </div>
              ) : (
                filteredLines.map(line => {
                  const isActive = line.id === activeLineId;
                  const hasNotes = !!notes[line.id];
                  const isBookmarked = bookmarks.includes(line.id);

                  return (
                    <div
                      key={line.id}
                      onClick={() => handleSelectLineWithMemory(line.id)}
                      className={`p-4 rounded-[15px] border transition-all cursor-pointer relative ${
                        isActive
                          ? "border-primary bg-primary/5 shadow-xs scale-[1.01]"
                          : "border-slate-100 hover:border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                            {line.chapterName}
                          </span>
                          <span className="text-[9px] font-semibold text-slate-400 font-mono">
                            Page {line.pageNumber} • Line {line.lineNumber}
                          </span>
                        </div>

                        <div className="flex gap-1">
                          {isBookmarked && <Bookmark className="w-3.5 h-3.5 text-emerald-500 fill-current" />}
                          {hasNotes && <FileText className="w-3.5 h-3.5 text-purple-400" />}
                        </div>
                      </div>

                      <p className={`text-xs leading-relaxed font-semibold ${isActive ? "text-slate-900" : "text-slate-700"}`}>
                        "{line.lineText}"
                      </p>

                      {/* Micro dashboard metrics */}
                      <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-slate-100/50 text-[9px] font-mono text-slate-500">
                        <span>Expected Boost: <strong className="text-slate-700">+{line.expectedRankDelta} ranks</strong></span>
                        <span>NEET Prob: <strong className="text-slate-700">{line.predictedOccurrenceProb}%</strong></span>
                        <span className="flex items-center gap-1">
                          Status: 
                          <strong className={`uppercase ${
                            line.masteryStatus === "mastered" ? "text-emerald-500" :
                            line.masteryStatus === "weak" ? "text-amber-500" : "text-rose-500"
                          }`}>
                            {line.masteryStatus}
                          </strong>
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          /* Recent Lines Memory View */
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-thin">
            {recentMemoryLines.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs font-medium">
                <Clock className="w-8 h-8 text-slate-350 mx-auto mb-2" />
                <p>No recent activity logs. Scanned or searched lines will populate here.</p>
              </div>
            ) : (
              recentMemoryLines.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectLineWithMemory(item.id)}
                  className={`p-4 rounded-[15px] border bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer relative ${
                    item.id === activeLineId ? "border-primary bg-primary/5" : "border-slate-100"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                      {item.chapterName}
                    </span>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 font-mono">
                      <span>{item.confidence}</span>
                      <span>•</span>
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 italic">
                    "{item.lineText}"
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: ACTIVE SENTENCE CONSOLE (lg:col-span-5) */}
      <div className="lg:col-span-5 bg-white border border-slate-100 rounded-xl md:rounded-[20px] p-4 md:p-5 shadow-sm flex flex-col justify-between h-auto lg:h-full min-h-0">
        <div className="space-y-4 overflow-y-auto pr-1 scrollbar-thin flex-1 pb-4">
          
          {/* Active coordinates header */}
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Active targets coordinate</span>
              <h3 className="font-poppins font-bold text-slate-900 text-xs uppercase mt-0.5">
                {activeLine.chapterName} • P{activeLine.pageNumber} L{activeLine.lineNumber}
              </h3>
            </div>
            <button
              onClick={() => toggleBookmark(activeLine.id)}
              className={`p-2 border rounded-xl transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center ${
                bookmarks.includes(activeLine.id)
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                  : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700"
              }`}
              title={bookmarks.includes(activeLine.id) ? "Remove Bookmark" : "Bookmark Line"}
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>

          {/* Active Highlight Line Text */}
          <div className="p-4 bg-primary/5 rounded-[15px] border border-primary/20 relative overflow-hidden">
            <span className="absolute top-0 left-0 w-1.5 h-full bg-primary"></span>
            <p className="text-xs font-semibold text-slate-900 leading-relaxed font-sans italic pl-1.5">
              "{activeLine.lineText}"
            </p>
          </div>

          {/* Dynamic Feature Redirection Actions */}
          <div className="space-y-2.5">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">NEET Intelligence Operating Tools</span>
            
            <button
              onClick={onTriggerAIExplain}
              className="w-full p-3.5 bg-slate-50 hover:bg-primary/5 border border-slate-200/80 rounded-[15px] flex items-center justify-between text-left text-xs text-slate-700 font-semibold cursor-pointer group hover:border-primary/30 hover:text-primary transition-all min-h-[48px]"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                <div>
                  <p className="font-poppins font-bold text-slate-900 group-hover:text-primary leading-none mb-0.5">Feature 5 — AI Explain</p>
                  <span className="text-[10px] text-slate-400 font-normal">Extract medical links & memory tricks</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onTriggerPYQEngine}
              className="w-full p-3.5 bg-slate-50 hover:bg-primary/5 border border-slate-200/80 rounded-[15px] flex items-center justify-between text-left text-xs text-slate-700 font-semibold cursor-pointer group hover:border-primary/30 hover:text-primary transition-all min-h-[48px]"
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="w-4 h-4 text-primary" />
                <div>
                  <p className="font-poppins font-bold text-slate-900 group-hover:text-primary leading-none mb-0.5">Feature 3 — Previous NEET Questions</p>
                  <span className="text-[10px] text-slate-400 font-normal">Review historical exam recurrence models</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onTriggerPredictiveEngine}
              className="w-full p-3.5 bg-slate-50 hover:bg-primary/5 border border-slate-200/80 rounded-[15px] flex items-center justify-between text-left text-xs text-slate-700 font-semibold cursor-pointer group hover:border-primary/30 hover:text-primary transition-all min-h-[48px]"
            >
              <div className="flex items-center gap-3">
                <BrainCircuit className="w-4 h-4 text-teal-500" />
                <div>
                  <p className="font-poppins font-bold text-slate-900 group-hover:text-primary leading-none mb-0.5">Feature 4 — Predictive MCQs Engine</p>
                  <span className="text-[10px] text-slate-400 font-normal">Generate custom logical assertion challenges</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Notes Workspace Block */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-400" /> My Study Notes
              </span>
              {!editingNote && (
                <button
                  onClick={handleStartEditingNote}
                  className="text-[10px] text-primary hover:underline font-bold cursor-pointer min-h-[30px]"
                >
                  {notes[activeLine.id] ? "Modify Notes" : "Create Note"}
                </button>
              )}
            </div>

            {editingNote ? (
              <div className="space-y-2">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Record summary concepts, memory mnemonics, or tricky traps for this sentence..."
                  className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-[12px] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/25 placeholder-slate-400"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setEditingNote(false)}
                    className="px-3 py-1.5 text-[10px] font-semibold text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer min-h-[30px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNoteLocal}
                    className="px-3 py-1.5 text-[10px] font-bold text-white bg-primary rounded-lg cursor-pointer shadow-xs min-h-[30px]"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-[12px] border border-slate-100 text-xs min-h-[60px] text-slate-600 font-medium relative leading-relaxed">
                {notes[activeLine.id] ? (
                  <p>{notes[activeLine.id]}</p>
                ) : (
                  <p className="text-slate-400 italic">No notes created yet. Click 'Create Note' to save insights on this line.</p>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
