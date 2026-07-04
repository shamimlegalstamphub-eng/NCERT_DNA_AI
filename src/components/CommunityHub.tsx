import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, MessageSquare, Flame, Award, Heart, Share2, 
  Send, Calendar, Clock, Lock, Sparkles, AlertCircle 
} from "lucide-react";

export default function CommunityHub() {
  const [activeGroup, setActiveGroup] = useState("all-india-rank-1");
  const [chatMessage, setChatMessage] = useState("");
  
  const [channels] = useState([
    { id: "all-india-rank-1", name: "AIIMS Elite AI Cohort", members: 324, level: "Premium" },
    { id: "morphology-roots", name: "Morphology Diagram Hacks", members: 184, level: "Public" },
    { id: "molecular-genetics", name: "Transcription & Translation Decipher", members: 412, level: "Public" },
    { id: "teacher-mentor-room", name: "Daily Dr. Verma Q&A Session", members: 92, level: "Premium" }
  ]);

  const [leaderboard] = useState([
    { rank: 1, name: "Aarav Sharma", score: 360, questionsSolved: 1450, streak: 42, iconColor: "text-amber-500" },
    { rank: 2, name: "Isha Malhotra", score: 355, questionsSolved: 1320, streak: 31, iconColor: "text-slate-400" },
    { rank: 3, name: "Pranav Iyer", score: 350, questionsSolved: 1190, streak: 25, iconColor: "text-amber-700" },
    { rank: 4, name: "Sneha Reddy", score: 345, questionsSolved: 1080, streak: 18, iconColor: "text-slate-500" }
  ]);

  const [discussions, setDiscussions] = useState([
    {
      id: "d1",
      author: "Aditi Bose",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
      timestamp: "20 minutes ago",
      topic: "How to memorize the cell envelope differentiation in Gram-positive bacteria vs Gram-negative?",
      replies: 12,
      likes: 45,
      liked: false
    },
    {
      id: "d2",
      author: "Vikram Sen",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop",
      timestamp: "1 hour ago",
      topic: "Mnemonics for exarch root development. Ex-arch root is always outer development!",
      replies: 8,
      likes: 31,
      liked: true
    }
  ]);

  const [chatLogs, setChatLogs] = useState<Record<string, Array<{ sender: string; time: string; text: string; isAI?: boolean }>>>({
    "all-india-rank-1": [
      { sender: "System Bot", time: "9:00 AM", text: "Welcome to AIIMS Elite AI Cohort. Focus remains strictly on Bio-Coordinates.", isAI: true },
      { sender: "Suresh", time: "9:02 AM", text: "Are you guys practicing the mock test on Lac Operon basals?" },
      { sender: "Kabir", time: "9:05 AM", text: "Yes, solved 40 questions today. Predictive AI is guessing a mutation scenario for NEET 2026." }
    ],
    "morphology-roots": [
      { sender: "System Bot", time: "10:00 AM", text: "Diagram Hacks live. Feel free to drag in textbook margins.", isAI: true }
    ]
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMsg = {
      sender: "You (Scholar)",
      time: "Just Now",
      text: chatMessage
    };

    setChatLogs(prev => ({
      ...prev,
      [activeGroup]: [...(prev[activeGroup] || []), newMsg]
    }));
    setChatMessage("");

    // Optional simulated reply from AI Mentor
    if (activeGroup === "teacher-mentor-room" || activeGroup === "all-india-rank-1") {
      setTimeout(() => {
        const aiReply = {
          sender: "Dr. Verma AI Assistant",
          time: "Just Now",
          text: "Excellent observation. Let's refer to page 126 in the NCERT handbook to confirm that hypothesis.",
          isAI: true
        };
        setChatLogs(prev => ({
          ...prev,
          [activeGroup]: [...(prev[activeGroup] || []), aiReply]
        }));
      }, 1000);
    }
  };

  const handleLikeDiscussion = (id: string) => {
    setDiscussions(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          liked: !d.liked,
          likes: d.liked ? d.likes - 1 : d.likes + 1
        };
      }
      return d;
    }));
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl md:rounded-[20px] p-4 md:p-6 shadow-xs space-y-6">
      <div className="border-b border-slate-100 pb-4 flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono font-bold px-2 py-0.5 rounded-full uppercase">
            Ecosystem Node: Step 6
          </span>
          <h3 className="text-base font-poppins font-black text-slate-900 uppercase mt-1">
            Social Study Community & Leaderboards
          </h3>
          <p className="text-[10px] text-slate-400 font-mono">
            Engage with study groups, join peer discussion threads, and check your rank on the live leaderboard.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Cohorts list and live study room chat (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border border-slate-100 rounded-[20px] overflow-hidden bg-slate-50/30">
            
            {/* Group Nav list */}
            <div className="md:col-span-4 bg-slate-50/80 border-r border-slate-100 p-3 space-y-2">
              <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold tracking-wider">Active Study Groups</span>
              {channels.map(g => (
                <button
                  key={g.id}
                  onClick={() => setActiveGroup(g.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all block ${
                    activeGroup === g.id ? "bg-white text-indigo-700 border border-indigo-100 shadow-2xs" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex justify-between items-center text-[8px] font-mono font-bold">
                    <span className="text-slate-400">{g.members} Peers</span>
                    <span className={`${g.level === "Premium" ? "text-amber-600" : "text-slate-400"}`}>{g.level}</span>
                  </div>
                  <strong className="text-[11px] font-poppins block mt-0.5 leading-snug font-bold">{g.name}</strong>
                </button>
              ))}
            </div>

            {/* Chat Room panel */}
            <div className="md:col-span-8 flex flex-col justify-between h-[340px] bg-white p-4">
              <div className="border-b border-slate-100 pb-2 mb-2 flex justify-between items-center">
                <div>
                  <h4 className="text-[11px] font-poppins font-bold text-slate-800 uppercase">
                    {channels.find(c => c.id === activeGroup)?.name} Chat
                  </h4>
                  <span className="text-[8px] text-emerald-500 font-bold font-mono">● LIVE STUDY STREAM ACTIVE</span>
                </div>
              </div>

              {/* Message History logs */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-1 text-[11px]">
                {(chatLogs[activeGroup] || []).map((msg, idx) => (
                  <div key={idx} className={`space-y-1 ${msg.isAI ? "bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-50" : ""}`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-mono font-bold ${msg.isAI ? "text-indigo-700" : "text-slate-700"}`}>
                        {msg.isAI ? "★ " : ""}{msg.sender}
                      </span>
                      <span className="text-[8px] text-slate-400 font-mono">{msg.time}</span>
                    </div>
                    <p className="text-slate-600 font-medium leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendMessage} className="border-t border-slate-100 pt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask peers, share mnemonic hacks..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs focus:outline-none focus:border-indigo-500 font-medium text-slate-700 p-2"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Peer discussion feed */}
          <div className="space-y-3.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Peer-to-Peer Discussion Feed</span>
            <div className="space-y-3">
              {discussions.map(d => (
                <div key={d.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex gap-3">
                  <img
                    src={d.avatar}
                    alt={d.author}
                    className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-150"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1.5 flex-1">
                    <div className="flex justify-between items-center text-[9px] font-mono">
                      <span className="font-bold text-slate-800">{d.author}</span>
                      <span className="text-slate-400">{d.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                      "{d.topic}"
                    </p>
                    <div className="flex gap-4 pt-1 items-center text-[10px] font-mono font-bold text-slate-400">
                      <button
                        onClick={() => handleLikeDiscussion(d.id)}
                        className={`flex items-center gap-1 transition-colors ${d.liked ? "text-rose-500" : "hover:text-rose-500"}`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${d.liked ? "fill-rose-500" : ""}`} />
                        <span>{d.likes} Likes</span>
                      </button>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{d.replies} Replies</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Leaderboard & Stats (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-slate-900 text-white rounded-[20px] p-5 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Weekly Rank Arena
              </h4>
            </div>
            <span className="text-[8px] font-mono text-emerald-400 tracking-wider">LIVE REFRESH</span>
          </div>

          <div className="space-y-3">
            {leaderboard.map((user) => (
              <div key={user.rank} className="flex items-center justify-between gap-3 p-2 bg-slate-950/60 border border-slate-800/80 rounded-xl hover:border-indigo-500/30 transition-all">
                <div className="flex items-center gap-2.5 truncate">
                  <span className={`text-xs font-black font-mono w-4 ${user.iconColor}`}>{user.rank}</span>
                  <div className="truncate text-left">
                    <p className="text-[11px] font-bold text-white truncate leading-snug">{user.name}</p>
                    <span className="text-[8px] text-slate-500 font-mono font-medium uppercase tracking-wide">
                      {user.questionsSolved} questions solved
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold font-mono text-amber-400 block">{user.score} pts</span>
                  <span className="text-[8px] text-slate-400 font-mono block">🔥 {user.streak}d streak</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-indigo-950/40 border border-indigo-900/40 rounded-xl space-y-1 text-left">
            <span className="text-[8px] font-mono font-bold text-indigo-400 block uppercase">Your Cohort Rank: #14</span>
            <p className="text-[10px] text-slate-300 font-medium">Solve 5 extra predictive MCQs to break into Top 10 Elite Badge.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
