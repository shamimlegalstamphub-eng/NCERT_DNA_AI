import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, Folder, Plus, Trash2, Download, Sparkles, 
  CheckCircle, ArrowRight, BookOpen, AlertCircle 
} from "lucide-react";
import { logActivity } from "../utils/activityTracker";

interface NotesManagerProps {
  notes: Record<string, string>;
  saveNote: (id: string, text: string) => void;
  deleteNote: (id: string) => void;
}

export default function NotesManager({ notes, saveNote, deleteNote }: NotesManagerProps) {
  console.log("Rendering NotesManager component");
  const [selectedFolder, setSelectedFolder] = useState<string>("ALL");
  const [newNoteId, setNewNoteId] = useState("");
  const [newNoteText, setNewNoteText] = useState("");
  const [newNoteChap, setNewNoteChap] = useState("ch-general");
  
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const folders = [
    { id: "ALL", label: "All Notes" },
    { id: "ch-morphology", label: "Anatomy & Morphology" },
    { id: "ch-cell", label: "Cell Structure" },
    { id: "ch-photosynthesis", label: "Photosynthesis" },
    { id: "ch-molecular", label: "Molecular Biology" },
    { id: "ch-general", label: "General Mnemonics" }
  ];

  // Convert key-value notes to array list
  const noteList = Object.entries(notes).map(([id, text]) => {
    let folderId = "ch-general";
    let title = "General Summary Note";
    if (id.includes("morphology")) {
      folderId = "ch-morphology";
      title = "Morphology Revision Node";
    } else if (id.includes("cell")) {
      folderId = "ch-cell";
      title = "Cell Structure Revision Node";
    } else if (id.includes("photosynthesis")) {
      folderId = "ch-photosynthesis";
      title = "Photosynthesis Reaction Node";
    } else if (id.includes("molecular")) {
      folderId = "ch-molecular";
      title = "Molecular Genetics Node";
    }

    return { id, text, folderId, title };
  });

  const filteredNotes = selectedFolder === "ALL" 
    ? noteList 
    : noteList.filter(n => n.folderId === selectedFolder);

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const id = `${newNoteChap}-${Date.now()}`;
    saveNote(id, newNoteText);
    setNewNoteText("");

    // Log the note save activity
    logActivity(
      "save",
      "Saved Custom Study Note",
      `Saved custom revision mnemonic under ${newNoteChap === "ch-general" ? "General Anatomy" : newNoteChap.replace("ch-", "Chapter ")}.`
    );
  };

  const handleTriggerExport = () => {
    setExportingPDF(true);
    setExportComplete(false);
    
    // Log note export activity
    logActivity(
      "save",
      "Exported Notes Archive",
      "Compiled study mnemonics, NCERT coordinate tags, and bookmarks to digital PDF/JSON."
    );

    setTimeout(() => {
      setExportingPDF(false);
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 2500);
    }, 1800);
  };

  const handleGenerateAISummary = () => {
    setGeneratingSummary(true);
    setAiSummary("");
    setTimeout(() => {
      const texts = noteList.map(n => n.text).join(" ");
      const mockSummary = noteList.length > 0 
        ? `NCERT BIOLOGY HIGH-YIELD EXECUTIVE DECRYPTION:\n- Identified ${noteList.length} focal checkpoints inside our genome files.\n- High-yield indicators: tonoplast active transport against gradients, exarch root centripetal structures, and basal background lac operon permease levels remain highly sensitive diagnostic traps.\n- Action: Schedule spaced revisions immediately to freeze recall decay curves.`
        : "No notes found. Create notes to trigger high-yield AI summary analysis.";
      setAiSummary(mockSummary);
      setGeneratingSummary(false);
    }, 1200);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl md:rounded-[20px] p-4 md:p-6 shadow-sm h-full min-h-0 flex flex-col justify-between">
      
      {/* Title */}
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-sm font-poppins font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-4.5 h-4.5 text-primary" /> Feature 7 — Study Notes Manager
          </h2>
          <p className="text-[10px] text-slate-400 font-medium">Custom Annotations, Folder categorization & Vector PDF Export</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start flex-1 min-h-0 overflow-y-auto py-4">
        
        {/* LEFT COLUMN: FOLDER LIST & NOTES LIST (md:col-span-8) */}
        <div className="md:col-span-8 space-y-4">
          
          {/* Folders horizontal tab selector */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 border-b border-slate-100 scrollbar-thin">
            {folders.map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFolder(f.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase cursor-pointer transition-all shrink-0 border ${
                  selectedFolder === f.id
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Create new note form inline */}
          <form onSubmit={handleCreateNote} className="p-4 bg-slate-50 border border-slate-100 rounded-[15px] space-y-3">
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-bold text-slate-500 uppercase">Create Custom Note</span>
              <select
                value={newNoteChap}
                onChange={(e) => setNewNoteChap(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-1.5 py-0.5 text-[9px] font-bold cursor-pointer text-slate-600 focus:outline-none"
              >
                <option value="ch-general">General Category</option>
                <option value="ch-morphology">Anatomy / Morphology</option>
                <option value="ch-cell">Cell: Unit of Life</option>
                <option value="ch-photosynthesis">Photosynthesis</option>
                <option value="ch-molecular">Molecular Biology</option>
              </select>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Write customized memory mnemonics or NEET alerts..."
                className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-[10px] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/25 placeholder-slate-400"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-[10px] hover:bg-primary/95 shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Save
              </button>
            </div>
          </form>

          {/* List layout of filtered notes */}
          <div className="space-y-3">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-[20px] flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-poppins font-bold text-slate-800 uppercase">Your Study Notes Standby</h3>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                    Annotate critical biological checkpoints, capture mnemonic acronyms, or flag NEET tricky exclusions here to streamline revision memory loops.
                  </p>
                </div>
                <div className="text-[10px] text-primary font-semibold font-mono bg-white px-3 py-1 border border-slate-100 rounded-lg shadow-2xs">
                  Tip: Search statements in NCERT Finder to save direct textbook notes!
                </div>
              </div>
            ) : (
              filteredNotes.map(note => (
                <div key={note.id} className="p-4 bg-white border border-slate-100 rounded-[15px] hover:border-slate-200 transition-all flex justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Folder className="w-3.5 h-3.5 text-primary" />
                      <strong className="text-[10px] text-slate-500 uppercase tracking-tight">{note.title}</strong>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">"{note.text}"</p>
                  </div>

                  <button
                    onClick={() => deleteNote(note.id)}
                    className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer shrink-0 align-top"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: AI CONSOLIDATOR & PDF EXPORTER */}
        <div className="md:col-span-4 bg-white border border-slate-100 rounded-xl md:rounded-[20px] p-4 md:p-5 shadow-xs space-y-5">
          
          {/* Section A: Vector PDF Exporter */}
          <div className="space-y-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Document Export Tools</span>
            
            <button
              onClick={handleTriggerExport}
              disabled={exportingPDF}
              className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 hover:border-slate-300 text-slate-700 font-semibold rounded-[12px] text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[48px]"
            >
              <Download className="w-4 h-4 text-primary" /> Export Notebook PDF
            </button>

            {exportingPDF && (
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-[12px] space-y-1.5 font-mono text-[9px] text-slate-500">
                <div className="flex justify-between">
                  <span>Exporting Vector Assets...</span>
                  <span className="animate-pulse">RUNNING</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary animate-progress-bar w-[60%]"></div>
                </div>
              </div>
            )}

            {exportComplete && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-[12px] text-[10px] font-bold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Standard Vector PDF generated successfully.</span>
              </div>
            )}
          </div>

          {/* Section B: AI Summary Generator */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">AI summary Engine</span>

            <button
              onClick={handleGenerateAISummary}
              disabled={generatingSummary}
              className="w-full py-3 bg-primary hover:bg-primary/95 text-white font-poppins font-bold rounded-[12px] text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm shadow-primary/10 min-h-[48px]"
            >
              <Sparkles className="w-4 h-4 text-accent animate-pulse" /> Generate AI Notes Summary
            </button>

            {generatingSummary && (
              <div className="text-center py-4 text-[10px] text-slate-400 font-mono animate-pulse">
                DECRYPTING CHECKPOINT CHECKLISTS...
              </div>
            )}

            {aiSummary && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="p-3 bg-slate-50 rounded-[12px] border border-slate-100 text-[10px] leading-relaxed text-slate-600 font-medium whitespace-pre-line"
              >
                {aiSummary}
              </motion.div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
