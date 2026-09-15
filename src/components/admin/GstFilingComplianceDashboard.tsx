import React, { useState, useMemo } from "react";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Percent,
  Calendar,
  Building,
  CreditCard,
  Layers,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Copy,
  Check,
  QrCode,
  Lock,
  Send,
  Sliders,
  X,
  FileSpreadsheet,
  BadgeCheck,
  Sparkles,
  Printer,
  Hash,
  Activity,
  AlertCircle,
} from "lucide-react";
import {
  BHARAT_YATRA_GSTIN_REGISTRATIONS,
  GST_FILING_PERIODS,
  GSTR1_OUTWARD_SUPPLIES,
  GSTR8_TCS_SUPPLIERS,
  GSTR2B_ITC_RECORDS,
  SAC_TAX_MATRIX,
  PMT06_CHALLANS,
  GstFilingPeriod,
  Gstr1OutwardSupplyRecord,
  Gstr8TcsSupplierRecord,
  Gstr2bItcReconciliationRecord,
  Pmt06Challan,
} from "../../data/gstFilingData";
import { GstLedgerExportView } from "./GstLedgerExportView";

type GstTab =
  | "gstr_dashboard"
  | "gstr1_outward"
  | "gstr3b_summary"
  | "gstr8_tcs"
  | "gstr2b_reconciliation"
  | "einvoice_irn"
  | "state_gstins_sac"
  | "ledger_export";

export function GstFilingComplianceDashboard() {
  const [activeTab, setActiveTab] = useState<GstTab>("gstr_dashboard");
  const [selectedGstin, setSelectedGstin] = useState<string>("ALL");
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>("2026-08");
  const [searchInvoice, setSearchInvoice] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Interactive Action States
  const [filingPeriod, setFilingPeriod] = useState<GstFilingPeriod>(
    GST_FILING_PERIODS.find((p) => p.periodId === "2026-08") || GST_FILING_PERIODS[0]
  );
  const [outwardSupplies, setOutwardSupplies] = useState<Gstr1OutwardSupplyRecord[]>(GSTR1_OUTWARD_SUPPLIES);
  const [tcsSuppliers, setTcsSuppliers] = useState<Gstr8TcsSupplierRecord[]>(GSTR8_TCS_SUPPLIERS);
  const [itcRecords, setItcRecords] = useState<Gstr2bItcReconciliationRecord[]>(GSTR2B_ITC_RECORDS);
  const [challans, setChallans] = useState<Pmt06Challan[]>(PMT06_CHALLANS);

  // Modals
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [showEvcFilingModal, setShowEvcFilingModal] = useState<boolean>(false);
  const [showChallanModal, setShowChallanModal] = useState<boolean>(false);
  const [showIrnModal, setShowIrnModal] = useState<Gstr1OutwardSupplyRecord | null>(null);
  const [evcOtp, setEvcOtp] = useState<string>("");
  const [isFiling, setIsFiling] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Filtered supplies
  const filteredSupplies = useMemo(() => {
    return outwardSupplies.filter((inv) => {
      const matchSearch =
        inv.invoiceNumber.toLowerCase().includes(searchInvoice.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(searchInvoice.toLowerCase()) ||
        (inv.customerGstin && inv.customerGstin.toLowerCase().includes(searchInvoice.toLowerCase())) ||
        inv.sacCode.includes(searchInvoice);
      const matchCategory = selectedCategory === "ALL" || inv.travelCategory === selectedCategory;
      const matchGstin =
        selectedGstin === "ALL" ||
        (selectedGstin === "07" && inv.posStateCode === "07") ||
        (selectedGstin === "27" && inv.posStateCode === "27") ||
        (selectedGstin === "29" && inv.posStateCode === "29");
      return matchSearch && matchCategory && matchGstin;
    });
  }, [outwardSupplies, searchInvoice, selectedCategory, selectedGstin]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    triggerToast(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Simulate Filing GSTR-1
  const handleFileGstr1 = () => {
    setIsFiling(true);
    setTimeout(() => {
      const newArn = `AA07082600${Math.floor(10000 + Math.random() * 90000)}`;
      setFilingPeriod((prev) => ({
        ...prev,
        gstr1: {
          ...prev.gstr1,
          status: "FILED",
          filingDate: "2026-09-08 11:45",
          arn: newArn,
        },
      }));
      setIsFiling(false);
      setShowEvcFilingModal(false);
      triggerToast(`GSTR-1 successfully signed with EVC & filed on GSTN Portal! ARN: ${newArn}`);
    }, 1200);
  };

  // Simulate Filing GSTR-3B
  const handleFileGstr3b = () => {
    setIsFiling(true);
    setTimeout(() => {
      const newArn = `AB07082600${Math.floor(10000 + Math.random() * 90000)}`;
      setFilingPeriod((prev) => ({
        ...prev,
        gstr3b: {
          ...prev.gstr3b,
          status: "FILED",
          filingDate: "2026-09-08 11:46",
          arn: newArn,
        },
      }));
      setIsFiling(false);
      setShowEvcFilingModal(false);
      triggerToast(`GSTR-3B Tax offset & Return filed! ARN: ${newArn}`);
    }, 1200);
  };

  // Simulate Challan Payment
  const handlePayChallan = (challanId: string) => {
    setChallans((prev) =>
      prev.map((c) =>
        c.challanId === challanId
          ? {
              ...c,
              status: "PAID",
              cinNumber: `SBIN${Date.now().toString().slice(-14)}`,
              paymentDate: "2026-09-08 11:50",
            }
          : c
      )
    );
    setFilingPeriod((prev) => ({
      ...prev,
      gstr3b: {
        ...prev.gstr3b,
        status: "READY_TO_FILE",
      },
    }));
    setShowChallanModal(false);
    triggerToast("₹28,89,700 credited to Electronic Cash Ledger via SBI NEFT. Ready to offset in GSTR-3B!");
  };

  // Download GSTR-1 JSON Schema (Offline tool compliant)
  const handleDownloadGstr1Json = () => {
    const payload = {
      gstin: "07AABCB1421R1Z8",
      fp: filingPeriod.periodId.replace("-", ""),
      version: "GST2.0",
      hash: "hash_48a9128bc0",
      cur_gt: 482910000,
      b2b: outwardSupplies
        .filter((s) => s.recipientType === "B2B")
        .map((s) => ({
          ctin: s.customerGstin,
          inv: [
            {
              inum: s.invoiceNumber,
              idt: s.invoiceDate,
              val: s.totalInvoiceINR,
              pos: s.posStateCode,
              rchrg: "N",
              inv_typ: "R",
              itms: [
                {
                  num: 1,
                  itm_det: {
                    rt: s.gstRatePercent,
                    txval: s.taxableValueINR,
                    iamt: s.igstINR,
                    camt: s.cgstINR,
                    samt: s.sgstINR,
                    csamt: 0,
                  },
                },
              ],
            },
          ],
        })),
      b2cs: [
        {
          sply_ty: "INTER",
          rt: 5,
          typ: "OE",
          pos: "29",
          txval: 4900000,
          iamt: 245000,
        },
        {
          sply_ty: "INTRA",
          rt: 5,
          typ: "OE",
          pos: "07",
          txval: 32400000,
          camt: 810000,
          samt: 810000,
        },
      ],
      hsn: {
        data: SAC_TAX_MATRIX.map((sac, idx) => ({
          num: idx + 1,
          hsn_sc: sac.sacCode,
          desc: sac.description,
          uqc: "OTH",
          qty: sac.totalInvoices,
          val: sac.taxableValueINR + sac.totalTaxINR,
          txval: sac.taxableValueINR,
          iamt: sac.igstINR,
          camt: sac.cgstINR,
          samt: sac.sgstINR,
          csamt: 0,
        })),
      },
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `GSTR1_07AABCB1421R1Z8_${filingPeriod.periodId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast(`GSTR-1 JSON offline payload generated for period ${filingPeriod.periodLabel}`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Compliance & Registration Bar */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black text-white tracking-tight">
                Statutory GST &amp; GSTR Compliance Filing Engine
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                GSTN API v2.0 CONNECTED
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                E-Commerce Operator (Sec 52)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Headquarters: <span className="font-mono text-slate-200 font-bold">07AABCB1421R1Z8</span> (Delhi) • 6 State Registrations • B2B IRN E-Invoicing &amp; GSTR-1/3B/8 Auto-Reconciliation
            </p>
          </div>
        </div>

        {/* Global Controls: GSTIN & Period Selector */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs">
            <Building className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400 text-[11px]">GSTIN:</span>
            <select
              value={selectedGstin}
              onChange={(e) => setSelectedGstin(e.target.value)}
              className="bg-transparent text-white font-mono font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="ALL" className="bg-slate-900">All India Consolidated</option>
              <option value="07" className="bg-slate-900">07-Delhi HQ (07AABCB1421R1Z8)</option>
              <option value="27" className="bg-slate-900">27-Maharashtra (27AABCB1421R1Z5)</option>
              <option value="29" className="bg-slate-900">29-Karnataka (29AABCB1421R1Z1)</option>
              <option value="33" className="bg-slate-900">33-Tamil Nadu (33AABCB1421R1Z8)</option>
              <option value="08" className="bg-slate-900">08-Rajasthan (08AABCB1421R1Z6)</option>
              <option value="30" className="bg-slate-900">30-Goa (30AABCB1421R1Z9)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 text-[11px]">Period:</span>
            <select
              value={selectedPeriodId}
              onChange={(e) => {
                setSelectedPeriodId(e.target.value);
                const found = GST_FILING_PERIODS.find((p) => p.periodId === e.target.value);
                if (found) setFilingPeriod(found);
              }}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="2026-08" className="bg-slate-900">August 2026 (Active)</option>
              <option value="2026-07" className="bg-slate-900">July 2026 (Filed)</option>
              <option value="2026-06" className="bg-slate-900">June 2026 (Filed)</option>
            </select>
          </div>

          <button
            onClick={() => triggerToast("Syncing with GSTN Portal Sandbox & E-Invoice IRP Gateway...")}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 cursor-pointer"
            title="Refresh GSTN API Status"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6 Key Statutory Tax Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        {/* Card 1: Gross Supplies */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Gross Turnover</span>
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="mt-2 text-xl font-black text-white font-mono">
            ₹{(filingPeriod.gstr1.taxableValueINR / 10000000).toFixed(2)} Cr
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {filingPeriod.gstr1.totalInvoices.toLocaleString()} Invoices • {filingPeriod.periodLabel}
          </p>
        </div>

        {/* Card 2: Total Output Tax */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Output Tax Liability</span>
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-2 text-xl font-black text-amber-400 font-mono">
            ₹{(filingPeriod.gstr1.totalTaxINR / 100000).toFixed(2)} L
          </div>
          <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
            <span>CGST+SGST: ₹{(filingPeriod.gstr1.cgstINR * 2 / 100000).toFixed(2)}L</span>
            <span>IGST: ₹{(filingPeriod.gstr1.igstINR / 100000).toFixed(2)}L</span>
          </div>
        </div>

        {/* Card 3: Eligible ITC (GSTR-2B) */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Eligible ITC (2B)</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-2 text-xl font-black text-emerald-400 font-mono">
            ₹{(filingPeriod.gstr3b.itcEligibleINR / 100000).toFixed(2)} L
          </div>
          <p className="text-[10px] text-emerald-400/80 mt-1">
            {filingPeriod.gstr2b.reconciliationMatchRate}% Reconciled with Portal
          </p>
        </div>

        {/* Card 4: Net Cash Payable */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 bg-gradient-to-b from-indigo-950/30 to-slate-950 hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between text-xs text-indigo-300 font-bold">
            <span>Net Cash Tax (3B)</span>
            <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="mt-2 text-xl font-black text-white font-mono">
            ₹{(filingPeriod.gstr3b.netCashTaxPaidINR / 100000).toFixed(2)} L
          </div>
          <p className="text-[10px] text-indigo-300/80 mt-1">
            PMT-06 Challan Ready
          </p>
        </div>

        {/* Card 5: GSTR-8 E-Commerce TCS */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>E-Com TCS (Sec 52)</span>
            <Percent className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-2 text-xl font-black text-cyan-400 font-mono">
            ₹{(filingPeriod.gstr8Tcs.tcsCollectedINR / 100000).toFixed(2)} L
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            1% on {filingPeriod.gstr8Tcs.totalSuppliers} Marketplace Partners
          </p>
        </div>

        {/* Card 6: GSTR-1 Status */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>GSTR-1 Status</span>
            <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-2 text-sm font-black text-white">
            {filingPeriod.gstr1.status === "FILED" ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                FILED (ARN Active)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                READY TO FILE
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Due Date: <span className="font-mono text-slate-300">{filingPeriod.gstr1.dueDate}</span>
          </p>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          <button
            id="gstr-filing-dashboard-tab"
            onClick={() => setActiveTab("gstr_dashboard")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "gstr_dashboard" || activeTab === "ledger_export"
                ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white shadow-lg shadow-emerald-600/30 font-bold ring-1 ring-emerald-400/40"
                : "bg-slate-900 text-emerald-400 hover:text-white hover:bg-slate-800 border border-emerald-500/30"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>GSTR Filing Dashboard</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 font-mono font-bold border border-emerald-500/30">
              Aggregates &amp; Reconciled
            </span>
          </button>

          <button
            onClick={() => setActiveTab("gstr1_outward")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "gstr1_outward"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>GSTR-1 Outward Supplies</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-indigo-300 font-mono">
              {outwardSupplies.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("gstr3b_summary")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "gstr3b_summary"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>GSTR-3B Tax Offset &amp; Payment</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
              ₹28.89L
            </span>
          </button>

          <button
            onClick={() => setActiveTab("gstr8_tcs")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "gstr8_tcs"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>GSTR-8 E-Commerce TCS (Sec 52)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
              1.0%
            </span>
          </button>

          <button
            onClick={() => setActiveTab("gstr2b_reconciliation")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "gstr2b_reconciliation"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>GSTR-2B &amp; ITC Reconciliation</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
              98.7%
            </span>
          </button>

          <button
            onClick={() => setActiveTab("einvoice_irn")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "einvoice_irn"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>B2B E-Invoicing &amp; IRN Gateway</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold">
              NIC IRP
            </span>
          </button>

          <button
            onClick={() => setActiveTab("state_gstins_sac")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "state_gstins_sac"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
            }`}
          >
            <Building className="w-4 h-4" />
            <span>State GSTINs &amp; SAC Rates (13 Cats)</span>
          </button>

          <button
            onClick={() => setActiveTab("ledger_export")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "ledger_export"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 font-bold"
                : "bg-slate-900 text-emerald-400 hover:text-white hover:bg-slate-800 border border-emerald-500/30"
            }`}
          >
            <Download className="w-4 h-4" />
            <span>GSTR-1 &amp; GSTR-2 Data Exporter</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              CSV / JSON
            </span>
          </button>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("ledger_export")}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
            title="Launch Full GSTR-1 & GSTR-2 Export Engine"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export GSTR-1 &amp; 2</span>
          </button>

          <button
            onClick={() => setShowJsonModal(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Inspect GSTN Offline Tool JSON Payload"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-400" />
            <span>JSON Schema</span>
          </button>

          <button
            onClick={handleDownloadGstr1Json}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
            title="Download GSTR-1 JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export GSTR-1 JSON</span>
          </button>
        </div>
      </div>

      {/* TAB 1: GSTR-1 OUTWARD SUPPLIES */}
      {activeTab === "gstr1_outward" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Filing Status Banner */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">GSTR-1 Monthly Return of Outward Supplies</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    filingPeriod.gstr1.status === "FILED"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}>
                    {filingPeriod.gstr1.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Return Period: <strong className="text-slate-200">{filingPeriod.periodLabel}</strong> • Statutory Due Date: <strong className="text-amber-400">{filingPeriod.gstr1.dueDate}</strong>
                  {filingPeriod.gstr1.arn && (
                    <span className="ml-2">
                      • ARN: <strong className="font-mono text-emerald-400">{filingPeriod.gstr1.arn}</strong>
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {filingPeriod.gstr1.status !== "FILED" ? (
                <button
                  onClick={() => setShowEvcFilingModal(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>File GSTR-1 with EVC / DSC</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Filed on {filingPeriod.gstr1.filingDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Table Breakdown Filter Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by Invoice #, Customer, GSTIN, SAC..."
                  value={searchInvoice}
                  onChange={(e) => setSearchInvoice(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                <option value="Corporate">Corporate</option>
                <option value="Flights">Flights</option>
                <option value="Hotels">Hotels</option>
                <option value="IRCTC Trains">IRCTC Trains</option>
                <option value="Buses">Buses</option>
                <option value="Cabs">Cabs</option>
                <option value="Yatras">Yatras</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Showing <strong>{filteredSupplies.length}</strong> of {outwardSupplies.length} tax records</span>
            </div>
          </div>

          {/* GSTR-1 Invoices Data Table */}
          <div className="rounded-2xl bg-slate-950/90 border border-slate-800 overflow-x-auto shadow-md">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Invoice # &amp; Date</th>
                  <th className="p-3.5">Recipient &amp; GSTIN</th>
                  <th className="p-3.5">Type &amp; POS</th>
                  <th className="p-3.5">SAC Code</th>
                  <th className="p-3.5 text-right">Taxable Val (₹)</th>
                  <th className="p-3.5 text-right">Rate</th>
                  <th className="p-3.5 text-right">CGST / SGST</th>
                  <th className="p-3.5 text-right">IGST</th>
                  <th className="p-3.5 text-right">Total Inv (₹)</th>
                  <th className="p-3.5 text-center">E-Invoice IRN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredSupplies.map((inv) => (
                  <tr key={inv.invoiceId} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-white">{inv.invoiceNumber}</div>
                      <div className="text-[11px] text-slate-500">{inv.invoiceDate}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-200">{inv.customerName}</div>
                      {inv.customerGstin ? (
                        <div className="font-mono text-[10px] text-indigo-400 flex items-center gap-1">
                          <span>{inv.customerGstin}</span>
                          <button
                            onClick={() => copyToClipboard(inv.customerGstin!, "GSTIN")}
                            className="hover:text-white"
                          >
                            <Copy className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">Unregistered (B2C)</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inv.recipientType === "B2B"
                          ? "bg-indigo-500/20 text-indigo-300"
                          : inv.recipientType === "B2C_LARGE"
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-slate-800 text-slate-300"
                      }`}>
                        {inv.recipientType.replace("_", " ")}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        POS: <span className="font-mono font-bold text-slate-300">{inv.posStateCode}-{inv.posStateName}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-slate-200">{inv.sacCode}</span>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px]" title={inv.sacDescription}>
                        {inv.travelCategory}
                      </div>
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-white">
                      ₹{inv.taxableValueINR.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-amber-400">
                      {inv.gstRatePercent}%
                    </td>
                    <td className="p-3.5 text-right font-mono text-slate-300">
                      {inv.cgstINR > 0 ? (
                        <div>
                          <div>₹{inv.cgstINR.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-500">+ ₹{inv.sgstINR.toLocaleString()}</div>
                        </div>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right font-mono text-cyan-400 font-bold">
                      {inv.igstINR > 0 ? `₹${inv.igstINR.toLocaleString()}` : <span className="text-slate-600">-</span>}
                    </td>
                    <td className="p-3.5 text-right font-mono font-black text-emerald-400">
                      ₹{inv.totalInvoiceINR.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-center">
                      {inv.eInvoiceStatus === "IRN_GENERATED" ? (
                        <button
                          onClick={() => setShowIrnModal(inv)}
                          className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold font-mono transition-all flex items-center justify-center gap-1 mx-auto cursor-pointer"
                        >
                          <QrCode className="w-3 h-3" />
                          <span>IRN VERIFIED</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500">N/A (B2C)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: GSTR-3B SUMMARY RETURN & TAX OFFSET */}
      {activeTab === "gstr3b_summary" && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Header Banner */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">GSTR-3B Self-Assessed Summary Return &amp; Payment</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    filingPeriod.gstr3b.status === "FILED"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}>
                    {filingPeriod.gstr3b.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Due Date: <strong className="text-amber-400">{filingPeriod.gstr3b.dueDate}</strong> • Electronic Cash Ledger Required: <strong className="font-mono text-emerald-400">₹{filingPeriod.gstr3b.netCashTaxPaidINR.toLocaleString()}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowChallanModal(true)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>View / Pay Challan PMT-06</span>
              </button>

              {filingPeriod.gstr3b.status !== "FILED" ? (
                <button
                  onClick={handleFileGstr3b}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Offset Liability &amp; File 3B</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Filed ARN: {filingPeriod.gstr3b.arn}</span>
                </div>
              )}
            </div>
          </div>

          {/* 3B Tax Computation & Ledger Offset Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Table 3.1: Details of Outward Supplies */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  3.1 Outward Taxable Supplies (Output Tax)
                </h4>
                <span className="text-[10px] font-mono text-slate-400">Section 9(1)</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 flex items-center justify-between">
                  <div>
                    <div className="text-slate-300 font-bold">(a) Outward Taxable Supplies (other than zero rated)</div>
                    <div className="text-[10px] text-slate-500">Taxable Value: ₹8,47,29,000</div>
                  </div>
                  <div className="text-right font-mono font-bold text-amber-400">
                    ₹{filingPeriod.gstr1.totalTaxINR.toLocaleString()}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 flex items-center justify-between">
                  <div>
                    <div className="text-slate-300 font-bold">(b) Zero rated supplies (Exports / SEZ units)</div>
                    <div className="text-[10px] text-slate-500">International corporate travel desk</div>
                  </div>
                  <div className="text-right font-mono font-bold text-slate-400">₹0</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 flex items-center justify-between">
                  <div>
                    <div className="text-slate-300 font-bold">(d) Inward supplies liable to reverse charge (RCM)</div>
                    <div className="text-[10px] text-slate-500">Legal counsel &amp; security services</div>
                  </div>
                  <div className="text-right font-mono font-bold text-white">₹42,500</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-bold">
                <span className="text-slate-300">Total Output Tax Due:</span>
                <span className="font-mono text-amber-400 text-sm">₹{(filingPeriod.gstr1.totalTaxINR + 42500).toLocaleString()}</span>
              </div>
            </div>

            {/* Table 4: Eligible Input Tax Credit (ITC) */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  4. Eligible Input Tax Credit (ITC Available)
                </h4>
                <span className="text-[10px] font-mono text-slate-400">GSTR-2B Auto-Drafted</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 flex items-center justify-between">
                  <div>
                    <div className="text-slate-300 font-bold">(A)(5) All other ITC (Cloud, API, GDS, Airlines)</div>
                    <div className="text-[10px] text-slate-500">AWS, Google Cloud, Air India, Razorpay</div>
                  </div>
                  <div className="text-right font-mono font-bold text-emerald-400">
                    + ₹{filingPeriod.gstr3b.itcEligibleINR.toLocaleString()}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 flex items-center justify-between">
                  <div>
                    <div className="text-slate-300 font-bold">(B)(1) Ineligible ITC under Section 17(5)</div>
                    <div className="text-[10px] text-rose-400">Food, outdoor catering &amp; luxury club perks</div>
                  </div>
                  <div className="text-right font-mono font-bold text-rose-400">
                    - ₹{filingPeriod.gstr2b.ineligibleItcINR.toLocaleString()}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 flex items-center justify-between">
                  <div>
                    <div className="text-slate-300 font-bold">(C) Net ITC Available for Offset</div>
                    <div className="text-[10px] text-slate-500">Credited to Electronic Credit Ledger</div>
                  </div>
                  <div className="text-right font-mono font-bold text-emerald-400">
                    ₹{filingPeriod.gstr3b.itcUtilizedINR.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-bold">
                <span className="text-slate-300">Total ITC Offset Allowed:</span>
                <span className="font-mono text-emerald-400 text-sm">₹{filingPeriod.gstr3b.itcUtilizedINR.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Section 6.1: Payment of Tax & Cash Ledger Offset Matrix */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">6.1 Payment of Tax (Electronic Cash &amp; Credit Ledger Utilization)</h4>
                <p className="text-xs text-slate-400">Tax liability offset adheres strictly to CGST Rule 88A (IGST first offset, followed by CGST/SGST balance)</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/30">
                Rule 88A Compliant
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Tax Head</th>
                    <th className="p-3 text-right">Total Liability (₹)</th>
                    <th className="p-3 text-right">Paid via IGST Credit</th>
                    <th className="p-3 text-right">Paid via CGST/SGST Credit</th>
                    <th className="p-3 text-right">Net Paid in Cash (₹)</th>
                    <th className="p-3 text-center">Offset Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  <tr>
                    <td className="p-3 font-bold text-white">Integrated Tax (IGST)</td>
                    <td className="p-3 text-right text-amber-400 font-bold">₹28,94,500</td>
                    <td className="p-3 text-right text-emerald-400">₹16,44,500</td>
                    <td className="p-3 text-right text-slate-500">-</td>
                    <td className="p-3 text-right font-black text-white">₹12,50,000</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        SETTLED
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">Central Tax (CGST)</td>
                    <td className="p-3 text-right text-amber-400 font-bold">₹34,18,200</td>
                    <td className="p-3 text-right text-slate-500">-</td>
                    <td className="p-3 text-right text-emerald-400">₹25,98,350</td>
                    <td className="p-3 text-right font-black text-white">₹8,19,850</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        SETTLED
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">State Tax (SGST)</td>
                    <td className="p-3 text-right text-amber-400 font-bold">₹34,18,200</td>
                    <td className="p-3 text-right text-slate-500">-</td>
                    <td className="p-3 text-right text-emerald-400">₹25,98,350</td>
                    <td className="p-3 text-right font-black text-white">₹8,19,850</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        SETTLED
                      </span>
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-900/90 font-bold border-t border-slate-800 text-xs">
                  <tr>
                    <td className="p-3 text-slate-200">Total Statutory Net Payable:</td>
                    <td className="p-3 text-right font-mono text-amber-400">₹97,30,900</td>
                    <td className="p-3 text-right font-mono text-emerald-400">₹16,44,500</td>
                    <td className="p-3 text-right font-mono text-emerald-400">₹51,96,700</td>
                    <td className="p-3 text-right font-mono text-emerald-400 text-sm font-black">
                      ₹28,89,700
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-[11px] text-indigo-400 font-mono">PMT-06 Active</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GSTR-8 E-COMMERCE TCS (SECTION 52) */}
      {activeTab === "gstr8_tcs" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">GSTR-8 Statement for Tax Collected at Source (Section 52)</h3>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                    1% TCS MANDATE
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Applicable to marketplace operators: 0.5% CGST + 0.5% SGST (Intra-state) or 1.0% IGST (Inter-state) on net taxable supplies of suppliers.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => triggerToast("Pushed TCS return statement to GSTN Portal. Partners will receive credit in their GSTR-2X / cash ledger.")}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit &amp; File GSTR-8</span>
              </button>
            </div>
          </div>

          {/* TCS Supplier Summary Table */}
          <div className="rounded-2xl bg-slate-950/90 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Supplier / Marketplace Partner</th>
                  <th className="p-3.5">Partner GSTIN</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5 text-right">Gross Supplies (₹)</th>
                  <th className="p-3.5 text-right">Returns / Cancellations</th>
                  <th className="p-3.5 text-right">Net Taxable Supplies</th>
                  <th className="p-3.5 text-right">CGST / SGST TCS</th>
                  <th className="p-3.5 text-right">IGST TCS</th>
                  <th className="p-3.5 text-right">Total TCS (1%)</th>
                  <th className="p-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {tcsSuppliers.map((sup) => (
                  <tr key={sup.supplierId} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3.5 font-sans">
                      <div className="font-bold text-white">{sup.partnerName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{sup.supplierId}</div>
                    </td>
                    <td className="p-3.5 text-indigo-400 font-bold">{sup.partnerGstin}</td>
                    <td className="p-3.5 font-sans">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        {sup.partnerType}
                      </span>
                    </td>
                    <td className="p-3.5 text-right text-slate-200">
                      ₹{sup.grossSuppliesINR.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right text-rose-400">
                      - ₹{sup.returnsINR.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right font-black text-white">
                      ₹{sup.netTaxableSuppliesINR.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right text-slate-300">
                      {sup.cgstTcsINR > 0 ? (
                        `₹${(sup.cgstTcsINR + sup.sgstTcsINR).toLocaleString()}`
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right text-cyan-400 font-bold">
                      {sup.igstTcsINR > 0 ? `₹${sup.igstTcsINR.toLocaleString()}` : <span className="text-slate-600">-</span>}
                    </td>
                    <td className="p-3.5 text-right font-black text-emerald-400">
                      ₹{sup.totalTcsINR.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-center font-sans">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                        {sup.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: GSTR-2B & ITC RECONCILIATION */}
      {activeTab === "gstr2b_reconciliation" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">GSTR-2B Auto-Drafted ITC vs Books Reconciliation</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                    98.7% AUTOMATCH
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Auto-drafted by GSTN on the 14th of every month based on outward returns filed by suppliers. Blocked credit under Sec 17(5) is automatically isolated.
                </p>
              </div>
            </div>

            <button
              onClick={() => triggerToast("Auto-reconciliation engine executed: 512 vendor records verified against GSTN GSTR-2B.")}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Run Auto-Reconciliation</span>
            </button>
          </div>

          {/* 2B Invoices Table */}
          <div className="rounded-2xl bg-slate-950/90 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Vendor Name &amp; GSTIN</th>
                  <th className="p-3.5">Invoice # &amp; Date</th>
                  <th className="p-3.5 text-right">Taxable Value</th>
                  <th className="p-3.5 text-right">CGST / SGST</th>
                  <th className="p-3.5 text-right">IGST</th>
                  <th className="p-3.5 text-right">Total Tax (₹)</th>
                  <th className="p-3.5">ITC Eligibility</th>
                  <th className="p-3.5 text-center">Match Status</th>
                  <th className="p-3.5">Audit Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {itcRecords.map((itc) => (
                  <tr key={itc.recordId} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3.5 font-sans">
                      <div className="font-bold text-white">{itc.supplierName}</div>
                      <div className="text-[10px] text-indigo-400 font-mono">{itc.supplierGstin}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-200">{itc.invoiceNumber}</div>
                      <div className="text-[10px] text-slate-500">{itc.invoiceDate}</div>
                    </td>
                    <td className="p-3.5 text-right text-slate-200">
                      ₹{itc.taxableValueINR.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right text-slate-300">
                      {itc.cgstINR > 0 ? `₹${(itc.cgstINR * 2).toLocaleString()}` : "-"}
                    </td>
                    <td className="p-3.5 text-right text-cyan-400 font-bold">
                      {itc.igstINR > 0 ? `₹${itc.igstINR.toLocaleString()}` : "-"}
                    </td>
                    <td className="p-3.5 text-right font-black text-emerald-400">
                      ₹{itc.totalTaxINR.toLocaleString()}
                    </td>
                    <td className="p-3.5 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        itc.itcEligibility === "INPUT_SERVICES"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }`}>
                        {itc.itcEligibility === "INELIGIBLE_SEC_17_5" ? "BLOCKED 17(5)" : itc.itcEligibility}
                      </span>
                      {itc.varianceNotes && (
                        <div className="text-[10px] text-slate-400 mt-1 max-w-[200px] truncate" title={itc.varianceNotes}>
                          {itc.varianceNotes}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 text-center font-sans">
                      {itc.reconciliationStatus === "MATCHED_100" ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          100% MATCH
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                          MISMATCH
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-sans">
                      {itc.reconciliationStatus === "VALUE_MISMATCH" ? (
                        <button
                          onClick={() => triggerToast(`Sent automated WhatsApp & Email notification to ${itc.supplierName} to reconcile invoice ${itc.invoiceNumber}.`)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Send Follow-up
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500">Auto-Approved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: B2B E-INVOICING & IRN GATEWAY */}
      {activeTab === "einvoice_irn" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-black">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">NIC Invoice Registration Portal (IRP) E-Invoicing Engine</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                    IRP PORTAL 1 &amp; 2 ONLINE
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Government mandated for taxpayers with turnover &gt; ₹5 Crores: Real-time generation of 64-character Invoice Reference Number (IRN) and digitally signed QR code.
                </p>
              </div>
            </div>

            <button
              onClick={() => triggerToast("Re-checked IRP token authentication. Cryptographic private key valid until Dec 2027.")}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Validate IRP Token</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">IRN Generation Latency</span>
              <div className="text-2xl font-black text-white font-mono">142 ms</div>
              <p className="text-[11px] text-emerald-400">Direct NIC IRP GSP API Gateway</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total E-Invoices Active</span>
              <div className="text-2xl font-black text-purple-400 font-mono">3,842</div>
              <p className="text-[11px] text-slate-400">100% compliant B2B corporate billing</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Auto-Sync to E-Way Bill</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">ENABLED</div>
              <p className="text-[11px] text-slate-400">Part-A automatically populated</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: STATE GSTINS & SAC RATES MASTER */}
      {activeTab === "state_gstins_sac" && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Registered GSTINs */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">BharatYatra Multi-State GSTIN Registrations</h4>
                <p className="text-xs text-slate-400">Registered across major Indian mobility hubs with Place of Supply (POS) rules</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold font-mono">
                6 Active Registrations
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {BHARAT_YATRA_GSTIN_REGISTRATIONS.map((reg) => (
                <div key={reg.gstin} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold">
                      State {reg.stateCode}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">{reg.status}</span>
                  </div>
                  <div>
                    <div className="font-mono text-xs font-bold text-white">{reg.gstin}</div>
                    <div className="text-xs font-semibold text-slate-300">{reg.stateName}</div>
                  </div>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                    Jurisdiction: {reg.nodalJurisdiction}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SAC Rates Master Table */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Travel &amp; Hospitality Services Accounting Code (SAC) Matrix</h4>
                <p className="text-xs text-slate-400">Statutory tax slabs mapped to BharatYatra service categories</p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">SAC Code</th>
                    <th className="p-3">Service Classification Description</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-right">Applicable GST Rate</th>
                    <th className="p-3">ITC Rules &amp; Restrictions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {SAC_TAX_MATRIX.map((sac) => (
                    <tr key={sac.sacCode} className="hover:bg-slate-900/50">
                      <td className="p-3 font-mono font-bold text-indigo-400">{sac.sacCode}</td>
                      <td className="p-3 text-slate-200">{sac.description}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                          {sac.category}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-amber-400">
                        {sac.taxRatePercent}%
                      </td>
                      <td className="p-3 text-[11px] text-slate-400">
                        {sac.taxRatePercent === 5 && sac.category === "Buses"
                          ? "Without ITC on motor vehicles; 100% ITC if opted for 12%"
                          : sac.taxRatePercent === 5 && sac.category === "Flights"
                          ? "Economy class travel - Input credit allowed only on input services"
                          : "Full input tax credit eligible for registered B2B entities"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: GSTR FILING DASHBOARD (BOOKING LEDGER AGGREGATES, GSTR-1 & 2 EXPORTS, RECONCILED FILES) */}
      {(activeTab === "gstr_dashboard" || activeTab === "ledger_export") && (
        <div className="animate-in fade-in duration-150">
          <GstLedgerExportView
            initialGstin={selectedGstin}
            initialPeriod={selectedPeriodId}
            onToast={triggerToast}
          />
        </div>
      )}

      {/* MODAL 1: GSTR-1 JSON SCHEMA PREVIEW */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">GSTN Offline Tool JSON Payload Specification</h3>
              </div>
              <button
                onClick={() => setShowJsonModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-y-auto max-h-[350px]">
              <pre>{JSON.stringify(
                {
                  gstin: "07AABCB1421R1Z8",
                  fp: filingPeriod.periodId.replace("-", ""),
                  version: "GST2.0",
                  total_invoices: outwardSupplies.length,
                  b2b_summary: {
                    invoices: outwardSupplies.filter((s) => s.recipientType === "B2B").length,
                    taxable_val: 16850000,
                    igst: 2894500,
                    cgst: 3418200,
                    sgst: 3418200,
                  },
                  hsn_sac_tables: SAC_TAX_MATRIX.length,
                },
                null,
                2
              )}</pre>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={handleDownloadGstr1Json}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download .JSON File</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EVC / DSC FILING MODAL */}
      {showEvcFilingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">File GSTR-1 via Electronic Verification Code (EVC)</h3>
              </div>
              <button
                onClick={() => setShowEvcFilingModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-400">Authorized Signatory:</div>
                <div className="font-bold text-white">Nasir Khan (Director of Compliance)</div>
                <div className="text-[10px] text-slate-500 font-mono">PAN: AABCK9912F • Aadhaar Linked</div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1.5">
                  Enter 6-Digit EVC OTP (Default: 941820)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="941820"
                  value={evcOtp}
                  onChange={(e) => setEvcOtp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-center text-lg font-mono tracking-widest text-emerald-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <p className="text-[11px] text-slate-500">
                By entering EVC, you digitally authenticate under Section 39 of CGST Act that the particulars furnished in GSTR-1 are true and correct.
              </p>

              <button
                onClick={handleFileGstr1}
                disabled={isFiling}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {isFiling ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                <span>Verify &amp; Submit Return on GSTN</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: PMT-06 CHALLAN MODAL */}
      {showChallanModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Form GST PMT-06 (Tax Payment Challan)</h3>
              </div>
              <button
                onClick={() => setShowChallanModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">CPIN Number</span>
                  <span className="font-mono text-sm font-black text-indigo-300">260908129481</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  Valid till 23-Sep-2026
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Integrated Tax (IGST):</span>
                  <span className="font-mono font-bold text-white">₹12,50,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Central Tax (CGST):</span>
                  <span className="font-mono font-bold text-white">₹8,19,850</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">State Tax (SGST):</span>
                  <span className="font-mono font-bold text-white">₹8,19,850</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-black text-emerald-400">
                  <span>Total Amount to Pay:</span>
                  <span>₹28,89,700</span>
                </div>
              </div>

              <button
                onClick={() => handlePayChallan("CHL-26-0801")}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Simulate Instant RTGS/NEFT Payment to SBI Virtual Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: IRN VERIFICATION POPUP */}
      {showIrnModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">NIC E-Invoice IRN Authentication</h3>
              </div>
              <button
                onClick={() => setShowIrnModal(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-[10px] text-slate-400 font-bold uppercase">64-Character IRN Hash:</div>
                <div className="font-mono text-[10px] text-purple-300 break-all bg-slate-900 p-2 rounded-lg">
                  {showIrnModal.irnNumber}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Invoice Number:</span>
                  <span className="font-mono font-bold text-white">{showIrnModal.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Recipient GSTIN:</span>
                  <span className="font-mono text-indigo-400">{showIrnModal.customerGstin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Invoice Value:</span>
                  <span className="font-mono font-bold text-emerald-400">₹{showIrnModal.totalInvoiceINR.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-center p-4 bg-white rounded-xl">
                <div className="text-center">
                  <QrCode className="w-24 h-24 text-slate-900 mx-auto" />
                  <span className="text-[9px] text-slate-600 font-mono mt-1 block">
                    Digitally Signed by NIC-IRP e-Invoice System
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
