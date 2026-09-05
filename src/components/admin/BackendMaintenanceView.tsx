import React, { useState } from "react";
import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Database,
  RefreshCw,
  Server,
  Archive,
  RotateCcw,
  Clock,
  Shield,
  Zap,
  Power,
  Sliders,
  HardDrive,
} from "lucide-react";
import {
  MaintenanceActionHistory,
  INITIAL_MAINTENANCE_HISTORY,
} from "../../data/backendAdminEngineeringData";

export function BackendMaintenanceView() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceHistory, setMaintenanceHistory] = useState<MaintenanceActionHistory[]>(
    INITIAL_MAINTENANCE_HISTORY
  );
  const [activeActionMsg, setActiveActionMsg] = useState<string | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState<string | null>(null);

  // Scheduled Maintenance States
  const [scheduledWindow, setScheduledWindow] = useState({
    date: "2026-09-12",
    timeStart: "02:00 UTC",
    timeEnd: "03:30 UTC",
    scope: "PostgreSQL Major Kernel Patch & GDS Circuit Breaker Upgrade",
    autoBanner: true,
  });

  const handleToggleMaintenanceMode = () => {
    const nextState = !maintenanceMode;
    setMaintenanceMode(nextState);
    const newHistoryItem: MaintenanceActionHistory = {
      id: `maint-${Math.floor(100 + Math.random() * 900)}`,
      action: nextState ? "Maintenance Mode ACTIVATED (System Lock)" : "Maintenance Mode DEACTIVATED (Traffic Restored)",
      initiatedBy: "Admin: Super Admin Session",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
      durationSec: 1,
      status: "COMPLETED",
      details: nextState
        ? "Public APIs routed to 503 Maintenance Page. Admin whitelist bypass active."
        : "Public ingress enabled across all customer and partner endpoints.",
    };
    setMaintenanceHistory([newHistoryItem, ...maintenanceHistory]);
    setActiveActionMsg(nextState ? "Platform Maintenance Mode is now ACTIVE." : "Platform Maintenance Mode DEACTIVATED.");
    setTimeout(() => setActiveActionMsg(null), 4000);
  };

  const handleTriggerAction = (actionKey: string, actionName: string, details: string) => {
    setIsProcessingAction(actionKey);
    setTimeout(() => {
      const newHistoryItem: MaintenanceActionHistory = {
        id: `maint-${Math.floor(100 + Math.random() * 900)}`,
        action: actionName,
        initiatedBy: "Admin: Super Admin",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
        durationSec: Math.floor(5 + Math.random() * 25),
        status: "COMPLETED",
        details,
      };
      setMaintenanceHistory([newHistoryItem, ...maintenanceHistory]);
      setIsProcessingAction(null);
      setActiveActionMsg(`${actionName} completed successfully.`);
      setTimeout(() => setActiveActionMsg(null), 3500);
    }, 1500);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/40 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-amber-600 text-slate-950 flex items-center gap-1 shadow-xs">
                <Lock className="w-3 h-3" />
                Backend Maintenance — Admin Only
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase bg-slate-800 text-amber-300 border border-amber-500/30">
                Services &bull; Database &bull; Cache &bull; Backup &bull; Recovery
              </span>
            </div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-400" />
              Platform Maintenance &amp; Disaster Recovery Control
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl">
              Zero-downtime rolling worker deployment, PostgreSQL hot backups, Redis cache invalidation, and emergency maintenance traffic gate.
            </p>
          </div>

          {/* Maintenance Mode Emergency Switch */}
          <div className="flex items-center gap-3 bg-slate-950/90 p-3 rounded-2xl border border-slate-800 shrink-0">
            <div className="text-right">
              <div className="text-xs font-black text-white">Platform Maintenance Gate</div>
              <div className={`text-3xs font-bold ${maintenanceMode ? "text-rose-400 animate-pulse" : "text-emerald-400"}`}>
                {maintenanceMode ? "ACTIVE (503 Page Live)" : "NORMAL (Public Live)"}
              </div>
            </div>
            <button
              onClick={handleToggleMaintenanceMode}
              className={`p-2.5 rounded-xl border transition-all shadow-md flex items-center gap-1.5 font-bold text-xs ${
                maintenanceMode
                  ? "bg-rose-600 text-white border-rose-400 shadow-rose-600/40"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{maintenanceMode ? "Turn OFF" : "Turn ON"}</span>
            </button>
          </div>
        </div>

        {activeActionMsg && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{activeActionMsg}</span>
          </div>
        )}
      </div>

      {/* 4 Interactive Maintenance Control Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Panel 1: Database Operations */}
        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">PostgreSQL Database Maintenance</h3>
            </div>
            <span className="text-3xs font-mono text-emerald-400">Primary: 42 connections</span>
          </div>

          <p className="text-xs text-slate-400">
            Vacuum dead tuples, rebuild B-Tree indices on booking tables, and generate encrypted snapshots to redundant cold storage.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={() =>
                handleTriggerAction(
                  "vacuum",
                  "PostgreSQL VACUUM FULL & REINDEX",
                  "Reclaimed 1.8 GB dead row storage across booking_events and tickets tables."
                )
              }
              disabled={isProcessingAction === "vacuum"}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isProcessingAction === "vacuum" ? "animate-spin" : ""}`} />
              <span>{isProcessingAction === "vacuum" ? "Vacuuming..." : "Run VACUUM ANALYZE"}</span>
            </button>

            <button
              onClick={() =>
                handleTriggerAction(
                  "backup",
                  "Database Snapshot pg_dump Encrypted Backup",
                  "Encrypted backup snapshot pg_dump_2026_09_05_hot.sql.gz uploaded to cold vault."
                )
              }
              disabled={isProcessingAction === "backup"}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <HardDrive className={`w-3.5 h-3.5 ${isProcessingAction === "backup" ? "animate-spin" : ""}`} />
              <span>{isProcessingAction === "backup" ? "Backing up..." : "Create Hot Backup"}</span>
            </button>
          </div>
        </div>

        {/* Panel 2: Cache & Memory Management */}
        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Redis Cluster Cache &amp; Sessions</h3>
            </div>
            <span className="text-3xs font-mono text-amber-400">Memory: 4.8 GB / 8.0 GB</span>
          </div>

          <p className="text-xs text-slate-400">
            Flush stale GDS fare quotes, invalidate outdated hotel rates, and refresh distributed locks across the microservices mesh.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={() =>
                handleTriggerAction(
                  "redis_flush",
                  "Redis Search Cache Selective Purge",
                  "Purged 58,000 flight and train price search cache keys. TTL reset to 15 mins."
                )
              }
              disabled={isProcessingAction === "redis_flush"}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isProcessingAction === "redis_flush" ? "animate-spin" : ""}`} />
              <span>{isProcessingAction === "redis_flush" ? "Flushing..." : "Purge Fare Cache"}</span>
            </button>

            <button
              onClick={() =>
                handleTriggerAction(
                  "restart_pods",
                  "Kubernetes Rolling Worker Restart",
                  "Triggered rolling restart for 6 worker pods. Zero request drops recorded."
                )
              }
              disabled={isProcessingAction === "restart_pods"}
              className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isProcessingAction === "restart_pods" ? "animate-spin" : ""}`} />
              <span>{isProcessingAction === "restart_pods" ? "Restarting..." : "Rolling Restart Pods"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scheduled Maintenance Window */}
      <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Scheduled Maintenance Window &amp; User Notice Banner</h3>
          </div>
          <span className="text-3xs font-mono text-indigo-400">Next Planned Window: {scheduledWindow.date}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 text-3xs uppercase font-bold">Planned Window</span>
            <div className="font-bold text-white text-sm mt-0.5">{scheduledWindow.date}</div>
            <div className="text-2xs text-slate-400 font-mono">{scheduledWindow.timeStart} - {scheduledWindow.timeEnd}</div>
          </div>

          <div className="sm:col-span-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-3xs uppercase font-bold">Maintenance Scope</span>
            <div className="font-medium text-slate-200 text-xs">{scheduledWindow.scope}</div>
            <div className="text-3xs text-emerald-400 font-mono">Auto customer banner trigger: ACTIVE 24h prior</div>
          </div>
        </div>
      </div>

      {/* Maintenance Action History Log */}
      <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Archive className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-white">Maintenance Action History &amp; Audit Trail</h3>
          </div>
          <span className="text-3xs text-slate-500 font-mono">Immutable Audit Log</span>
        </div>

        <div className="space-y-2">
          {maintenanceHistory.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">{item.action}</span>
                  <span className="px-2 py-0.5 rounded text-3xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {item.status}
                  </span>
                </div>
                <p className="text-2xs text-slate-400">{item.details}</p>
              </div>

              <div className="text-right text-3xs font-mono text-slate-400 shrink-0">
                <div>{item.initiatedBy}</div>
                <div className="text-slate-500">{item.timestamp} ({item.durationSec}s)</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
