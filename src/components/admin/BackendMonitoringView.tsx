import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Cpu,
  Database,
  HardDrive,
  Layers,
  Lock,
  RefreshCw,
  Server,
  ShieldAlert,
  Zap,
} from "lucide-react";
import {
  SystemMonitoringSnapshot,
  INITIAL_MONITORING_SNAPSHOT,
  API_DEBUG_ENDPOINTS,
} from "../../data/backendAdminEngineeringData";

export function BackendMonitoringView() {
  const [snapshot, setSnapshot] = useState<SystemMonitoringSnapshot>(INITIAL_MONITORING_SNAPSHOT);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);

  const handleRefreshMetrics = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSnapshot((prev) => ({
        ...prev,
        serverHost: {
          ...prev.serverHost,
          cpuUsagePercent: Number((24 + Math.random() * 8).toFixed(1)),
        },
        apiMetrics: {
          ...prev.apiMetrics,
          requestsPerSecond: Math.floor(170 + Math.random() * 40),
          p95LatencyMs: Math.floor(110 + Math.random() * 15),
        },
      }));
      setIsRefreshing(false);
      setAlertSuccess("Live metrics refreshed from Spring Boot Actuator & Prometheus.");
      setTimeout(() => setAlertSuccess(null), 3000);
    }, 800);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/40 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-cyan-600 text-slate-950 flex items-center gap-1 shadow-xs">
                <Lock className="w-3 h-3" />
                Backend Monitoring — Admin/Internal Only
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase bg-slate-800 text-cyan-300 border border-cyan-500/30">
                Frontend (Customer / Agent / Operator): ❌ Never Display
              </span>
            </div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Live Microservices Telemetry &amp; System Health Radar
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl">
              Spring Boot Actuator endpoints, PostgreSQL replication health, JVM heap memory, and p99 API latency distributions.
            </p>
          </div>

          <button
            onClick={handleRefreshMetrics}
            disabled={isRefreshing}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Polling Actuator..." : "Refresh Telemetry"}</span>
          </button>
        </div>

        {alertSuccess && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{alertSuccess}</span>
          </div>
        )}
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-slate-400 text-2xs uppercase font-bold">Spring Boot Service</span>
          <div className="text-xl font-black text-emerald-400 mt-1 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{snapshot.springBoot.status}</span>
          </div>
          <p className="text-3xs text-slate-500 font-mono mt-0.5">Uptime: {snapshot.springBoot.uptimeHours} hrs</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-slate-400 text-2xs uppercase font-bold">Host CPU Utilization</span>
          <div className="text-xl font-black text-white mt-1">
            {snapshot.serverHost.cpuUsagePercent}%
          </div>
          <p className="text-3xs text-slate-500 font-mono mt-0.5">8 vCPUs Dedicated</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-slate-400 text-2xs uppercase font-bold">JVM Heap Allocated</span>
          <div className="text-xl font-black text-indigo-400 mt-1">
            {(snapshot.springBoot.jvmHeapUsedMb / 1024).toFixed(1)} GB / {(snapshot.springBoot.jvmHeapMaxMb / 1024).toFixed(1)} GB
          </div>
          <p className="text-3xs text-slate-500 font-mono mt-0.5">GC Pause: {snapshot.springBoot.gcPauseTimeMs}ms</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-slate-400 text-2xs uppercase font-bold">API p95 Latency</span>
          <div className="text-xl font-black text-cyan-400 mt-1">
            {snapshot.apiMetrics.p95LatencyMs} ms
          </div>
          <p className="text-3xs text-slate-500 font-mono mt-0.5">Throughput: {snapshot.apiMetrics.requestsPerSecond} req/s</p>
        </div>
      </div>

      {/* Host Metrics & Hardware Load */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Compute &amp; Memory Allocation</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-2xs mb-1">
                <span className="text-slate-400">RAM Utilization</span>
                <span className="text-white font-mono">{snapshot.serverHost.ramUsedGb} GB / {snapshot.serverHost.ramTotalGb} GB</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full"
                  style={{ width: `${(snapshot.serverHost.ramUsedGb / snapshot.serverHost.ramTotalGb) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-2xs mb-1">
                <span className="text-slate-400">Disk Storage (NVMe SSD)</span>
                <span className="text-white font-mono">{snapshot.serverHost.diskUsedPercent}% used</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${snapshot.serverHost.diskUsedPercent}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-3xs font-mono text-slate-400 space-y-1">
              <div>Network RX: <strong className="text-slate-200">{snapshot.serverHost.networkRxMb} MB/s</strong></div>
              <div>Network TX: <strong className="text-slate-200">{snapshot.serverHost.networkTxMb} MB/s</strong></div>
            </div>
          </div>
        </div>

        {/* Integration Status Table */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Critical Integrations Live Health</h3>
            </div>
            <span className="text-3xs text-slate-400 font-mono">Real-time GDS &amp; Banking Switches</span>
          </div>

          <div className="space-y-2">
            {API_DEBUG_ENDPOINTS.map((api) => (
              <div
                key={api.id}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{api.name}</span>
                    <span className="text-3xs text-slate-400 font-mono">({api.provider})</span>
                  </div>
                  <div className="text-3xs text-slate-500 font-mono truncate max-w-sm">{api.endpoint}</div>
                </div>

                <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                  <span className="text-indigo-400">{api.latencyMs}ms</span>
                  <span
                    className={`px-2 py-0.5 rounded text-3xs font-extrabold uppercase ${
                      api.status === "HEALTHY"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    }`}
                  >
                    {api.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
