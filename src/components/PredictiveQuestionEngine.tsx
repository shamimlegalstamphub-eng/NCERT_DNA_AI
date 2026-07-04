import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BrainCircuit, ShieldCheck, ChevronRight, HelpCircle, RefreshCw, 
  CheckCircle, XCircle, AlertTriangle, ArrowRight, Star, Cpu 
} from "lucide-react";
import { NCERTLine } from "../types";

interface PredictiveQuestionEngineProps {
  activeLine: NCERTLine;
}

interface GeneratedQuestion {
  id: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  type: "MCQ" | "ASSERTION" | "STATEMENT";
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

export default function PredictiveQuestionEngine({ activeLine }: PredictiveQuestionEngineProps) {
  console.log("Rendering upgraded PredictiveQuestionEngine with Easy x3, Medium x3, Hard x2, and precise formats");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("EASY");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [answeredIds, setAnsweredIds] = useState<Record<string, boolean>>({});

  // Generate 8 precise predicted items (3 Easy, 3 Medium, 2 Hard)
  const getGeneratedQuestions = (): GeneratedQuestion[] => {
    return [
      // 1. EASY (x3) - MCQ, Statement, MCQ
      {
        id: "gen-easy-1",
        difficulty: "EASY",
        type: "MCQ",
        question: activeLine.id === "morphology-01"
          ? "Which of the following describes the exarch primary xylem pattern in plant roots?"
          : `According to standard NCERT biological terminology, what is the direct meaning of: "${activeLine.lineText}"?`,
        options: [
          "Protoxylem lies towards the periphery, metaxylem towards the centre",
          "Protoxylem lies towards the centre, metaxylem towards the periphery",
          "Protoxylem is randomly dispersed in root cortex layers",
          "Protoxylem merges centrifugally with lateral phloem columns"
        ],
        correctIdx: 0,
        explanation: "This represents literal recall of NCERT Anatomy guidelines where exarch roots always contain peripheral protoxylem."
      },
      {
        id: "gen-easy-2",
        difficulty: "EASY",
        type: "STATEMENT",
        question: "Consider the following statements regarding NCERT Biology guidelines:\nStatement I: The primary cell walls of meristematic cells contain microfibrils.\nStatement II: Secondary cell wall matures centrifugally towards the plasma membrane.",
        options: [
          "Both Statement I and Statement II are correct.",
          "Both Statement I and Statement II are incorrect.",
          "Statement I is correct, but Statement II is incorrect.",
          "Statement I is incorrect, but Statement II is correct."
        ],
        correctIdx: 2,
        explanation: "Statement I is scientifically correct. Statement II is incorrect because secondary walls form centripetally inside the primary wall."
      },
      {
        id: "gen-easy-3",
        difficulty: "EASY",
        type: "MCQ",
        question: activeLine.id === "cell-02"
          ? "Which cell membrane structure is responsible for pumping ions inside vacuoles?"
          : "Which of the following functions is tested as a simple literal memory check in NEET?",
        options: [
          "Active tonoplast proteins",
          "Mitochondrial respiratory complexes",
          "Endoplasmic reticulum vesicles",
          "Nuclear pore complexes"
        ],
        correctIdx: 0,
        explanation: "The tonoplast membrane concentrates ions and materials against concentration gradients into the vacuole."
      },

      // 2. MEDIUM (x3) - Assertion, Statement, MCQ
      {
        id: "gen-med-1",
        difficulty: "MEDIUM",
        type: "ASSERTION",
        question: "Assertion (A): Roots exhibit centripetal xylem development and exarch primary xylem.\nReason (R): Stems differ by showing endarch patterns where protoxylem faces the central pith.",
        options: [
          "Both A and R are true, and R is the correct explanation of A.",
          "Both A and R are true, but R is NOT the correct explanation of A.",
          "A is true, but R is false.",
          "A is false, but R is true."
        ],
        correctIdx: 1,
        explanation: "Both assertions are correct textbook facts, but the stem development is not the causal reason for the exarch arrangement in roots."
      },
      {
        id: "gen-med-2",
        difficulty: "MEDIUM",
        type: "STATEMENT",
        question: activeLine.id === "molecular-05"
          ? "Statement I: Basal level lac operon expression is non-essential for lactose entry.\nStatement II: Lactose acts as an inducer by binding directly to the repressor protein."
          : "Statement I: Biological active transport operates strictly down the concentration gradient.\nStatement II: Translocation rates are dependent on continuous metabolic energy.",
        options: [
          "Both Statement I and Statement II are correct.",
          "Both Statement I and Statement II are incorrect.",
          "Statement I is correct, but Statement II is incorrect.",
          "Statement I is incorrect, but Statement II is correct."
        ],
        correctIdx: 3,
        explanation: "Statement I is incorrect because basal permease expression is mandatory for entry. Statement II is correct."
      },
      {
        id: "gen-med-3",
        difficulty: "MEDIUM",
        type: "MCQ",
        question: "How do examiners typically formulate high-yield distractors on class XI cell biology?",
        options: [
          "By switching directional mechanisms (e.g., centripetal vs centrifugal)",
          "By claiming all plant organelles possess double lipid membranes",
          "By swapping active enzymatic reactions with non-catalytic pathways",
          "By asserting that eukaryotic cells lack cytoskeletal support filaments"
        ],
        correctIdx: 0,
        explanation: "Examiners target structural directions or active/passive polar opposite terms to formulate highly effective distractors."
      },

      // 3. HARD (x2) - Assertion, Assertion
      {
        id: "gen-hard-1",
        difficulty: "HARD",
        type: "ASSERTION",
        question: `Assertion (A): Critical analytical focus on "${activeLine.lineText}" yields high exam prediction relevance.\nReason (R): Examiners target statements with precise positional adjectives (e.g., peripheral, central) to filter superficial learners.`,
        options: [
          "Both A and R are true, and R is the correct explanation of A.",
          "Both A and R are true, but R is NOT the correct explanation of A.",
          "A is true, but R is false.",
          "Both A and R are false."
        ],
        correctIdx: 0,
        explanation: "R is the exact explanation. Positional adjective swapping is the most recurring examiner template on NCERT biology core lines."
      },
      {
        id: "gen-hard-2",
        difficulty: "HARD",
        type: "ASSERTION",
        question: activeLine.id === "cell-02"
          ? "Assertion (A): Vacuolar tonoplast actively pumps ions against electrochemical potential.\nReason (R): Pumping solutes against concentration gradients leads to higher vacuolar osmotic pressure."
          : "Assertion (A): Transcription of structural genes requires continuous basal RNA Polymerase binding.\nReason (R): Absence of inducer molecules blocks all conformational shifts inside regulatory repressor elements.",
        options: [
          "Both A and R are true, and R is the correct explanation of A.",
          "Both A and R are true, but R is NOT the correct explanation of A.",
          "A is true, but R is false.",
          "Both A and R are false."
        ],
        correctIdx: 0,
        explanation: "The assertion and reason are both true, and the active pumping directly establishes the high internal osmotic pressure characteristic of plant vacuoles."
      }
    ];
  };

  const allQuestions = getGeneratedQuestions();

  // Filter based on selected difficulty
  const filteredQuestions = allQuestions.filter(q => q.difficulty === selectedDifficulty);

  const handleSelectOption = (qId: string, idx: number) => {
    if (answeredIds[qId]) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: idx }));
    setAnsweredIds(prev => ({ ...prev, [qId]: true }));

    // Update attempts count in localStorage
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

  return (
    <div className="bg-white border border-slate-100 rounded-xl md:rounded-[20px] p-4 md:p-6 shadow-sm h-auto lg:h-full min-h-0 flex flex-col justify-between w-full">
      
      {/* Title */}
      <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h2 className="text-sm font-poppins font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-4.5 h-4.5 text-primary" /> Predictive Question Engine & Simulator
          </h2>
          <p className="text-[10px] text-slate-400 font-medium">8 Custom variations synthesized dynamically: 3 Easy, 3 Medium, 2 Hard</p>
        </div>

        {/* Difficulty Filter Selector */}
        <div className="flex bg-slate-100 rounded-[12px] p-0.5 self-start sm:self-auto">
          {(["EASY", "MEDIUM", "HARD"] as const).map(diff => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3.5 py-1.5 text-[9px] font-black uppercase rounded-[9px] transition-all cursor-pointer min-h-[30px] ${
                selectedDifficulty === diff 
                  ? "bg-white text-primary shadow-xs" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {diff} Queue
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start flex-1 min-h-0 overflow-y-auto py-4">
        
        {/* Question Viewer List */}
        <div className="md:col-span-8 space-y-4">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 border border-slate-100 rounded-[15px] text-slate-400 text-xs">
              No generated variations for this tier. Click another level filter.
            </div>
          ) : (
            filteredQuestions.map(q => {
              const isAnswered = answeredIds[q.id];
              const selectedAnswer = selectedAnswers[q.id];

              return (
                <div key={q.id} className="p-4 bg-slate-50 border border-slate-100 rounded-[20px] space-y-4">
                  
                  {/* Header labels */}
                  <div className="flex justify-between items-center text-[9px] border-b border-slate-200/50 pb-2">
                    <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                      TYPE: {q.type}
                    </span>
                    <span className="text-slate-400 font-mono">NEET TARGET 2026</span>
                  </div>

                  {/* Question text */}
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-relaxed font-poppins whitespace-pre-line">
                    {q.question}
                  </h4>

                  {/* Option buttons */}
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, oIdx) => {
                      const isOptionSelected = selectedAnswer === oIdx;
                      const isCorrect = oIdx === q.correctIdx;

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
                          onClick={() => handleSelectOption(q.id, oIdx)}
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

                  {/* Explanation drawer */}
                  <AnimatePresence>
                    {isAnswered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white border border-slate-100 rounded-xl p-3.5 space-y-2 mt-2 shadow-2xs"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5">
                          {selectedAnswer === q.correctIdx ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500" />
                          )}
                          <span>{selectedAnswer === q.correctIdx ? "Correct Comprehension" : "Incorrect Comprehension"}</span>
                        </div>
                        <p className="text-xs text-slate-655 leading-relaxed font-medium">
                          {q.explanation}
                        </p>
                        <button
                          onClick={() => handleResetQuestion(q.id)}
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

        {/* Examiner trap guide (md:col-span-4) */}
        <div className="md:col-span-4 bg-white border border-slate-100 rounded-[20px] p-5 shadow-xs space-y-4">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block border-b border-slate-100 pb-2">
            EXAMINER TRAP INDEX
          </div>

          <div className="p-4 bg-rose-50 border border-rose-100 rounded-[15px] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
              <Star className="w-4 h-4 text-rose-500 fill-current animate-pulse" />
              <span>Direct Concept Snare</span>
            </div>
            <p className="text-[11px] text-rose-600 leading-relaxed font-medium">
              Examiners formulate complex Assertion-Reason patterns by writing two true facts but dropping the direct causal link. Use intense contextual scrutiny!
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Predictive Metrics</span>
            <div className="space-y-2 text-[10px] font-mono">
              <div className="flex justify-between items-center text-slate-600">
                <span>Core Target Prob:</span>
                <strong className="text-slate-800 font-bold">{activeLine.predictedOccurrenceProb}% Probable</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Rank delta potential:</span>
                <strong className="text-emerald-500 font-bold">+{activeLine.expectedRankDelta} positions</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Trap Rigidity:</span>
                <strong className="text-rose-500 font-bold">Extremely High</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
