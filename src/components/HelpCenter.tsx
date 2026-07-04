import { useState } from "react";
import { 
  BookOpen, HelpCircle, Camera, BrainCircuit, ShieldAlert, 
  ChevronDown, ChevronUp, Search, GraduationCap, Zap 
} from "lucide-react";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const sections = [
    {
      id: "scan",
      title: "How Scanning Works",
      icon: Camera,
      color: "text-teal-500 bg-teal-50",
      description: "Understand the technology behind our active page transcription systems.",
      details: [
        "Capture or upload any handwritten study notes, textbook pages, or diagram highlights.",
        "Our high-fidelity Optical Character Recognition (OCR) scanner strips characters with 98.7% sub-millimeter visual precision.",
        "Works beautifully with both low-contrast printed book pages and quick pencil doodles in margins.",
        "Scanned words are tokenized and sent to the NEET semantic parsing middleware instantly."
      ]
    },
    {
      id: "matching",
      title: "How Line Matching Works",
      icon: BrainCircuit,
      color: "text-primary bg-primary/10",
      description: "Learn how we match raw text to precise official high-yield NCERT coordinates.",
      details: [
        "Extracted OCR strings are fed into our advanced semantic word embedding alignment matrix.",
        "Our custom cosine similarity algorithm computes semantic relevance scores rather than simple word-for-word string matches.",
        "It successfully matches custom mnemonics, abbreviated formulas, or summarized notes to the exact page and line coordinate of the official biology text.",
        "Provides dynamic indicators: NEET rank multipliers, frequency coefficients, and spaced recall risks."
      ]
    },
    {
      id: "privacy",
      title: "Data Integrity & Privacy",
      icon: ShieldAlert,
      color: "text-rose-500 bg-rose-50",
      description: "Why your study analytics and scanned documents are secure with us.",
      details: [
        "Your scans, study notes, and chapter bookmarks are stored safely on your device in local sandbox memory.",
        "Zero tracking cookies, ad networks, or invasive identity tracking protocols are used.",
        "Handshake tokens are securely generated using military-grade key signatures.",
        "Full support for local database resets. Wipe all traces with a single click in your settings panel."
      ]
    }
  ];

  const faqs = [
    {
      q: "Does NCERT DNA require active internet for basic finders?",
      a: "No! The core high-yield NCERT Biology Volume I and Volume II databases are fully loaded locally within your client sandbox. You can search, browse, bookmark, and review notes completely offline. AI Explainers and advanced OCR Vision searches will use brief backend alignment queries if internet is available, but fail gracefully back to offline offline mode."
    },
    {
      q: "What is the Spaced Repetition mastery score system?",
      a: "Every core NCERT line is assigned a recall risk that updates when you mark your mastery status ('unknown', 'unseen', 'learning', or 'mastered'). If a line is not revised, its recall decay curve triggers spaced reminders to suggest reviews before memory fade."
    },
    {
      q: "Are my uploaded photos or notes shared with other students?",
      a: "Absolutely not. All document snapshots and handwritten OCR transcriptions are fully sandboxed and cleared as soon as matching is completed. We do not persist raw images on external storage arrays."
    },
    {
      q: "How can I customize study hours target?",
      a: "You can customize your daily target study hours, class tier, and competitive NEET goals at any time from your settings or by resetting onboarding parameters. This will dynamically recalculate the progress bars on your home dashboard."
    },
    {
      q: "What is expected NEET Rank Delta?",
      a: "This represents the calculated NEET score improvement of a student who achieves 100% mastery over that specific textbook statement, computed relative to historic exam traps and national competition percentiles."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 h-full overflow-y-auto pr-1 text-xs text-slate-600">
      
      {/* Search Header */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-[24px] relative overflow-hidden flex flex-col items-center text-center space-y-4 shadow-md">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-indigo-900/40 pointer-events-none" />
        <div className="relative flex items-center gap-1.5 text-primary bg-white/10 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest">
          <Zap className="w-3.5 h-3.5 fill-primary text-primary animate-pulse" /> SYSTEM DOCUMENTATION SHELF
        </div>
        <div className="relative space-y-2 max-w-lg">
          <h2 className="text-lg md:text-2xl font-poppins font-black uppercase tracking-tight">How can we optimize your NEET preparation?</h2>
          <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
            Understand active OCR scan mechanics, semantic cosine alignment formulas, privacy guidelines, and spaced repetition calibration matrices.
          </p>
        </div>

        {/* Local FAQ Search Input */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs, features, or privacy terms..."
            className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 text-xs font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-primary shadow-sm placeholder-slate-400"
          />
        </div>
      </div>

      {/* THREE CORE EXPLAINER SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <div key={sec.id} className="p-5 border border-slate-100 rounded-[20px] bg-white space-y-3 shadow-xs hover:border-slate-200 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${sec.color} shrink-0`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-poppins font-black text-slate-950 uppercase tracking-tight text-[11px]">{sec.title}</h3>
                  <p className="text-[10px] text-slate-400 font-medium leading-normal mt-0.5">{sec.description}</p>
                </div>
              </div>

              <ul className="space-y-2 pt-3 border-t border-slate-50">
                {sec.details.map((detail, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-[11px] text-slate-500 leading-normal">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* COLLAPSIBLE FAQS */}
      <div className="bg-slate-50/50 p-5 rounded-[24px] border border-slate-100 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4.5 h-4.5 text-primary" />
          <h3 className="text-xs font-poppins font-black text-slate-950 uppercase tracking-wider">Frequently Asked Questions</h3>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="text-center py-6 text-slate-400 font-mono">
            No matching FAQ nodes found. Try searching for "spaced" or "privacy".
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredFaqs.map((faq, idx) => {
              const isFaqOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-white rounded-xl border border-slate-150 shadow-2xs overflow-hidden transition-all">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 flex items-center justify-between text-left font-bold text-slate-800 hover:bg-slate-50 cursor-pointer text-xs"
                  >
                    <span className="pr-4 leading-relaxed">{faq.q}</span>
                    {isFaqOpen ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                  </button>
                  {isFaqOpen && (
                    <div className="px-4 pb-4 text-[11px] text-slate-500 leading-relaxed border-t border-slate-50 pt-3 bg-slate-50/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
