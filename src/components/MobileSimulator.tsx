import { useState } from "react";
import { motion } from "motion/react";
import { 
  Smartphone, Tablet, CheckCircle, Wifi, WifiOff, Camera, 
  Download, Link2, Copy, Zap, ArrowRight, ShieldCheck, RefreshCw 
} from "lucide-react";

export default function MobileSimulator() {
  const [device, setDevice] = useState<"android" | "ios" | "tablet">("android");
  const [isOffline, setIsOffline] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [deepLink, setDeepLink] = useState("ncertdna://chapter/cell/line/cell-02");
  const [copiedLink, setCopiedLink] = useState(false);
  const [scanStatus, setScanStatus] = useState<"idle" | "capturing" | "parsing" | "done">("idle");

  const handleDownloadOffline = () => {
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(deepLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl md:rounded-[20px] p-4 md:p-6 shadow-xs space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono font-bold px-2 py-0.5 rounded-full uppercase">
          Ecosystem Node: Step 1
        </span>
        <h3 className="text-base font-poppins font-black text-slate-900 uppercase mt-1">
          Multi-Device Mobile App Shell Simulator
        </h3>
        <p className="text-[10px] text-slate-400 font-mono">
          Interactive device render of native iOS, Android, and Tablet bundles with offline syncing & deep link schemas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Device Shell Render Panel (lg:col-span-6) */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200/60 rounded-[20px] p-5 flex flex-col items-center justify-center">
          
          {/* Viewport switch selectors */}
          <div className="flex bg-slate-200/60 p-1 rounded-xl mb-6 gap-1 border border-slate-200/40">
            {[
              { id: "android", label: "Android OS", icon: Smartphone },
              { id: "ios", label: "iOS Cocoa", icon: Smartphone },
              { id: "tablet", label: "iPadOS Core", icon: Tablet }
            ].map(v => {
              const Icon = v.icon;
              return (
                <button
                  key={v.id}
                  onClick={() => setDevice(v.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
                    device === v.id ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{v.label}</span>
                </button>
              );
            })}
          </div>

          {/* Device Mock Framing */}
          <div className={`border-[10px] border-slate-900 bg-white shadow-2xl transition-all duration-300 relative ${
            device === "tablet" ? "w-80 h-[480px] rounded-[30px]" : "w-64 h-[440px] rounded-[36px]"
          }`}>
            {/* Top Ear Speaker/Notch */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-slate-800"></span>
            </div>

            {/* Inner App Mock Screen */}
            <div className="w-full h-full overflow-hidden p-4 pt-8 flex flex-col justify-between text-left font-sans">
              
              {/* Device Status Bar */}
              <div className="flex justify-between items-center text-[8px] font-mono font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2">
                <span>9:41 AM</span>
                <span className="flex items-center gap-1">
                  {isOffline ? <WifiOff className="w-2.5 h-2.5 text-rose-500" /> : <Wifi className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />}
                  <span>LTE</span>
                </span>
              </div>

              {/* Dynamic App Content Sim */}
              <div className="flex-1 space-y-3.5 overflow-y-auto pr-0.5 select-none">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[7px] text-primary font-mono font-bold block uppercase tracking-wide">NCERT DNA Mobile</span>
                    <strong className="text-xs text-slate-900 font-bold font-poppins block">My Mobile Studio</strong>
                  </div>
                  <span className="p-1.5 bg-indigo-50 rounded-lg text-primary">
                    <Zap className="w-3.5 h-3.5 animate-pulse" />
                  </span>
                </div>

                <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg space-y-1">
                  <span className="text-[7px] text-slate-400 block font-bold font-mono">NEET EXAM COUNTDOWN</span>
                  <div className="flex items-baseline gap-1">
                    <strong className="text-[14px] text-slate-800 font-black">312 Days</strong>
                    <span className="text-[8px] text-emerald-600 font-bold font-mono">Active Prep</span>
                  </div>
                </div>

                <div className="p-2 bg-emerald-50/50 border border-emerald-100/50 rounded-lg space-y-1">
                  <span className="text-[7px] text-emerald-700 block font-bold font-mono uppercase">Offline Syllabus Cache</span>
                  <p className="text-[8px] text-slate-600 leading-snug">
                    {downloadProgress === 100 ? "✓ 450 NCERT lines fully stored offline." : "Ready for local synchronization."}
                  </p>
                  {downloadProgress !== null && downloadProgress < 100 && (
                    <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${downloadProgress}%` }}></div>
                    </div>
                  )}
                </div>

                {/* Simulated Lens Scan */}
                <div className="p-2 bg-indigo-50/40 border border-indigo-100/40 rounded-lg space-y-1 text-[8px]">
                  <span className="font-mono font-bold text-indigo-700 block uppercase">Textbook Camera OCR</span>
                  <p className="text-slate-500 leading-normal">Snap a chapter page to match original coordinates.</p>
                  <button
                    onClick={() => {
                      setScanStatus("capturing");
                      setTimeout(() => setScanStatus("parsing"), 800);
                      setTimeout(() => {
                        setScanStatus("done");
                        alert("Camera OCR success! Linked to 'Cell division and envelope coordinates'.");
                      }, 1800);
                    }}
                    className="w-full py-1 bg-indigo-600 text-white rounded font-mono text-[7px] font-bold uppercase cursor-pointer"
                  >
                    {scanStatus === "idle" && "Trigger Camera"}
                    {scanStatus === "capturing" && "Capturing Lens..."}
                    {scanStatus === "parsing" && "Parsing AI Coordinates..."}
                    {scanStatus === "done" && "✓ Coordinates Synced"}
                  </button>
                </div>
              </div>

              {/* Bottom Navigation */}
              <div className="border-t border-slate-100 pt-1.5 mt-2 flex justify-between text-[7px] font-mono font-bold text-slate-400 text-center">
                <span className="text-indigo-600">Home</span>
                <span>Finder</span>
                <span>Flashcard</span>
                <span>Profile</span>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Controls (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wide">
              Ecosystem Control Triggers
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1">
                <span className="text-[9px] text-slate-400 font-bold font-mono uppercase">Offline Mode Toggler</span>
                <p className="text-[10px] text-slate-500 leading-normal">Simulate offline state to verify local storage fallback cache.</p>
                <button
                  onClick={() => setIsOffline(!isOffline)}
                  className={`w-full py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase mt-2 cursor-pointer transition-colors ${
                    isOffline ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {isOffline ? "Go Online" : "Go Offline"}
                </button>
              </div>

              <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1">
                <span className="text-[9px] text-slate-400 font-bold font-mono uppercase">Download Syllabus</span>
                <p className="text-[10px] text-slate-500 leading-normal">Locally cache NCERT coordinate matrices for reading in high altitude trains.</p>
                <button
                  onClick={handleDownloadOffline}
                  disabled={downloadProgress === 100}
                  className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-emerald-600 text-white disabled:text-white rounded-lg text-[9px] font-mono font-bold uppercase mt-2 cursor-pointer transition-colors"
                >
                  {downloadProgress === null && "Begin Download"}
                  {downloadProgress !== null && downloadProgress < 100 && `Downloading ${downloadProgress}%`}
                  {downloadProgress === 100 && "✓ Synced"}
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Deep Linking Schema & Universal Routing
            </span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Native app URLs allow candidates to click shared QR codes or web links to instantly pop open coordinates inside the Android/iOS viewer.
            </p>

            <div className="flex gap-2 items-center bg-white p-2.5 border border-slate-200 rounded-xl">
              <Link2 className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={deepLink}
                onChange={(e) => setDeepLink(e.target.value)}
                className="w-full bg-transparent border-none text-[10px] font-mono text-slate-800 focus:outline-none focus:ring-0 p-0"
              />
              <button
                onClick={handleCopyLink}
                className="p-1 hover:text-indigo-600 transition-colors shrink-0"
                title="Copy Deep Link"
              >
                {copiedLink ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>

          <div className="p-4 border border-indigo-100 rounded-xl bg-indigo-50/30 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-xs font-bold text-indigo-900 block uppercase font-mono">Native Compliance Metrics</strong>
              <p className="text-[10.5px] text-indigo-700 leading-normal font-medium">
                Tested against Android SDK 34 and iOS 17 Cocoa Touch layers. All files support progressive offline state encryption via local SecureStore keys.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
