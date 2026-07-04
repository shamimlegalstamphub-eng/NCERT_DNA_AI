import { useState } from "react";
import { motion } from "motion/react";
import { 
  Users, BarChart3, Upload, Plus, FileText, CheckCircle, 
  MessageSquare, TrendingUp, ArrowRight, RefreshCw, BookOpen, Clock 
} from "lucide-react";

export default function TeacherPortal() {
  const [activeCohort, setActiveCohort] = useState("batch-a");
  const [syllabusInput, setSyllabusInput] = useState("");
  const [createdTests, setCreatedTests] = useState([
    { id: "t1", title: "Cytology & Organelle Membrane Barrier Mock", date: "June 25", questions: 45, average: "82%" },
    { id: "t2", title: "Genetics Basal Lac Operon Mutations", date: "June 20", questions: 30, average: "74%" }
  ]);

  const [students] = useState([
    { id: "s1", name: "Aarav Sharma", completion: 94, weakChapter: "Molecular Genetics" },
    { id: "s2", name: "Isha Malhotra", completion: 88, weakChapter: "Morphology of Plants" },
    { id: "s3", name: "Kabir Mehta", completion: 76, weakChapter: "Cell: Unit of Life" },
    { id: "s4", name: "Riya Sen", completion: 65, weakChapter: "Cytology Membranes" }
  ]);

  const handleUploadMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!syllabusInput.trim()) return;
    alert(`Teacher Material Synced: "${syllabusInput}" has been added to Student Smart Study feeds.`);
    setSyllabusInput("");
  };

  const handleCreateTest = () => {
    const title = prompt("Enter Test Title for NEET Biology Cohort:");
    if (!title) return;
    const newTest = {
      id: `t${Date.now()}`,
      title,
      date: "Today",
      questions: 40,
      average: "N/A"
    };
    setCreatedTests([newTest, ...createdTests]);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl md:rounded-[20px] p-4 md:p-6 shadow-xs space-y-6">
      
      {/* Title Header */}
      <div className="border-b border-slate-100 pb-4 flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="text-[10px] bg-purple-50 border border-purple-100 text-purple-700 font-mono font-bold px-2 py-0.5 rounded-full uppercase">
            Ecosystem Node: Step 7
          </span>
          <h3 className="text-base font-poppins font-black text-slate-900 uppercase mt-1">
            Teacher & Educator Management Desk
          </h3>
          <p className="text-[10px] text-slate-400 font-mono">
            Empower coaching centers to upload customized NCERT study aids, monitor class metrics, and trigger mock testing modules.
          </p>
        </div>

        {/* Cohort switch */}
        <div className="flex bg-slate-100 p-1 rounded-xl items-center gap-1 border border-slate-200/50">
          <button
            onClick={() => setActiveCohort("batch-a")}
            className={`px-3 py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg transition-all ${
              activeCohort === "batch-a" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            NEET Batch A (Elite)
          </button>
          <button
            onClick={() => setActiveCohort("batch-b")}
            className={`px-3 py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg transition-all ${
              activeCohort === "batch-b" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            NEET Batch B (Regular)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Hand: Upload & Test Builder (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-4">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-purple-600" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wide text-slate-800">
                Push Syllabus Material To Students
              </h4>
            </div>

            <form onSubmit={handleUploadMaterial} className="space-y-3">
              <textarea
                value={syllabusInput}
                onChange={(e) => setSyllabusInput(e.target.value)}
                placeholder="Paste key notes, special teacher guidelines, or custom chapter corrections..."
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-purple-500 min-h-[90px] font-medium text-slate-700"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all"
              >
                Sync Material to Live Feeds
              </button>
            </form>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wide text-slate-800">
                Mock Test Modules
              </h4>
              <button
                onClick={handleCreateTest}
                className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-mono text-[9px] font-bold rounded uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3 inline-block -mt-0.5 mr-0.5" /> New Test
              </button>
            </div>

            <div className="space-y-2.5">
              {createdTests.map(t => (
                <div key={t.id} className="p-3 bg-white border border-slate-200 rounded-xl flex justify-between items-center text-[11px] font-mono shadow-2xs">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800 leading-snug">{t.title}</p>
                    <span className="text-[9px] text-slate-400">Scheduled: {t.date} • {t.questions} MCQs</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-purple-600 block">{t.average} Avg</span>
                    <span className="text-[8px] text-slate-400 font-medium">Class Grade</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Hand: Class & Student Diagnostics (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900 text-white rounded-[20px] p-5 border border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  Cohort Performance Metrics
                </h4>
              </div>
              <span className="text-[8px] font-mono text-emerald-400 uppercase font-bold">BATCH A CALIBRATED</span>
            </div>

            {/* Structured Stats Visualizer bars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-800 pb-4 text-left font-mono">
              <div className="p-3 bg-slate-950 rounded-xl">
                <span className="text-[8px] text-slate-500 uppercase block font-bold">AVERAGE RANK DELTA</span>
                <strong className="text-sm text-emerald-400 block mt-1">+142 ranks booster</strong>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl">
                <span className="text-[8px] text-slate-500 uppercase block font-bold">COGNITIVE INDEX</span>
                <strong className="text-sm text-indigo-400 block mt-1">81.4% Retention</strong>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl">
                <span className="text-[8px] text-slate-500 uppercase block font-bold">DECAY RISK STATUS</span>
                <strong className="text-sm text-rose-400 block mt-1">11% Alert Level</strong>
              </div>
            </div>

            {/* List of students under teacher supervision */}
            <div className="space-y-3 text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono block">Classroom roster list</span>
              <div className="space-y-2.5">
                {students.map(s => (
                  <div key={s.id} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between text-[11px] font-mono">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-200">{s.name}</p>
                      <span className="text-[9px] text-rose-400 uppercase">Weak Category: {s.weakChapter}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs font-black text-indigo-400 block">{s.completion}% Done</span>
                        <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-indigo-500" style={{ width: `${s.completion}%` }}></div>
                        </div>
                      </div>
                      <button
                        onClick={() => alert(`Sending premium AI tutor session to ${s.name}.`)}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[9px] font-bold rounded cursor-pointer transition-colors uppercase"
                      >
                        Nudge AI
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
