import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, Star, Upload, FileImage, CheckCircle, 
  X, AlertTriangle, Lightbulb, Camera, Paperclip
} from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [type, setType] = useState<"bug" | "feature" | "rating">("bug");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  
  // Screenshot states
  const [hasScreenshot, setHasScreenshot] = useState(false);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const triggerMockScreenshot = () => {
    setIsCapturing(true);
    setTimeout(() => {
      // Create a nice mockup canvas representation or a mock screen capture
      setHasScreenshot(true);
      setScreenshotPreview("https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=300&auto=format&fit=crop");
      setIsCapturing(false);
    }, 900);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Hardened upload guards (Security & Storage stability checks)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit. Please attach a smaller image.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Unsupported file extension. Only standard images are permitted.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setHasScreenshot(true);
        setScreenshotPreview(reader.result as string);
      };
      reader.onerror = () => {
        alert("Failed to read the attachment.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() && type !== "rating") return;

    setIsSubmitting(true);
    
    // Simulate API call to process the feedback
    setTimeout(() => {
      // Save to localStorage
      const existing = localStorage.getItem("ncert_dna_feedbacks") || "[]";
      let parsed = [];
      try {
        parsed = JSON.parse(existing);
      } catch (err) {}
      
      const newFeedback = {
        id: "fb-" + Date.now(),
        type,
        description,
        rating: type === "rating" || description ? rating : undefined,
        screenshot: screenshotPreview,
        timestamp: new Date().toISOString()
      };

      parsed.push(newFeedback);
      localStorage.setItem("ncert_dna_feedbacks", JSON.stringify(parsed));
      
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleReset = () => {
    setType("bug");
    setDescription("");
    setRating(5);
    setHasScreenshot(false);
    setScreenshotPreview(null);
    setIsSubmitted(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-55 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-[24px] border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden flex flex-col relative"
      >
        <div className="h-1.5 w-full bg-primary"></div>

        {/* HEADER */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-poppins font-black text-slate-900 uppercase tracking-tight">
              NEET OS Feedback Command
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="feedback-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4 text-xs text-slate-600"
              >
                {/* SELECT TYPE */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "bug", label: "Report Issue", icon: AlertTriangle, color: "text-rose-500 bg-rose-500/10" },
                    { id: "feature", label: "Suggest Feature", icon: Lightbulb, color: "text-amber-500 bg-amber-500/10" },
                    { id: "rating", label: "Rate Experience", icon: Star, color: "text-teal-500 bg-teal-500/10" }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setType(btn.id as any)}
                      className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                        type === btn.id
                          ? "border-primary bg-primary/5 font-bold text-primary"
                          : "border-slate-150 hover:bg-slate-50 text-slate-500"
                      }`}
                    >
                      <btn.icon className={`w-4 h-4 ${type === btn.id ? "text-primary" : "text-slate-400"}`} />
                      <span className="text-[10px] tracking-tight">{btn.label}</span>
                    </button>
                  ))}
                </div>

                {/* STAR RATING FOR EXPERIENCE */}
                {(type === "rating" || type === "feature" || type === "bug") && (
                  <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex flex-col items-center justify-center gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      How would you rate NCERT DNA?
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(null)}
                          onClick={() => setRating(star)}
                          className="p-1 cursor-pointer transform hover:scale-125 transition-transform"
                        >
                          <Star 
                            className={`w-6 h-6 ${
                              star <= (hoveredRating ?? rating)
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200"
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* DESCRIPTION */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    {type === "bug" && "Describe the bug or technical anomaly"}
                    {type === "feature" && "What features would make you study better?"}
                    {type === "rating" && "Any thoughts or testimonial you'd like to share? (Optional)"}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required={type !== "rating"}
                    placeholder={
                      type === "bug" 
                        ? "E.g., The Vision scanner didn't match page 142 on Botany properly..." 
                        : type === "feature" 
                          ? "E.g., A custom audio recitation player to listen to high-yield NCERT lines during commute..."
                          : "We read every response to improve the app. Tell us how we are doing!"
                    }
                    className="w-full h-24 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/25 placeholder-slate-400 text-slate-700 leading-relaxed"
                  />
                </div>

                {/* ATTACHMENT SECTION */}
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Attach Screenshot or Log Artifacts
                  </label>

                  <div className="flex items-center gap-3">
                    {/* Capture current screen */}
                    <button
                      type="button"
                      onClick={triggerMockScreenshot}
                      disabled={isCapturing}
                      className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Camera className="w-4 h-4 text-slate-500" />
                      {isCapturing ? "Capturing..." : "Autofill Current Screen"}
                    </button>

                    {/* Choose local file */}
                    <label className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer">
                      <Paperclip className="w-4 h-4 text-slate-500" />
                      Browse File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* PREVIEW ATTACHMENT */}
                  {hasScreenshot && screenshotPreview && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative rounded-xl border border-slate-200 overflow-hidden w-full h-28 bg-slate-100"
                    >
                      <img 
                        src={screenshotPreview} 
                        alt="Feedback screenshot preview" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setHasScreenshot(false);
                          setScreenshotPreview(null);
                        }}
                        className="absolute top-1.5 right-1.5 p-1 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-slate-900/60 text-white text-[9px] font-mono rounded-md">
                        screenshot_captured_node.png
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* SUBMIT */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 text-slate-500 hover:bg-slate-50 rounded-lg font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || (!description.trim() && type !== "rating")}
                    className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="feedback-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-16 h-16 bg-teal-50 rounded-full border border-teal-100 text-teal-500 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 fill-teal-100" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-poppins font-black text-slate-900 uppercase tracking-tight">
                    Feedback Lodged Successfully!
                  </h4>
                  <p className="text-[11px] text-slate-400 max-w-sm leading-relaxed">
                    Thank you for optimizing the NEET Intelligence Operating System. Our core engine engineers review feedback coordinates daily to perfect high-yield retention models.
                  </p>
                </div>
                <button
                  onClick={() => {
                    handleReset();
                    onClose();
                  }}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
