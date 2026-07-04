import { useState } from "react";
import { motion } from "motion/react";
import { 
  ShieldCheck, Award, Users, RefreshCw, Key, LogIn, FileText, 
  Sparkles, CheckCircle2, ChevronRight, Share2, Clipboard, Download 
} from "lucide-react";

export default function SecurityGrowthPanel() {
  const [referralCode] = useState("NCERT-DNA-AIIMS-99");
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(true);

  const [achievements] = useState([
    { id: "a1", name: "Synaptic Explorer", desc: "Linked exarch roots with vacuole coordinates.", unlocked: true, date: "June 25" },
    { id: "a2", name: "Giga-Syllabus Devourer", desc: "Logged 100+ predicted MCQ solutions.", unlocked: true, date: "June 24" },
    { id: "a3", name: "Lens Marksman", desc: "Transcribed 5 distinct textbook margins.", unlocked: false, progress: "3/5 done" }
  ]);

  const [securityLogs, setSecurityLogs] = useState([
    { id: "l1", time: "10:14:02 AM", event: "Secure local keychain sync initiated", ip: "127.0.0.1", status: "Secure" },
    { id: "l2", time: "09:44:11 AM", event: "AES-256 backup compiled & pushed to cloud node", ip: "127.0.0.1", status: "Secure" },
    { id: "l3", time: "08:12:45 AM", event: "Session authentication token handshake", ip: "109.12.33.1", status: "Validated" }
  ]);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const handleRestoreBackup = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSecurityLogs([
        { id: `l-${Date.now()}`, time: "Just Now", event: "Full snapshot restored from cloud database", ip: "127.0.0.1", status: "Restored" },
        ...securityLogs
      ]);
      alert("✓ Sync Completed. All offline study metrics, notes, and scans restored.");
    }, 1200);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl md:rounded-[20px] p-4 md:p-6 shadow-xs space-y-6">
      
      {/* Title Header */}
      <div className="border-b border-slate-100 pb-4 flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-700 font-mono font-bold px-2 py-0.5 rounded-full uppercase">
            Ecosystem Node: Step 8, 9 & 10
          </span>
          <h3 className="text-base font-poppins font-black text-slate-900 uppercase mt-1">
            Enterprise Security & Referral Growth Hub
          </h3>
          <p className="text-[10px] text-slate-400 font-mono">
            Verify AES-256 encryption logs, track earned study badges, and copy student referral discount links.
          </p>
        </div>

        <button
          onClick={handleRestoreBackup}
          disabled={isSyncing}
          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-mono text-[10px] font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer min-h-[38px] uppercase disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Syncing Cryptography..." : "Synchronize Cloud Backup"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Hand: Enterprise security simulator & audit logs (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-5">
          <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 animate-pulse" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wide text-slate-800">
                  AES-256 Storage Handshake Logs
                </h4>
              </div>
              <button
                onClick={() => setIsEncrypted(!isEncrypted)}
                className={`px-2 py-0.5 text-[8px] font-mono font-bold rounded uppercase ${
                  isEncrypted ? "bg-emerald-50 text-emerald-600 border border-emerald-150" : "bg-rose-50 text-rose-600 border border-rose-150"
                }`}
              >
                {isEncrypted ? "Storage Encrypted" : "Storage Unlocked"}
              </button>
            </div>

            <div className="space-y-2">
              {securityLogs.map(log => (
                <div key={log.id} className="p-2.5 bg-white border border-slate-100 rounded-lg flex justify-between items-center text-[10px] font-mono shadow-3xs text-left">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-700 leading-snug">{log.event}</p>
                    <span className="text-[8px] text-slate-400">Time: {log.time} • Local IP: {log.ip}</span>
                  </div>
                  <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Incident release playbooks (v2.0) */}
          <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wide text-slate-800">
              Ecosystem Release Playbooks
            </h4>
            <p className="text-[10.5px] text-slate-500 leading-relaxed font-medium">
              Calibrated automated triggers for fallback scenarios. In case of unexpected server latency drops, priority model pipelines are instantly diverted to cold regional clusters.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => alert("Simulated: Active failover triggers deployed to US-EAST recovery container.")}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-mono text-[9px] font-bold rounded-lg uppercase cursor-pointer transition-colors"
              >
                Run Backup Drill
              </button>
            </div>
          </div>
        </div>

        {/* Right Hand: Growth, referrals and badges list (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Referrals */}
          <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3.5 text-left">
            <div>
              <span className="text-[9px] text-indigo-600 font-mono font-bold uppercase block tracking-wider">Growth Referral Program</span>
              <strong className="text-xs text-slate-800 font-bold font-poppins block uppercase mt-0.5">
                Invite fellow medical aspirants
              </strong>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Share your custom code with coaching batchmates. When they subscribe to Pro or Rank Booster, you receive **1 month free access** and they get 15% immediate checkout discounts.
            </p>

            <div className="flex gap-2 items-center bg-white p-2.5 border border-slate-200 rounded-xl">
              <Key className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="w-full text-[11px] font-mono text-slate-800 font-bold">
                {referralCode}
              </span>
              <button
                onClick={handleCopyReferral}
                className="p-1 hover:text-indigo-600 transition-colors shrink-0"
                title="Copy Code"
              >
                {copiedReferral ? (
                  <span className="text-[9px] font-mono font-bold text-emerald-600">Copied</span>
                ) : (
                  <Clipboard className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Unlocked Badges & Achievements list */}
          <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Student Accomplishments</span>

            <div className="space-y-2.5 text-left">
              {achievements.map(ach => (
                <div key={ach.id} className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between text-[11px] font-mono shadow-3xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <Award className={`w-3.5 h-3.5 ${ach.unlocked ? "text-amber-500" : "text-slate-300"}`} />
                      <p className="font-bold text-slate-800">{ach.name}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 leading-snug">{ach.desc}</span>
                  </div>

                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase ${
                    ach.unlocked ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-400 border border-slate-200"
                  }`}>
                    {ach.unlocked ? `Unlocked ${ach.date}` : ach.progress}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
