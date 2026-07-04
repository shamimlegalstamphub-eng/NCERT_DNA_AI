import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CreditCard, Check, Sparkles, AlertCircle, ShieldCheck, 
  HelpCircle, ChevronRight, Zap, Award, Crown, FileSpreadsheet, 
  TrendingUp, Download, CheckCircle 
} from "lucide-react";

export default function SubscriptionBilling() {
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro" | "premium">("pro");
  const [isYearly, setIsYearly] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cvv, setCvv] = useState("321");
  const [paymentDone, setPaymentDone] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const plans = [
    {
      id: "free",
      name: "Standard Access",
      desc: "Essentials for daily NCERT bio-coordinate tracing.",
      priceMonthly: 0,
      priceYearly: 0,
      icon: Zap,
      color: "border-slate-100 bg-white hover:border-slate-200",
      iconColor: "text-slate-500",
      btnClass: "bg-slate-100 hover:bg-slate-200 text-slate-800",
      features: [
        "15 daily NCERT line scans",
        "Standard cognitive analytics",
        "Public study channel access",
        "Base predictive MCQs (15/day)"
      ]
    },
    {
      id: "pro",
      name: "NEET Pro Scholar",
      desc: "Our most popular setup for serious AI feedback.",
      priceMonthly: 9,
      priceYearly: 79,
      icon: Award,
      color: "border-indigo-200 bg-indigo-50/10 hover:border-indigo-300 ring-2 ring-indigo-500/20",
      iconColor: "text-indigo-600",
      btnClass: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-200",
      badge: "RECOMMENDED",
      features: [
        "Unlimited Advanced Lens OCR Scans",
        "Dynamic cognitive decay map",
        "All expected PYQ predictor modes",
        "Cross-device mobile state sync",
        "Daily revision assistant mentor"
      ]
    },
    {
      id: "premium",
      name: "A.I. Rank Booster",
      desc: "For candidates aiming for top tier AIIMS medical rank.",
      priceMonthly: 19,
      priceYearly: 169,
      icon: Crown,
      color: "border-amber-200 bg-amber-50/10 hover:border-amber-300 ring-2 ring-amber-500/20",
      iconColor: "text-amber-500",
      badge: "ELITE ACCESS",
      btnClass: "bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-200",
      features: [
        "Priority dedicated AI model inference",
        "Voice textbook reading assistant",
        "Custom revision scheduler calendar",
        "Direct export of analytical study logs",
        "Full enterprise grade safety vault"
      ]
    }
  ];

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPayment(true);
    setTimeout(() => {
      setLoadingPayment(false);
      setPaymentDone(true);
      setTimeout(() => {
        setShowCheckoutModal(false);
        setPaymentDone(false);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl md:rounded-[20px] p-4 md:p-6 shadow-xs space-y-6">
      
      {/* Header section */}
      <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] bg-amber-50 border border-amber-100 text-amber-700 font-mono font-bold px-2 py-0.5 rounded-full uppercase">
            Ecosystem Node: Step 3
          </span>
          <h3 className="text-base font-poppins font-black text-slate-900 uppercase mt-1">
            Subscription Plan & Billing Center
          </h3>
          <p className="text-[10px] text-slate-400 font-mono">
            Toggle membership plans, simulate secure stripe checkout transitions, and export premium reports.
          </p>
        </div>

        {/* Billing cycle switch */}
        <div className="flex bg-slate-100 p-1 rounded-xl items-center gap-1 border border-slate-200/50">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-3 py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg transition-all ${
              !isYearly ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-3 py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg transition-all flex items-center gap-1 ${
              isYearly ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Yearly
            <span className="bg-rose-150 text-[8px] text-rose-600 px-1 py-0.2 rounded font-black">SAVE 15%</span>
          </button>
        </div>
      </div>

      {/* Grid of Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((p) => {
          const Icon = p.icon;
          const currentPrice = isYearly ? p.priceYearly : p.priceMonthly;
          return (
            <div
              key={p.id}
              className={`border rounded-[20px] p-5 flex flex-col justify-between space-y-5 transition-all relative overflow-hidden ${p.color}`}
            >
              {p.badge && (
                <div className="absolute top-3 right-3 bg-slate-900 text-white text-[7.5px] font-mono font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
                  {p.badge}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className={`p-2 bg-slate-100/60 rounded-xl ${p.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="text-xs font-poppins font-black text-slate-900 uppercase leading-none">{p.name}</h4>
                    <span className="text-[9px] text-slate-400 leading-none">{p.desc}</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-1">
                  <strong className="text-2xl font-black text-slate-900 font-mono">${currentPrice}</strong>
                  <span className="text-[10px] text-slate-400 font-mono">/{isYearly ? "year" : "mo"}</span>
                </div>

                <div className="border-t border-slate-100/60 pt-4 space-y-2.5">
                  {p.features.map((f, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[10.5px]">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-slate-600 font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedPlan(p.id as any);
                  setShowCheckoutModal(true);
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer min-h-[38px] ${p.btnClass}`}
              >
                {p.priceMonthly === 0 ? "Enjoy Free" : `Upgrade to ${p.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Premium exports & telemetry */}
      <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <strong className="text-xs text-slate-800 font-bold uppercase font-mono block">Premium analytical study log</strong>
          <p className="text-[10px] text-slate-500 leading-normal">
            Download syllabus coverage index, error reports, and critical metrics formatted for offline teacher diagnostics.
          </p>
        </div>

        <button
          onClick={() => alert("Generating XLSX study spreadsheet. Download initialized.")}
          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-mono font-bold rounded-lg flex items-center gap-1.5 cursor-pointer uppercase transition-colors"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" /> Export XLSX Log
        </button>
      </div>

      {/* Checkout Modal Dialog simulation */}
      <AnimatePresence>
        {showCheckoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-55 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white text-slate-800 rounded-[24px] border border-slate-100 shadow-2xl p-6 max-w-md w-full relative space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-xs font-poppins font-black text-slate-900 uppercase">
                    Stripe Secure checkout gateway
                  </h3>
                </div>
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="text-xs font-mono text-slate-400 hover:text-slate-600 uppercase"
                >
                  Close
                </button>
              </div>

              {paymentDone ? (
                <div className="text-center py-6 space-y-2">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-6 h-6 animate-bounce" />
                  </div>
                  <strong className="text-sm font-bold text-slate-800 block uppercase font-mono">Payment Successful!</strong>
                  <p className="text-xs text-slate-400">Your student memory credentials have been updated instantly.</p>
                </div>
              ) : (
                <form onSubmit={handleSimulatePayment} className="space-y-4">
                  <div className="bg-indigo-50/50 p-3 rounded-xl space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase font-mono">Selected Membership Tier:</span>
                    <strong className="text-xs text-indigo-900 uppercase font-black block">
                      {plans.find(p => p.id === selectedPlan)?.name} ({(isYearly ? "Annual" : "Monthly")})
                    </strong>
                  </div>

                  <div className="space-y-3 text-[10px]">
                    <div>
                      <label className="block text-slate-500 mb-1 font-bold uppercase font-mono">16-Digit Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-500 mb-1 font-bold uppercase font-mono">Expiration Date</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-800 text-xs focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-1 font-bold uppercase font-mono">CVV / CV2</label>
                        <input
                          type="password"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-800 text-xs focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loadingPayment}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[40px] disabled:opacity-50"
                  >
                    {loadingPayment ? "Processing via Stripe API..." : "Authorize Subscription"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
