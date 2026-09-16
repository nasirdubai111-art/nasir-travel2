import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  AlertTriangle,
  Bell,
  CheckCircle2,
  ShieldAlert,
  Send,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  X,
  Check,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  GSTR_DEADLINES,
  GstrDeadlineItem,
  MONTHLY_RECONCILIATION_VARIANCES,
} from "../../data/gstrFilingHistoryData";

interface GstrFilingDeadlineWidgetProps {
  onReconcilePeriod?: (periodId: string) => void;
  onOpenAuditModal?: () => void;
  onToast?: (msg: string) => void;
}

export function GstrFilingDeadlineWidget({
  onReconcilePeriod,
  onOpenAuditModal,
  onToast,
}: GstrFilingDeadlineWidgetProps) {
  const [deadlines, setDeadlines] = useState<GstrDeadlineItem[]>(GSTR_DEADLINES);
  const [autoNotifyEnabled, setAutoNotifyEnabled] = useState<boolean>(true);
  const [showNotificationModal, setShowNotificationModal] = useState<boolean>(false);
  const [showDiscrepancyModal, setShowDiscrepancyModal] = useState<boolean>(false);
  const [isSendingNotification, setIsSendingNotification] = useState<boolean>(false);
  const [notificationHistory, setNotificationHistory] = useState<
    Array<{ id: string; timestamp: string; channel: string; recipient: string; status: string; message: string }>
  >([
    {
      id: "ntf-1",
      timestamp: "Today, 09:15 AM",
      channel: "EMAIL & SLACK",
      recipient: "tax-compliance@bharatyatra.in (#finance-tax)",
      status: "DELIVERED",
      message: "GSTR-1 August 2026 due in 3 days. 1 un-reconciled variance of ₹5,200 pending.",
    },
  ]);

  // Automated Discrepancy Calculation
  // Checks discrepancies between expected tax collected and recorded ledger entries
  const currentDiscrepancy = useMemo(() => {
    // Look for periods where expectedTax !== ledgerTax
    const unreconciledItems = deadlines.filter((d) => !d.isReconciled && d.varianceINR !== 0);
    const totalExpected = unreconciledItems.reduce((acc, curr) => acc + curr.expectedTaxINR, 0);
    const totalLedger = unreconciledItems.reduce((acc, curr) => acc + curr.ledgerTaxINR, 0);
    const netVariance = totalExpected - totalLedger;

    return {
      hasDiscrepancy: Math.abs(netVariance) > 0,
      netVariance,
      totalExpected,
      totalLedger,
      affectedReturns: unreconciledItems,
      unreconciledCount: deadlines.filter((d) => !d.isReconciled).length,
    };
  }, [deadlines]);

  // Calculate days remaining from today (assume reference date is 2026-09-08 for demo)
  const calculateDaysRemaining = (dueDateStr: string): number => {
    const today = new Date("2026-09-08T00:00:00Z");
    const due = new Date(`${dueDateStr}T00:00:00Z`);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Dispatch Automated Notification
  const handleSendAutomatedNotification = () => {
    setIsSendingNotification(true);
    setTimeout(() => {
      const newNotif = {
        id: `ntf-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        channel: "EMAIL, SMS & WEBHOOK",
        recipient: "Finance Controller (tax-alerts@bharatyatra.in)",
        status: "DISPATCHED",
        message: `Automated Tax Alert: GSTR-1 filing due on 11 Sep 2026. Month August 2026 remains un-reconciled with variance of ₹${Math.abs(
          currentDiscrepancy.netVariance
        ).toLocaleString("en-IN")}.`,
      };
      setNotificationHistory((prev) => [newNotif, ...prev]);
      setIsSendingNotification(false);
      setShowNotificationModal(false);
      if (onToast) {
        onToast("Automated statutory compliance notification dispatched to Finance & Accounts team!");
      }
    }, 1100);
  };

  return (
    <div className="space-y-4">
      {/* WARNING BANNER: Automated Check for Tax Discrepancies */}
      {currentDiscrepancy.hasDiscrepancy && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border border-amber-500/50 shadow-lg shadow-amber-950/40 relative overflow-hidden animate-in fade-in duration-200">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Tax Variance Warning: Discrepancy Detected in Booking Ledger
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">
                  Variance: ₹{Math.abs(currentDiscrepancy.netVariance).toLocaleString("en-IN")}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                  August 2026 Un-reconciled
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Automated check calculated a mismatch between <strong>Expected Tax Collected</strong> (
                <span className="font-mono text-white font-bold">₹{currentDiscrepancy.totalExpected.toLocaleString("en-IN")}</span>)
                and <strong>Recorded Ledger Entries</strong> (
                <span className="font-mono text-white font-bold">₹{currentDiscrepancy.totalLedger.toLocaleString("en-IN")}</span>).
                Discrepancy of <strong className="text-amber-400 font-mono">₹{Math.abs(currentDiscrepancy.netVariance).toLocaleString("en-IN")}</strong> must be cleared before the GSTR-1 submission deadline (11 Sep 2026).
              </p>

              <div className="flex items-center gap-2.5 pt-1 flex-wrap">
                <button
                  onClick={() => setShowDiscrepancyModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspect Discrepant Bookings</span>
                </button>

                <button
                  onClick={() => setShowNotificationModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>Send Automated Alert</span>
                </button>

                {onReconcilePeriod && (
                  <button
                    onClick={() => onReconcilePeriod("2026-08")}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reconcile August 2026</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Deadline Widget Card */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-white tracking-tight">
                  Upcoming Statutory GSTR Filing Deadlines
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold">
                  FY 2026-27 COMPLIANCE CALENDAR
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Highlights upcoming GSTR-1, 2B, 3B, and 8 submission due dates with auto-notification if a month remains un-reconciled.
              </p>
            </div>
          </div>

          {/* Automated Notification Control */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowNotificationModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="View or trigger automated compliance notifications"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Automated Notifications ({notificationHistory.length})</span>
            </button>

            <button
              onClick={() => {
                setAutoNotifyEnabled(!autoNotifyEnabled);
                if (onToast) {
                  onToast(
                    !autoNotifyEnabled
                      ? "Automated reconciliation deadline notifications enabled!"
                      : "Automated deadline alerts paused."
                  );
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                autoNotifyEnabled
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                  : "bg-slate-900 border-slate-800 text-slate-400"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${autoNotifyEnabled ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`}></span>
              <span>{autoNotifyEnabled ? "Auto-Alerts Active" : "Auto-Alerts Paused"}</span>
            </button>
          </div>
        </div>

        {/* Deadlines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {deadlines.map((dl) => {
            const daysRemaining = calculateDaysRemaining(dl.dueDate);
            const isUrgent = daysRemaining <= 3 && !dl.isReconciled;

            return (
              <div
                key={dl.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isUrgent
                    ? "bg-amber-950/40 border-amber-500/50 shadow-md shadow-amber-950/20"
                    : dl.isReconciled
                    ? "bg-slate-900/90 border-slate-800 hover:border-slate-700"
                    : "bg-slate-900/90 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-slate-950 font-mono font-bold text-xs text-indigo-300 border border-slate-800">
                    {dl.returnType}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                      dl.status === "FILED"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : isUrgent
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                        : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                    }`}
                  >
                    {dl.status === "FILED"
                      ? "FILED"
                      : daysRemaining <= 0
                      ? "DUE TODAY"
                      : `${daysRemaining} DAYS REMAINING`}
                  </span>
                </div>

                <div className="mt-2.5">
                  <h5 className="text-xs font-bold text-white truncate" title={dl.returnName}>
                    {dl.returnName}
                  </h5>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>Due Date:</span>
                    <strong className="text-amber-300 font-mono">{dl.dueDate}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
                    <span>Period:</span>
                    <span className="text-slate-200">{dl.applicablePeriod}</span>
                  </div>
                </div>

                {/* Reconciliation Status Badge */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {dl.isReconciled ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span className="text-[10px] text-slate-400">
                      {dl.isReconciled ? "Fully Reconciled" : "Un-reconciled"}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-slate-300">
                    {dl.reconciliationScore}% Match
                  </span>
                </div>

                {/* Discrepancy indicator */}
                {dl.varianceINR !== 0 && (
                  <div className="mt-2 p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] flex items-center justify-between text-amber-300 font-mono">
                    <span>Tax Variance:</span>
                    <span className="font-bold">₹{Math.abs(dl.varianceINR).toLocaleString("en-IN")}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* DISCREPANCY INSPECTION MODAL */}
      {showDiscrepancyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Automated Tax Discrepancy Audit</h3>
                  <p className="text-[11px] text-slate-400">Comparing booking engine collections vs. recorded GST ledger entries</p>
                </div>
              </div>
              <button
                onClick={() => setShowDiscrepancyModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Statutory Return Period:</span>
                  <strong className="text-white font-mono">August 2026 (Due 11 Sep 2026)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected Tax (SAC-computed on booking checkout):</span>
                  <strong className="text-indigo-400 font-mono">₹58,92,400</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Recorded Inward/Outward Ledger Total:</span>
                  <strong className="text-emerald-400 font-mono">₹58,87,200</strong>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-900 text-amber-400 font-bold">
                  <span>Net Discrepancy Delta:</span>
                  <span className="font-mono">+₹5,200 (0.09%)</span>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Identified Root Cause Bookings (3 Items)</h5>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-indigo-300 font-bold">BK-CORP-9021</span> • TechCorp Bangalore (Corporate Flight)
                      <span className="text-[10px] text-slate-500 block">Split payment tax timing variance</span>
                    </div>
                    <span className="text-amber-400 font-bold">+₹2,400</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-indigo-300 font-bold">BK-HTL-4419</span> • The Oberoi Delhi (Luxury Hotel)
                      <span className="text-[10px] text-slate-500 block">SAC 996322 18% rounding fraction</span>
                    </div>
                    <span className="text-amber-400 font-bold">+₹1,800</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-indigo-300 font-bold">BK-CAB-1104</span> • Intercity Outstation Delhi-Jaipur
                      <span className="text-[10px] text-slate-500 block">Toll charge GST exemption classification</span>
                    </div>
                    <span className="text-amber-400 font-bold">+₹1,000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowDiscrepancyModal(false);
                  if (onToast) onToast("Adjusted rounding tolerance. August 2026 reconciled with Safe Harbor provisions!");
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Auto-Align Discrepancy (Apply Rule 59 Safe Harbor)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTOMATED NOTIFICATIONS MODAL */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Automated Compliance Notification Engine</h3>
                  <p className="text-[11px] text-slate-400">Sends alerts to Finance &amp; Tax Controllers if a month remains un-reconciled</p>
                </div>
              </div>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Automated Notification Rule:</span>
                <span className="text-emerald-400 font-bold">ACTIVE (Daily cron at 09:00 IST)</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Any filing period with an upcoming deadline within 7 days that remains <strong>Un-reconciled</strong> triggers automated high-priority compliance notifications across verified communication channels.
              </p>
            </div>

            {/* Past notifications log */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Dispatched Alerts Log</h5>
              <div className="space-y-2 max-h-[220px] overflow-y-auto">
                {notificationHistory.map((notif) => (
                  <div key={notif.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-indigo-400 font-bold">{notif.channel}</span>
                      <span className="text-[10px] text-slate-500">{notif.timestamp}</span>
                    </div>
                    <p className="text-slate-200 text-[11px]">{notif.message}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                      <span>Recipient: {notif.recipient}</span>
                      <span className="text-emerald-400 font-bold">{notif.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trigger Button */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={handleSendAutomatedNotification}
                disabled={isSendingNotification}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingNotification ? "Dispatching..." : "Send Automated Notification Now"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
