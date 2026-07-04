import { useState, useEffect } from "react";
import { 
  Users, Clock, TrendingUp, BarChart3, Database, ShieldAlert,
  Download, Sparkles, Zap, Award, CheckCircle, RefreshCw, Search,
  Trash2, ShieldOff, AlertCircle, FileText, Lock, Unlock, Eye
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from "recharts";
import DatabaseDiagnostic from "./DatabaseDiagnostic";

interface AdminPanelProps {
  onboardingData?: any;
}

export default function AdminPanel({ onboardingData }: AdminPanelProps) {
  console.log("Rendering advanced AdminPanel component v1.2");
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");
  const [refreshKey, setRefreshKey] = useState(0);
  const [adminTab, setAdminTab] = useState<"telemetry" | "users" | "uploads" | "reports" | "toggles">("telemetry");

  // Simulated User Directory state
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([
    { id: "usr-1", name: "aspirant_surgeon", email: "surgeon_neeti@gmail.com", role: "ELITE_CLEARANCE", status: "Active", xp: 1240, joined: "2026-06-12" },
    { id: "usr-2", name: "biology_ace_2026", email: "biology_ace26@gmail.com", role: "STUDENT_PREVIEW", status: "Active", xp: 950, joined: "2026-06-15" },
    { id: "usr-3", name: "dr_kapoor_aspirant", email: "dr_kapoor@yahoo.com", role: "ELITE_CLEARANCE", status: "Active", xp: 2100, joined: "2026-06-10" },
    { id: "usr-4", name: "gene_indexer_99", email: "gene_index99@gmail.com", role: "STUDENT_PREVIEW", status: "Suspended", xp: 420, joined: "2026-06-18" },
    { id: "usr-5", name: "guest_preview_node", email: "guest_preview@ncertdna.ai", role: "GUEST_PREVIEW", status: "Active", xp: 50, joined: "2026-06-25" }
  ]);

  // Simulated reports list
  const [reports, setReports] = useState([
    { id: "rep-1", user: "biology_ace_2026", type: "MCQ Trap Clarification", description: "Line coordinate mismatch on Cell Division page 135.", content: "Cell division is a progress...", timestamp: "2 hours ago", status: "Pending" },
    { id: "rep-2", user: "aspirant_surgeon", type: "OCR Alignment Issue", description: "Blurred camera upload resulted in transcription failure on Botany Vol I.", content: "OCR snapshot asset 412.png", timestamp: "1 day ago", status: "Resolved" },
    { id: "rep-3", user: "dr_kapoor_aspirant", type: "Incorrect Assertion Trap", description: "Assertion Reason key states False instead of True under genetics translation.", content: "Genetics assertion MCQ 59", timestamp: "3 days ago", status: "Pending" }
  ]);

  // Simulated OCR uploads list
  const [uploads, setUploads] = useState([
    { id: "upl-1", user: "dr_kapoor_aspirant", name: "Genetics_Chromosome_Screenshot_01.jpg", size: "1.4 MB", type: "image/jpeg", result: "Matched: 12 lines found in genetics", timestamp: "1 hour ago" },
    { id: "upl-2", user: "biology_ace_2026", name: "Anatomy_Flowering_Plants_Weird_Ex.png", size: "3.2 MB", type: "image/png", result: "Matched: 4 lines found in morphology", timestamp: "5 hours ago" },
    { id: "upl-3", user: "aspirant_surgeon", name: "Transcription_Mechanisms_Core.jpg", size: "840 KB", type: "image/jpeg", result: "No high-yield lines found", timestamp: "1 day ago" }
  ]);

  // Simulated system toggles
  const [toggles, setToggles] = useState({
    killSwitch: false,
    maintenanceMode: false,
    aiExplainerMode: true,
    instantPracticeMcqs: true,
    spacedRepReminderPush: true,
    unlimitedOcrScans: false,
    debugLogsVerbose: true
  });

  // Simulated Activity Logs
  const activityLogs = [
    { id: "log-1", message: "Screenshot OCR genomic scan run by @aspirant_surgeon", time: "12 mins ago" },
    { id: "log-2", message: "NCERT Biology Vol I database lookups by @guest_preview_node", time: "25 mins ago" },
    { id: "log-3", message: "Mock predictive question test generation initiated", time: "44 mins ago" },
    { id: "log-4", message: "User @dr_kapoor_aspirant updated target exam preferences", time: "1 hour ago" },
    { id: "log-5", message: "Spaced repetition decay curves calculated by background scheduler", time: "3 hours ago" }
  ];

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [timeRange, refreshKey]);

  // Custom live demographics updates
  useEffect(() => {
    if (onboardingData && onboardingData.name) {
      // Upsert current user into local users table
      setUsers(prev => {
        const index = prev.findIndex(u => u.name === onboardingData.name || u.email === "current_user@ncertdna.ai");
        if (index === -1) {
          return [
            ...prev,
            {
              id: "usr-current",
              name: onboardingData.name || "current_user",
              email: "current_user@ncertdna.ai",
              role: "STUDENT_PREVIEW",
              status: "Active",
              xp: 150,
              joined: "Today"
            }
          ];
        }
        return prev;
      });
    }
  }, [onboardingData]);

  const handleToggleValue = (key: keyof typeof toggles) => {
    setToggles(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSuspendUser = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === "Suspended" ? "Active" : "Suspended";
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleDeleteReport = (reportId: string) => {
    if (confirm("Are you sure you want to delete this content item?")) {
      setReports(prev => prev.filter(r => r.id !== reportId));
    }
  };

  const handleDeleteUpload = (uploadId: string) => {
    if (confirm("Are you sure you want to delete this uploaded image from storage?")) {
      setUploads(prev => prev.filter(u => u.id !== uploadId));
    }
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value,Status\n"
      + "Daily Active Users (DAU),1750,Excellent (+18.4% WoW)\n"
      + "Average Session Length,24.6 Minutes,Stable (NEET intense)\n"
      + "Cohort Retention (Day 28),81% Elite / 52% Standard,Highly Engaged\n"
      + "Top Feature Module,NCERT Finder,1540 Active Users\n"
      + "Active Handshake Handshakes,4120,Secure\n"
      + "System Health Level,99.98% SLA,Nominal Operations\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "NEET_OS_Admin_Intelligence_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // High fidelity growth and engagement mock data
  const dauData = {
    "7d": [
      { date: "June 20", dau: 1240, sessions: 3100, retentionRate: 85 },
      { date: "June 21", dau: 1350, sessions: 3400, retentionRate: 86 },
      { date: "June 22", dau: 1420, sessions: 3650, retentionRate: 88 },
      { date: "June 23", dau: 1390, sessions: 3500, retentionRate: 87 },
      { date: "June 24", dau: 1480, sessions: 3890, retentionRate: 89 },
      { date: "June 25", dau: 1610, sessions: 4200, retentionRate: 91 },
      { date: "June 26", dau: 1750, sessions: 4680, retentionRate: 93 },
    ],
    "30d": [
      { date: "Wk 1", dau: 980, sessions: 2300, retentionRate: 78 },
      { date: "Wk 2", dau: 1150, sessions: 2800, retentionRate: 82 },
      { date: "Wk 3", dau: 1380, sessions: 3500, retentionRate: 86 },
      { date: "Wk 4", dau: 1750, sessions: 4680, retentionRate: 93 },
    ],
    "90d": [
      { date: "April", dau: 450, sessions: 1100, retentionRate: 65 },
      { date: "May", dau: 890, sessions: 2150, retentionRate: 74 },
      { date: "June", dau: 1750, sessions: 4680, retentionRate: 93 },
    ],
  };

  const featureUsageData = [
    { name: "NCERT Finder", users: 1540, hits: 8900, color: "#5B61F6" },
    { name: "Vision Search", users: 1120, hits: 4200, color: "#0D9488" },
    { name: "AI Explainer", users: 980, hits: 3100, color: "#D97706" },
    { name: "Spaced Repetition", users: 890, hits: 5600, color: "#F97316" },
    { name: "Notes & Creator", users: 650, hits: 1800, color: "#8B5CF6" },
  ];

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white border border-slate-100 rounded-xl md:rounded-[20px] p-4 md:p-6 shadow-sm min-h-full flex flex-col justify-between">
      
      {/* Header Panel */}
      <div className="border-b border-slate-100 pb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 shrink-0">
        <div>
          <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wide">
            ADMINISTRATOR INTELLIGENCE SYSTEM v1.2
          </span>
          <h2 className="text-base font-poppins font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2 mt-1">
            <Database className="w-5 h-5 text-primary animate-pulse" /> Live Administration & Control Panel
          </h2>
          <p className="text-[10px] text-slate-400 font-medium font-mono">Calibrate user clearance registers, monitor OCR logs, audit reports & toggle experimental nodes.</p>
        </div>
        
        {/* Tab Selector buttons */}
        <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1">
          {[
            { id: "telemetry", label: "Telemetry", icon: BarChart3 },
            { id: "users", label: "Users", icon: Users },
            { id: "uploads", label: "OCR Uploads", icon: Zap },
            { id: "reports", label: "Reports", icon: ShieldAlert },
            { id: "toggles", label: "Feature Toggles", icon: RefreshCw }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
                  adminTab === tab.id 
                    ? "bg-white text-slate-900 shadow-sm" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col justify-center items-center py-16 space-y-4">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs text-slate-400 font-mono">Syncing system nodes database arrays...</p>
        </div>
      ) : (
        <div className="space-y-6 py-4 flex-1 overflow-y-auto max-h-[72vh] pr-1">
          
          {/* ================= TELEMETRY TAB ================= */}
          {adminTab === "telemetry" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-xl space-y-2">
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block tracking-wide">DAILY ACTIVE USERS</span>
                  <div className="flex items-baseline gap-2">
                    <strong className="text-xl font-poppins font-black text-slate-900">1,750</strong>
                    <span className="text-[10px] text-emerald-600 font-bold font-mono">↑ 18.4%</span>
                  </div>
                  <p className="text-[9.5px] text-slate-500 font-mono">Peak hour study patterns observed at 9:00 PM IST.</p>
                </div>

                <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-xl space-y-2">
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block tracking-wide">AVERAGE FOCUS LENGTH</span>
                  <div className="flex items-baseline gap-2">
                    <strong className="text-xl font-poppins font-black text-primary">24.6 min</strong>
                    <span className="text-[10px] text-emerald-600 font-bold font-mono">↑ 6.1%</span>
                  </div>
                  <p className="text-[9.5px] text-slate-500 font-mono">Student sessions are highly focused with low latency.</p>
                </div>

                <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-xl space-y-2">
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block tracking-wide">ELITE RETENTION COEFFICIENT</span>
                  <div className="flex items-baseline gap-2">
                    <strong className="text-xl font-poppins font-black text-slate-900">81.4%</strong>
                    <span className="text-[10px] text-indigo-500 font-bold font-mono">ELITE TIER</span>
                  </div>
                  <p className="text-[9.5px] text-slate-500 font-mono">High-yield spaced-loop notifications offset decay.</p>
                </div>

                <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-xl space-y-2">
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block tracking-wide">ACTIVE SCHEDULER NODES</span>
                  <div className="flex items-baseline gap-2">
                    <strong className="text-xl font-poppins font-black text-emerald-600">4,120</strong>
                    <span className="text-[10px] text-amber-500 font-bold font-mono">ACTIVE SCAN</span>
                  </div>
                  <p className="text-[9.5px] text-slate-500 font-mono">Authentications verified via digital handshakes.</p>
                </div>
              </div>

              {/* Database Health Diagnostic Section */}
              <div className="bg-slate-50/40 border border-slate-100/70 rounded-xl p-4 md:p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-200/50 pb-2.5">
                  <Database className="w-5 h-5 text-primary animate-pulse" />
                  <div>
                    <h3 className="text-xs font-poppins font-bold text-slate-800 uppercase tracking-tight">Database Infrastructure Health Panel</h3>
                    <p className="text-[9.5px] text-slate-400 font-mono">Monitor current cloud storage routing state, active pools, connection drops and real-time response latency thresholds.</p>
                  </div>
                </div>
                <DatabaseDiagnostic />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-8 bg-white border border-slate-100 rounded-xl p-4 md:p-5 space-y-4 shadow-sm">
                  <div className="flex justify-between items-center text-[10px] border-b border-slate-100 pb-2 font-mono font-bold">
                    <span className="text-slate-500 uppercase">DAU & TOTAL SESSIONS TELEMETRY</span>
                    <span className="text-primary uppercase">ACTIVE LOGS • {timeRange.toUpperCase()}</span>
                  </div>
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dauData[timeRange]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorDau" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#5B61F6" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#5B61F6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#64748b", fontWeight: "bold" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 9, fill: "#64748b", fontWeight: "bold" }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#1e293b", color: "#fff", border: "0", borderRadius: "8px", fontSize: "10px", fontWeight: "bold" }} />
                        <Area type="monotone" dataKey="dau" name="Daily Active Users" stroke="#5B61F6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDau)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-white border border-slate-100 rounded-xl p-4 md:p-5 space-y-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-[10px] border-b border-slate-100 pb-2 font-mono font-bold text-slate-500 mb-3">
                      <span className="uppercase">TOP PRODUCT FEATURES</span>
                      <span className="text-emerald-500 uppercase">BY HITS</span>
                    </div>
                    <div className="space-y-3">
                      {featureUsageData.map((feat) => {
                        const maxHits = 9000;
                        const pct = (feat.hits / maxHits) * 100;
                        return (
                          <div key={feat.name} className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="font-bold text-slate-700">{feat.name}</span>
                              <span className="font-mono text-slate-400 font-bold">{feat.hits.toLocaleString()} hits</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: feat.color }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100/60 text-[9.5px] text-slate-400 font-mono leading-relaxed">
                    *NCERT Finder remains the core launch acquisition loop, with over 8,900 database lookups.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= USERS TAB ================= */}
          {adminTab === "users" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 border border-slate-100 rounded-xl">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search user registry by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0"
                />
              </div>

              <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] font-mono text-slate-400 uppercase font-bold border-b border-slate-100">
                    <tr>
                      <th className="p-3">User Handle</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Clearance Role</th>
                      <th className="p-3">Joined Date</th>
                      <th className="p-3">XP Score</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-800">@{user.name}</td>
                        <td className="p-3 font-mono text-[10.5px] text-slate-500">{user.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            user.role === "ELITE_CLEARANCE" ? "bg-amber-50 text-amber-600 border border-amber-200/50" :
                            user.role === "STUDENT_PREVIEW" ? "bg-primary/5 text-primary border border-primary/20" :
                            "bg-slate-50 text-slate-500 border border-slate-200"
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-500">{user.joined}</td>
                        <td className="p-3 font-bold text-slate-700">{user.xp} XP</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            user.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleSuspendUser(user.id)}
                            className={`px-3 py-1 text-[10px] font-mono font-bold rounded-lg uppercase cursor-pointer transition-colors ${
                              user.status === "Suspended"
                                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                            }`}
                          >
                            {user.status === "Suspended" ? "Activate" : "Suspend"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= UPLOADS TAB ================= */}
          {adminTab === "uploads" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">ACTIVE OCR TEXTBOOK UPLOADS REGISTER</span>
                <span className="text-[10px] text-slate-400 font-mono">COUNT: {uploads.length} ATTACHED IMAGES</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {uploads.map(upl => (
                  <div key={upl.id} className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3 relative hover:border-slate-300 transition-all">
                    <div className="flex justify-between items-start gap-3">
                      <div className="truncate">
                        <strong className="text-xs text-slate-800 font-bold block truncate" title={upl.name}>{upl.name}</strong>
                        <span className="text-[9.5px] text-slate-400 font-mono">{upl.size} • {upl.type}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteUpload(upl.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete asset from storage"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-2 bg-white border border-slate-200/50 rounded-lg">
                      <span className="text-[8px] text-slate-400 font-mono font-bold uppercase block">OCR ANALYSIS RESULT</span>
                      <p className="text-[10px] text-slate-600 font-medium leading-normal mt-0.5">{upl.result}</p>
                    </div>

                    <div className="flex justify-between items-center pt-1 text-[9px] text-slate-400 border-t border-slate-200/40">
                      <span>Uploaded by @{upl.user}</span>
                      <span>{upl.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= REPORTS TAB ================= */}
          {adminTab === "reports" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">STUDENT INCIDENTS & ERROR REPORTS</span>
                <span className="text-rose-500 font-mono font-bold text-[10px]">{reports.filter(r => r.status === "Pending").length} UNRESOLVED</span>
              </div>

              <div className="space-y-3.5">
                {reports.map(rep => (
                  <div key={rep.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3 hover:border-slate-200 transition-all">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div className="space-y-0.5">
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 text-[9px] font-bold uppercase rounded">
                          {rep.type}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 mt-1.5">{rep.description}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          rep.status === "Resolved" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        }`}>
                          {rep.status}
                        </span>
                        <button
                          onClick={() => {
                            setReports(prev => prev.map(r => r.id === rep.id ? { ...r, status: "Resolved" } : r));
                          }}
                          className="px-2 py-1 bg-white border border-slate-200 text-[9px] font-bold rounded hover:bg-slate-50 transition-colors"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => handleDeleteReport(rep.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-900 text-slate-300 font-mono text-[10px] rounded-lg">
                      <span className="text-[8px] text-slate-500 block">REPORTED CONTENT SOURCE PREVIEW:</span>
                      "{rep.content}"
                    </div>

                    <div className="text-[9px] text-slate-400 flex items-center gap-2 font-mono">
                      <span>Reported by @{rep.user}</span>
                      <span>•</span>
                      <span>{rep.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TOGGLES TAB ================= */}
          {adminTab === "toggles" && (
            <div className="space-y-6">
              <div className="p-4 bg-rose-50 border border-rose-150 rounded-xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-rose-800 uppercase">Emergency Safety Control Center</h4>
                  <p className="text-[10.5px] text-rose-700 leading-normal font-medium">
                    Activating the global application kill switch or maintenance calibrations will lock student nodes instantly to prevent data collisions.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "killSwitch", label: "Global Application Kill Switch", desc: "Instantly locks access and redirects to system override failsafes.", color: "text-rose-600" },
                  { key: "maintenanceMode", label: "Scheduled Maintenance Lock", desc: "Places system databases in safe read-only calibration loops.", color: "text-amber-600" },
                  { key: "aiExplainerMode", label: "Advanced AI Explainer Node", desc: "Routes biology summaries through denseAssertion models.", color: "text-primary" },
                  { key: "instantPracticeMcqs", label: "Instant Practice Mock Generator", desc: "Generates custom diagnostic assertions without caching lag.", color: "text-emerald-600" },
                  { key: "spacedRepReminderPush", label: "Spaced Repetition Push Notifications", desc: "Dispatches automated retention reminders to candidate registers.", color: "text-indigo-600" },
                  { key: "unlimitedOcrScans", label: "Allow Unlimited Free OCR scans", desc: "Bybasses standard limits for guest preview accounts.", color: "text-teal-600" },
                  { key: "debugLogsVerbose", label: "Enable Verbose Debug Telemetry Logs", desc: "Saves high fidelity keystroke and mouse movement events to memory logs.", color: "text-slate-600" }
                ].map((item) => {
                  const isEnabled = toggles[item.key as keyof typeof toggles];
                  return (
                    <div key={item.key} className="p-4 border border-slate-200/60 hover:border-slate-300 rounded-xl bg-slate-50/20 flex items-start justify-between gap-4 transition-all">
                      <div className="space-y-1">
                        <strong className={`text-xs font-bold block ${item.color}`}>{item.label}</strong>
                        <span className="text-[10px] text-slate-400 leading-normal block">{item.desc}</span>
                      </div>
                      
                      <button
                        onClick={() => handleToggleValue(item.key as any)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase cursor-pointer shrink-0 transition-all ${
                          isEnabled 
                            ? "bg-slate-900 text-white" 
                            : "bg-white border border-slate-200 text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        {isEnabled ? "ACTIVE" : "INACTIVE"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Activity Logs feed list */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block tracking-wider mb-2.5">LIVE AUDIT ACTIVITY FEED (TELEMETRY BLOCKS)</span>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-2">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex justify-between items-center text-[10px] text-slate-600 font-mono py-1 border-b border-slate-200/50 last:border-0 last:pb-0">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    {log.message}
                  </span>
                  <span className="text-slate-400 shrink-0">{log.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Footer System Compliance Status */}
      <div className="border-t border-slate-100 pt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0 text-[10px] text-slate-400 font-mono mt-2">
        <span className="flex items-center gap-1.5 font-bold">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          ADMIN TELEMETRY LOGS STABLE • SLA SECURED 99.98%
        </span>
        <button
          onClick={handleExportCSV}
          className="self-start sm:self-auto px-2.5 py-1 text-[9px] bg-slate-900 hover:bg-slate-800 text-white font-bold rounded uppercase transition-colors shrink-0"
        >
          DOWNLOAD EXPORT LOGS
        </button>
      </div>

    </div>
  );
}
