import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GraduationCap, Target, Calendar, Clock, Sparkles, Check, 
  ArrowRight, ArrowLeft, Trophy, BookOpen, BrainCircuit
} from "lucide-react";

interface OnboardingData {
  classLevel: string;
  goal: string;
  exam: string;
  studyHours: number;
}

interface OnboardingModalProps {
  onComplete: (data: OnboardingData) => void;
  isOpen: boolean;
}

export default function OnboardingModal({ onComplete, isOpen }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [classLevel, setClassLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [exam, setExam] = useState("");
  const [studyHours, setStudyHours] = useState(4);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);

  const classes = [
    { id: "class-11", label: "Class 11", desc: "Build rock-solid molecular biology & botany fundamentals" },
    { id: "class-12", label: "Class 12", desc: "Master complex cell, genetics & evolutionary concepts" },
    { id: "repeater", label: "Dropper / Repeater", desc: "Intense focus on speed, high-yield accuracy & PYQ traps" }
  ];

  const goals = [
    { id: "360", label: "Perfect 360/360 Score", desc: "Aims for perfect retention & zero penalty on tricky NEET exceptions" },
    { id: "retention", label: "Active Daily Retention", desc: "Build persistent muscle memory using spaced-repetition loops" },
    { id: "rapid", label: "Rapid Chapter Mastery", desc: "Expedite coverage of high-probability chapter matrices" }
  ];

  const exams = [
    { id: "neet-2026", label: "NEET 2026", desc: "Perfect pacing and deep retention of both volumes" },
    { id: "neet-2027", label: "NEET 2027", desc: "Early preparation targeting stellar conceptual maps" },
    { id: "boards-neet", label: "Boards + NEET", desc: "Dual balance between descriptive answers & rapid MCQs" }
  ];

  const hoursOptions = [2, 4, 6, 8];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Step 5: Start Calibration Simulation
      setStep(5);
      setIsCalibrating(true);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 8;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTimeout(() => {
            onComplete({
              classLevel: classLevel || "Class 12",
              goal: goal || "Perfect 360/360 Score",
              exam: exam || "NEET 2026",
              studyHours: studyHours || 4
            });
          }, 600);
        }
        setCalibrationProgress(progress);
      }, 100);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isStepValid = () => {
    if (step === 1) return classLevel !== "";
    if (step === 2) return goal !== "";
    if (step === 3) return exam !== "";
    return true;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-55 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -15 }}
          className="bg-white rounded-[24px] border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col relative min-h-[480px] max-h-[90vh]"
        >
          {/* Decorative bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-indigo-500 to-teal-400"></div>

          {step < 5 && (
            <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
                  CANDIDATE PARAMETER CALIBRATION
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                Step {step} of 4
              </span>
            </div>
          )}

          {/* MAIN FORM VIEWPORTS */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg md:text-xl font-poppins font-black text-slate-900 leading-tight">
                    Select Your Academic Class Level
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    We tailor our predictive question accuracy models and chapter pacing parameters to your class tier.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {classes.map((cls) => (
                    <button
                      key={cls.id}
                      onClick={() => setClassLevel(cls.label)}
                      className={`w-full p-4 rounded-xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                        classLevel === cls.label
                          ? "bg-primary/5 border-primary shadow-xs"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-800 font-bold block">{cls.label}</strong>
                        <span className="text-[11px] text-slate-400 font-mono leading-relaxed block">{cls.desc}</span>
                      </div>
                      <div className={`w-4.5 h-4.5 rounded-full border shrink-0 flex items-center justify-center mt-0.5 ${
                        classLevel === cls.label ? "bg-primary border-primary text-white" : "border-slate-300"
                      }`}>
                        {classLevel === cls.label && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 border border-amber-100">
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg md:text-xl font-poppins font-black text-slate-900 leading-tight">
                    What is your Core Biology Goal?
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    This dynamically recalibrates daily XP challenges, reminder alarms, and Spaced Repetition urgency levels.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {goals.map((gl) => (
                    <button
                      key={gl.id}
                      onClick={() => setGoal(gl.label)}
                      className={`w-full p-4 rounded-xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                        goal === gl.label
                          ? "bg-amber-500/5 border-amber-500 shadow-xs"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-800 font-bold block">{gl.label}</strong>
                        <span className="text-[11px] text-slate-400 font-mono leading-relaxed block">{gl.desc}</span>
                      </div>
                      <div className={`w-4.5 h-4.5 rounded-full border shrink-0 flex items-center justify-center mt-0.5 ${
                        goal === gl.label ? "bg-amber-500 border-amber-500 text-white" : "border-slate-300"
                      }`}>
                        {goal === gl.label && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 border border-indigo-100">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg md:text-xl font-poppins font-black text-slate-900 leading-tight">
                    Which exam is your primary focus?
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    We fine-tune previous year questions (PYQs) and difficulty weighting vectors accordingly.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {exams.map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => setExam(ex.label)}
                      className={`w-full p-4 rounded-xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                        exam === ex.label
                          ? "bg-indigo-500/5 border-indigo-500 shadow-xs"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-800 font-bold block">{ex.label}</strong>
                        <span className="text-[11px] text-slate-400 font-mono leading-relaxed block">{ex.desc}</span>
                      </div>
                      <div className={`w-4.5 h-4.5 rounded-full border shrink-0 flex items-center justify-center mt-0.5 ${
                        exam === ex.label ? "bg-indigo-500 border-indigo-500 text-white" : "border-slate-300"
                      }`}>
                        {exam === ex.label && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-500 border border-teal-100">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg md:text-xl font-poppins font-black text-slate-900 leading-tight">
                    Daily Active Study Target
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Set the target hours you plan to study NCERT statements every single day. Consistent efforts compound into stellar outcomes.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  {hoursOptions.map((hours) => (
                    <button
                      key={hours}
                      onClick={() => setStudyHours(hours)}
                      className={`p-5 rounded-xl border text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                        studyHours === hours
                          ? "bg-teal-500/5 border-teal-500 shadow-xs"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span className="text-xl md:text-2xl font-poppins font-black text-slate-850">
                        {hours} Hours
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                        {hours <= 3 ? "Consistent Prep" : hours <= 5 ? "Ideal Balanced" : "Intense Core"}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center text-center space-y-6 py-6"
              >
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-primary stroke-current"
                      strokeWidth="3.5"
                      strokeDasharray={`${calibrationProgress}, 100`}
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-mono font-black text-primary">
                    {calibrationProgress}%
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-amber-500 animate-pulse">
                    <Sparkles className="w-4 h-4 fill-amber-400" />
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider">
                      PERSONALIZING BIO WORKSPACE
                    </span>
                  </div>
                  <h3 className="text-base font-poppins font-black text-slate-900 uppercase">
                    Calibrating Dashboard Nodes...
                  </h3>
                  
                  {/* Staggered text logs */}
                  <p className="text-[11px] text-slate-500 font-mono h-4">
                    {calibrationProgress < 30 && "Analyzing syllabus vectors for: " + classLevel}
                    {calibrationProgress >= 30 && calibrationProgress < 60 && "Mapping high-yield matrices with target: " + goal}
                    {calibrationProgress >= 60 && calibrationProgress < 90 && "Initializing recall frequency parameters for: " + exam}
                    {calibrationProgress >= 90 && "Calibration successful! Launching dashboard..."}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* LOWER CONTROLS */}
          {step < 5 && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
              <button
                onClick={handlePrev}
                disabled={step === 1}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  step === 1 
                    ? "opacity-0 pointer-events-none" 
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`px-5 py-2.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:bg-primary/95 transition-all flex items-center gap-1.5 cursor-pointer ${
                  !isStepValid() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {step === 4 ? "Complete Calibration" : "Continue"} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
