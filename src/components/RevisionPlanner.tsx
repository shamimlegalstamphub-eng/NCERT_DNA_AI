import { useState, useEffect } from "react";
import { 
  Calendar, Clock, BookOpen, CheckCircle, RefreshCw, 
  Sparkles, ChevronRight, Bell, CalendarDays, History, AlertCircle
} from "lucide-react";
import { NCERTLine } from "../types";

interface RevisionPlannerProps {
  lines: NCERTLine[];
  onLineSelected: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function RevisionPlanner({ lines, onLineSelected, setActiveTab }: RevisionPlannerProps) {
  console.log("Rendering upgraded RevisionPlanner component with Timeline and Auto Reminders");
  const [selectedPlan, setSelectedPlan] = useState<"TODAY" | "TOMORROW" | "WEEKLY">("TODAY");
  const [remindersEnabled, setRemindersEnabled] = useState(() => {
    return localStorage.getItem("ncert_dna_reminders_enabled") === "true";
  });
  const [timelineLineId, setTimelineLineId] = useState<string>("");

  useEffect(() => {
    if (lines.length > 0 && !timelineLineId) {
      setTimelineLineId(lines[0].id);
    }
  }, [lines, timelineLineId]);

  const toggleReminders = () => {
    const nextState = !remindersEnabled;
    setRemindersEnabled(nextState);
    localStorage.setItem("ncert_dna_reminders_enabled", String(nextState));
  };

  const getRevisionAgenda = () => {
    switch (selectedPlan) {
      case "TOMORROW":
        // Tomorrow items (simulated from secondary subset or weak items)
        const tomorrowLines = lines.filter(l => l.masteryStatus === "weak").slice(0, 3);
        const tomorrowList = tomorrowLines.length > 0 ? tomorrowLines : lines.slice(1, 3);
        return tomorrowList.map((line, idx) => ({
          time: idx === 0 ? "09:00 AM" : idx === 1 ? "02:00 PM" : "05:30 PM",
          concept: line.lineText,
          id: line.id,
          duration: "10 mins",
          type: "Tomorrow Schedule",
          chapter: line.chapterName
        }));

      case "WEEKLY":
        // Weekly target list (critical + general review)
        const weeklyLines = lines.filter(l => l.masteryStatus === "critical").slice(0, 3);
        const weeklyList = weeklyLines.length > 0 ? weeklyLines : lines.slice(0, 2);
        return weeklyList.map((line, idx) => ({
          time: idx === 0 ? "Saturday" : "Sunday",
          concept: line.lineText,
          id: line.id,
          duration: "25 mins",
          type: "Weekly Goal Check",
          chapter: line.chapterName
        }));

      case "TODAY":
      default:
        // Today Spaced repetition agenda prioritizing Weak or Critical status lines
        const todayLines = lines.filter(l => l.masteryStatus === "critical" || l.masteryStatus === "weak");
        const todayList = todayLines.length > 0 ? todayLines : lines.slice(0, 2);

        return todayList.map((line, idx) => ({
          time: idx === 0 ? "08:30 AM" : idx === 1 ? "11:45 AM" : "04:15 PM",
          concept: line.lineText,
          id: line.id,
          duration: "12 mins",
          type: line.masteryStatus === "critical" ? "Critical Priority" : "Weak Priority",
          chapter: line.chapterName
        }));
    }
  };

  const currentAgenda = getRevisionAgenda();

  const handleActionFocusLine = (id: string) => {
    onLineSelected(id);
    setTimelineLineId(id);
    setActiveTab("finder");
  };

  const selectedTimelineLine = lines.find(l => l.id === timelineLineId) || lines[0];

  return (
    <div className="bg-white border border-slate-100 rounded-xl md:rounded-[20px] p-4 md:p-6 shadow-sm h-auto lg:h-full min-h-0 flex flex-col justify-between w-full">
      
      {/* Title */}
      <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h2 className="text-sm font-poppins font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-4.5 h-4.5 text-primary" /> NEET Spaced Revision & Remembrance Engine
          </h2>
          <p className="text-[10px] text-slate-400 font-medium">Automatic revision queues, active memory loops, and learning timelines</p>
        </div>

        {/* Reminders Toggle Action */}
        <button
          onClick={toggleReminders}
          className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 min-h-[44px] cursor-pointer ${
            remindersEnabled 
              ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100/50" 
              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
          }`}
        >
          <Bell className={`w-3.5 h-3.5 ${remindersEnabled ? "animate-bounce" : ""}`} />
          <span>{remindersEnabled ? "Daily Reminders Active" : "Enable Auto Reminders"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 min-h-0 overflow-y-auto py-4">
        
        {/* LEFT COLUMN: INTERVAL TYPE SELECTOR & LIST AGENDA (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Planner type triggers (Today, Tomorrow, Weekly) */}
          <div className="flex justify-between items-center border-b border-slate-200/50 pb-3 flex-wrap gap-2">
            <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5 text-primary" /> Active Revision Queue
            </span>
            
            <div className="flex bg-slate-100 rounded-[12px] p-0.5">
              {(["TODAY", "TOMORROW", "WEEKLY"] as const).map(plan => (
                <button
                  key={plan}
                  onClick={() => setSelectedPlan(plan)}
                  className={`px-3.5 py-1.5 text-[9px] font-black uppercase rounded-[9px] transition-all cursor-pointer min-h-[30px] ${
                    selectedPlan === plan 
                      ? "bg-white text-primary shadow-xs" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {plan}
                </button>
              ))}
            </div>
          </div>

          {/* Agenda Feed */}
          <div className="space-y-3">
            {currentAgenda.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 border border-slate-100/50 rounded-[15px] text-slate-400 text-xs font-medium">
                No scheduled revisions pending for this period. Keep scanning NCERT statements!
              </div>
            ) : (
              currentAgenda.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-4 bg-white border border-slate-150 rounded-[15px] hover:border-slate-300 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                        {item.type}
                      </span>
                      <span className="text-[9px] font-black text-slate-500 font-mono flex items-center gap-0.5">
                        <Clock className="w-3 h-3" /> {item.time} ({item.duration})
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">
                        {item.chapter}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                      "{item.concept}"
                    </p>
                  </div>

                  <button
                    onClick={() => handleActionFocusLine(item.id)}
                    className="text-[10px] text-primary hover:underline font-bold uppercase shrink-0 flex items-center gap-0.5 cursor-pointer min-h-[44px]"
                  >
                    Focus HUD <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: COGNITIVE TIMELINE & REMINDER STATS (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-[20px] p-4 md:p-5 space-y-5">
          
          {/* Timeline Panel (Scanned -> Learned -> Revised) */}
          <div className="space-y-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block border-b border-slate-200 pb-2">
              Cognitive Learning Timeline
            </span>

            {selectedTimelineLine ? (
              <div className="space-y-4">
                <span className="text-[10px] text-slate-700 font-black font-poppins uppercase line-clamp-1">
                  Active target: {selectedTimelineLine.chapterName}
                </span>

                <div className="relative pl-5 border-l border-slate-200 space-y-4 text-[10px]">
                  {/* Step 1: Scanned */}
                  <div className="relative">
                    <div className="absolute -left-[24px] top-0 w-3 h-3 rounded-full bg-emerald-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    </div>
                    <div>
                      <span className="font-bold text-emerald-600 block">1. SCANNED / RECOVERY SHIELDED</span>
                      <p className="text-slate-500 text-[9px] leading-relaxed">Line verified through OCR scan engine indexers.</p>
                    </div>
                  </div>

                  {/* Step 2: Learned */}
                  <div className="relative">
                    <div className={`absolute -left-[24px] top-0 w-3 h-3 rounded-full flex items-center justify-center ${
                      selectedTimelineLine.masteryStatus !== "critical" ? "bg-emerald-500" : "bg-primary"
                    }`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    </div>
                    <div>
                      <span className={`font-bold block ${
                        selectedTimelineLine.masteryStatus !== "critical" ? "text-emerald-600" : "text-primary"
                      }`}>
                        2. LEARNED / COMPREHENDED
                      </span>
                      <p className="text-slate-500 text-[9px] leading-relaxed">Decoded mechanisms with AI Explanation tool checkmarks.</p>
                    </div>
                  </div>

                  {/* Step 3: Revised */}
                  <div className="relative">
                    <div className={`absolute -left-[24px] top-0 w-3 h-3 rounded-full flex items-center justify-center ${
                      selectedTimelineLine.masteryStatus === "mastered" ? "bg-emerald-500" : "bg-slate-300"
                    }`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    </div>
                    <div>
                      <span className={`font-bold block ${
                        selectedTimelineLine.masteryStatus === "mastered" ? "text-emerald-600" : "text-slate-400"
                      }`}>
                        3. REVISED & RECALLED
                      </span>
                      <p className="text-slate-500 text-[9px] leading-relaxed">Retained via Spaced Repetition MCQ Practice cycles.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[10px] text-slate-400">Select an NCERT line to track cognitive progression steps.</p>
            )}
          </div>

          <div className="bg-primary/5 p-4 rounded-[15px] border border-primary/25 space-y-2 font-mono">
            <span className="text-[9px] text-slate-500 block uppercase font-bold">Retention decay forecast</span>
            <div className="flex justify-between items-baseline text-primary font-bold text-lg leading-none">
              <span>94% Retention</span>
              <span className="text-[10px] text-emerald-500 uppercase">EXCELLENT</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-sans font-medium">
              Daily active testing of flagged core statements shields your sub-conscious memory from typical NEET fatigue decay windows.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
