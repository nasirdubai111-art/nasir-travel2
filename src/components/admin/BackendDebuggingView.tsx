import React, { useState } from "react";
import {
  AlertTriangle,
  Bug,
  CheckCircle2,
  Clock,
  Code,
  Copy,
  Database,
  ExternalLink,
  Eye,
  Filter,
  Layers,
  Lock,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Server,
  Shield,
  ShieldAlert,
  Terminal,
  UserCheck,
  Zap,
} from "lucide-react";
import {
  BackendErrorLog,
  BackendIssue,
  INITIAL_BACKEND_ERROR_LOGS,
  INITIAL_BACKEND_ISSUES,
  API_DEBUG_ENDPOINTS,
  DATABASE_DEBUG_METRICS,
} from "../../data/backendAdminEngineeringData";

export function BackendDebuggingView() {
  const [activeSubTab, setActiveSubTab] = useState<
    "error_logs" | "debug_console" | "api_debug" | "db_debug" | "integration_debug" | "issue_mgmt" | "security_masking"
  >("error_logs");

  const [errorLogs, setErrorLogs] = useState<BackendErrorLog[]>(INITIAL_BACKEND_ERROR_LOGS);
  const [issues, setIssues] = useState<BackendIssue[]>(INITIAL_BACKEND_ISSUES);
  const [selectedError, setSelectedError] = useState<BackendErrorLog | null>(INITIAL_BACKEND_ERROR_LOGS[0]);
  const [selectedIssue, setSelectedIssue] = useState<BackendIssue | null>(INITIAL_BACKEND_ISSUES[0]);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // New Note Modal / Input
  const [newNoteText, setNewNoteText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateIssueFromError = (error: BackendErrorLog) => {
    const existingIssue = issues.find((i) => i.errorId === error.id);
    if (existingIssue) {
      setSelectedIssue(existingIssue);
      setActiveSubTab("issue_mgmt");
      return;
    }

    const newIssue: BackendIssue = {
      id: `ISS-${Math.floor(100 + Math.random() * 900)}`,
      title: `${error.category} Error in ${error.service}: ${error.errorMessage.substring(0, 50)}...`,
      errorId: error.id,
      service: error.service,
      priority: error.severity,
      status: "OPEN",
      assignedDeveloper: "Developer On-Call (Assigned)",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
      debugNotes: [
        `Auto-created from Error Log #${error.id} (Trace ID: ${error.correlationId}).`,
        `Investigating status code: HTTP ${error.statusCode} on endpoint: ${error.endpoint}.`,
      ],
    };

    setIssues([newIssue, ...issues]);
    setSelectedIssue(newIssue);
    setActionSuccess(`Issue ${newIssue.id} created and assigned to on-call engineer.`);
    setTimeout(() => setActionSuccess(null), 3500);
    setActiveSubTab("issue_mgmt");
  };

  const handleAddNoteToIssue = (issueId: string) => {
    if (!newNoteText.trim()) return;
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          return {
            ...iss,
            debugNotes: [...iss.debugNotes, newNoteText.trim()],
            updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
          };
        }
        return iss;
      })
    );
    setNewNoteText("");
  };

  const handleUpdateIssueStatus = (
    issueId: string,
    newStatus: "OPEN" | "INVESTIGATING" | "FIXED" | "CLOSED"
  ) => {
    setIssues((prev) =>
      prev.map((iss) => (iss.id === issueId ? { ...iss, status: newStatus } : iss))
    );
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const filteredLogs = errorLogs.filter((log) => {
    if (categoryFilter !== "ALL" && log.category !== categoryFilter) return false;
    if (severityFilter !== "ALL" && log.severity !== severityFilter) return false;
    if (
      searchQuery &&
      !log.errorMessage.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !log.service.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !log.correlationId.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 text-slate-100">
      {/* Strict Access & Architectural Isolation Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-500/40 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-rose-600 text-white flex items-center gap-1 shadow-xs">
                <Lock className="w-3 h-3" />
                Admin &amp; Developer Only
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase bg-slate-800 text-rose-300 border border-rose-500/30">
                Visibility: ❌ Customer &bull; ❌ Operator &bull; ❌ Public UI
              </span>
            </div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Bug className="w-5 h-5 text-rose-400" />
              Backend Debugging &amp; Error Diagnostic Console
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl">
              Internal microservice diagnostics, raw correlation trace IDs, and sanitized stack traces.
              All public customer and operator dashboards strictly display safe generic notices (e.g. &ldquo;Something went wrong. Please try again.&rdquo;).
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 shrink-0">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-right">
              <div className="text-xs font-bold text-slate-200">Zero Leakage Policy</div>
              <div className="text-3xs text-emerald-400 font-mono">Masked PII &amp; Credentials Active</div>
            </div>
          </div>
        </div>

        {actionSuccess && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
        )}
      </div>

      {/* Sub-Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab("error_logs")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === "error_logs"
              ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>1. Error Logs ({errorLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("debug_console")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === "debug_console"
              ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>2. Debug Console &amp; Stack Traces</span>
        </button>

        <button
          onClick={() => setActiveSubTab("api_debug")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === "api_debug"
              ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>3. API Debugging ({API_DEBUG_ENDPOINTS.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("db_debug")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === "db_debug"
              ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>4. Database Debugging</span>
        </button>

        <button
          onClick={() => setActiveSubTab("integration_debug")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === "integration_debug"
              ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>5. Integration Debugging</span>
        </button>

        <button
          onClick={() => setActiveSubTab("issue_mgmt")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === "issue_mgmt"
              ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>6. Issue Management ({issues.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("security_masking")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === "security_masking"
              ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>7. Security &amp; Data Masking</span>
        </button>
      </div>

      {/* 1. ERROR LOG MANAGEMENT */}
      {activeSubTab === "error_logs" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search error messages, service names, or correlation IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-white placeholder-slate-500 text-xs w-full focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-2xs uppercase font-bold">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-hidden"
              >
                <option value="ALL">All Categories</option>
                <option value="API">API Errors</option>
                <option value="DATABASE">Database Errors</option>
                <option value="PAYMENT">Payment Errors</option>
                <option value="INTEGRATION">Integration Errors</option>
                <option value="EXCEPTION">Exception Logs</option>
              </select>

              <span className="text-slate-400 text-2xs uppercase font-bold ml-2">Severity:</span>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-hidden"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          {/* Logs List Table */}
          <div className="space-y-2.5">
            {filteredLogs.map((log) => {
              const isSelected = selectedError?.id === log.id;
              const severityColor =
                log.severity === "CRITICAL"
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                  : log.severity === "HIGH"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-blue-500/20 text-blue-300 border-blue-500/40";

              return (
                <div
                  key={log.id}
                  onClick={() => setSelectedError(log)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 border-rose-500 shadow-md"
                      : "bg-slate-950/80 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-3xs font-extrabold border uppercase ${severityColor}`}>
                        {log.severity}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-3xs font-bold">
                        {log.category}
                      </span>
                      <span className="font-mono text-xs font-bold text-white">{log.service}</span>
                      <span className="text-3xs text-slate-400 font-mono">[{log.method} {log.endpoint}]</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-3xs text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {log.timestamp}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/50 font-mono text-3xs font-bold">
                        HTTP {log.statusCode}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-rose-200 font-mono line-clamp-2">
                    {log.errorMessage}
                  </p>

                  <div className="flex items-center justify-between pt-2 mt-2 text-2xs border-t border-slate-800/60 text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-3xs text-indigo-400">Trace: {log.correlationId}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(log.correlationId, log.id);
                        }}
                        className="hover:text-white"
                        title="Copy Correlation ID"
                      >
                        {copiedId === log.id ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedError(log);
                          setActiveSubTab("debug_console");
                        }}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-3xs transition-colors flex items-center gap-1"
                      >
                        <Code className="w-3 h-3" />
                        <span>Inspect Stack</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateIssueFromError(log);
                        }}
                        className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-3xs transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Create Issue</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. DEBUG CONSOLE & STACK TRACE INSPECTOR */}
      {activeSubTab === "debug_console" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Error Selector List */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 space-y-3">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Select Trace to Inspect
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {errorLogs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => setSelectedError(log)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedError?.id === log.id
                      ? "bg-slate-900 border-rose-500 text-white"
                      : "bg-slate-900/40 border-slate-800/80 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xs font-bold text-slate-300">{log.service}</span>
                    <span className="font-mono text-3xs text-rose-400">HTTP {log.statusCode}</span>
                  </div>
                  <div className="text-3xs text-indigo-400 font-mono truncate mt-0.5">{log.correlationId}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Inspector */}
          {selectedError ? (
            <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-3xs font-bold">
                      {selectedError.severity}
                    </span>
                    <span className="text-sm font-black text-white font-mono">{selectedError.service}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Correlation / Trace ID: <span className="font-mono text-indigo-400">{selectedError.correlationId}</span></p>
                </div>

                <button
                  onClick={() => handleCreateIssueFromError(selectedError)}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Assign to Developer</span>
                </button>
              </div>

              {/* Stack Trace Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-2xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-rose-400" />
                    Java / Spring Boot Exception Stack Trace
                  </span>
                  <span className="text-3xs text-slate-500 font-mono">Timestamp: {selectedError.timestamp}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-rose-300 font-mono text-2xs overflow-x-auto whitespace-pre leading-relaxed max-h-56">
                  {selectedError.stackTrace}
                </div>
              </div>

              {/* Masked Request / Response Payloads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-2xs">
                <div className="space-y-1.5">
                  <div className="font-bold text-slate-300 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Sanitized Request Payload (Masked PII)</span>
                  </div>
                  <pre className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-3xs overflow-x-auto max-h-44">
                    {JSON.stringify(selectedError.maskedPayload.requestBody, null, 2)}
                  </pre>
                </div>

                <div className="space-y-1.5">
                  <div className="font-bold text-slate-300 flex items-center gap-1">
                    <Eye className="w-3 h-3 text-indigo-400" />
                    <span>Response Payload (Exposed to Client)</span>
                  </div>
                  <pre className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-300 font-mono text-3xs overflow-x-auto max-h-44">
                    {JSON.stringify(selectedError.maskedPayload.responseBody, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 text-center py-20 bg-slate-950 rounded-3xl border border-slate-800 text-slate-500">
              Select an error from the left list to view raw stack trace and request payloads.
            </div>
          )}
        </div>
      )}

      {/* 3. API DEBUGGING */}
      {activeSubTab === "api_debug" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {API_DEBUG_ENDPOINTS.map((api) => {
              const isHealthy = api.status === "HEALTHY";
              const isDegraded = api.status === "DEGRADED";

              return (
                <div key={api.id} className="p-4 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-3xs font-bold font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 uppercase">
                        {api.category}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">{api.name}</h4>
                      <p className="text-3xs text-slate-400">{api.provider}</p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-3xs font-extrabold uppercase ${
                        isHealthy
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : isDegraded
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                      }`}
                    >
                      {api.status}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-3xs text-slate-300 truncate">
                    <span className="text-amber-400 font-bold mr-1.5">{api.method}</span>
                    {api.endpoint}
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-3xs font-mono">
                    <div>
                      <span className="text-slate-500">Latency:</span>
                      <div className="font-bold text-indigo-400">{api.latencyMs}ms</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Timeout:</span>
                      <div className="font-bold text-slate-300">{api.timeoutLimitMs}ms</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Auth:</span>
                      <div className="font-bold text-slate-300 truncate">{api.authMethod}</div>
                    </div>
                  </div>

                  {api.lastFailureCode && (
                    <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-3xs font-mono">
                      Last Failure: HTTP {api.lastFailureCode} at {api.lastFailureTimestamp}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. DATABASE DEBUGGING */}
      {activeSubTab === "db_debug" && (
        <div className="space-y-5">
          {/* Connection Pool Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-2xs uppercase font-bold">Active Connections</span>
              <div className="text-xl font-black text-emerald-400 mt-1">
                {DATABASE_DEBUG_METRICS.activeConnections} / {DATABASE_DEBUG_METRICS.maxConnections}
              </div>
              <p className="text-3xs text-slate-500 font-mono mt-0.5">{DATABASE_DEBUG_METRICS.poolName}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-2xs uppercase font-bold">Slow Query Threshold</span>
              <div className="text-xl font-black text-amber-400 mt-1">
                {DATABASE_DEBUG_METRICS.slowQueryThresholdMs} ms
              </div>
              <p className="text-3xs text-slate-500 font-mono mt-0.5">Automated telemetry trigger</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-2xs uppercase font-bold">Cache Hit Ratio</span>
              <div className="text-xl font-black text-indigo-400 mt-1">
                {DATABASE_DEBUG_METRICS.cacheHitRatio}%
              </div>
              <p className="text-3xs text-slate-500 font-mono mt-0.5">PostgreSQL shared buffers</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-2xs uppercase font-bold">Deadlocks (24h)</span>
              <div className="text-xl font-black text-rose-400 mt-1">
                {DATABASE_DEBUG_METRICS.deadlocksCount}
              </div>
              <p className="text-3xs text-slate-500 font-mono mt-0.5">Resolved via retry policy</p>
            </div>
          </div>

          {/* Slow Queries Inspector */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">PostgreSQL Slow Query Audit Log (&gt;250ms)</h3>
              </div>
              <span className="text-3xs text-slate-400 font-mono">Live PostgreSQL 16 Telemetry</span>
            </div>

            <div className="space-y-2.5">
              {DATABASE_DEBUG_METRICS.recentSlowQueries.map((q) => (
                <div key={q.queryId} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-3xs">
                    <span className="text-indigo-400 font-bold">{q.queryId}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold">{q.durationMs}ms duration</span>
                      <span className="text-slate-500">{q.timestamp}</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 text-slate-300 overflow-x-auto whitespace-pre">
                    {q.statement}
                  </div>
                  <div className="text-3xs text-slate-500">Rows Scanned / Affected: {q.rowsAffected}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. INTEGRATION DEBUGGING */}
      {activeSubTab === "integration_debug" && (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              External Travel &amp; Payment Service Integrations Diagnostics
            </h3>
            <p className="text-xs text-slate-400">
              Live heartbeat telemetry and retry queues across GDS, IRCTC rail networks, bus aggregators, and payment switches.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Amadeus Flight GDS</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-3xs font-bold">CONNECTED</span>
                </div>
                <p className="text-2xs text-slate-400">OAuth2 Bearer token refreshed automatically every 1800s. Rate limit ceiling: 120 req/sec.</p>
                <div className="text-3xs font-mono text-indigo-400">Circuit Breaker: CLOSED (Healthy)</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">IRCTC NGeT Rail Service</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-3xs font-bold">HIGH LATENCY</span>
                </div>
                <p className="text-2xs text-slate-400">mTLS certificate handshake active. Upstream latency 380ms during morning Tatkal booking window.</p>
                <div className="text-3xs font-mono text-amber-400">Circuit Breaker: HALF-OPEN (Fallback cache active)</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Razorpay Payment Gateway</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-3xs font-bold">CONNECTED</span>
                </div>
                <p className="text-2xs text-slate-400">HMAC-SHA256 signature verification. Webhook processing idempotent with Redis distributed lock.</p>
                <div className="text-3xs font-mono text-indigo-400">Webhook Success Rate: 99.92%</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Meta WhatsApp Business API</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-3xs font-bold">CONNECTED</span>
                </div>
                <p className="text-2xs text-slate-400">System token auto-refresh active. Instant PDF ticket confirmation dispatch delivery time &lt;2.1s.</p>
                <div className="text-3xs font-mono text-indigo-400">Queue Backlog: 0 messages</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. ISSUE MANAGEMENT */}
      {activeSubTab === "issue_mgmt" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Engineering Issues ({issues.length})
              </h3>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {issues.map((iss) => {
                const statusColor =
                  iss.status === "OPEN"
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    : iss.status === "INVESTIGATING"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : iss.status === "FIXED"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-slate-800 text-slate-400 border-slate-700";

                return (
                  <div
                    key={iss.id}
                    onClick={() => setSelectedIssue(iss)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedIssue?.id === iss.id
                        ? "bg-slate-900 border-rose-500 shadow-md"
                        : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{iss.id}</span>
                      <span className={`px-2 py-0.5 rounded text-3xs font-extrabold uppercase border ${statusColor}`}>
                        {iss.status}
                      </span>
                    </div>
                    <p className="text-slate-300 text-2xs font-medium line-clamp-1 mt-1">{iss.title}</p>
                    <div className="text-3xs text-slate-500 mt-1 font-mono">{iss.assignedDeveloper}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Issue Details & Debug Notes */}
          {selectedIssue ? (
            <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-white">{selectedIssue.id}: {selectedIssue.title}</span>
                  </div>
                  <p className="text-2xs text-slate-400 mt-1">
                    Service: <span className="text-indigo-400 font-mono">{selectedIssue.service}</span> &bull; Assigned: <span className="text-white font-semibold">{selectedIssue.assignedDeveloper}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-2xs text-slate-400 font-bold">Status:</span>
                  <select
                    value={selectedIssue.status}
                    onChange={(e) => handleUpdateIssueStatus(selectedIssue.id, e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-hidden"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="INVESTIGATING">INVESTIGATING</option>
                    <option value="FIXED">FIXED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>

              {/* Debug Notes Log */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  Engineering Notes &amp; Root Cause Analysis
                </h4>

                <div className="space-y-2">
                  {selectedIssue.debugNotes.map((note, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-900 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <p>{note}</p>
                    </div>
                  ))}
                </div>

                {/* Add Note Input */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add diagnostic notes, fix commits, or PR reference..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddNoteToIssue(selectedIssue.id)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 flex-1 focus:outline-hidden"
                  />
                  <button
                    onClick={() => handleAddNoteToIssue(selectedIssue.id)}
                    className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 transition-colors"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 text-center py-20 bg-slate-950 rounded-3xl border border-slate-800 text-slate-500">
              Select an issue from the left to view notes and update progress.
            </div>
          )}
        </div>
      )}

      {/* 7. SECURITY & SENSITIVE DATA MASKING */}
      {activeSubTab === "security_masking" && (
        <div className="space-y-5">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-emerald-400" />
              <div>
                <h3 className="text-base font-bold text-white">Sensitive Data Masking &amp; Zero-Knowledge Logging</h3>
                <p className="text-xs text-slate-400">Strict compliance with RBI digital payment directives and ISO 27001 confidentiality.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="font-bold text-rose-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Strictly Redacted from Logs</span>
                </div>
                <ul className="space-y-1.5 text-2xs text-slate-300 list-disc list-inside">
                  <li>Credit / Debit Card PANs (Tokenized, max 4 digits shown)</li>
                  <li>Card CVV / CVC numbers (Never stored or logged)</li>
                  <li>Customer Passwords &amp; PINs (Argon2id hashed)</li>
                  <li>JWT Bearer Tokens (Masked as [REDACTED_BEARER_TOKEN])</li>
                  <li>Third-Party API Secrets (sk_live_••••)</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Allowed in Diagnostic Logs</span>
                </div>
                <ul className="space-y-1.5 text-2xs text-slate-300 list-disc list-inside">
                  <li>Correlation / Trace IDs (e.g. corr_rzp_9f82a)</li>
                  <li>HTTP status codes (400, 404, 500, 502, 504)</li>
                  <li>Microservice names and handler class paths</li>
                  <li>Execution latency timestamps (e.g. 142ms)</li>
                  <li>Generic sanitized customer error response copies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
