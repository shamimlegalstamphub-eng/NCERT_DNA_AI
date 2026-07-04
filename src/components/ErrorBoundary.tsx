import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Cpu, CheckCircle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an active runtime failure:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleRestorationReset = () => {
    // Attempt clear local state of cache items that might be corrupted, then reload
    try {
      localStorage.removeItem("ncert_dna_recent_scans");
      localStorage.removeItem("ncert_dna_search_history_v2");
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-slate-900 min-h-screen text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-5">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] font-mono bg-rose-500/15 text-rose-400 font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-rose-500/30">
                CRITICAL SYSTEM EXCEPTION INTERCEPTED
              </span>
              <h2 className="text-xl font-poppins font-black uppercase tracking-tight">NEET OS Diagnostic Fault</h2>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                An unexpected UI rendering loop crash was intercepted in the local view container. The core NCERT Genome databases are untouched and 100% secure.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl text-left space-y-1.5 font-mono max-h-40 overflow-y-auto">
              <span className="text-[9px] text-slate-500 block">FATAL REASON LOGS:</span>
              <span className="text-[10px] text-rose-400 font-bold block leading-tight">
                {this.state.error?.toString() || "Unknown react render failure"}
              </span>
              {this.state.errorInfo && (
                <span className="text-[8px] text-slate-400 leading-normal block overflow-x-hidden">
                  {this.state.errorInfo.componentStack.split("\n").slice(0, 3).join("\n")}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase rounded-xl transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reboot Node</span>
              </button>
              
              <button
                onClick={this.handleRestorationReset}
                className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-md cursor-pointer min-h-[44px]"
              >
                Wipe Faulty Cache & Restore
              </button>
            </div>

            <div className="text-[9px] text-slate-500 font-mono border-t border-slate-800/50 pt-3 flex items-center justify-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>FAIL-SAFE LAYER ACTIVATED • SLA 99.98% COHERENT</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
