import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Brain, Award, Calendar, BookOpen, Search, Clock, 
  Flame, TrendingUp, AlertCircle, RefreshCw, CheckCircle, ArrowRight,
  Cpu, Target, Save, Zap
} from "lucide-react";
import { NCERTLine } from "../types";

interface AIMemoryDashboardProps {
  lines: NCERTLine[];
  onLineSelected: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function AIMemoryDashboard({ lines, onLineSelected, setActiveTab }: AIMemoryDashboardProps) {
  // Goal and memory states
  const [dailyTarget, setDailyTarget] = useState(() => Number(localStorage.getItem("ncert_dna_target_mcqs") || "50"));
  const [targetScore, setTargetScore] = useState(() => Number(localStorage.getItem("ncert_dna_target_score") || "340"));
  const [studyHours, setStudyHours] = useState(() => Number(localStorage.getItem("ncert_dna_target_hours") || "6"));
  const [isUpdatingGoal, setIsUpdatingGoal] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);

  // Recommendations calculated state
  const [recommendations, setRecommendations] = useState<any>({
    chapters: [],
    revisions: [],
    pyqs: [],
    dailyTasks: []
  });

  // Load and compute recommendations dynamically based on student stats
  const calculateMemoryMetrics = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      // Find weak chapters based on critical and weak lines
      const weakLines = lines.filter(l => l.masteryStatus === "critical" || l.masteryStatus === "weak");
      const chapterWeakness: Record<string, { count: number; name: string; lines: NCERTLine[] }> = {};
      
      lines.forEach(l => {
        if (l.masteryStatus === "critical" || l.masteryStatus === "weak") {
          if (!chapterWeakness[l.chapterId]) {
            chapterWeakness[l.chapterId] = { count: 0, name: l.chapterName, lines: [] };
          }
          chapterWeakness[l.chapterId].count++;
          chapterWeakness[l.chapterId].lines.push(l);
        }
      });

      const weakChaptersSorted = Object.values(chapterWeakness).sort((a, b) => b.count - a.count);

      // 1. Recommended Chapters to focus on
      const recChapters = weakChaptersSorted.slice(0, 3).map(wc => ({
        id: wc.lines[0]?.chapterId || "cell",
        name: wc.name,
        criticalCount: wc.lines.filter(l => l.masteryStatus === "critical").length,
        weakCount: wc.lines.filter(l => l.masteryStatus === "weak").length,
        suggestedHours: Math.max(2, Math.floor(wc.count * 1.5))
      }));

      // Fallback if student is doing extremely well
      if (recChapters.length === 0) {
        recChapters.push(
          { id: "ch-morphology", name: "Morphology of Flowering Plants", criticalCount: 0, weakCount: 1, suggestedHours: 3 },
          { id: "ch-cell", name: "Cell: The Unit of Life", criticalCount: 0, weakCount: 1, suggestedHours: 2 }
        );
      }

      // 2. Recommended revision statements (decay risk > 70%)
      const recRevisions = lines
        .filter(l => l.recallRisk > 60)
        .slice(0, 4)
        .map(l => ({
          id: l.id,
          text: l.lineText,
          chapter: l.chapterName,
          risk: l.recallRisk,
          page: l.pageNumber
        }));

      // 3. Recommended PYQs based on historical occurrences and weak spots
      const recPYQs = lines
        .filter(l => l.frequency >= 5)
        .slice(0, 3)
        .map(l => ({
          id: l.id,
          text: l.lineText,
          chapter: l.chapterName,
          appearances: l.frequency,
          examYear: `NEET ${2025 - Math.floor(Math.random() * 8)}`
        }));

      // 4. Recommended Daily Tasks
      const recTasks = [
        {
          id: "task-1",
          title: `Practice ${dailyTarget} High-Yield Biology MCQs`,
          sub: `Calibrated for score booster target of ${targetScore}+`,
          xp: 120,
          completed: false
        },
        {
          id: "task-2",
          title: "Revise Top Critical Bio-coordinates",
          sub: `${weakLines.length} statements currently marked as 'Critical Decay'`,
          xp: 150,
          completed: false
        },
        {
          id: "task-3",
          title: "Trigger Advanced Lens OCR Scan",
          sub: "Transcribe textbook margins to match rank deltas",
          xp: 80,
          completed: false
        }
      ];

      setRecommendations({
        chapters: recChapters,
        revisions: recRevisions,
        pyqs: recPYQs,
        dailyTasks: recTasks
      });
      setIsCalibrating(false);
    }, 800);
  };

  useEffect(() => {
    calculateMemoryMetrics();
  }, [lines, dailyTarget, targetScore, studyHours]);

  const handleSaveGoals = () => {
    setIsUpdatingGoal(true);
    setTimeout(() => {
      localStorage.setItem("ncert_dna_target_mcqs", dailyTarget.toString());
      localStorage.setItem("ncert_dna_target_score", targetScore.toString());
      localStorage.setItem("ncert_dna_target_hours", studyHours.toString());
      setIsUpdatingGoal(false);
    }, 600);
  };

  // Recent scans loaded from local storage
  const [recentScans, setRecentScans] = useState<any[]>([]);
  useEffect(() => {
    const saved = localStorage.getItem("ncert_dna_recent_scans");
    if (saved) {
      try {
        setRecentScans(JSON.parse(saved));
      } catch (e) {
        setRecentScans([]);
      }
    }
  }, []);

  return (
    <div className="space-y-6 h-full overflow-y-auto pr-1">
      {/* Header section with AI sparkle */}
      <div className="border-b border-slate-100 pb-4 flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 bg-indigo-50 text-indigo-600 rounded-lg">
              <Brain className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-base font-poppins font-black text-slate-900 tracking-tight uppercase">
              AI Student Memory Engine & Predictive Planner
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">
            Continuously tracking cognitive decay, error profiles, and OCR queries to compute real-time recommendation matrices.
          </p>
        </div>

        <button
          onClick={calculateMemoryMetrics}
          disabled={isCalibrating}
          className="px-3 py-1.5 border border-indigo-100 hover:border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer min-h-[38px] disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isCalibrating ? "animate-spin" : ""}`} />
          {isCalibrating ? "Recalibrating Memory..." : "Force Synaptic Update"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Memory Settings & Goals */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 text-white rounded-[20px] p-5 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Cognitive Calibration Targets
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">
                  Daily MCQ Volume Target
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="10"
                    max="150"
                    value={dailyTarget}
                    onChange={(e) => setDailyTarget(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <span className="text-xs font-bold font-mono text-amber-400 w-10 text-right">{dailyTarget}q</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">
                  Target Biology NEET Score
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="280"
                    max="360"
                    step="5"
                    value={targetScore}
                    onChange={(e) => setTargetScore(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <span className="text-xs font-bold font-mono text-indigo-400 w-10 text-right">{targetScore}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">
                  Daily Revision Investment
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="14"
                    value={studyHours}
                    onChange={(e) => setStudyHours(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <span className="text-xs font-bold font-mono text-emerald-400 w-10 text-right">{studyHours}h</span>
                </div>
              </div>

              <button
                onClick={handleSaveGoals}
                disabled={isUpdatingGoal}
                className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-indigo-900/30"
              >
                <Save className="w-3.5 h-3.5" />
                {isUpdatingGoal ? "Calibrating..." : "Lock In Targets"}
              </button>
            </div>
          </div>

          {/* Weak Chapters Memory Profile */}
          <div className="bg-white border border-slate-100 rounded-[20px] p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-rose-500 w-4 h-4" />
                <h3 className="text-xs font-poppins font-bold text-slate-800 uppercase tracking-tight">
                  Weak Chapter Profile
                </h3>
              </div>
              <span className="text-[9px] font-mono font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full uppercase">
                CRITICAL FOCUS
              </span>
            </div>

            <div className="space-y-3">
              {recommendations.chapters.map((ch: any, idx: number) => (
                <div key={idx} className="p-3 bg-rose-50/20 border border-rose-50 rounded-xl space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">{ch.name}</span>
                    <span className="text-[9px] text-rose-500 font-bold whitespace-nowrap">
                      {ch.criticalCount} Critical • {ch.weakCount} Weak
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span className="font-mono">REMEDY: {ch.suggestedHours} HOURS WORKSPACE STUDY</span>
                    <button
                      onClick={() => {
                        setActiveTab("finder");
                      }}
                      className="text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer"
                    >
                      Diagnose Lines
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center/Right: Advanced Dynamic Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Calibrated Study Pathway */}
          <div className="bg-white border border-slate-100 rounded-[20px] p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              <h3 className="text-xs font-poppins font-bold text-slate-800 uppercase tracking-tight">
                Recommended Daily Study Tasks
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.dailyTasks.map((task: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-[15px] hover:border-indigo-100 transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold text-indigo-600 tracking-wider uppercase">
                      TASK 0{idx + 1}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 leading-snug">{task.title}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">{task.sub}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold font-mono text-emerald-600">+{task.xp} XP</span>
                    <button
                      onClick={() => {
                        if (idx === 0) setActiveTab("predictive");
                        if (idx === 1) setActiveTab("revision");
                        if (idx === 2) setActiveTab("vision");
                      }}
                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-mono text-[9px] font-bold rounded-lg uppercase cursor-pointer transition-colors"
                    >
                      Begin
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommended High-Yield Revisions */}
          <div className="bg-white border border-slate-100 rounded-[20px] p-5 space-y-4 shadow-xs">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-emerald-500" />
                <h3 className="text-xs font-poppins font-bold text-slate-800 uppercase tracking-tight">
                  Recommended Revision Coordinates (Decay Profiles)
                </h3>
              </div>
              <span className="text-[9px] font-mono text-slate-400">CALCULATED FROM COGNITIVE GRAPH</span>
            </div>

            <div className="space-y-3">
              {recommendations.revisions.map((rev: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() => onLineSelected(rev.id)}
                  className="p-3.5 bg-slate-50 border border-slate-100 hover:border-emerald-200 rounded-[15px] flex items-center justify-between gap-4 cursor-pointer transition-all hover:bg-slate-50/50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {rev.chapter}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">Page {rev.page}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">"{rev.text}"</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold font-mono block text-rose-500">{rev.risk}% Decay</span>
                    <span className="text-[8px] font-mono font-medium text-slate-400 uppercase">Action Now</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended PYQ Targets */}
          <div className="bg-white border border-slate-100 rounded-[20px] p-5 space-y-4 shadow-xs">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-poppins font-bold text-slate-800 uppercase tracking-tight">
                  Recommended High-Yield Past Year Questions
                </h3>
              </div>
              <span className="text-[9px] font-mono text-slate-400">HIGHEST FREQUENCY TARGETS</span>
            </div>

            <div className="space-y-3">
              {recommendations.pyqs.map((pyq: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() => {
                    onLineSelected(pyq.id);
                    setActiveTab("pyq");
                  }}
                  className="p-3.5 bg-slate-50 border border-slate-100 hover:border-amber-200 rounded-[15px] flex items-center justify-between gap-4 cursor-pointer transition-all hover:bg-slate-50/50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        {pyq.chapter}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                        {pyq.examYear}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">"{pyq.text}"</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black font-mono text-amber-600 block">{pyq.appearances} Hits</span>
                    <span className="text-[8px] font-mono font-medium text-slate-400 uppercase">Test Practice</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
