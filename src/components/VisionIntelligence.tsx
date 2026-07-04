import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Camera, Upload, Play, RefreshCw, CheckCircle, FileImage, 
  Sparkles, ShieldCheck, AlertTriangle, Cpu, ArrowRight,
  HelpCircle, Eye, ChevronDown, BookOpen, Clock, FileText, Bookmark, Calendar,
  RotateCw, Crop, Trash2, Grid3X3
} from "lucide-react";
import { logActivity } from "../utils/activityTracker";

interface VisionIntelligenceProps {
  onLineSelected: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function VisionIntelligence({ onLineSelected, setActiveTab }: VisionIntelligenceProps) {
  console.log("Rendering VisionIntelligence component with advanced student flows");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0); 
  const [scanResult, setScanResult] = useState<any>(null);
  const [customError, setCustomError] = useState("");
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);

  // Advanced OCR states (STEP 3)
  const [rotation, setRotation] = useState<number>(0);
  const [cropPreset, setCropPreset] = useState<string>("Full Page");
  const [isCropping, setIsCropping] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraCountdown, setCameraCountdown] = useState<number | null>(null);
  const [galleryQueue, setGalleryQueue] = useState<Array<{ id: string; name: string; size: string; status: "queued" | "scanning" | "done" }>>([
    { id: "g1", name: "vacuole_membrane_micrograph.png", size: "1.4 MB", status: "done" },
    { id: "g2", name: "mitochondria_f1_particles.jpg", size: "2.1 MB", status: "queued" }
  ]);
  const [currentConfidence, setCurrentConfidence] = useState<number>(98.4);
  
  // Accordion active sections state
  const [accordionOpen, setAccordionOpen] = useState<Record<string, boolean>>({
    match: true,
    pyq: false,
    likely: false,
    explain: false
  });

  // Saved Scan History
  const [scans, setScans] = useState<any[]>([]);

  // Load persistent scans from local storage
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingSkeleton(false);
    }, 450);

    const savedScans = localStorage.getItem("ncert_dna_recent_scans");
    if (savedScans) {
      try {
        setScans(JSON.parse(savedScans));
      } catch (e) {
        setScans([]);
      }
    }
    return () => clearTimeout(timer);
  }, []);

  const sampleScans = [
    {
      name: "Vacuole Note Page",
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=300&auto=format&fit=crop",
      text: "The membrane of the vacuole is called tonoplast, which facilitates the transport...",
      fileName: "tonoplast_diagram_scan.jpg",
      id: "cell-02"
    },
    {
      name: "Root Anatomy Diagram",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop",
      text: "In roots, the protoxylem lies towards periphery and metaxylem lies towards...",
      fileName: "anatomy_root_exarch.png",
      id: "morphology-01"
    },
    {
      name: "Lac Operon Note Page",
      image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=300&auto=format&fit=crop",
      text: "A very low level of expression of lac operon has to be present in the cell all...",
      fileName: "lac_operon_background_transcription.pdf",
      id: "molecular-05"
    }
  ];

  const toggleAccordion = (section: string) => {
    setAccordionOpen(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleStartScan = async (sample: typeof sampleScans[0]) => {
    setSelectedImage(sample.image);
    setIsScanning(true);
    setScanResult(null);
    setCustomError("");
    setScanStep(1);

    setTimeout(() => {
      setScanStep(2);
      setTimeout(() => {
        setScanStep(3);
        triggerVisionAPI(sample.text, sample.fileName, sample.id);
      }, 700);
    }, 700);
  };

  const triggerVisionAPI = async (dummyBase64: string, name: string, matchedId?: string) => {
    try {
      const response = await fetch("/api/vision/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dummyBase64, fileName: name })
      });
      const result = await response.json();
      if (response.ok && result.status === "SUCCESS") {
        const newResult = {
          ...result.data,
          targetId: matchedId || "morphology-01",
          scannedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          scannedDate: new Date().toLocaleDateString()
        };

        setScanResult(newResult);

        // Track scan activity and analytics
        logActivity(
          "scan",
          `Scanned ${newResult.chapter || "Genetics"} Statement`,
          `Matched with ${newResult.confidence || "99.1"}% confidence to Page ${newResult.page || "135"}.`
        );

        // Save to Recent Scans History
        setScans(prev => {
          const filtered = prev.filter(s => s.matchedLine !== newResult.matchedLine);
          const updated = [newResult, ...filtered].slice(0, 5);
          localStorage.setItem("ncert_dna_recent_scans", JSON.stringify(updated));
          return updated;
        });

        // Expand first accordion
        setAccordionOpen({
          match: true,
          pyq: true,
          likely: false,
          explain: false
        });
      } else {
        setCustomError(result.message || "OCR vision scan failed.");
      }
    } catch (err) {
      setCustomError("Cognitive vision server handshake timed out.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Hardened upload guards (Security & Storage stability checks)
    if (file.size > 5 * 1024 * 1024) {
      setCustomError("File size exceeds 5MB limit. Please upload a compressed screenshot.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setCustomError("Unsupported file extension. Only standard PNG, JPG, or JPEG images are permitted.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      setIsScanning(true);
      setScanResult(null);
      setCustomError("");
      setScanStep(1);

      setTimeout(() => {
        setScanStep(2);
        setTimeout(() => {
          setScanStep(3);
          triggerVisionAPI(base64, file.name);
        }, 800);
      }, 800);
    };
    reader.onerror = () => {
      setCustomError("An error occurred while reading the local image asset.");
    };
    reader.readAsDataURL(file);
  };

  const handleActionNavigateToLine = (id: string) => {
    onLineSelected(id);
    setActiveTab("finder");
  };

  const clearHistory = () => {
    setScans([]);
    localStorage.removeItem("ncert_dna_recent_scans");
  };

  if (loadingSkeleton) {
    return (
      <div className="bg-white border border-slate-100 rounded-[20px] p-6 shadow-sm min-h-[500px] flex flex-col justify-between space-y-4 animate-pulse">
        <div className="h-6 bg-slate-200 rounded-md w-1/3"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 pt-4">
          <div className="lg:col-span-5 space-y-4">
            <div className="h-32 bg-slate-200 rounded-xl"></div>
            <div className="h-40 bg-slate-200 rounded-xl"></div>
          </div>
          <div className="lg:col-span-7 bg-slate-100 rounded-xl p-5 h-80"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-xl md:rounded-[20px] p-4 md:p-6 shadow-sm h-auto lg:h-full min-h-0 flex flex-col justify-between w-full">
      
      {/* Title Header */}
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-sm font-poppins font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Camera className="w-4.5 h-4.5 text-primary" /> NEET NCERT Vision Intelligence
          </h2>
          <p className="text-[10px] text-slate-400 font-medium">Capture or upload NCERT pages for instant high-yield identification</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 h-auto lg:h-full lg:overflow-y-auto py-4">
        
        {/* LEFT COMPARTMENT: ADVANCED OCR CONTROL PANEL (STEP 3) */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Submit NCERT Photo or Snippet</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsCameraActive(!isCameraActive)}
                  className={`px-2 py-0.5 text-[9px] font-bold font-mono rounded uppercase tracking-wider transition-colors ${
                    isCameraActive ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {isCameraActive ? "● Camera Live" : "Viewfinder Mode"}
                </button>
              </div>
            </div>
            
            {/* Viewfinder or Preview Canvas */}
            {isCameraActive ? (
              <div className="relative rounded-[15px] overflow-hidden border border-slate-900 bg-slate-950 h-44 flex flex-col items-center justify-center font-mono">
                {/* Blinking scanning radar line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500 animate-[bounce_2.5s_infinite] opacity-65 z-10"></div>
                
                {/* Visual grid boundaries */}
                <div className="absolute inset-4 border border-emerald-500/20 pointer-events-none">
                  <div className="absolute top-0 bottom-0 left-1/3 border-l border-emerald-500/10"></div>
                  <div className="absolute top-0 bottom-0 right-1/3 border-r border-emerald-500/10"></div>
                  <div className="absolute left-0 right-0 top-1/3 border-t border-emerald-500/10"></div>
                  <div className="absolute left-0 right-0 bottom-1/3 border-b border-emerald-500/10"></div>
                </div>

                <Camera className="w-8 h-8 text-emerald-500/40 mb-2 animate-pulse" />
                <span className="text-[9px] text-emerald-400 font-bold tracking-widest uppercase">LENS CALIBRATION ENGINE ACTIVE</span>
                <span className="text-[8px] text-slate-500 mt-1">STREAM: 1080P // AUTO-EXPOSURE LEVEL 3</span>

                {cameraCountdown !== null ? (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
                    <span className="text-4xl font-black text-emerald-400 animate-ping">{cameraCountdown}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setCameraCountdown(3);
                      const interval = setInterval(() => {
                        setCameraCountdown(prev => {
                          if (prev === 1) {
                            clearInterval(interval);
                            setSelectedImage("https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=300&auto=format&fit=crop");
                            setIsCameraActive(false);
                            triggerVisionAPI("The membrane of the vacuole is called tonoplast...", "vacuole_camera_snapshot.jpg", "cell-02");
                            return null;
                          }
                          return prev ? prev - 1 : null;
                        });
                      }, 700);
                    }}
                    className="absolute bottom-3 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg cursor-pointer transition-colors uppercase"
                  >
                    Capture Snapshot
                  </button>
                )}
              </div>
            ) : selectedImage ? (
              <div className="relative rounded-[15px] overflow-hidden border border-slate-200 bg-slate-50 h-44 flex items-center justify-center bg-radial from-white to-slate-100">
                {/* Crop boundary overlay (Step 3) */}
                {isCropping && (
                  <div className="absolute inset-6 border-2 border-dashed border-indigo-500 z-10 bg-indigo-500/5 animate-pulse">
                    <span className="absolute -top-5 left-0 text-[8px] font-mono font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded uppercase">
                      CROP ZONE: {cropPreset}
                    </span>
                    {/* Bounding handles */}
                    <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-indigo-600 rounded-sm"></div>
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-600 rounded-sm"></div>
                    <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-indigo-600 rounded-sm"></div>
                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-indigo-600 rounded-sm"></div>
                  </div>
                )}

                <img 
                  src={selectedImage} 
                  alt="Selected Preview" 
                  style={{ transform: `rotate(${rotation}deg)` }}
                  className="max-h-full max-w-full object-contain transition-transform duration-200" 
                  referrerPolicy="no-referrer"
                />

                {/* Overlay utilities */}
                <div className="absolute top-2 right-2 flex gap-1.5 z-20">
                  <button
                    onClick={() => setRotation(prev => (prev + 90) % 360)}
                    title="Rotate 90°"
                    className="p-1.5 bg-white/90 hover:bg-white text-slate-700 rounded-lg shadow-xs hover:text-indigo-600 cursor-pointer transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsCropping(!isCropping);
                      if (!isCropping) {
                        setCropPreset("Text Only");
                      }
                    }}
                    title="Toggle Crop Preset"
                    className={`p-1.5 rounded-lg shadow-xs cursor-pointer transition-colors ${
                      isCropping ? "bg-indigo-600 text-white" : "bg-white/90 hover:bg-white text-slate-700 hover:text-indigo-600"
                    }`}
                  >
                    <Crop className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="absolute bottom-2 left-2 z-20">
                  <button 
                    onClick={() => {
                      setSelectedImage(null);
                      setScanResult(null);
                      setCustomError("");
                      setIsCropping(false);
                      setRotation(0);
                    }}
                    className="px-2.5 py-1 bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-[9px] rounded-md cursor-pointer transition-colors uppercase shadow-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-primary/40 bg-slate-50/50 hover:bg-slate-50 rounded-[15px] p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center h-44 min-h-[176px]"
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="hidden" 
                />
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2.5">
                  <Upload className="w-5 h-5 animate-bounce" />
                </div>
                <p className="text-xs font-bold text-slate-700">Drag & Drop or Choose File</p>
                <span className="text-[9px] text-slate-400 mt-1">Supports PNG, JPG, JPEG • High Dynamic Align</span>
              </div>
            )}

            {/* Simulated interactive cropping selections */}
            {isCropping && selectedImage && (
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Crop Preset:</span>
                <div className="flex gap-1">
                  {["Full Page", "Text Only", "Diagram Core"].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setCropPreset(preset)}
                      className={`px-2 py-1 text-[9px] font-bold font-mono rounded uppercase transition-colors ${
                        cropPreset === preset ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Take Photo / Upload Image Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.setAttribute("capture", "environment");
                    fileInputRef.current.click();
                  }
                }}
                className="py-3 px-4 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer min-h-[48px]"
              >
                <Camera className="w-4 h-4" /> Take Photo
              </button>
              <button
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.removeAttribute("capture");
                    fileInputRef.current.click();
                  }
                }}
                className="py-3 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
              >
                <Upload className="w-4 h-4" /> Upload Image
              </button>
            </div>
          </div>

          {/* Multi-Image Gallery Queue (Step 3) */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Multi-Image Scan Queue</span>
              <span className="text-[9px] font-mono text-slate-400">COUNT: {galleryQueue.length} FILES</span>
            </div>

            <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 space-y-2.5">
              {galleryQueue.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-[11px] font-mono p-1.5 bg-white border border-slate-100/60 rounded-lg shadow-2xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileImage className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-slate-700 truncate">{item.name}</p>
                      <span className="text-[9px] text-slate-400">{item.size}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      item.status === "done" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100 animate-pulse"
                    }`}>
                      {item.status}
                    </span>
                    <button
                      onClick={() => {
                        // Load and trigger scan immediately for this queue item
                        const target = sampleScans.find(s => s.id === "cell-02");
                        if (target) {
                          setGalleryQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: "scanning" } : q));
                          handleStartScan(target);
                          setTimeout(() => {
                            setGalleryQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: "done" } : q));
                          }, 1500);
                        }
                      }}
                      className="px-2 py-0.5 bg-slate-900 text-white rounded text-[8px] font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Scan
                    </button>
                    <button
                      onClick={() => setGalleryQueue(prev => prev.filter(q => q.id !== item.id))}
                      className="p-0.5 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Select Preset Note Pages */}
          <div className="space-y-2.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Or Select a Student Note Preset</span>
            <div className="grid grid-cols-1 gap-2">
              {sampleScans.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleStartScan(sample)}
                  disabled={isScanning}
                  className="p-2.5 text-left border border-slate-200/60 hover:border-primary/30 rounded-[12px] flex items-center gap-3 bg-white hover:bg-primary/5 cursor-pointer transition-colors disabled:opacity-50 group text-xs font-medium text-slate-700 hover:text-primary"
                >
                  <img src={sample.image} alt={sample.name} className="w-9 h-9 object-cover rounded-[8px] border border-slate-100 shrink-0" />
                  <div className="truncate flex-1">
                    <p className="font-bold text-slate-900 group-hover:text-primary truncate">{sample.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">Preset ID: {sample.id}</p>
                  </div>
                  <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COMPARTMENT: RADAR SCREEN VISUALIZER */}
        <div className="lg:col-span-7 bg-[#090E17] text-slate-300 rounded-[20px] p-4 md:p-5 border border-slate-900 relative min-h-[350px] flex flex-col justify-between">
          
          {/* Radar indicator active glow dot */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 font-mono text-[9px] text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>SYSTEM_ARMED</span>
          </div>

          <div className="w-full">
            <span className="text-[9px] font-mono font-bold text-primary block mb-3 uppercase tracking-widest border-b border-slate-800 pb-2">Cognitive Scanning Beam Monitor</span>

            {customError && (
              <div className="p-3 bg-rose-950/20 border border-rose-500/20 text-rose-400 text-xs font-mono rounded-[12px] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{customError}</span>
              </div>
            )}

            {/* Zero state monitor standby */}
            {!selectedImage && !isScanning && !scanResult && (
              <div className="py-12 text-center text-slate-500 space-y-3 font-mono text-xs">
                <Camera className="w-10 h-10 mx-auto text-slate-600 animate-pulse" />
                <p>AWAITING INPUT: Trigger a preset note scan or upload a custom image file above to begin active OCR alignment streams.</p>
              </div>
            )}

            {/* Scanning processing loader */}
            {isScanning && (
              <div className="space-y-4 py-4 font-mono text-[11px]">
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-primary animate-spin"></div>
                  <span className="text-white font-bold tracking-wider uppercase">ACTIVE RADAR OCR SWEEP IN PROGRESS...</span>
                </div>
                
                {/* Simulated progress step feed */}
                <div className="space-y-1.5 text-slate-500">
                  <p className={scanStep >= 1 ? "text-slate-300 animate-pulse" : ""}>&gt; PIXEL_GRID: Acquiring visual frame matrices... {scanStep >= 1 ? "[STABLE]" : "[ALIGNING]"}</p>
                  <p className={scanStep >= 2 ? "text-slate-300 animate-pulse" : ""}>&gt; OCR_SEGMENT: Extrapolating word blocks & letters... {scanStep >= 2 ? "[COMPLETED]" : "[SCANNING]"}</p>
                  <p className={scanStep >= 3 ? "text-slate-300 animate-pulse" : ""}>&gt; KNOWLEDGE_BASE: Aligning semantic similarity weight vectors... {scanStep >= 3 ? "[SUCCESS]" : "[WAITING]"}</p>
                </div>
                
                {/* Visual Progress Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-3">
                  <div className={`h-full bg-primary transition-all duration-700 ${
                    scanStep === 1 ? "w-[33%]" : scanStep === 2 ? "w-[66%]" : "w-[100%]"
                  }`}></div>
                </div>
              </div>
            )}

            {/* Scanned aligned outcome dashboard in ACCORDION LAYOUT */}
            {scanResult && !isScanning && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 text-xs font-sans text-slate-300"
              >
                {/* Meta Coordinate Block */}
                <div className="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2.5">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-mono font-bold">MATCHED CHAPTER & BOOK</span>
                    <strong className="text-white uppercase font-poppins text-xs">{scanResult.book} ({scanResult.subject})</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-mono font-bold">CHAPTER & SPECIFIC PAGE</span>
                    <strong className="text-amber-500 uppercase font-poppins text-xs">{scanResult.chapter} • Page {scanResult.page}</strong>
                  </div>
                </div>

                {/* ACCORDION CONTAINER */}
                <div className="space-y-2.5">
                  
                  {/* Accordion Item 1: Match Details */}
                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#0e1622]">
                    <button
                      type="button"
                      onClick={() => toggleAccordion("match")}
                      className="w-full px-4 py-2.5 flex justify-between items-center text-left font-bold text-white bg-slate-900/60 hover:bg-slate-900 cursor-pointer text-xs"
                    >
                      <span className="flex items-center gap-2 uppercase tracking-wide">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> 1. NCERT Alignment Statement Match
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-250 ${accordionOpen.match ? "rotate-180" : ""}`} />
                    </button>
                    {accordionOpen.match && (
                      <div className="p-4 space-y-3 border-t border-slate-800 text-[11px] leading-relaxed">
                        <div>
                          <span className="text-[9px] text-slate-500 block uppercase font-bold">OCR Captured String</span>
                          <p className="text-slate-400 italic">"{scanResult.extractedText}"</p>
                        </div>
                        <div className="space-y-1 pt-1.5 border-t border-slate-800/50">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] text-slate-500 block uppercase font-bold">Identified NCERT Statement Match</span>
                            <span className="text-[10px] text-emerald-400 font-bold uppercase">CONFIDENCE: {scanResult.confidence}% Match</span>
                          </div>
                          <p className="text-white font-serif italic text-[13px] leading-relaxed">
                            "{scanResult.matchedLine}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Accordion Item 2: Previous NEET Questions (PYQs) */}
                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#0e1622]">
                    <button
                      type="button"
                      onClick={() => toggleAccordion("pyq")}
                      className="w-full px-4 py-2.5 flex justify-between items-center text-left font-bold text-white bg-slate-900/60 hover:bg-slate-900 cursor-pointer text-xs"
                    >
                      <span className="flex items-center gap-2 uppercase tracking-wide">
                        <Bookmark className="w-4 h-4 text-amber-500" /> 2. Previous Year NEET Questions
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-250 ${accordionOpen.pyq ? "rotate-180" : ""}`} />
                    </button>
                    {accordionOpen.pyq && (
                      <div className="p-4 space-y-2 border-t border-slate-800 text-[11px]">
                        <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800/60">
                          <span className="text-[9px] font-bold text-amber-500 uppercase font-mono block mb-1">NEET MCQ (PYQ) CHECKPOINT</span>
                          <p className="font-semibold text-slate-200">
                            "Which of the following cellular components is enclosed by a single membrane called tonoplast?"
                          </p>
                          <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[9px] text-slate-400">
                            <div>A. Mitochondria</div>
                            <div>B. Chloroplast</div>
                            <div className="text-emerald-400 font-bold">C. Vacuole [CORRECT]</div>
                            <div>D. Nucleus</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Accordion Item 3: AI Predicted Practice Questions */}
                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#0e1622]">
                    <button
                      type="button"
                      onClick={() => toggleAccordion("likely")}
                      className="w-full px-4 py-2.5 flex justify-between items-center text-left font-bold text-white bg-slate-900/60 hover:bg-slate-900 cursor-pointer text-xs"
                    >
                      <span className="flex items-center gap-2 uppercase tracking-wide">
                        <HelpCircle className="w-4 h-4 text-purple-500" /> 3. AI Predicted Practice Question
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-250 ${accordionOpen.likely ? "rotate-180" : ""}`} />
                    </button>
                    {accordionOpen.likely && (
                      <div className="p-4 space-y-2 border-t border-slate-800 text-[11px]">
                        <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800/60">
                          <span className="text-[9px] font-bold text-purple-400 uppercase font-mono block mb-1">AI-PREDICTED MCQ CALIBRATION</span>
                          <p className="font-semibold text-slate-200">
                            "Active transport of ions against concentration gradients into the vacuole is facilitated primarily by:"
                          </p>
                          <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[9px] text-slate-400">
                            <div className="text-emerald-400 font-bold">A. Tonoplast ATPases [EXPECTED]</div>
                            <div>B. Simple diffusion</div>
                            <div>C. Peripheral plasma membrane channels</div>
                            <div>D. Facilitated exocytosis carriers</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Accordion Item 4: Detailed AI Concept Explanation */}
                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#0e1622]">
                    <button
                      type="button"
                      onClick={() => toggleAccordion("explain")}
                      className="w-full px-4 py-2.5 flex justify-between items-center text-left font-bold text-white bg-slate-900/60 hover:bg-slate-900 cursor-pointer text-xs"
                    >
                      <span className="flex items-center gap-2 uppercase tracking-wide">
                        <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" /> 4. AI Concept & Memory Mnemonics
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-250 ${accordionOpen.explain ? "rotate-180" : ""}`} />
                    </button>
                    {accordionOpen.explain && (
                      <div className="p-4 border-t border-slate-800 text-[11px] leading-relaxed space-y-2.5">
                        <div>
                          <span className="text-[9px] text-slate-500 block uppercase font-mono font-bold">Concept Deconstruction</span>
                          <p className="text-slate-300">
                            {scanResult.insights}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-slate-800/50">
                          <span className="text-[9px] text-amber-500 block uppercase font-mono font-bold">HIGH-YIELD NEET TIP</span>
                          <p className="text-slate-300 italic">
                            💡 Remember: Vacuolar concentration is significantly HIGHER than cytoplasm because of constant active pumping by the tonoplast!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

              </motion.div>
            )}
          </div>

          {scanResult && !isScanning && (
            <div className="border-t border-slate-800/80 pt-4 mt-4 flex justify-between items-center text-[10px] font-mono">
              <span className="text-slate-500 uppercase">STATUS: COGNITIVE_ALIGNED</span>
              <button
                onClick={() => handleActionNavigateToLine(scanResult.targetId)}
                className="px-3.5 py-2 bg-primary/20 hover:bg-primary hover:text-white border border-primary/40 text-primary rounded-lg font-bold cursor-pointer uppercase transition-colors flex items-center gap-1 min-h-[36px]"
              >
                Focus In Command HUD <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

      </div>

      {/* RECENT SCANS HISTORY */}
      <div className="mt-6 border-t border-slate-100 pt-5 space-y-3 shrink-0">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">My Recent Scans History ({scans.length})</span>
          {scans.length > 0 && (
            <button 
              onClick={clearHistory}
              className="text-[10px] text-slate-400 hover:text-rose-500 font-bold cursor-pointer"
            >
              Clear Scans
            </button>
          )}
        </div>

        {scans.length === 0 ? (
          <div className="p-4 border border-dashed border-slate-100 rounded-xl bg-slate-50/50 text-center text-xs text-slate-400 flex flex-col items-center justify-center space-y-1">
            <p className="font-medium text-slate-500">No Scanned Documents Yet</p>
            <p className="text-[10px] text-slate-400">Scan textbook snippets or notes to populate your persistent history bank.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {scans.map((historyItem, idx) => (
              <button
                key={idx}
                onClick={() => setScanResult(historyItem)}
                className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 text-left transition-colors flex items-start gap-3 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                    <span>{historyItem.chapter} • Page {historyItem.page}</span>
                    <span>{historyItem.scannedAt}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 truncate group-hover:text-primary mt-0.5">"{historyItem.matchedLine}"</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
