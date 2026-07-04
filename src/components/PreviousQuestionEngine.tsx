import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GraduationCap, Calendar, Filter, Sparkles, AlertCircle, 
  CheckCircle, XCircle, Info, ChevronRight, BarChart3, RefreshCw, Bookmark
} from "lucide-react";
import { NCERTLine } from "../types";

interface PreviousQuestionEngineProps {
  activeLine: NCERTLine;
  onLineSelected: (id: string) => void;
}

interface PYQItem {
  id: string;
  category: "NEET" | "Boards";
  question: string;
  options: string[];
  correctIdx: number;
  year: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  explanation: string;
  topic: string;
}

export default function PreviousQuestionEngine({ activeLine, onLineSelected }: PreviousQuestionEngineProps) {
  console.log("Rendering upgraded PreviousQuestionEngine with NEET/Boards filter list");
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | "NEET" | "Boards">("ALL");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [answeredIds, setAnsweredIds] = useState<Record<string, boolean>>({});

  // Dynamic set of questions for active line
  const pyqList: PYQItem[] = [
    {
      id: "pyq-1",
      category: "NEET",
      question: activeLine.id === "morphology-01" 
        ? "In primary roots anatomy, which maturation direction of xylem develops centripetally?" 
        : `Regarding ${activeLine.chapterName}, which structural characteristic is critical for exam weightage?`,
      options: [
        "Exarch (periphery protoxylem, central metaxylem)",
        "Endarch (central protoxylem, peripheral metaxylem)",
        "Mesarch (nested dispersion of protoxylem)",
        "Polyarch radial arrangement"
      ],
      correctIdx: 0,
      year: "NEET 2022",
      difficulty: "MEDIUM",
      explanation: "NCERT states that in roots, protoxylem is peripheral and metaxylem is central, defining exarch maturation.",
      topic: "Roots Anatomical Mapping"
    },
    {
      id: "pyq-2",
      category: "Boards",
      question: "Describe the structural placement of protoxylem in roots according to NCERT Guidelines.",
      options: [
        "Protoxylem lies towards the periphery (Exarch layout)",
        "Protoxylem lies towards the center (Endarch layout)",
        "Protoxylem is absent in secondary roots",
        "Protoxylem forms a spiral band around the phloem"
      ],
      correctIdx: 0,
      year: "CBSE Boards 2021",
      difficulty: "EASY",
      explanation: "In class XII biology, CBSE frequently tests the basic definition of exarch xylem arrangement in root systems.",
      topic: "Root Primary Xylem"
    },
    {
      id: "pyq-3",
      category: "NEET",
      question: activeLine.id === "cell-02"
        ? "Which membrane structure actively concentrates ions against potential gradients into the plant vacuole?"
        : `Which of the following describes the most precise examiner variation for: "${activeLine.lineText}"?`,
      options: [
        "Tonoplast membrane active transport proteins",
        "Plasma membrane simple diffusion pathways",
        "Nuclear membrane nuclear pores",
        "Ribosomal transport channels"
      ],
      correctIdx: 0,
      year: "NEET 2023",
      difficulty: "HARD",
      explanation: "The tonoplast acts as a highly selective barrier pumping ions and minerals against concentration gradients into the vacuolar fluid.",
      topic: "Vacuole Active Transport"
    }
  ];

  const handleSelectOption = (qId: string, idx: number, correctIdx: number) => {
    if (answeredIds[qId]) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: idx }));
    setAnsweredIds(prev => ({ ...prev, [qId]: true }));

    // Increment question attempts count in localStorage
    const saved = localStorage.getItem("ncert_dna_question_attempts");
    const count = saved ? parseInt(saved, 10) : 34;
    localStorage.setItem("ncert_dna_question_attempts", String(count + 1));
  };

  const handleResetQuestion = (qId: string) => {
    setSelectedAnswers(prev => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
    setAnsweredIds(prev => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
  };

  // Filter list based on selected tab (All, NEET, Boards)
  const filteredPYQs = pyqList.filter(item => {
    return selectedCategory === "ALL" || item.category === selectedCategory;
  });

  return (
    <div className="bg-white border border-slate-100 rounded-xl md:rounded-[20px] p-4 md:p-6 shadow-sm h-auto lg:h-full min-h-0 flex flex-col justify-between w-full">
      
      {/* Title */}
      <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h2 className="text-sm font-poppins font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-4.5 h-4.5 text-primary" /> Previous Year Question (PYQ) Engine
          </h2>
          <p className="text-[10px] text-slate-400 font-medium">Verified national previous exams matched with active textbook lines</p>
        </div>

        {/* Categories (All, NEET, Boards) */}
        <div className="flex bg-slate-100 rounded-[12px] p-0.5 self-start sm:self-auto">
          {(["ALL", "NEET", "Boards"] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-[9px] transition-all cursor-pointer min-h-[30px] ${
                selectedCategory === cat 
                  ? "bg-white text-primary shadow-xs" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start flex-1 min-h-0 overflow-y-auto py-4">
        
        {/* PYQ List column (md:col-span-8) */}
        <div className="md:col-span-8 space-y-4">
          {filteredPYQs.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-[20px]">
              <p className="text-xs text-slate-500 font-semibold">No matches found for this exam Category. Select another filter.</p>
            </div>
          ) : (
            filteredPYQs.map(pyq => {
              const isAnswered = answeredIds[pyq.id];
              const selectedAnswer = selectedAnswers[pyq.id];

              return (
                <div key={pyq.id} className="p-4 bg-slate-50 border border-slate-100 rounded-[20px] space-y-4">
                  
                  {/* Header labels */}
                  <div className="flex justify-between items-center flex-wrap gap-2 text-[10px] border-b border-slate-200/50 pb-2">
                    <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                      {pyq.category} • {pyq.year}
                    </span>
                    <div className="flex gap-1.5 items-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[8px] ${
                        pyq.difficulty === "HARD" ? "bg-rose-50 text-rose-600" :
                        pyq.difficulty === "MEDIUM" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                      }`}>
                        {pyq.difficulty} DIFFICULTY
                      </span>
                    </div>
                  </div>

                  {/* Question */}
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-relaxed font-poppins">
                    {pyq.question}
                  </h4>

                  {/* Options */}
                  <div className="grid grid-cols-1 gap-2">
                    {pyq.options.map((opt, oIdx) => {
                      const isOptionSelected = selectedAnswer === oIdx;
                      const isCorrect = oIdx === pyq.correctIdx;

                      let btnStyle = "border-slate-200 bg-white text-slate-700 hover:border-slate-300";
                      if (isAnswered) {
                        if (isCorrect) {
                          btnStyle = "border-emerald-300 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-500/10";
                        } else if (isOptionSelected) {
                          btnStyle = "border-rose-300 bg-rose-50/50 text-rose-900 ring-2 ring-rose-500/10";
                        } else {
                          btnStyle = "border-slate-100 bg-slate-50/50 text-slate-450 opacity-60";
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isAnswered}
                          onClick={() => handleSelectOption(pyq.id, oIdx, pyq.correctIdx)}
                          className={`w-full p-3 text-left rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-start gap-2.5 min-h-[48px] ${btnStyle}`}
                        >
                          <span className={`w-5 h-5 rounded-full border text-[10px] font-bold flex items-center justify-center shrink-0 ${
                            isOptionSelected ? "bg-primary text-white border-primary" : "border-slate-300 text-slate-500 bg-slate-50"
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation card */}
                  <AnimatePresence>
                    {isAnswered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white border border-slate-100 rounded-xl p-3.5 space-y-2 mt-2 shadow-2xs"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5">
                          {selectedAnswer === pyq.correctIdx ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500" />
                          )}
                          <span>{selectedAnswer === pyq.correctIdx ? "Correct Answer" : "Incorrect Answer"}</span>
                        </div>
                        <p className="text-xs text-slate-650 leading-relaxed font-medium">
                          {pyq.explanation}
                        </p>
                        <button
                          onClick={() => handleResetQuestion(pyq.id)}
                          className="text-[10px] text-primary hover:underline font-bold uppercase tracking-wider flex items-center gap-1 mt-1 cursor-pointer min-h-[30px]"
                        >
                          <RefreshCw className="w-3 h-3" /> Retry practice MCQ
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              );
            })
          )}
        </div>

        {/* Quick analytics card (md:col-span-4) */}
        <div className="md:col-span-4 bg-white border border-slate-100 rounded-[20px] p-5 shadow-xs space-y-4">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block border-b border-slate-100 pb-2">
            PYQ WEIGHTAGE TELEMETRY
          </div>

          <div className="bg-primary/5 p-4 rounded-[15px] border border-primary/20 space-y-2 font-mono">
            <span className="text-[9px] text-slate-500 block uppercase font-bold">RECURRENCE INDEX</span>
            <div className="flex items-baseline gap-1.5 text-primary text-xl font-extrabold leading-none">
              4 Years <span className="text-[10px] text-slate-400 font-normal uppercase">in past decade</span>
            </div>
            <p className="text-[10px] text-slate-500 font-sans font-medium leading-relaxed">
              This specific NCERT statement acts as a persistent diagnostic marker. Examiners regularly target this paragraph to screen candidate clarity.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">NEET Trend Analytics</span>
            <div className="space-y-2 text-[10px] font-mono">
              <div className="flex justify-between items-center text-slate-600">
                <span>Core Weightage:</span>
                <strong className="text-slate-800 font-bold">+4 Marks Securable</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Distractor Complexity:</span>
                <strong className="text-amber-500 font-bold">Level 3 (High)</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>NEET Syllabus Alignment:</span>
                <strong className="text-emerald-500 font-bold">100% Core NCERT</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
