import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Fingerprint, Eye, Mail, KeyRound, Radio, Compass, AlertTriangle, CheckCircle } from "lucide-react";
import { UserClearance } from "../types";

interface ClearanceAuthProps {
  onClearanceGranted: (user: UserClearance) => void;
}

export default function ClearanceAuth({ onClearanceGranted }: ClearanceAuthProps) {
  console.log("Rendering ClearanceAuth component");
  const [email, setEmail] = useState("");
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authorizedState, setAuthorizedState] = useState<"form" | "scanning" | "clearance_match">("form");
  const [clearedUser, setClearedUser] = useState<UserClearance | null>(null);

  // Secure guest bypass
  const handleGuestBypass = () => {
    setLoading(true);
    setErrorStatus(null);
    setTimeout(() => {
      const guestUser: UserClearance = {
        userId: "GUEST_OFFLINE",
        email: "guest_observer@ncertdna.ai",
        clearanceLevel: "GUEST_PREVIEW",
        clearanceCode: "DNA-GUEST-01",
        handshakeToken: "OFFLINE_GUEST_BYPASS",
        handshakeTimestamp: new Date().toISOString()
      };
      setClearedUser(guestUser);
      setLoading(false);
      setAuthorizedState("scanning");
      triggerAnalysisSequence(guestUser);
    }, 400);
  };

  // Real full-stack credential check
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorStatus("IDENTITY REJECTED: Valid tactical email format required.");
      return;
    }

    setLoading(true);
    setErrorStatus(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, method: "TACTICAL_EMAIL" })
      });

      const result = await response.json();
      if (response.ok && result.status === "SUCCESS") {
        const user: UserClearance = {
          userId: result.userId,
          email: result.email,
          clearanceLevel: result.clearanceLevel,
          clearanceCode: result.clearanceCode,
          handshakeToken: result.handshakeToken,
          handshakeTimestamp: result.handshakeTimestamp
        };
        setClearedUser(user);
        setAuthorizedState("scanning");
        triggerAnalysisSequence(user);
      } else {
        setErrorStatus(result.message || "CLEAN ROOM EXCEPTION: Identity denied.");
      }
    } catch (err) {
      console.warn("Authentication server handshake failed:", err);
      // Fallback offline generator if server has an issue
      const syntheticUser: UserClearance = {
        userId: "SYNTH_AUTH_99",
        email: email,
        clearanceLevel: email.toLowerCase().includes("elite") ? "ELITE_CLEARANCE" : "STUDENT_PREVIEW",
        clearanceCode: email.toLowerCase().includes("elite") ? "DNA-LVL-99_SYS_OP" : "DNA-LVL-05",
        handshakeToken: "SECURE_HS_OFFLINE_DEV",
        handshakeTimestamp: new Date().toISOString()
      };
      setClearedUser(syntheticUser);
      setAuthorizedState("scanning");
      triggerAnalysisSequence(syntheticUser);
    } finally {
      setLoading(false);
    }
  };

  const triggerAnalysisSequence = (user: UserClearance) => {
    // Stage 1: Retina eye-scan, Stage 2: clearance match, Stage 3: grant dashboard access
    setTimeout(() => {
      setAuthorizedState("clearance_match");
      setTimeout(() => {
        onClearanceGranted(user);
      }, 700); // reduced from 2.5 seconds to 0.7 seconds
    }, 800); // reduced from 2.8 seconds to 0.8 seconds
  };

  return (
    <div id="clearance-viewport" className="fixed inset-0 bg-[#05070B] flex items-center justify-center font-mono p-4 z-40 overflow-y-auto">
      {/* Background terminal noise */}
      <div className="absolute inset-0 opacity-10 bg-grid/10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(43, 127, 255, 0.12) 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
      
      <div id="auth-panel" className="relative w-full max-w-lg border border-slate-800/80 bg-[#090E17]/95 p-6 md:p-8 rounded-none shadow-2xl">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2 text-blue-500 font-bold tracking-wider text-sm">
            <Shield className="w-5 h-5 animate-pulse" />
            <span>MISSION LEVEL CLEARANCE REQUIRED</span>
          </div>
          <span className="text-[10px] text-slate-500 bg-slate-900 border border-slate-800 uppercase px-1.5 py-0.5 tracking-widest font-semibold">
            SECURE INTEL MODE
          </span>
        </div>

        <AnimatePresence mode="wait">
          
          {/* Phase 1: Identity/Email Enrollment Form */}
          {authorizedState === "form" && (
            <motion.div
              key="auth-form-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="text-xs text-slate-400 leading-relaxed mb-4 text-left">
                  Welcome to <span className="text-white font-bold">NCERT DNA AI v18</span>. Accessing this intelligence terminal requires user authorization. Provide student credentials or bypass for standard observer preview clearance.
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} id="clearance-credentials-form" className="space-y-4">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#2B7FFF]" /> Operator Tactical Identity (Email)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full bg-[#05070B] border border-slate-800/90 text-white placeholder-slate-600 px-3 py-2 text-xs font-mono focus:border-blue-500/80 focus:outline-none transition-colors rounded-none"
                      placeholder="e.g. elite_aspirant@ncertdna.ai"
                      disabled={loading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    * Tip: Use word <span className="text-yellow-500 font-semibold">'elite'</span> in email to unlock premium operator privileges instantly.
                  </div>
                </div>

                {errorStatus && (
                  <div className="bg-red-950/20 border border-red-900 px-3 py-2 text-[10px] text-[#FF3D3D] flex items-start gap-2 animate-bounce">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{errorStatus}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-slate-900 border border-blue-500/30 text-white font-bold py-2.5 text-xs uppercase tracking-widest cursor-pointer transition-colors shadow-md rounded-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Radio className="w-4 h-4 animate-spin" /> VERIFYING IDENTIFICATION LOGS...
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-4 h-4" /> INITIATE EYE SCAN & AUTHORIZE
                    </>
                  )}
                </button>
              </form>

              {/* Secure Guest Bypass */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-4 text-[9px] text-[#2B7FFF]/70 uppercase tracking-widest font-bold">OR Bypass Security</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              <button
                type="button"
                onClick={handleGuestBypass}
                disabled={loading}
                className="w-full border border-slate-800 hover:border-[#2B7FFF]/30 bg-slate-950/40 text-slate-400 hover:text-white py-2 text-[10px] font-bold tracking-widest uppercase rounded-none cursor-pointer hover:bg-slate-950 transition-all text-center flex items-center justify-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" /> DECRYPT VISITOR GUEST OBSERVATION HANDSHAKE
              </button>
            </motion.div>
          )}

          {/* Phase 2: Beautiful Active Retina Scanner UI */}
          {authorizedState === "scanning" && (
            <motion.div
              key="auth-scanning-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-6 space-y-6"
            >
              {/* Rotating biometric eye-target scan effect */}
              <div id="retina-scan-target" className="relative w-36 h-36 flex items-center justify-center">
                <div className="absolute inset-0 border border-blue-500/20 border-teal-500/10 rounded-full scale-105"></div>
                <div className="absolute inset-0 border border-dotted border-blue-500/40 animate-spin rounded-full"></div>
                
                {/* Scanner Target Circle with Corner Brackets */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#2B7FFF]"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#2B7FFF]"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#2B7FFF]"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#2B7FFF]"></div>
                
                {/* Horizontal Sweeping Laser */}
                <motion.div 
                  className="absolute left-1 right-1 h-0.5 bg-[#2B7FFF] opacity-60 shadow-[0_0_10px_2px_#2B7FFF] z-10"
                  animate={{ top: ["10%", "90%", "10%"] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
                
                <Eye className="w-16 h-16 text-blue-500/80 animate-pulse" />
              </div>

              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-white uppercase tracking-widest block">RUNNING OPTICAL MATRIX COGNITION INDEX</span>
                <span className="text-[10px] text-blue-400 font-mono tracking-widest uppercase block animate-pulse">
                  Target Identity: {clearedUser?.email || "Unknown Observer"}
                </span>
                <span className="text-[9px] text-slate-500 block uppercase">
                  Checking databases: CBSE, NEET-UG frequency blocks...
                </span>
              </div>
            </motion.div>
          )}

          {/* Phase 3: Live Verification Clearance Match Summary */}
          {authorizedState === "clearance_match" && clearedUser && (
            <motion.div
              key="auth-granted-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-4 space-y-6"
            >
              <div id="verification-clearance-block" className="border border-slate-800 bg-slate-950 p-4 font-mono space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Clearing Authority</div>
                  <div className="text-[#2B7FFF] text-[10px] font-bold">DNA-HS_18</div>
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-[10px]">
                  <span className="text-slate-500 uppercase">Clearance Operator:</span>
                  <span className="text-white font-bold tracking-tight text-right uppercase overflow-hidden truncate max-w-[180px]">
                    {clearedUser.email}
                  </span>

                  <span className="text-slate-500 uppercase">Assigned Level:</span>
                  <span className={`font-extrabold text-right uppercase ${
                    clearedUser.clearanceLevel === "ELITE_CLEARANCE" 
                      ? "text-yellow-500 animate-pulse" 
                      : clearedUser.clearanceLevel === "STUDENT_PREVIEW" 
                        ? "text-[#2B7FFF]" 
                        : "text-slate-400"
                  }`}>
                    {clearedUser.clearanceLevel.replace("_", " ")}
                  </span>

                  <span className="text-slate-500 uppercase">Clearance Code:</span>
                  <span className="text-white font-bold text-right tracking-widest">{clearedUser.clearanceCode}</span>

                  <span className="text-slate-500 uppercase">Session Handshake:</span>
                  <span className="text-[#22C55E] text-right font-semibold text-[9px] break-all">{clearedUser.handshakeToken}</span>
                </div>

                <div className="border-t border-slate-900 pt-2 flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 animate-ping" />
                  <span className="text-emerald-500 font-bold uppercase tracking-widest text-[11px]">
                    STATUS: ACCESS GRANTED
                  </span>
                </div>
              </div>

              {/* Progress terminal blip bar */}
              <div className="text-center select-none text-[10px] text-slate-500 animate-pulse uppercase">
                Synchronizing visual nodes... Grid setup completed. Loading.
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}
