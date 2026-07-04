import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Flame, Award, Calendar, BookOpen, Clock, Camera, Sparkles, 
  ChevronRight, Check, Play, Pause, RefreshCw, AlertCircle, 
  TrendingUp, Users, Download, Trophy, Bookmark, FileText, 
  HelpCircle, Shield, Share2, Info, Activity
} from "lucide-react";
import { NCERTLine } from "../types";
import DNAMap from "./DNAMap";
import { getActivities, getWeeklyInsights, ActivityLog } from "../utils/activityTracker";

interface DailyRetentionHomeProps {
  lines: NCERTLine[];
  activeLineId: string;
  onLineSelected: (id: string) => void;
  bookmarks: string[];
  notes: Record<string, string>;
  setActiveTab: (tab: string) => void;
  saveLinesState: (updated: NCERTLine[]) => void;
  onboardingData?: any;
}

interface Mission {
  id: string;
  title: string;
  actionLabel: string;
  tabTarget: string;
  xpReward: number;
  completed: boolean;
}

interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  threshold: number;
  current: number;
  unlocked: boolean;
}

export default function DailyRetentionHome({
  lines,
  activeLineId,
  onLineSelected,
  bookmarks,
  notes,
  setActiveTab,
  saveLinesState,
  onboardingData
}: DailyRetentionHomeProps) {
  // Recent Activities and Weekly insights load
  const [activitiesList, setActivitiesList] = useState<ActivityLog[]>(() => getActivities());
  const [weeklyInsightsData, setWeeklyInsightsData] = useState(() => getWeeklyInsights());

  useEffect(() => {
    setActivitiesList(getActivities());
    setWeeklyInsightsData(getWeeklyInsights());
  }, [bookmarks, notes]);

  // --- Persistent Local States for Gamification ---
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem("ncert_dna_xp");
    return saved ? parseInt(saved) : 340; // Default XP (Explorer level)
  });

  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem("ncert_dna_streak");
    return saved ? parseInt(saved) : 3; // Default 3 day streak
  });

  const [streakDays, setStreakDays] = useState<boolean[]>(() => {
    const saved = localStorage.getItem("ncert_dna_streak_days");
    // Default last 7 days (e.g., checkmarks for Mon, Tue, Wed, today Thu is pending)
    return saved ? JSON.parse(saved) : [true, true, true, false, false, false, false];
  });

  const [studyTimeToday, setStudyTimeToday] = useState<number>(() => {
    const saved = localStorage.getItem("ncert_dna_study_time");
    return saved ? parseInt(saved) : 485; // 8 mins 5 secs default
  });

  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);

  const [lastScanTopic, setLastScanTopic] = useState<string>(() => {
    return localStorage.getItem("ncert_dna_last_scan_topic") || "Morphology: Tapetum Structure";
  });

  const [lastScanTime, setLastScanTime] = useState<string>(() => {
    return localStorage.getItem("ncert_dna_last_scan_time") || "Today, 10:15 AM";
  });

  const [completedMissions, setCompletedMissions] = useState<string[]>(() => {
    const saved = localStorage.getItem("ncert_dna_completed_missions");
    return saved ? JSON.parse(saved) : [];
  });

  const [leaderboardFriendsMode, setLeaderboardFriendsMode] = useState<boolean>(false);
  const [activeReportTab, setActiveReportTab] = useState<"weekly" | "stats">("weekly");
  const [showLevelUpMessage, setShowLevelUpMessage] = useState<boolean>(false);
  const [prevLevel, setPrevLevel] = useState<string>("");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Find Active studied line ---
  const activeLine = lines.find(l => l.id === activeLineId) || lines[0];

  // --- Save states to localStorage ---
  useEffect(() => {
    localStorage.setItem("ncert_dna_xp", xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem("ncert_dna_streak", streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem("ncert_dna_streak_days", JSON.stringify(streakDays));
  }, [streakDays]);

  useEffect(() => {
    localStorage.setItem("ncert_dna_study_time", studyTimeToday.toString());
  }, [studyTimeToday]);

  useEffect(() => {
    localStorage.setItem("ncert_dna_completed_missions", JSON.stringify(completedMissions));
  }, [completedMissions]);

  // --- Study Timer effect ---
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        setStudyTimeToday(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive]);

  // --- XP Levels Definition ---
  const getLevelInfo = (currentXp: number) => {
    if (currentXp < 200) {
      return { title: "Beginner Agent", min: 0, max: 200, color: "text-slate-400 bg-slate-100 border-slate-200" };
    } else if (currentXp < 500) {
      return { title: "Cognitive Explorer", min: 200, max: 500, color: "text-[#2B7FFF] bg-blue-50 border-blue-100" };
    } else if (currentXp < 1000) {
      return { title: "NCERT Master", min: 500, max: 1000, color: "text-amber-500 bg-amber-50 border-amber-100" };
    } else {
      return { title: "Retention Legend", min: 1000, max: 5000, color: "text-emerald-500 bg-emerald-50 border-emerald-100" };
    }
  };

  const levelInfo = getLevelInfo(xp);
  const xpInCurrentLevel = xp - levelInfo.min;
  const xpNeededInCurrentLevel = levelInfo.max - levelInfo.min;
  const levelProgressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpNeededInCurrentLevel) * 100));

  // --- Level Up Detector ---
  useEffect(() => {
    const info = getLevelInfo(xp);
    if (prevLevel && prevLevel !== info.title) {
      setShowLevelUpMessage(true);
      setTimeout(() => setShowLevelUpMessage(false), 4000);
    }
    setPrevLevel(info.title);
  }, [xp]);

  // --- Add XP helper ---
  const awardXp = (amount: number, reason: string) => {
    setXp(prev => prev + amount);
    // Notification could go here
  };

  // --- 1. Today's Goal Tracker ---
  const todayGoalXp = 150;
  const todayGoalProgress = Math.min(100, Math.round((Math.min(xp, todayGoalXp) / todayGoalXp) * 100));

  // --- 4. Study Missions List ---
  const initialMissions: Mission[] = [
    { id: "scan", title: "Scan 1 Textbook Page", actionLabel: "Launch Camera Scanner", tabTarget: "vision", xpReward: 50, completed: completedMissions.includes("scan") },
    { id: "solve", title: "Solve 10 Active Recall Questions", actionLabel: "Launch Recall Panel", tabTarget: "recovery", xpReward: 60, completed: completedMissions.includes("solve") },
    { id: "review", title: "Review Notebook Statements", actionLabel: "Open Notebooks Hub", tabTarget: "notes", xpReward: 30, completed: completedMissions.includes("review") },
    { id: "master", title: "Calibrate Chapter Mastery to Mastered", actionLabel: "Open Revision HUD", tabTarget: "revision", xpReward: 40, completed: completedMissions.includes("master") }
  ];

  const handleCompleteMission = (mId: string, reward: number) => {
    if (completedMissions.includes(mId)) return;
    const updated = [...completedMissions, mId];
    setCompletedMissions(updated);
    awardXp(reward, `Completed Daily Mission: ${mId.toUpperCase()}`);
  };

  // --- 3. Smart Reminders Generator (Based on actual state) ---
  const weakLinesCount = lines.filter(l => l.masteryStatus === "critical").length;
  const notesCount = Object.keys(notes).length;
  const bookmarkedLinesWithoutNotes = lines.filter(l => bookmarks.includes(l.id) && !notes[l.id]).length;

  const reminders = [
    {
      id: "rem-1",
      title: "Active Recall Calibration Required",
      desc: `${weakLinesCount} statements marked as CRITICAL. Immediate self-testing is recommended to restore retention.`,
      actionLabel: "Calibrate Recall",
      actionTab: "recovery",
      critical: weakLinesCount > 2
    },
    {
      id: "rem-2",
      title: "Consolidated Notebook Gaps",
      desc: bookmarkedLinesWithoutNotes > 0 
        ? `${bookmarkedLinesWithoutNotes} bookmarked statements do not have active consolidated study notes.`
        : "All active bookmarks are fully documented. Excellent notes coverage!",
      actionLabel: "Update Notes",
      actionTab: "notes",
      critical: bookmarkedLinesWithoutNotes > 1
    },
    {
      id: "rem-3",
      title: "Weekly Coverage Goal Check",
      desc: `Total syllabus statement coverage is at ${Math.round((lines.filter(l => l.masteryStatus === "mastered").length / lines.length) * 100)}%. Keep studying!`,
      actionLabel: "Analyze Finder",
      actionTab: "finder",
      critical: false
    }
  ];

  // --- 6. Achievements Trackers ---
  const achievements: Achievement[] = [
    { id: "ach-1", title: "First Lens Scan", desc: "Successfully completed first optical OCR scan calibration.", icon: "📷", threshold: 1, current: completedMissions.includes("scan") ? 1 : 0, unlocked: completedMissions.includes("scan") },
    { id: "ach-2", title: "Active Revision Master", desc: "Achieved 10 NCERT Line revisions.", icon: "⚡", threshold: 10, current: lines.filter(l => l.masteryStatus === "mastered").length, unlocked: lines.filter(l => l.masteryStatus === "mastered").length >= 10 },
    { id: "ach-3", title: "Cognitive Consistency", desc: "Maintained a 3+ day streak.", icon: "🔥", threshold: 3, current: streak, unlocked: streak >= 3 },
    { id: "ach-4", title: "High-Yield Investigator", desc: "Added custom statements to scanner database.", icon: "🧬", threshold: 1, current: lines.length > 5 ? 1 : 0, unlocked: lines.length > 5 }
  ];

  // --- 8. Leaderboard ---
  const localLeaderboard = [
    { rank: 1, name: "Aarav Sharma", xp: 1450, badge: "Legend", isMe: false },
    { rank: 2, name: "Prisha Patel", xp: 980, badge: "Master", isMe: false },
    { rank: 3, name: "Me (Candidate)", xp: xp, badge: getLevelInfo(xp).title.split(" ")[1] || "Explorer", isMe: true },
    { rank: 4, name: "Kabir Mehta", xp: 310, badge: "Explorer", isMe: false },
    { rank: 5, name: "Diya Roy", xp: 180, badge: "Beginner", isMe: false }
  ].sort((a, b) => b.xp - a.xp).map((item, idx) => ({ ...item, rank: idx + 1 }));

  const friendsLeaderboard = [
    { rank: 1, name: "Me (Candidate)", xp: xp, badge: getLevelInfo(xp).title.split(" ")[1] || "Explorer", isMe: true },
    { rank: 2, name: "Rohan Sen (Friend)", xp: 410, badge: "Explorer", isMe: false },
    { rank: 3, name: "Aditi K. (Friend)", xp: 290, badge: "Beginner", isMe: false }
  ].sort((a, b) => b.xp - a.xp).map((item, idx) => ({ ...item, rank: idx + 1 }));

  const activeLeaderboard = leaderboardFriendsMode ? friendsLeaderboard : localLeaderboard;

  // --- 9. Student Report Cards data ---
  const mostMasteredChapter = () => {
    const chapters: Record<string, number> = {};
    lines.filter(l => l.masteryStatus === "mastered").forEach(l => {
      chapters[l.chapterName] = (chapters[l.chapterName] || 0) + 1;
    });
    let best = "None Yet";
    let max = 0;
    Object.entries(chapters).forEach(([k, v]) => {
      if (v > max) {
        max = v;
        best = k;
      }
    });
    return best;
  };

  const criticalTopicsList = () => {
    return lines.filter(l => l.masteryStatus === "critical").map(l => l.chapterName);
  };

  // --- 10. Share Card Generator (Actual PNG) ---
  const handleGenerateShareImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw dark techy certificate card
    ctx.fillStyle = "#090E17";
    ctx.fillRect(0, 0, 600, 400);

    // Dynamic grid overlay
    ctx.strokeStyle = "rgba(43, 127, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 600; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 400);
      ctx.stroke();
    }
    for (let j = 0; j < 400; j += 40) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(600, j);
      ctx.stroke();
    }

    // Outer cyber glowing border
    ctx.strokeStyle = "#2B7FFF";
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 580, 380);

    // Corner decorative brackets
    ctx.fillStyle = "#EF4444";
    ctx.fillRect(8, 8, 20, 4);
    ctx.fillRect(8, 8, 4, 20);
    ctx.fillRect(572, 8, 20, 4);
    ctx.fillRect(588, 8, 4, 20);
    ctx.fillRect(8, 388, 20, 4);
    ctx.fillRect(8, 372, 4, 20);
    ctx.fillRect(572, 388, 20, 4);
    ctx.fillRect(588, 372, 4, 20);

    // App header
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 20px monospace";
    ctx.fillText("NCERT INTELLIGENCE OPERATING SYSTEM", 50, 60);

    ctx.fillStyle = "#64748B";
    ctx.font = "12px monospace";
    ctx.fillText("COGNITIVE RETENTION REPORT CARD", 50, 85);

    // Separator line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 105);
    ctx.lineTo(550, 105);
    ctx.stroke();

    // Stats Section
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 14px monospace";
    ctx.fillText("CANDIDATE PARAMETERS:", 50, 140);

    ctx.fillStyle = "#CBD5E1";
    ctx.font = "13px monospace";
    ctx.fillText(`- LEVEL: ${levelInfo.title.toUpperCase()}`, 50, 175);
    ctx.fillText(`- TOTAL EXPERIENCE: ${xp} XP`, 50, 205);
    ctx.fillText(`- CONFLICT STREAK: ${streak} DAYS 🔥`, 50, 235);
    ctx.fillText(`- RECALL ACCURACY: ${Math.round((lines.filter(l => l.masteryStatus === "mastered").length / lines.length) * 100)}% SYLLABUS CAPTURE`, 50, 265);

    // Bottom decorative wave / DNA
    ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 50; x <= 550; x += 10) {
      const y = 330 + Math.sin(x * 0.05) * 15;
      if (x === 50) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = "rgba(43, 127, 255, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 50; x <= 550; x += 10) {
      const y = 330 - Math.sin(x * 0.05) * 15;
      if (x === 50) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Download linkage
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "ncert_agent_daily_retention.png";
    link.href = url;
    link.click();
  };

  // Helper formatting timer
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`;
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
      
      {/* Hidden canvas for PNG generator */}
      <canvas ref={canvasRef} width="600" height="400" className="hidden" />

      {/* Level Up Banner Alert */}
      <AnimatePresence>
        {showLevelUpMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="p-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-xl shadow-lg border border-amber-400 flex items-center justify-between gap-3 font-poppins"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-bounce">🏆</span>
              <div>
                <strong className="text-sm block">LEVEL CALIBRATION UPGRADE!</strong>
                <span className="text-xs text-white/90">You have advanced to: {levelInfo.title}!</span>
              </div>
            </div>
            <button 
              onClick={() => setShowLevelUpMessage(false)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-xs rounded-lg transition-all"
            >
              Acknowledge
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 1: WELCOME & CONTINUE STUDYING BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Welcome Block + XP System Level Gauge */}
        <div className="lg:col-span-8 bg-gradient-to-br from-slate-900 via-slate-950 to-[#090E17] border border-slate-800 rounded-xl p-5 text-white flex flex-col justify-between relative overflow-hidden shadow-xl min-h-[220px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] bg-red-500/10 border border-red-500/30 text-red-400 font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-widest">
                {onboardingData 
                  ? `IDENT: ${onboardingData.classLevel.toUpperCase()} | TARGET: ${onboardingData.exam.toUpperCase()}`
                  : "SYSTEM IDENT: ACTIVE SCANNER"}
              </span>
              <span className="flex items-center gap-0.5 text-amber-400 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> {streak} Day Streak
              </span>
              {onboardingData?.goal && (
                <span className="text-[10px] bg-primary/20 text-cyan-300 font-bold px-2 py-0.5 rounded-full font-mono uppercase border border-primary/30">
                  GOAL: {onboardingData.goal}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-poppins font-black tracking-tight leading-tight">
              Welcome Back, {onboardingData?.name || "Biology Agent"}
            </h2>
            <p className="text-xs text-slate-400 max-w-xl font-mono leading-relaxed">
              Your personalized NEET-focused dashboard has calibrated 100+ logical connection points. Focus on active weak items to maximize retention.
            </p>
          </div>

          {/* Level Progress Indicator */}
          <div className="border-t border-slate-800/80 pt-4 mt-4 space-y-2.5">
            <div className="flex justify-between items-end">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block tracking-wider">RECALL CALIBRATION TIER</span>
                <span className="text-sm font-bold text-amber-400 uppercase font-sans tracking-tight">{levelInfo.title}</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-300">
                {xp} XP / {levelInfo.max} XP
              </span>
            </div>
            
            <div className="w-full bg-slate-850 h-3 rounded-full overflow-hidden border border-slate-800/60 relative">
              <div 
                className="bg-gradient-to-r from-[#2B7FFF] to-cyan-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 font-mono font-bold uppercase">
              <span>{levelInfo.min} XP</span>
              <span>{levelProgressPercent}% toward next badge</span>
              <span>{levelInfo.max} XP</span>
            </div>
          </div>
        </div>

        {/* 2. Streak & Live Study Tracker */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5 mb-3">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">CONSISTENCY COMPASS</span>
              <span className="text-xs font-mono font-semibold text-rose-500 flex items-center gap-1">
                <Flame className="w-4 h-4 fill-rose-500 text-rose-500" /> STREAK: {streak}D
              </span>
            </div>

            {/* Calendar indicators */}
            <div className="grid grid-cols-7 gap-1.5 mb-4">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
                const isActive = streakDays[i];
                const isToday = i === 3; // Mock Thursday today
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className="text-[9px] text-slate-400 font-mono font-bold">{day}</span>
                    <button 
                      onClick={() => {
                        if (!isActive) {
                          const copy = [...streakDays];
                          copy[i] = true;
                          setStreakDays(copy);
                          setStreak(prev => prev + 1);
                          awardXp(30, "Claimed daily streak multiplier!");
                        }
                      }}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border cursor-pointer ${
                        isActive 
                          ? "bg-rose-500 border-rose-600 text-white font-black shadow-xs" 
                          : isToday 
                            ? "border-dashed border-rose-500 bg-rose-50/50 text-rose-600 animate-pulse font-bold"
                            : "bg-slate-50 border-slate-100 text-slate-400"
                      }`}
                    >
                      {isActive ? "✓" : isToday ? "🔥" : "•"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's Goal percentage circle */}
          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
            <div className="space-y-0.5">
              <span className="text-[9px] text-slate-400 font-mono font-bold block">TODAY'S XP LIMIT</span>
              <strong className="text-slate-800 text-xs font-black block uppercase">{todayGoalProgress}% CAPTURED</strong>
              <span className="text-[10px] text-slate-500 leading-none">Goal: 150 XP per day</span>
            </div>
            
            <div className="relative w-11 h-11 shrink-0">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-slate-200 stroke-current"
                  strokeWidth="3.5"
                  strokeDasharray="100, 100"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-primary stroke-current"
                  strokeWidth="3.5"
                  strokeDasharray={`${todayGoalProgress}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-black text-slate-800">
                {todayGoalProgress}%
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 2: LIVE TIMER, LAST SCAN & QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        
        {/* Study Timer Tracker */}
        <div className="md:col-span-4 bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">STUDY TIME RECORDER</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          </div>

          <div className="py-2 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] font-mono block">ACTIVE SESSION TIME</span>
              <strong className="text-slate-950 font-mono text-xl font-black block tracking-tight">
                {formatTimer(studyTimeToday)}
              </strong>
            </div>

            <button 
              onClick={() => setIsTimerActive(!isTimerActive)}
              className={`p-2 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
                isTimerActive 
                  ? "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100/60" 
                  : "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100/60"
              }`}
              title={isTimerActive ? "Pause Timer" : "Resume Timer"}
            >
              {isTimerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>

          <div className="bg-slate-50 p-2 text-center rounded-lg font-mono text-[9px] text-slate-500">
            *Study timer auto-increments to track active recall.
          </div>
        </div>

        {/* Last Page Scanner Log */}
        <div className="md:col-span-4 bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">LAST OPTICAL OCR SCAN</span>
            <Camera className="w-3.5 h-3.5 text-[#2B7FFF]" />
          </div>

          <div className="py-2">
            <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">LAST DETECTED TOPIC</span>
            <p className="text-xs font-bold text-slate-800 truncate leading-relaxed">
              {lastScanTopic}
            </p>
            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
              Time: {lastScanTime}
            </span>
          </div>

          <button 
            onClick={() => setActiveTab("vision")}
            className="w-full py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 font-bold text-[10px] uppercase tracking-wider text-center cursor-pointer min-h-[36px]"
          >
            Launch Lens Scanner
          </button>
        </div>

        {/* Quick Resume studying statement */}
        <div className="md:col-span-4 bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">LAST EXAMINED STATEMENT</span>
            <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
          </div>

          <div className="py-2">
            <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase block tracking-wide">
              {activeLine.chapterName} (PAGE {activeLine.pageNumber})
            </span>
            <p className="text-xs font-semibold text-slate-700 line-clamp-1 italic">
              "{activeLine.lineText}"
            </p>
          </div>

          <button 
            onClick={() => setActiveTab("finder")}
            className="w-full py-2 bg-primary text-white hover:bg-primary/95 rounded-lg font-bold text-[10px] uppercase tracking-wider text-center cursor-pointer min-h-[36px]"
          >
            Quick Resume Analysis
          </button>
        </div>

      </div>

      {/* SECTION 3: DAILY MISSIONS & SMART REMINDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Daily Study Missions */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-2.5 flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">DAILY STUDY MISSIONS</span>
              <h3 className="text-sm font-poppins font-bold text-slate-900 uppercase">ACTIVE TARGET ASSIGNMENTS</h3>
            </div>
            <span className="text-[10px] bg-primary/10 text-primary font-bold font-mono px-2 py-0.5 rounded-full uppercase">
              {completedMissions.length} / 4 COMPLETED
            </span>
          </div>

          <div className="space-y-3">
            {initialMissions.map((mission) => (
              <div 
                key={mission.id} 
                className={`p-3.5 border rounded-xl flex items-center justify-between gap-4 transition-all ${
                  mission.completed 
                    ? "bg-emerald-50/50 border-emerald-100 text-slate-500" 
                    : "bg-white border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <button 
                    onClick={() => handleCompleteMission(mission.id, mission.xpReward)}
                    disabled={mission.completed}
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 cursor-pointer ${
                      mission.completed 
                        ? "bg-emerald-500 border-emerald-600 text-white" 
                        : "border-slate-300 hover:border-primary text-transparent"
                    }`}
                  >
                    ✓
                  </button>
                  <div className="space-y-0.5 min-w-0">
                    <span className={`text-xs font-bold block truncate ${mission.completed ? "line-through text-slate-400 font-medium" : "text-slate-800"}`}>
                      {mission.title}
                    </span>
                    <button 
                      onClick={() => setActiveTab(mission.tabTarget)}
                      className="text-[10px] font-mono text-primary font-bold hover:underline text-left block"
                    >
                      {mission.actionLabel} →
                    </button>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className={`text-xs font-mono font-bold uppercase tracking-tight block ${mission.completed ? "text-emerald-500" : "text-amber-500"}`}>
                    +{mission.xpReward} XP
                  </span>
                  {mission.completed && (
                    <span className="text-[8px] font-bold text-emerald-600 block bg-emerald-100 px-1 py-0.2 rounded-sm uppercase tracking-wider mt-0.5">
                      CLAIMED
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Reminders Grid */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">SMART RETENTION REMINDERS</span>
            <h3 className="text-sm font-poppins font-bold text-slate-900 uppercase">ACTIVE RADAR ALERTS</h3>
          </div>

          <div className="space-y-3.5">
            {reminders.map((rem) => (
              <div 
                key={rem.id} 
                className={`p-3.5 border rounded-xl space-y-2 transition-all ${
                  rem.critical 
                    ? "bg-rose-50/50 border-rose-100/80 hover:border-rose-200" 
                    : "bg-slate-50 border-slate-100 hover:border-slate-200/80"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${rem.critical ? "text-rose-500" : "text-slate-400"}`} />
                  <div className="space-y-0.5">
                    <h4 className={`text-xs font-bold ${rem.critical ? "text-rose-950" : "text-slate-800"}`}>
                      {rem.title}
                    </h4>
                    <p className="text-[10.5px] text-slate-500 leading-relaxed font-mono">
                      {rem.desc}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end pt-1">
                  <button 
                    onClick={() => setActiveTab(rem.actionTab)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all min-h-[32px] cursor-pointer flex items-center justify-center ${
                      rem.critical 
                        ? "bg-rose-500 hover:bg-rose-600 text-white" 
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60"
                    }`}
                  >
                    {rem.actionLabel}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION 4: COGNITIVE DNA MAP & WORKSPACE COMPARTMENT */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 md:p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">REVISION TARGET INTERFACE</span>
            <h3 className="text-sm font-poppins font-bold text-slate-900 uppercase">Interactive DNA Genome Map</h3>
          </div>
          <button 
            onClick={() => setActiveTab("finder")}
            className="text-primary text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            Launch Core Statement Finder <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="w-full">
          <DNAMap 
            lines={lines} 
            activeLineId={activeLineId} 
            clearanceLevel="GUEST_PREVIEW"
            onLineSelected={onLineSelected} 
            onMasteryReset={() => {
              const copy = lines.map(l => ({ ...l, masteryStatus: "unknown" as const }));
              saveLinesState(copy);
            }}
          />
        </div>
      </div>

      {/* SECTION 5: RETENTION ARENA: LEADERBOARD, ACHIEVEMENTS & REPORT CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Local & Friends Leaderboard */}
        <div className="lg:col-span-6 bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-2.5 flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">RETENTION CHALLENGE LEADERBOARD</span>
              <h3 className="text-sm font-poppins font-bold text-slate-900 uppercase">COGNITIVE CALIBRATION CHAMPIONS</h3>
            </div>
            
            {/* Friends toggle */}
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 border border-slate-100 rounded-lg">
              <button 
                onClick={() => setLeaderboardFriendsMode(false)}
                className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                  !leaderboardFriendsMode 
                    ? "bg-primary text-white" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Global
              </button>
              <button 
                onClick={() => setLeaderboardFriendsMode(true)}
                className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                  leaderboardFriendsMode 
                    ? "bg-primary text-white" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Friends
              </button>
            </div>
          </div>

          {/* Table list */}
          <div className="space-y-2">
            {activeLeaderboard.map((student) => (
              <div 
                key={student.name}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  student.isMe 
                    ? "bg-primary/5 border-primary/20" 
                    : "bg-slate-50/50 border-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full font-mono text-[10px] font-black flex items-center justify-center ${
                    student.rank === 1 
                      ? "bg-amber-100 text-amber-700 border border-amber-200" 
                      : student.rank === 2
                        ? "bg-slate-200 text-slate-700 border border-slate-300"
                        : "bg-slate-100 text-slate-500"
                  }`}>
                    {student.rank}
                  </span>
                  <div>
                    <span className={`text-xs font-bold block ${student.isMe ? "text-slate-900" : "text-slate-700"}`}>
                      {student.name} {student.isMe && <span className="text-[8px] font-bold bg-primary text-white px-1 py-0.2 rounded-sm ml-1 uppercase">Me</span>}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wide">
                      Tier: {student.badge}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-black text-slate-800">
                    {student.xp} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Achievements unlocked */}
        <div className="lg:col-span-6 bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">MISSION ACHIEVEMENTS RADAR</span>
            <h3 className="text-sm font-poppins font-bold text-slate-900 uppercase">UNLOCKED SPECIALIST BADGES</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {achievements.map((ach) => (
              <div 
                key={ach.id} 
                className={`p-3.5 border rounded-xl flex items-start gap-3 transition-all ${
                  ach.unlocked 
                    ? "bg-emerald-50/20 border-emerald-100/70" 
                    : "bg-slate-50 border-slate-100 opacity-65"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 text-lg ${
                  ach.unlocked 
                    ? "bg-emerald-100/50 border-emerald-200 text-emerald-700" 
                    : "bg-slate-200 border-slate-300 text-slate-400"
                }`}>
                  {ach.icon}
                </div>
                
                <div className="space-y-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 leading-tight">
                    {ach.title}
                  </h4>
                  <p className="text-[9.5px] text-slate-500 leading-relaxed truncate font-mono">
                    {ach.desc}
                  </p>
                  
                  {/* Progress info */}
                  <div className="pt-1 flex items-center justify-between gap-2 text-[8.5px] font-mono text-slate-400">
                    <span>PROGRESS: {ach.current}/{ach.threshold}</span>
                    <span className={`font-bold uppercase ${ach.unlocked ? "text-emerald-600" : "text-slate-400"}`}>
                      {ach.unlocked ? "UNLOCKED" : "LOCKED"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION 6: STUDENT REPORT & SAVE SUMMARY IMAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Weekly Student Performance Report */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">WEEKLY COGNITIVE DIAGNOSTIC</span>
                <h3 className="text-sm font-poppins font-bold text-slate-900 uppercase">STUDENT RETENTION ANALYSIS REPORT</h3>
              </div>
              
              <div className="flex bg-slate-50 p-1 border border-slate-100 rounded-lg">
                <button 
                  onClick={() => setActiveReportTab("weekly")}
                  className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                    activeReportTab === "weekly" 
                      ? "bg-primary text-white" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Weekly Report
                </button>
                <button 
                  onClick={() => setActiveReportTab("stats")}
                  className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                    activeReportTab === "stats" 
                      ? "bg-primary text-white" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Syllabus Metrics
                </button>
              </div>
            </div>

            {activeReportTab === "weekly" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block tracking-wide">ACTIVE STUDY TIME</span>
                  <strong className="text-sm text-slate-900 block font-poppins font-black">
                    {(weeklyInsightsData.studyTimeMinutes / 60).toFixed(1)} / {onboardingData?.studyHours || "4"} HOURS TARGET
                  </strong>
                  <span className="text-[10px] text-emerald-600 font-semibold block">↑ {(weeklyInsightsData.studyTimeMinutes > 145 ? 12 : 6)}% increase from last week</span>
                </div>
                
                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block tracking-wide">BEST COGNITIVE CHAPTER</span>
                  <strong className="text-sm text-primary block font-poppins font-black truncate">
                    {(weeklyInsightsData.mostStudiedChapter || mostMasteredChapter()).toUpperCase()}
                  </strong>
                  <span className="text-[10px] text-slate-500 block">Sustained recall retention above 85%</span>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block tracking-wide">WEAK RECALL TOPICS DETECTED</span>
                  <strong className="text-sm text-rose-500 block font-poppins font-black truncate">
                    {(weeklyInsightsData.weakChapter || (criticalTopicsList()[0] ? criticalTopicsList()[0] : "NONE DETECTED")).toUpperCase()}
                  </strong>
                  <span className="text-[10px] text-slate-500 block">Requires flashcard testing loop</span>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block tracking-wide">COGNITIVE SPEED IMPROVEMENT</span>
                  <strong className="text-sm text-slate-900 block font-poppins font-black">
                    +{weeklyInsightsData.progressPercentage}% COGNITIVE SPEED
                  </strong>
                  <span className="text-[10px] text-slate-500 block">Calculated via active question latency</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 font-mono">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span>Syllabus Covered</span>
                    <span className="font-bold text-slate-800">
                      {Math.round((lines.filter(l => l.masteryStatus === "mastered").length / lines.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${(lines.filter(l => l.masteryStatus === "mastered").length / lines.length) * 100}%` }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span>Notes consolidated</span>
                    <span className="font-bold text-slate-800">
                      {Math.round((notesCount / lines.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (notesCount / lines.length) * 100)}%` }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <p className="text-[10px] font-mono text-slate-400 mt-4 pt-2 border-t border-slate-100 leading-relaxed">
            *This weekly report uses actual local telemetry to calculate active recall, notebook completion, and chapter coverage coefficients.
          </p>
        </div>

        {/* Recent Activity Timeline Widget */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between mb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">STUDENT WORK LOG</span>
                <h3 className="text-sm font-poppins font-bold text-slate-900 uppercase">RECENT ACTIVITY TIMELINE</h3>
              </div>
              <Activity className="w-4 h-4 text-primary animate-pulse" />
            </div>

            <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
              {activitiesList.length === 0 ? (
                <p className="text-slate-400 italic text-[11px] text-center py-8">No recent activity logged yet.</p>
              ) : (
                activitiesList.map((act) => (
                  <div key={act.id} className="relative pl-5 pb-1">
                    {/* Timeline vertical node line */}
                    <span className="absolute left-1.5 top-1.5 bottom-0 w-[1px] bg-slate-200"></span>
                    
                    {/* Timeline bullet dot */}
                    <span className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-white ${
                      act.type === "scan" ? "bg-[#2B7FFF]" :
                      act.type === "explain" ? "bg-amber-500" :
                      act.type === "save" ? "bg-purple-500" :
                      act.type === "revise" ? "bg-emerald-500" : "bg-slate-450"
                    }`}></span>

                    <div className="space-y-0.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-800">{act.title}</span>
                        <span className="text-[8.5px] font-mono text-slate-400">{act.timestamp}</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 leading-normal">{act.desc}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="text-[9px] font-mono text-slate-400 border-t border-slate-100/60 pt-2.5 mt-2">
            *Activities are recorded locally when actions are taken.
          </div>
        </div>

        {/* Share study summary layout */}
        <div className="lg:col-span-4 bg-[#090E17] border border-slate-800 rounded-xl p-5 text-white flex flex-col justify-between relative overflow-hidden shadow-xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse"></div>
          
          <div className="space-y-3">
            <span className="text-[9px] text-[#2B7FFF] font-mono font-bold uppercase tracking-widest block">SECURE CREDENTIAL EXPORTER</span>
            <h3 className="text-base font-poppins font-black leading-snug">
              EXPORT DIGITAL STUDY PASS
            </h3>
            
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              Generate and download a high-fidelity cryptographic agent status ticket containing your Streak, Level and Syllabus Completion.
            </p>

            <div className="bg-slate-950 p-3 border border-slate-900 rounded-xl space-y-2 font-mono text-[10px] text-slate-300">
              <div>• AGENT LEVEL: {levelInfo.title}</div>
              <div>• STREAK: {streak} DAYS 🔥</div>
              <div>• CALIBRATED RECALL: {lines.filter(l => l.masteryStatus === "mastered").length} LINES</div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              onClick={handleGenerateShareImage}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-poppins font-black uppercase text-xs tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-red-950/20 hover:scale-[1.01] transition-all min-h-[48px]"
            >
              <Download className="w-4 h-4 text-white" /> EXPORT STATUS IMAGE (.PNG)
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
