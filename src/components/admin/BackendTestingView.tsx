import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  RotateCcw,
  Download,
  Filter,
  Shield,
  Zap,
  Lock,
  Database,
  Key,
  Calendar,
  CreditCard,
  Layers,
  Activity,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { BackendTestCase, INITIAL_TEST_CASES } from "../../data/backendAdminEngineeringData";

export function BackendTestingView() {
  const [testCases, setTestCases] = useState<BackendTestCase[]>(INITIAL_TEST_CASES);
  const [activeSuite, setActiveSuite] = useState<string>("ALL");
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [runningTestId, setRunningTestId] = useState<string | null>(null);
  const [reportExportedMsg, setReportExportedMsg] = useState<string | null>(null);

  const suitesList = [
    "ALL",
    "API Testing",
    "Database Testing",
    "Authentication Testing",
    "Booking Testing",
    "Payment Testing",
    "Integration Testing",
    "Security Testing",
    "Performance Testing",
    "Regression Testing",
  ];

  const handleRunTest = (testId: string) => {
    setRunningTestId(testId);
    setTimeout(() => {
      setTestCases((prev) =>
        prev.map((tc) =>
          tc.id === testId
            ? {
                ...tc,
                status: "PASSED",
                failureReason: undefined,
                lastRunTimestamp: "Just now",
                durationMs: Math.floor(20 + Math.random() * 150),
              }
            : tc
        )
      );
      setRunningTestId(null);
    }, 800);
  };

  const handleRunAllTests = () => {
    setIsRunningAll(true);
    setTimeout(() => {
      setTestCases((prev) =>
        prev.map((tc) => ({
          ...tc,
          status: "PASSED",
          failureReason: undefined,
          lastRunTimestamp: "Just now",
          durationMs: Math.floor(25 + Math.random() * 200),
        }))
      );
      setIsRunningAll(false);
    }, 1800);
  };

  const handleExportReport = () => {
    const jsonStr = JSON.stringify(
      {
        reportDate: new Date().toISOString(),
        totalTests: testCases.length,
        passed: testCases.filter((t) => t.status === "PASSED").length,
        failed: testCases.filter((t) => t.status === "FAILED").length,
        testCases,
      },
      null,
      2
    );
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BharatYatra_Backend_Test_Report_${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setReportExportedMsg("Test report downloaded successfully.");
    setTimeout(() => setReportExportedMsg(null), 3500);
  };

  const filteredTests = testCases.filter((tc) => {
    if (activeSuite !== "ALL" && tc.suite !== activeSuite) return false;
    return true;
  });

  const passedCount = testCases.filter((t) => t.status === "PASSED").length;
  const failedCount = testCases.filter((t) => t.status === "FAILED").length;
  const pendingCount = testCases.filter((t) => t.status === "PENDING").length;

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/40 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-indigo-600 text-white flex items-center gap-1 shadow-xs">
                <Lock className="w-3 h-3" />
                Backend Testing — Admin Only
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase bg-slate-800 text-indigo-300 border border-indigo-500/30">
                Admin Login &bull; RBAC &bull; Testing Center
              </span>
            </div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              Automated Microservice &amp; Integration Testing Center
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl">
              10 comprehensive test suites: API validation, PostgreSQL ACID rollbacks, JWT session auth, Tatkal booking concurrency, Razorpay webhooks, and performance stress testing.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRunAllTests}
              disabled={isRunningAll}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRunningAll ? "animate-spin" : ""}`} />
              <span>{isRunningAll ? "Running 10 Suites..." : "Run All Test Suites"}</span>
            </button>

            <button
              onClick={handleExportReport}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="Export Test Report JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {reportExportedMsg && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{reportExportedMsg}</span>
          </div>
        )}
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-slate-400 text-2xs uppercase font-bold">Total Test Cases</span>
          <div className="text-2xl font-black text-white mt-1">{testCases.length}</div>
          <p className="text-3xs text-slate-500 mt-0.5">Across 10 backend tiers</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-slate-400 text-2xs uppercase font-bold">Passed</span>
          <div className="text-2xl font-black text-emerald-400 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{passedCount}</span>
          </div>
          <p className="text-3xs text-slate-500 mt-0.5">{(passedCount / testCases.length * 100).toFixed(0)}% pass rate</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-slate-400 text-2xs uppercase font-bold">Failed / Triaged</span>
          <div className="text-2xl font-black text-rose-400 mt-1 flex items-center gap-1.5">
            <XCircle className="w-5 h-5 text-rose-400" />
            <span>{failedCount}</span>
          </div>
          <p className="text-3xs text-slate-500 mt-0.5">Upstream integration error</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-slate-400 text-2xs uppercase font-bold">Pending Execution</span>
          <div className="text-2xl font-black text-slate-400 mt-1">{pendingCount}</div>
          <p className="text-3xs text-slate-500 mt-0.5">Automated CI/CD hook</p>
        </div>
      </div>

      {/* Suites Navigation Pill Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 text-2xs font-bold">
        {suitesList.map((suite) => (
          <button
            key={suite}
            onClick={() => setActiveSuite(suite)}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeSuite === suite
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            {suite}
          </button>
        ))}
      </div>

      {/* Test Cases List */}
      <div className="space-y-2.5">
        {filteredTests.map((tc) => {
          const isPassed = tc.status === "PASSED";
          const isRunning = runningTestId === tc.id;

          return (
            <div
              key={tc.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-3xs font-extrabold uppercase border ${
                        isPassed
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                      }`}
                    >
                      {tc.status}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-3xs font-bold">
                      {tc.suite}
                    </span>
                    <span className="text-3xs text-slate-400 font-mono">[{tc.targetService}]</span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{tc.testName}</h4>
                  <p className="text-xs text-slate-400">{tc.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right text-3xs font-mono text-slate-400">
                    <div>Assertions: <strong className="text-slate-200">{tc.assertionsCount}</strong></div>
                    <div>Duration: <strong className="text-indigo-400">{tc.durationMs}ms</strong></div>
                  </div>

                  <button
                    onClick={() => handleRunTest(tc.id)}
                    disabled={isRunning}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Play className={`w-3.5 h-3.5 text-emerald-400 ${isRunning ? "animate-spin" : ""}`} />
                    <span>{isRunning ? "Executing..." : "Run Test"}</span>
                  </button>
                </div>
              </div>

              {tc.failureReason && (
                <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-2xs font-mono flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{tc.failureReason}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
