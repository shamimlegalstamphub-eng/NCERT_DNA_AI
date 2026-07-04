import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, CheckCircle2, Clock, Brain, MessageSquare, Sparkles, 
  Send, ShieldCheck, Play, Pause, RefreshCw, Cpu, Activity, ChevronRight 
} from "lucide-react";

export default function SmartStudyOS() {
  const [selectedTopic, setSelectedTopic] = useState("transcription");
  const [mentorInput, setMentorInput] = useState("");
  const [mentorMessages, setMentorMessages] = useState([
    { role: "mentor", text: "Salutations! I am your AI Chapter Mentor calibrated to NCERT Biology syllabus. Ask me anything about cytological barriers or dna transcriptions." }
  ]);

  // Focus Timer state
  const [seconds, setSeconds] = useState(1500); // 25 mins
  const [timerActive, setTimerActive] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (timerActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setTimerActive(false);
      setPomodoroCount(prev => prev + 1);
      alert("🎉 Focus session completed! Take a 5 minute break.");
      setSeconds(1500);
    }
    return () => clearInterval(interval);
  }, [timerActive, seconds]);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAskMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorInput.trim()) return;

    const userMsg = { role: "user", text: mentorInput };
    setMentorMessages(prev => [...prev, userMsg]);
    setMentorInput("");

    setTimeout(() => {
      let replyText = "Based on official NCERT Cytology references, that structure is considered highly stable.";
      if (mentorInput.toLowerCase().includes("transcription")) {
        replyText = "In transcriptions, RNA polymerase binds to promoter and initiates transcription (Initiation). A single DNA-dependent RNA polymerase catalyses transcription of all types of RNA in bacteria.";
      } else if (mentorInput.toLowerCase().includes("vacuole") || mentorInput.toLowerCase().includes("membrane")) {
        replyText = "The vacuole is bound by a single membrane called tonoplast. In plants, the tonoplast facilitates the transport of a number of ions against concentration gradients into the vacuole.";
      }

      setMentorMessages(prev => [...prev, { role: "mentor", text: replyText }]);
    }, 900);
  };

  const [scheduleTasks, setScheduleTasks] = useState([
    { id: "1", task: "Revise Exarch Root Anatomy", time: "09:00 AM", status: "completed" },
    { id: "2", task: "Solve 20 Cytology MCQ Predictions", time: "11:30 AM", status: "pending" },
    { id: "3", task: "OCR Scan Diagram Margins", time: "02:00 PM", status: "pending" },
    { id: "4", task: "Dr. Verma Live Q&A Room Session", time: "05:00 PM", status: "pending" }
  ]);

  const toggleTaskStatus = (id: string) => {
    setScheduleTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === "completed" ? "pending" : "completed" };
      }
      return t;
    }));
  };

  // Predictor stats helper
  const topicsData: Record<string, { difficulty: string; recallHalfLife: string; failureRate: string; rankBoost: string }> = {
    "transcription": { difficulty: "85% (Extreme)", recallHalfLife: "3.2 Days", failureRate: "42%", rankBoost: "+180 Ranks" },
    "membranes": { difficulty: "40% (Medium)", recallHalfLife: "14.5 Days", failureRate: "18%", rankBoost: "+65 Ranks" },
    "chloroplast": { difficulty: "65% (High)", recallHalfLife: "8.1 Days", failureRate: "31%", rankBoost: "+110 Ranks" }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl md:rounded-[20px] p-4 md:p-6 shadow-xs space-y-6">
      
      {/* Title Header */}
      <div className="border-b border-slate-100 pb-4">
        <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono font-bold px-2 py-0.5 rounded-full uppercase">
          Ecosystem Node: Step 4 & 5
        </span>
        <h3 className="text-base font-poppins font-black text-slate-900 uppercase mt-1">
          Smart Study OS & Pomodoro Focus Hub
        </h3>
        <p className="text-[10px] text-slate-400 font-mono">
          Auto-scheduling calendar pipelines, custom Pomodoro focus state systems, and intelligent chapter mentor engines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Hand: Today Schedule & Pomodoro focus (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Pomodoro Timer */}
          <div className="p-5 bg-slate-900 text-white rounded-[20px] text-center border border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center text-[9px] font-mono tracking-wider uppercase text-slate-400">
              <span>Cognitive Pomodoro Timer</span>
              <span className="text-indigo-400">{pomodoroCount} Done Today</span>
            </div>

            <div className="text-4xl font-black font-mono tracking-tight text-white py-2">
              {formatTime(seconds)}
            </div>

            <div className="flex justify-center gap-2">
              <button
                onClick={() => setTimerActive(!timerActive)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase cursor-pointer transition-colors ${
                  timerActive ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"
                }`}
              >
                {timerActive ? "Pause Timer" : "Start Focus"}
              </button>
              <button
                onClick={() => {
                  setTimerActive(false);
                  setSeconds(1500);
                }}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] font-mono font-bold rounded-lg cursor-pointer uppercase transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Dynamic "Today Plan" List */}
          <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Today's Study Calendar</span>
            
            <div className="space-y-2.5">
              {scheduleTasks.map(t => (
                <div 
                  key={t.id} 
                  onClick={() => toggleTaskStatus(t.id)}
                  className="flex items-center justify-between gap-3 text-[11px] p-2.5 bg-white border border-slate-100/80 rounded-xl cursor-pointer hover:border-indigo-100 transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 transition-colors ${t.status === "completed" ? "text-emerald-500" : "text-slate-300"}`} />
                    <span className={`font-semibold ${t.status === "completed" ? "line-through text-slate-400" : "text-slate-700"}`}>
                      {t.task}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono font-bold">{t.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Hand: AI Mentor Chat & Difficulty Predictor (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* AI Chapter Mentor */}
          <div className="border border-slate-150 rounded-[20px] overflow-hidden">
            <div className="bg-slate-900 p-3.5 flex justify-between items-center text-white border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-poppins font-black uppercase tracking-wider">
                  Chapter Mentor Chat Engine
                </h4>
              </div>
              <span className="text-[8px] font-mono text-indigo-400">MODEL RECALIBRATED</span>
            </div>

            <div className="h-48 overflow-y-auto bg-slate-50 p-4 space-y-4 text-[11.5px] font-medium leading-relaxed">
              {mentorMessages.map((msg, idx) => (
                <div key={idx} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] text-left ${
                    msg.role === "user" ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-700 shadow-3xs"
                  }`}>
                    <span className="text-[8px] font-mono font-bold block uppercase tracking-wider mb-1 opacity-70">
                      {msg.role === "user" ? "You (Scholar)" : "Dr. Verma AI Mentor"}
                    </span>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAskMentor} className="p-3 bg-white border-t border-slate-150 flex gap-2">
              <input
                type="text"
                value={mentorInput}
                onChange={(e) => setMentorInput(e.target.value)}
                placeholder="Ask about Transcription promoters, Tonoplast gradients, etc..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs focus:outline-none focus:border-indigo-500 p-2 text-slate-800"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold uppercase rounded-xl transition-all cursor-pointer"
              >
                Ask AI
              </button>
            </form>
          </div>

          {/* Difficulty Predictor */}
          <div className="p-4 border border-slate-100 rounded-[20px] bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Cognitive Difficulty & Decay Predictor</span>
              <span className="text-[9px] font-mono font-bold text-indigo-600">PREDICTIVE TELEMETRY</span>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1.5">
              {[
                { id: "transcription", label: "DNA Transcription" },
                { id: "membranes", label: "Cytology Membranes" },
                { id: "chloroplast", label: "Chloroplast Stroma" }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopic(t.id)}
                  className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase transition-colors whitespace-nowrap cursor-pointer ${
                    selectedTopic === t.id ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center text-[10.5px] font-mono font-bold">
              <div className="p-2 bg-white border border-slate-150 rounded-lg">
                <span className="text-[8px] text-slate-400 block uppercase font-bold">EXAM WEIGHT</span>
                <span className="text-slate-900">{topicsData[selectedTopic]?.difficulty}</span>
              </div>
              <div className="p-2 bg-white border border-slate-150 rounded-lg">
                <span className="text-[8px] text-slate-400 block uppercase font-bold">RECALL HALF-LIFE</span>
                <span className="text-indigo-600">{topicsData[selectedTopic]?.recallHalfLife}</span>
              </div>
              <div className="p-2 bg-white border border-slate-150 rounded-lg">
                <span className="text-[8px] text-slate-400 block uppercase font-bold">STUDENT FAILS</span>
                <span className="text-rose-500">{topicsData[selectedTopic]?.failureRate} avg</span>
              </div>
              <div className="p-2 bg-white border border-slate-150 rounded-lg">
                <span className="text-[8px] text-slate-400 block uppercase font-bold">RANK BOOSTER</span>
                <span className="text-emerald-600">{topicsData[selectedTopic]?.rankBoost}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
