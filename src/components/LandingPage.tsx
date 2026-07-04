import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, BookOpen, Sparkles, Upload, FileImage, ShieldCheck, 
  ArrowRight, Users, MessageSquare, Star, ArrowUpRight, Check,
  Camera, Cpu, Database, PlayCircle
} from "lucide-react";
import { NCERTLine, UserClearance, ClearanceLevel } from "../types";
import { INITIAL_NCERT_LINES } from "../data";

interface LandingPageProps {
  onLoginSuccess: (user: UserClearance) => void;
  onEnterGuestMode: () => void;
}

export default function LandingPage({ onLoginSuccess, onEnterGuestMode }: LandingPageProps) {
  console.log("Rendering LandingPage component");
  const [searchQuery, setSearchQuery] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Vision scanner demo states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0); // 0: idle, 1: OCR, 2: Semantic, 3: Insights
  const [scanResult, setScanResult] = useState<any>(null);

  // Live filtering NCERT lines
  const filteredLines = searchQuery.trim() === "" 
    ? [] 
    : INITIAL_NCERT_LINES.filter(line => 
        line.lineText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        line.chapterName.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Simulate or execute Email Handshake authentication
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      setAuthError("Please enter a valid student email address.");
      return;
    }

    setAuthLoading(true);
    setAuthError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput })
      });
      const result = await response.json();
      if (response.ok && result.status === "SUCCESS") {
        const user: UserClearance = {
          userId: result.user?.id || result.userId || "GUEST_USER",
          email: result.user?.email || result.email || emailInput,
          clearanceLevel: (result.user?.clearanceLevel || result.clearanceLevel || "STUDENT_PREVIEW") as ClearanceLevel,
          clearanceCode: result.user?.clearanceCode || result.clearanceCode || "DNA-STUDENT-05",
          handshakeToken: result.token || result.handshakeToken || "",
          handshakeTimestamp: result.handshakeTimestamp || new Date().toISOString()
        };
        onLoginSuccess(user);
      } else {
        setAuthError(result.message || "Identity validation rejected.");
      }
    } catch (err) {
      // Offline fallback
      const offlineUser: UserClearance = {
        userId: "OFFLINE_STUDENT_" + Date.now().toString().substring(8),
        email: emailInput,
        clearanceLevel: emailInput.toLowerCase().includes("elite") ? "ELITE_CLEARANCE" : "STUDENT_PREVIEW",
        clearanceCode: "DNA-STUDENT-05",
        handshakeToken: "SECURE_OFFLINE_BYPASS",
        handshakeTimestamp: new Date().toISOString()
      };
      onLoginSuccess(offlineUser);
    } finally {
      setAuthLoading(false);
    }
  };

  // Pre-configured templates to test OCR vision uploads
  const sampleScans = [
    {
      name: "Vacuole Note Page",
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=200&auto=format&fit=crop",
      text: "The membrane of the vacuole is called tonoplast, which facilitates the transport...",
      fileName: "tonoplast_diagram_scan.jpg"
    },
    {
      name: "Root Anatomy Diagram",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=200&auto=format&fit=crop",
      text: "In roots, the protoxylem lies towards periphery and metaxylem lies towards...",
      fileName: "anatomy_root_exarch.png"
    },
    {
      name: "Lac Operon Note Page",
      image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=200&auto=format&fit=crop",
      text: "A very low level of expression of lac operon has to be present in the cell all...",
      fileName: "lac_operon_background_transcription.pdf"
    }
  ];

  // OCR scanning triggers
  const handleTriggerScan = async (sample: typeof sampleScans[0]) => {
    setSelectedImage(sample.image);
    setIsScanning(true);
    setScanResult(null);
    setScanStep(1);

    // Staggered simulation logs to mimic real OCR process
    setTimeout(() => {
      setScanStep(2);
      setTimeout(() => {
        setScanStep(3);
        // Execute actual API call
        executeVisionAPI(sample.text, sample.fileName);
      }, 700);
    }, 700);
  };

  const executeVisionAPI = async (dummyBase64: string, name: string) => {
    try {
      const response = await fetch("/api/vision/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dummyBase64, fileName: name })
      });
      const result = await response.json();
      if (response.ok && result.status === "SUCCESS") {
        setScanResult(result.data);
      }
    } catch (err) {
      console.warn("Vision backend call failed", err);
    } finally {
      setIsScanning(false);
    }
  };

  // Handle custom image uploads via base64 encoding
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Hardened upload guards
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please upload a smaller image.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Unsupported file format. Only standard PNG, JPG, or JPEG images are permitted.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      setIsScanning(true);
      setScanResult(null);
      setScanStep(1);

      setTimeout(() => {
        setScanStep(2);
        setTimeout(() => {
          setScanStep(3);
          executeVisionAPI(base64, file.name);
        }, 800);
      }, 800);
    };
    reader.onerror = () => {
      alert("An error occurred while reading the image asset.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white text-[#111827] font-sans selection:bg-primary/20 min-h-screen flex flex-col antialiased">
      {/* HEADER NAVIGATION */}
      <header className="border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-[12px] bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
              D
            </div>
            <div>
              <span className="font-poppins font-semibold text-[#111827] tracking-tight text-base block leading-none">NCERT DNA AI</span>
              <span className="text-[10px] text-primary font-semibold tracking-wider uppercase mt-1 block">NEET Intelligence Operating System</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#search-demo" className="hover:text-primary transition-colors">NCERT Finder</a>
            <a href="#vision-demo" className="hover:text-primary transition-colors">Vision Scan</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={onEnterGuestMode}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-primary hover:bg-slate-50 rounded-[12px] transition-all cursor-pointer"
            >
              Guest Access
            </button>
            <button 
              onClick={() => setShowAuthModal(true)}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-primary hover:bg-primary/95 rounded-[12px] transition-all shadow-sm shadow-primary/20 cursor-pointer"
            >
              Access Command Center
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-16 px-6 bg-gradient-to-b from-slate-50/50 via-white to-white">
        {/* Soft background grid & blob */}
        <div className="absolute inset-0 bg-light-grid opacity-70 pointer-events-none"></div>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" /> Ranked NEET Biology Intelligence Engine
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-poppins font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Study the Exact <span className="text-primary relative inline-block">NCERT Line<span className="absolute bottom-1 left-0 w-full h-1 bg-accent/30"></span></span> That Maximizes Your Rank.
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              Stop swimming aimlessly in oceans of notes. Instantly extract premium logical explanations, past NEET year questions, predicted future variations, and personalized recall flashcards directly linked to any page.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
          >
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full sm:w-auto px-8 py-4 font-poppins font-semibold text-white bg-primary hover:bg-primary/95 rounded-[20px] flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all cursor-pointer"
            >
              Start Decoding Biology <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#search-demo"
              className="w-full sm:w-auto px-6 py-4 font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-[20px] transition-all flex items-center justify-center gap-1.5 border border-slate-200/60"
            >
              <PlayCircle className="w-4 h-4 text-primary" /> Try Search Demo
            </a>
          </motion.div>
        </div>
      </section>

      {/* DOCK DEMO 1: LIVE NCERT INTERACTIVE FINDER */}
      <section id="search-demo" className="py-16 px-6 bg-slate-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-poppins font-bold text-slate-900">NCERT Intelligence Line Finder</h2>
            <p className="text-sm text-slate-500 mt-2">Type any keyword or concept to fetch the exact textbook coordinates instantly</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-[20px] p-6 shadow-md shadow-slate-100 relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search biology text (e.g. xylem, tonoplast, lac operon, protoxylem...)"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200/80 rounded-[15px] text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 text-slate-800 font-medium placeholder-slate-400"
              />
            </div>

            {searchQuery.trim() === "" && (
              <div className="text-center py-10 text-slate-400 text-xs">
                <p>Type keywords to test live semantic-indexing simulation</p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {["exarch", "tonoplast", "C4 PEP", "Henking", "lac operon"].map(keyword => (
                    <button
                      key={keyword}
                      onClick={() => setSearchQuery(keyword)}
                      className="px-3 py-1 bg-slate-50 hover:bg-primary/10 hover:text-primary transition-colors rounded-full border border-slate-200/60 text-[11px] font-medium text-slate-500 cursor-pointer"
                    >
                      "{keyword}"
                    </button>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence>
              {filteredLines.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3.5 mt-4"
                >
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Matched Core Genome Statements ({filteredLines.length})</p>
                  {filteredLines.map(line => (
                    <div 
                      key={line.id} 
                      className="p-4 bg-slate-50 hover:bg-slate-50/80 border border-slate-100 rounded-[15px] flex justify-between items-start gap-4 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">{line.chapterName}</span>
                          <span className="text-[10px] font-semibold text-slate-400">Page {line.pageNumber} • Line {line.lineNumber}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-800 leading-relaxed">
                          "{line.lineText}"
                        </p>
                      </div>
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="p-2 hover:bg-primary hover:text-white rounded-lg border border-slate-200 text-slate-500 transition-all flex items-center gap-1 text-[11px] font-bold cursor-pointer shrink-0"
                      >
                        Unlock Forensics <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* DOCK DEMO 2: NCERT VISION INTELLIGENCE SCANNER */}
      <section id="vision-demo" className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-poppins font-bold text-slate-900">NCERT Vision Intelligence</h2>
            <p className="text-sm text-slate-500 mt-2">Upload any diagram, page scan, handwritten note, or exam question to find the NCERT counterpart</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Input Controls */}
            <div className="md:col-span-5 bg-white border border-slate-200/80 p-5 rounded-[20px] shadow-sm space-y-5">
              <div className="space-y-2">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Option A: Drag & Drop Scan</span>
                <label className="border-2 border-dashed border-slate-200 hover:border-primary/40 rounded-[15px] h-36 flex flex-col items-center justify-center p-4 text-center cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors relative overflow-hidden">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageFileChange}
                    className="hidden" 
                  />
                  <Upload className="w-8 h-8 text-primary/80 mb-2" />
                  <span className="text-xs font-semibold text-slate-700">Choose Image or Scan</span>
                  <span className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, JPEG</span>
                </label>
              </div>

              <div className="space-y-2.5">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Option B: Load Sample Note Scans</span>
                <div className="space-y-2">
                  {sampleScans.map((sample, i) => (
                    <button
                      key={i}
                      onClick={() => handleTriggerScan(sample)}
                      disabled={isScanning}
                      className="w-full p-2.5 text-left hover:bg-primary/5 border border-slate-200/60 rounded-[12px] flex items-center gap-3 transition-colors text-xs font-medium text-slate-700 hover:text-primary hover:border-primary/30 disabled:opacity-50 cursor-pointer"
                    >
                      <img src={sample.image} alt={sample.name} className="w-9 h-9 object-cover rounded-[8px]" />
                      <div className="truncate">
                        <p className="font-semibold">{sample.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">File: {sample.fileName}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scanning Visualization Output Panel */}
            <div className="md:col-span-7 bg-[#090E17] text-slate-300 rounded-[20px] p-6 shadow-xl relative min-h-[350px] flex flex-col justify-between border border-slate-900">
              {/* Telemetry Dots */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>VISION_SYS_STANDBY</span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest block mb-4 border-b border-slate-800 pb-2">SECURE GENOME RADAR MONITOR</span>
                
                {/* No upload state */}
                {!selectedImage && !isScanning && (
                  <div className="py-12 text-center text-slate-500 space-y-3 font-mono text-xs">
                    <Camera className="w-10 h-10 mx-auto text-slate-600 animate-pulse" />
                    <p>STANDBY: Upload image or pick sample above to trigger vision analysis stream</p>
                  </div>
                )}

                {/* Scanning stage logs */}
                {isScanning && (
                  <div className="space-y-4 py-6 font-mono text-[11px]">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-primary animate-spin"></div>
                      <p className="text-white font-bold uppercase tracking-wider">DECIPHERING HIGH RES IMAGING TARGET...</p>
                    </div>
                    <div className="space-y-1 text-slate-500">
                      <p className={scanStep >= 1 ? "text-slate-300" : ""}>&gt; OCR_SYS: Scanning pixels & converting spatial curves... {scanStep >= 1 ? "[COMPLETED]" : "[RUNNING]"}</p>
                      <p className={scanStep >= 2 ? "text-slate-300" : ""}>&gt; NLP_SECTOR: Indexing sequence strings & parsing vocabulary tokens... {scanStep >= 2 ? "[COMPLETED]" : "[WAITING]"}</p>
                      <p className={scanStep >= 3 ? "text-slate-300" : ""}>&gt; GENE_MATRIX: Aligning semantic similarity coordinates... {scanStep >= 3 ? "[MATCHED]" : "[QUEUE]"}</p>
                    </div>
                  </div>
                )}

                {/* Scanned Results */}
                {scanResult && !isScanning && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="space-y-4 py-2 text-xs"
                  >
                    <div className="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-3">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-mono">Matched Subject / Book</span>
                        <span className="font-bold text-white uppercase">{scanResult.book} ({scanResult.subject})</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-mono">Matched Chapter / Page</span>
                        <span className="font-bold text-amber-500 uppercase">{scanResult.chapter} • Page {scanResult.page}</span>
                      </div>
                    </div>

                    <div className="space-y-1 border-b border-slate-800/80 pb-3">
                      <div className="flex justify-between">
                        <span className="text-[10px] text-slate-500 uppercase font-mono">Matched NCERT Statement</span>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase font-mono">Confidence: {scanResult.confidence}%</span>
                      </div>
                      <p className="text-white font-serif italic text-[13px] leading-relaxed">
                        "{scanResult.matchedLine}"
                      </p>
                    </div>

                    <div className="space-y-1 text-slate-400">
                      <span className="text-[10px] text-slate-500 block uppercase font-mono">GenAI Summary & Study Advice</span>
                      <p className="leading-relaxed text-[11px] text-slate-300">
                        {scanResult.insights}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {scanResult && !isScanning && (
                <div className="border-t border-slate-800/80 pt-4 mt-2 flex justify-between items-center text-[11px]">
                  <span className="text-slate-500 font-mono">Match source: {scanResult.confidence > 90 ? "CRITICAL_HIT" : "PROBABLE_MATCH"}</span>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-3 py-1.5 bg-primary/20 hover:bg-primary hover:text-white text-primary border border-primary/40 rounded-lg font-semibold cursor-pointer transition-all uppercase"
                  >
                    Unlock NEET Mock PYQs
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE BENTO GRID SECTION */}
      <section id="features" className="py-20 px-6 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Core Technologies</span>
            <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-slate-900 mt-4">The NCERT Intelligence Operating System</h2>
            <p className="text-sm text-slate-500 mt-2">Original high-yield biology learning systems that translate simple sentences into maximum NEET scores.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 bg-white border border-slate-200/80 p-8 rounded-[20px] shadow-sm flex flex-col justify-between">
              <div className="w-12 h-12 rounded-[15px] bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-poppins font-bold text-slate-900">1. Precision NCERT Line Indexer</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Look up biology concepts in seconds. Discover exactly which volume, chapter, page, and line number houses any statement. Supports keyword search, fuzzy query string matches, and live semantic indices.
                </p>
              </div>
            </div>

            <div className="md:col-span-4 bg-white border border-slate-200/80 p-8 rounded-[20px] shadow-sm flex flex-col justify-between">
              <div className="w-12 h-12 rounded-[15px] bg-accent/10 flex items-center justify-center text-accent mb-6">
                <Camera className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-poppins font-bold text-slate-900">2. Vision scanner</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Photograph any question from standard NEET mock banks, handwritten summaries, or diagram boxes to extract matching lines.
                </p>
              </div>
            </div>

            <div className="md:col-span-4 bg-white border border-slate-200/80 p-8 rounded-[20px] shadow-sm flex flex-col justify-between">
              <div className="w-12 h-12 rounded-[15px] bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
                <Database className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-poppins font-bold text-slate-900">3. Past Year Question (PYQ) Regression</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Never miss standard exam patterns. View real previous NEET questions mapped to exact lines, complete with frequency trackers and examiner trend charts.
                </p>
              </div>
            </div>

            <div className="md:col-span-8 bg-white border border-slate-200/80 p-8 rounded-[20px] shadow-sm flex flex-col justify-between">
              <div className="w-12 h-12 rounded-[15px] bg-purple-100 flex items-center justify-center text-purple-600 mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-poppins font-bold text-slate-900">4. Predictive Mock Question Generator</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Simulate potential variations of NCERT sentences. Generates complex multiple-choice challenges, tricky assertion-reasons, and comprehensive conceptual logic prompts on multiple difficulty scales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Success Stories</span>
            <h2 className="text-3xl font-poppins font-bold text-slate-900 mt-4">Praise from NEET Toppers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "I scored a perfect 360/360 in Biology this year. NCERT DNA AI allowed me to immediately review previous questions and tricky traps for every single sentence I read.",
                author: "Dr. Ananya Sharma",
                rank: "NEET All India Rank 14",
                score: "Biology Score: 360/360"
              },
              {
                quote: "The Vision Scanning feature saved me weeks. Whenever I was confused by a diagram or question in reference books, I scanned it to see the exact NCERT core line.",
                author: "Rahul Chaudhari",
                rank: "NEET All India Rank 89",
                score: "Biology Score: 355/360"
              },
              {
                quote: "Most mock questions are trash. NCERT DNA AI generates real predictive questions that mimic the actual examiner mind-games beautifully.",
                author: "Sneha Patel",
                rank: "NEET All India Rank 142",
                score: "Biology Score: 350/360"
              }
            ].map((t, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 p-6 rounded-[20px] flex flex-col justify-between relative shadow-sm">
                <div className="flex gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-slate-700 text-sm italic mb-6 leading-relaxed">"{t.quote}"</p>
                <div>
                  <h4 className="font-poppins font-bold text-slate-900 text-xs">{t.author}</h4>
                  <p className="text-[10px] text-primary font-semibold mt-0.5">{t.rank}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">{t.score}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-20 px-6 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Transparent Pricing</span>
            <h2 className="text-3xl font-poppins font-bold text-slate-900 mt-4">Unleash the full DNA Matrix</h2>
            <p className="text-sm text-slate-500 mt-2">Connect your real study tracker and lock down elite NEET Biology clearance levels.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                level: "Guest Access",
                price: "Free",
                desc: "Explore public chapters and sample focus points.",
                features: ["Fuzzy NCERT Index search", "Sample high-yield statements", "Offline mock insights", "Limit of 10 daily lookups"],
                action: "Explore Now",
                primary: false,
                trigger: onEnterGuestMode
              },
              {
                level: "Student Premium",
                price: "$19/mo",
                desc: "Complete comprehensive dashboard for active aspirants.",
                features: ["Unrestricted NCERT line lookup", "Multimodal Vision OCR scanning", "Related past NEET years mapped", "Predictive MCQs & Assertion generator", "Daily active recall scheduler"],
                action: "Upgrade Now",
                primary: true,
                trigger: () => setShowAuthModal(true)
              },
              {
                level: "Elite Clearance",
                price: "$49/mo",
                desc: "Ultimate medical school clearance & custom tutor coaching.",
                features: ["All Student Premium traits", "Live server-side Gemini generation", "Durable Firestore session backups", "Weak topic automated recovery", "Export PDF study notes", "Custom goal analytics tracker"],
                action: "Acquire Elite access",
                primary: false,
                trigger: () => {
                  setEmailInput("elite_aspirant@ncertdna.ai");
                  setShowAuthModal(true);
                }
              }
            ].map((p, i) => (
              <div 
                key={i} 
                className={`bg-white border rounded-[20px] p-6 flex flex-col justify-between shadow-sm relative transition-all ${
                  p.primary 
                    ? "border-primary ring-2 ring-primary/10 scale-105 z-10 shadow-md" 
                    : "border-slate-200/80 hover:border-slate-300"
                }`}
              >
                {p.primary && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
                    MOST POPULAR FOR NEET
                  </span>
                )}
                <div>
                  <h3 className="font-poppins font-bold text-slate-900 text-base">{p.level}</h3>
                  <div className="flex items-baseline gap-1 mt-3">
                    <span className="text-3xl font-poppins font-bold text-slate-900">{p.price}</span>
                  </div>
                  <p className="text-slate-500 text-xs mt-2">{p.desc}</p>
                  
                  <ul className="space-y-2.5 mt-6 border-t border-slate-100 pt-6">
                    {p.features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                        <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={p.trigger}
                  className={`w-full py-3 mt-8 font-semibold rounded-[15px] text-xs transition-all cursor-pointer ${
                    p.primary
                      ? "bg-primary hover:bg-primary/95 text-white shadow-md shadow-primary/20"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200"
                  }`}
                >
                  {p.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-white py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[10px] bg-primary flex items-center justify-center text-white font-bold text-sm">
              D
            </div>
            <div>
              <span className="font-poppins font-semibold text-[#111827] text-sm block">NCERT DNA AI</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">© 2026 NCERT DNA Operating System</span>
            </div>
          </div>

          <div className="flex gap-8">
            <a href="#features" className="hover:text-primary">Features</a>
            <a href="#search-demo" className="hover:text-primary">Finder</a>
            <a href="#vision-demo" className="hover:text-primary">Vision</a>
            <a href="#pricing" className="hover:text-primary">Pricing</a>
          </div>

          <div className="text-right text-[10px] text-slate-400 font-mono">
            PORT: 3000 // STATUS: FULLSTACK_ONLINE
          </div>
        </div>
      </footer>

      {/* AUTHENTICATION POPUP MODAL */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-[20px] p-6 w-full max-w-sm border border-slate-100 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <span className="w-11 h-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </span>
                <h3 className="text-lg font-poppins font-bold text-slate-900">Sign In to NCERT DNA AI</h3>
                <p className="text-xs text-slate-400 mt-1">Unlock related PYQs, mock simulators & spaced repetition trackers</p>
              </div>

              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-[12px] text-xs text-rose-600 mb-4 font-medium">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Aspirant Email Address</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="student@example.com"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-[12px] text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 bg-primary hover:bg-primary/95 text-white font-semibold rounded-[15px] text-xs transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {authLoading ? "Initializing security handshake..." : "Authorize Security Handshake"} <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="relative my-6 text-center">
                <span className="absolute inset-x-0 top-1/2 border-b border-slate-100"></span>
                <span className="relative bg-white px-3 text-[10px] text-slate-400 uppercase font-bold">Or Continue With</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    const mockGoogleUser: UserClearance = {
                      userId: "G_AUTH_MOCK_" + Math.random().toString(36).substring(3, 8),
                      email: "google_student@gmail.com",
                      clearanceLevel: "STUDENT_PREVIEW",
                      clearanceCode: "DNA-STUDENT-G",
                      handshakeToken: "SECURE_GOOGLE_TOKEN_88",
                      handshakeTimestamp: new Date().toISOString()
                    };
                    onLoginSuccess(mockGoogleUser);
                  }}
                  className="py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60 rounded-[12px] text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  Google
                </button>
                <button
                  onClick={onEnterGuestMode}
                  className="py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60 rounded-[12px] text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  Guest Mode
                </button>
              </div>

              <p className="text-center text-[9px] text-slate-400 mt-6 font-mono uppercase tracking-widest leading-relaxed">
                By entering, you confirm NEET revision protocols & consent to adaptive cognitive metrics.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
