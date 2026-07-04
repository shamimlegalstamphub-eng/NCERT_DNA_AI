import { useState, useEffect } from "react";
import { 
  Database, Clock, Activity, RefreshCw, CheckCircle, 
  AlertTriangle, Server, ShieldAlert 
} from "lucide-react";

interface DBHealthData {
  connected: boolean;
  connectionState: number;
  host: string;
  name: string;
  latency: number;
  timestamp: string;
}

export default function DatabaseDiagnostic() {
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState<DBHealthData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<string>("");

  const fetchDBHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/db/health");
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json();
      if (data.status === "SUCCESS") {
        setHealth({
          connected: data.connected,
          connectionState: data.connectionState,
          host: data.host,
          name: data.name,
          latency: data.latency,
          timestamp: data.timestamp
        });
      } else {
        throw new Error(data.message || "Failed to retrieve database health.");
      }
    } catch (err: any) {
      console.error("Database diagnostic fetch failed:", err);
      setError(err.message || "Endpoint unresponsive or timed out.");
    } finally {
      setLoading(false);
      setLastChecked(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    fetchDBHealth();
  }, []);

  // Latency rating helper
  const getLatencyRating = (ms: number) => {
    if (ms < 15) return { label: "Excellent", color: "text-emerald-500 bg-emerald-50 border-emerald-200" };
    if (ms < 100) return { label: "Nominal", color: "text-amber-500 bg-amber-50 border-amber-200" };
    return { label: "Degraded", color: "text-rose-500 bg-rose-50 border-rose-200" };
  };

  const getStatusIndicator = (connected: boolean) => {
    if (connected) {
      return {
        label: "ONLINE (MONGODB ATLAS)",
        color: "text-emerald-600 bg-emerald-50/80 border-emerald-100",
        indicator: "bg-emerald-500 animate-pulse"
      };
    } else {
      return {
        label: "LOCAL SANDBOX FAILOVER",
        color: "text-amber-600 bg-amber-50/80 border-amber-100",
        indicator: "bg-amber-500 animate-bounce"
      };
    }
  };

  const getConnectionStateString = (state: number) => {
    switch (state) {
      case 0: return "Disconnected";
      case 1: return "Connected";
      case 2: return "Connecting";
      case 3: return "Disconnecting";
      default: return "Unknown";
    }
  };

  return (
    <div id="db-health-diagnostic-card" className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col space-y-4">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-poppins font-bold text-slate-900 uppercase tracking-tight">
              Database Core Diagnostic Matrix
            </h3>
            <p className="text-[9px] text-slate-400 font-mono">
              Live Mongo connection handshake & latency threshold analysis
            </p>
          </div>
        </div>

        <button
          onClick={fetchDBHealth}
          disabled={loading}
          className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[9px] font-mono font-bold uppercase disabled:opacity-50"
          title="Refresh database diagnostics"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin text-primary" : ""}`} />
          <span>{loading ? "Testing..." : "Test Node"}</span>
        </button>
      </div>

      {/* Diagnostics Body */}
      {loading && !health ? (
        <div className="flex flex-col items-center justify-center py-6 space-y-2">
          <RefreshCw className="w-5 h-5 text-primary animate-spin" />
          <span className="text-[10px] text-slate-400 font-mono">Pinging cloud database arrays...</span>
        </div>
      ) : error ? (
        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl space-y-1.5">
          <div className="flex items-center gap-1.5 text-rose-600 font-bold text-[10px] uppercase font-mono">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Operational Diagnostic Warning</span>
          </div>
          <p className="text-[10px] text-rose-500 font-mono leading-normal">
            Error: {error}
          </p>
          <button
            onClick={fetchDBHealth}
            className="text-[9px] font-bold text-rose-700 underline font-mono cursor-pointer"
          >
            Retry Diagnostics Handshake
          </button>
        </div>
      ) : health ? (
        <div className="space-y-4">
          {/* Main Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Status indicator */}
            {(() => {
              const status = getStatusIndicator(health.connected);
              return (
                <div className={`p-3 border rounded-xl flex items-center justify-between ${status.color}`}>
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-mono text-slate-400 font-bold uppercase block">CONNECTION STATUS</span>
                    <span className="text-[10.5px] font-bold uppercase font-mono tracking-tight">{status.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${status.indicator}`}></span>
                  </div>
                </div>
              );
            })()}

            {/* Latency Threshold indicator */}
            {(() => {
              const rating = getLatencyRating(health.latency);
              return (
                <div className={`p-3 border rounded-xl flex items-center justify-between ${rating.color}`}>
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-mono text-slate-400 font-bold uppercase block">RESPONSE LATENCY</span>
                    <span className="text-[10.5px] font-bold uppercase font-mono tracking-tight">{health.latency} ms ({rating.label})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 shrink-0" />
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Technical specifications */}
          <div className="grid grid-cols-2 gap-2 bg-slate-50/70 border border-slate-100/80 rounded-xl p-3 font-mono text-[9px]">
            <div className="space-y-1">
              <div>
                <span className="text-slate-400 font-bold">DATABASE CLUSTER:</span>
                <p className="text-slate-700 font-medium truncate" title={health.host}>{health.host}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold">ACTIVE DATABASE:</span>
                <p className="text-slate-700 font-medium">{health.name}</p>
              </div>
            </div>

            <div className="space-y-1 pl-2 border-l border-slate-200/60">
              <div>
                <span className="text-slate-400 font-bold">MONGO STATE:</span>
                <p className="text-slate-700 font-medium">
                  {health.connectionState} ({getConnectionStateString(health.connectionState)})
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-bold">OPERATIONAL MODE:</span>
                <p className={`font-bold uppercase ${health.connected ? "text-emerald-600" : "text-amber-600"}`}>
                  {health.connected ? "Durable Write-Pool" : "Sandbox JSON Failover"}
                </p>
              </div>
            </div>
          </div>

          {/* Diagnostic Latency thresholds legend */}
          <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[8px] font-mono text-slate-400">
            <span className="flex items-center gap-1 font-bold">
              <Activity className="w-3 h-3 text-primary" />
              Latency Threshold Rules:
            </span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                &lt;15ms (Excellent)
              </span>
              <span className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                15-100ms (Good)
              </span>
              <span className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                &gt;100ms (Degraded)
              </span>
            </div>
          </div>

          <div className="text-[8px] text-slate-400 font-mono text-right">
            Last diagnostic run: {lastChecked}
          </div>
        </div>
      ) : null}
    </div>
  );
}
