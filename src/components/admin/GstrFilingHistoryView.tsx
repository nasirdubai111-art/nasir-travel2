import React, { useState, useMemo } from "react";
import {
  History,
  FileText,
  CheckCircle2,
  Download,
  Search,
  Filter,
  Eye,
  Calendar,
  ShieldCheck,
  Hash,
  Clock,
  ArrowDownToLine,
  X,
  Copy,
  Check,
  ExternalLink,
  Printer,
  BadgeCheck,
  Building,
} from "lucide-react";
import {
  HISTORICAL_GSTR_SUBMISSIONS,
  GstrSubmissionRecord,
} from "../../data/gstrFilingHistoryData";

interface GstrFilingHistoryViewProps {
  onToast?: (msg: string) => void;
}

export function GstrFilingHistoryView({ onToast }: GstrFilingHistoryViewProps) {
  const [submissions, setSubmissions] = useState<GstrSubmissionRecord[]>(HISTORICAL_GSTR_SUBMISSIONS);
  const [searchArn, setSearchArn] = useState<string>("");
  const [returnTypeFilter, setReturnTypeFilter] = useState<string>("ALL");
  const [selectedSubmission, setSelectedSubmission] = useState<GstrSubmissionRecord | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Filtered submissions in chronological order (newest first)
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchType = returnTypeFilter === "ALL" || sub.returnType === returnTypeFilter;
      const q = searchArn.toLowerCase().trim();
      const matchSearch =
        !q ||
        sub.arn.toLowerCase().includes(q) ||
        sub.periodLabel.toLowerCase().includes(q) ||
        sub.digitalSignatureRef.toLowerCase().includes(q) ||
        sub.authorizedSignatory.toLowerCase().includes(q);
      return matchType && matchSearch;
    });
  }, [submissions, searchArn, returnTypeFilter]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    if (onToast) onToast(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleDownloadAckSlip = (sub: GstrSubmissionRecord) => {
    const slipText = `
================================================================================
          GOODS AND SERVICES TAX NETWORK (GSTN) - FILING ACKNOWLEDGMENT
================================================================================
Acknowledgment Reference Number (ARN): ${sub.arn}
Return Type                         : ${sub.returnType}
Return Period                       : ${sub.periodLabel} (${sub.periodId})
Submission Date & Time              : ${sub.submissionDate}
Statutory Due Date                  : ${sub.statutoryDueDate}
Filing Status                       : ${sub.status}
GSTIN                               : ${sub.gstin}
Legal Entity Name                   : BHARAT YATRA TRAVEL SUPERAPP PRIVATE LIMITED
Principal Place of Business         : ${sub.stateName}

FINANCIAL & TAX SUMMARY (INR)
--------------------------------------------------------------------------------
Gross Turnover Reported             : ₹${sub.grossTurnoverINR.toLocaleString("en-IN")}
Net Taxable Value                   : ₹${sub.taxableValueINR.toLocaleString("en-IN")}
Central Tax (CGST)                  : ₹${sub.cgstINR.toLocaleString("en-IN")}
State Tax (SGST)                    : ₹${sub.sgstINR.toLocaleString("en-IN")}
Integrated Tax (IGST)               : ₹${sub.igstINR.toLocaleString("en-IN")}
Total Statutory Tax Collected/Paid  : ₹${sub.totalTaxINR.toLocaleString("en-IN")}
${sub.itcClaimedINR ? `ITC Claimed (Input Credit)         : ₹${sub.itcClaimedINR.toLocaleString("en-IN")}\n` : ""}${sub.tcsDeductedINR ? `TCS Deducted (Sec 52)               : ₹${sub.tcsDeductedINR.toLocaleString("en-IN")}\n` : ""}Total Invoices Accounted            : ${sub.invoicesCount}

STATUTORY DIGITAL VERIFICATION
--------------------------------------------------------------------------------
Authorized Signatory                : ${sub.authorizedSignatory}
Authentication Mode                 : ${sub.filingMode}
Digital Signature Token Hash        : ${sub.digitalSignatureRef}
System Timestamp                    : ${new Date().toISOString()}

Note: This is a computer-generated statutory acknowledgment slip valid under Rule 59/61 of the CGST Rules, 2017.
================================================================================
    `;

    const blob = new Blob([slipText.trim()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `GSTN_ACK_SLIP_${sub.arn}_${sub.returnType.replace(" ", "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    if (onToast) onToast(`Downloaded Acknowledgment Slip for ARN ${sub.arn}`);
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-white tracking-tight">
                  GSTR Statutory Filing History &amp; Acknowledgment Registry
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  CHRONOLOGICAL SUBMISSION LOGS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Audit trail of all past GSTR-1, GSTR-2, GSTR-3B, and GSTR-8 submissions with statutory GSTN Acknowledgment Reference Numbers (ARNs).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Total Historical Filings:</span>
            <strong className="text-white text-sm">{submissions.length} Returns</strong>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-slate-900">
          <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by ARN, Period, or DSC Signature..."
                value={searchArn}
                onChange={(e) => setSearchArn(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={returnTypeFilter}
              onChange={(e) => setReturnTypeFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Return Types</option>
              <option value="GSTR-1">GSTR-1 (Outward)</option>
              <option value="GSTR-2">GSTR-2 (Inward)</option>
              <option value="GSTR-3B">GSTR-3B (Summary)</option>
              <option value="GSTR-8 TCS">GSTR-8 (TCS)</option>
            </select>
          </div>

          <div className="text-[11px] text-slate-400">
            Showing <strong className="text-white">{filteredSubmissions.length}</strong> statutory filings
          </div>
        </div>
      </div>

      {/* Submissions Chronological Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                <th className="p-3">Acknowledgment ID (ARN)</th>
                <th className="p-3">Return Type</th>
                <th className="p-3">Period</th>
                <th className="p-3">Submission Timestamp</th>
                <th className="p-3 text-right">Turnover (₹)</th>
                <th className="p-3 text-right">Tax Declared (₹)</th>
                <th className="p-3 text-center">Filing Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredSubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-indigo-300">{sub.arn}</span>
                      <button
                        onClick={() => copyToClipboard(sub.arn, "ARN")}
                        className="text-slate-500 hover:text-slate-200 transition-colors"
                        title="Copy ARN"
                      >
                        {copiedText === "ARN" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate max-w-[200px]" title={sub.digitalSignatureRef}>
                      {sub.digitalSignatureRef.substring(0, 24)}...
                    </span>
                  </td>

                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                      {sub.returnType}
                    </span>
                  </td>

                  <td className="p-3 text-slate-300 font-sans">
                    <div>{sub.periodLabel}</div>
                    <span className="text-[10px] text-slate-500 font-mono">Due: {sub.statutoryDueDate}</span>
                  </td>

                  <td className="p-3 text-slate-300">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{sub.submissionDate}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">Via {sub.filingMode}</span>
                  </td>

                  <td className="p-3 text-right text-slate-200 font-bold">
                    ₹{(sub.taxableValueINR / 100000).toFixed(2)} L
                    <span className="text-[10px] text-slate-500 block font-normal">{sub.invoicesCount} Invoices</span>
                  </td>

                  <td className="p-3 text-right text-emerald-400 font-bold">
                    ₹{(sub.totalTaxINR / 100000).toFixed(2)} L
                    <span className="text-[10px] text-slate-500 block font-normal">
                      IGST: ₹{(sub.igstINR / 100000).toFixed(1)}L
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{sub.status.replace(/_/g, " ")}</span>
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                        title="Inspect Statutory Return Details"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                      </button>

                      <button
                        onClick={() => handleDownloadAckSlip(sub)}
                        className="px-2 py-1 rounded-lg bg-indigo-600/90 hover:bg-indigo-600 text-white text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Download Signed Acknowledgment Slip"
                      >
                        <Download className="w-3 h-3" />
                        <span>Slip</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECTION MODAL FOR SELECTED SUBMISSION */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">GSTN Statutory Submission Verification</h3>
                  <p className="text-[11px] font-mono text-indigo-300">ARN: {selectedSubmission.arn}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Core Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Return Type</span>
                  <span className="text-sm font-bold font-mono text-indigo-400">{selectedSubmission.returnType}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Return Period</span>
                  <span className="text-sm font-bold font-mono text-white">{selectedSubmission.periodLabel}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Vouchers Count</span>
                  <span className="text-sm font-bold font-mono text-emerald-400">{selectedSubmission.invoicesCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Filing Mode</span>
                  <span className="text-sm font-bold font-mono text-emerald-400">{selectedSubmission.filingMode}</span>
                </div>
              </div>

              {/* Tax Figures Breakdown */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Statutory Tax Breakdown</span>
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Gross Reported Turnover</span>
                    <span className="text-sm font-bold text-white">₹{selectedSubmission.grossTurnoverINR.toLocaleString("en-IN")}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Net Taxable Value</span>
                    <span className="text-sm font-bold text-slate-200">₹{selectedSubmission.taxableValueINR.toLocaleString("en-IN")}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Central + State GST (CGST+SGST)</span>
                    <span className="text-sm font-bold text-indigo-400">
                      ₹{(selectedSubmission.cgstINR + selectedSubmission.sgstINR).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Integrated GST (IGST)</span>
                    <span className="text-sm font-bold text-emerald-400">₹{selectedSubmission.igstINR.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Digital Signature & Portal Verification */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-xs">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-sans">Digital Signature &amp; Audit Trail</span>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 break-all">
                  {selectedSubmission.digitalSignatureRef}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-500 block">Signatory:</span>
                    <span className="text-slate-200 font-bold">{selectedSubmission.authorizedSignatory}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Filing Timestamp:</span>
                    <span className="text-slate-200 font-bold">{selectedSubmission.submissionDate}</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                {selectedSubmission.notes}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => handleDownloadAckSlip(selectedSubmission)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Official Acknowledgment Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
