import React, { useState, useMemo } from "react";
import {
  X,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  Building,
  CreditCard,
  Receipt,
  FileText,
  DollarSign,
  ShieldCheck,
  Filter,
  CheckCircle2,
  Table,
  Briefcase,
  Layers,
  ArrowDownToLine,
  HelpCircle,
} from "lucide-react";
import { BookingItem, UserProfile, ServiceCategory } from "../types";
import {
  generateCorporateExpenseCSV,
  downloadCorporateExpenseCSV,
  computeExpenseSummary,
  getCorporateExpenseCategory,
} from "../utils/csvExpenseExporter";
import { computeBookingTaxBreakdown } from "../utils/invoicePdfGenerator";

interface ExpenseReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingItem[];
  userProfile: UserProfile;
}

export function ExpenseReconciliationModal({
  isOpen,
  onClose,
  bookings,
  userProfile,
}: ExpenseReconciliationModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<"all" | "completed" | "upcoming" | "confirmed">("all");
  const [selectedService, setSelectedService] = useState<string>("all");
  const [companyName, setCompanyName] = useState<string>(
    userProfile.companyName || userProfile.b2bCorporateDetails?.companyName || "Bharat Yatra Enterprise Client"
  );
  const [corporateGstin, setCorporateGstin] = useState<string>(
    userProfile.gstNumber || userProfile.b2bCorporateDetails?.gstNumber || "27AABCB2212P1Z0"
  );
  const [costCenter, setCostCenter] = useState<string>("CC-CORP-TRAVEL-01");
  const [employeeId, setEmployeeId] = useState<string>(
    "EMP-" + (userProfile.name ? userProfile.name.slice(0, 3).toUpperCase() : "BYT") + "-941"
  );
  const [hasCopied, setHasCopied] = useState(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  // Filtered dataset for reconciliation
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus =
        selectedStatus === "all"
          ? true
          : selectedStatus === "upcoming"
          ? b.status === "upcoming" || b.status === "confirmed"
          : b.status === selectedStatus;
      
      const matchService = selectedService === "all" ? true : b.serviceType === selectedService;
      return matchStatus && matchService;
    });
  }, [bookings, selectedStatus, selectedService]);

  // Financial reconciliation summary
  const summary = useMemo(() => {
    return computeExpenseSummary(filteredBookings);
  }, [filteredBookings]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const res = downloadCorporateExpenseCSV(filteredBookings, userProfile, {
      companyName,
      corporateGstin,
      costCenter,
      employeeId,
      filterName: selectedStatus !== "all" ? selectedStatus : undefined,
    });

    setDownloadSuccessMessage(
      `Successfully exported ${res.count} transactions (₹${res.totalAmount.toLocaleString("en-IN")}) to ${res.filename}`
    );
    setTimeout(() => {
      setDownloadSuccessMessage(null);
    }, 4500);
  };

  const handleCopyToClipboard = () => {
    const csv = generateCorporateExpenseCSV(filteredBookings, userProfile, {
      companyName,
      corporateGstin,
      costCenter,
      employeeId,
      filterName: selectedStatus,
    });
    navigator.clipboard.writeText(csv);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-indigo-900/50">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Corporate Finance &amp; Tax Audit
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  GST Input Credit Ready
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                Corporate Expense Reconciliation &amp; CSV Export
              </h2>
              <p className="text-xs text-slate-300">
                Generate audit-ready spreadsheets with SAC codes, GST breakups, and cost center mappings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {downloadSuccessMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center gap-2 text-xs font-bold text-emerald-800 animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccessMessage}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Summary Bento Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">
                Total Expenses
              </span>
              <span className="text-lg font-black text-slate-900 font-mono mt-0.5 block">
                {summary.totalTrips} <span className="text-xs font-medium text-slate-500">trips</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Selected for export</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">
                Taxable Base
              </span>
              <span className="text-lg font-black text-slate-900 font-mono mt-0.5 block">
                ₹{summary.totalBaseTaxable.toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Excl. GST &amp; fees</span>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5">
              <span className="text-[10px] uppercase font-black text-emerald-700 tracking-wider block flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Input Tax Credit
              </span>
              <span className="text-lg font-black text-emerald-800 font-mono mt-0.5 block">
                ₹{summary.totalGstInputCredit.toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">100% Recoverable GST</span>
            </div>

            <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-3.5">
              <span className="text-[10px] uppercase font-black text-indigo-700 tracking-wider block">
                Gross Reconciled
              </span>
              <span className="text-lg font-black text-indigo-900 font-mono mt-0.5 block">
                ₹{summary.totalGrossSpend.toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] text-indigo-700 font-semibold">Total financial outlay</span>
            </div>
          </div>

          {/* Configuration & Filter Controls */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-indigo-600" />
              <span>Corporate Ledger &amp; Cost Center Tagging</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Company / Entity Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-indigo-600"
                  placeholder="Company Legal Name"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Corporate GSTIN (ITC)
                </label>
                <input
                  type="text"
                  value={corporateGstin}
                  onChange={(e) => setCorporateGstin(e.target.value.toUpperCase())}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800 font-bold focus:outline-indigo-600"
                  placeholder="27AABCB2212P1Z0"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Cost Center Code
                </label>
                <select
                  value={costCenter}
                  onChange={(e) => setCostCenter(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-indigo-600"
                >
                  <option value="CC-CORP-TRAVEL-01">CC-CORP-TRAVEL-01 (General Travel)</option>
                  <option value="CC-SALES-BD-02">CC-SALES-BD-02 (Sales &amp; Client Visits)</option>
                  <option value="CC-TECH-FIELD-03">CC-TECH-FIELD-03 (Engineering &amp; Site Ops)</option>
                  <option value="CC-EXEC-BOARD-04">CC-EXEC-BOARD-04 (Executive &amp; Board)</option>
                  <option value="CC-OFFSITE-TRAINING">CC-OFFSITE-TRAINING (Team Offsites)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Employee / Traveler ID
                </label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800 font-semibold focus:outline-indigo-600"
                  placeholder="EMP-1049"
                />
              </div>
            </div>

            {/* Scope & Service Filter Row */}
            <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-slate-400" /> Status:
                </span>
                {[
                  { id: "all", label: "All Bookings" },
                  { id: "completed", label: "Completed" },
                  { id: "upcoming", label: "Upcoming / Active" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStatus(s.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      selectedStatus === s.id
                        ? "bg-indigo-600 text-white shadow-2xs"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500">Service:</span>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-semibold"
                >
                  <option value="all">All Modes (Flights, Trains, Stays, Cabs)</option>
                  <option value="flights">Flights Only</option>
                  <option value="trains">Trains Only</option>
                  <option value="buses">Buses Only</option>
                  <option value="hotels">Hotels &amp; Stays Only</option>
                  <option value="cabs">Cabs &amp; Transfers</option>
                </select>
              </div>
            </div>
          </div>

          {/* Live Data Preview Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5 text-indigo-600" />
                <span>Spreadsheet Preview ({filteredBookings.length} Line Items)</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">
                Standard RFC 4180 CSV with UTF-8 BOM
              </span>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="max-h-60 overflow-y-auto overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">PNR</th>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3">SAC Code</th>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3 text-right">Taxable Base</th>
                      <th className="py-2 px-3 text-right">GST (12%)</th>
                      <th className="py-2 px-3 text-right">Total (INR)</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center py-8 text-slate-400 font-medium">
                          No transactions matching the selected criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => {
                        const tax = computeBookingTaxBreakdown(b);
                        const pnr = b.pnr || `BY-${b.id.slice(-6).toUpperCase()}`;
                        return (
                          <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2 px-3 font-mono font-bold text-indigo-700">{pnr}</td>
                            <td className="py-2 px-3 text-slate-600">{b.date}</td>
                            <td className="py-2 px-3 font-bold uppercase text-[10px] text-slate-700">
                              {b.serviceType}
                            </td>
                            <td className="py-2 px-3 font-mono text-slate-500 text-[11px]">{tax.sacCode}</td>
                            <td className="py-2 px-3 text-slate-800 font-medium max-w-xs truncate" title={b.title}>
                              {b.title}
                            </td>
                            <td className="py-2 px-3 text-right font-mono text-slate-700">
                              ₹{tax.baseAmount.toLocaleString("en-IN")}
                            </td>
                            <td className="py-2 px-3 text-right font-mono text-emerald-700 font-semibold">
                              ₹{(tax.cgst + tax.sgst + tax.igst).toLocaleString("en-IN")}
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-extrabold text-slate-900">
                              ₹{tax.totalAmount.toLocaleString("en-IN")}
                            </td>
                            <td className="py-2 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  b.status === "completed"
                                    ? "bg-slate-100 text-slate-700"
                                    : b.status === "cancelled"
                                    ? "bg-rose-100 text-rose-700"
                                    : "bg-emerald-100 text-emerald-800"
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="hidden sm:inline">
              Compatible with SAP Concur, Zoho Expense, QuickBooks &amp; Microsoft Excel.
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleCopyToClipboard}
              disabled={filteredBookings.length === 0}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
              title="Copy CSV to clipboard for quick paste into Google Sheets"
            >
              {hasCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600" />
                  <span>Copy Raw CSV</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              disabled={filteredBookings.length === 0}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <ArrowDownToLine className="w-4 h-4 text-white" />
              <span>Download Expense CSV (.csv)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
