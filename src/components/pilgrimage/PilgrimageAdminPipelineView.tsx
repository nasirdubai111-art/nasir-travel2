import React, { useState, useEffect } from "react";
import {
  Shield,
  Layers,
  Building2,
  Package,
  Calendar,
  CreditCard,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Users,
  Download,
  Eye,
  RefreshCw,
  Sun,
  Lock,
  ArrowRight,
  TrendingUp,
  DollarSign,
  FileSpreadsheet,
  Printer,
  ChevronRight,
} from "lucide-react";
import { pilgrimageService } from "../../services/pilgrimageService";
import {
  PilgrimageOperator,
  PilgrimagePackage,
  PilgrimageBookingRecord,
  PilgrimagePaymentLedgerItem,
} from "../../types/pilgrimagePipelineTypes";

type AdminStage =
  | "admin"
  | "pilgrimage_management"
  | "operators"
  | "packages"
  | "bookings"
  | "payments"
  | "reports";

const PIPELINE_STAGES: { id: AdminStage; label: string; number: number; desc: string }[] = [
  { id: "admin", label: "Admin", number: 1, desc: "Governance & Session" },
  { id: "pilgrimage_management", label: "Pilgrimage Management", number: 2, desc: "Circuits & Advisory" },
  { id: "operators", label: "Operators", number: 3, desc: "Yatra Samitis Directory" },
  { id: "packages", label: "Packages", number: 4, desc: "Yatra Catalog & Batches" },
  { id: "bookings", label: "Bookings", number: 5, desc: "Devotee Manifest Ledger" },
  { id: "payments", label: "Payments", number: 6, desc: "Escrow & Settlements" },
  { id: "reports", label: "Reports", number: 7, desc: "Analytics & Compliance" },
];

export interface PilgrimageAdminPipelineViewProps {
  initialStage?: AdminStage;
  onNavigateStage?: (stage: AdminStage) => void;
  onSwitchToYatraBooking?: () => void;
}

export function PilgrimageAdminPipelineView({
  initialStage,
  onNavigateStage,
  onSwitchToYatraBooking,
}: PilgrimageAdminPipelineViewProps = {}) {
  const [currentStage, setCurrentStage] = useState<AdminStage>(initialStage || "pilgrimage_management");

  // Sync initialStage if passed or changed
  useEffect(() => {
    if (initialStage) {
      setCurrentStage(initialStage);
    }
  }, [initialStage]);

  // State & Data
  const [operators, setOperators] = useState<PilgrimageOperator[]>(pilgrimageService.getOperators());
  const [packages, setPackages] = useState<PilgrimagePackage[]>(pilgrimageService.getPackages());
  const [bookings, setBookings] = useState<PilgrimageBookingRecord[]>(pilgrimageService.getBookings());
  const [payments, setPayments] = useState<PilgrimagePaymentLedgerItem[]>(pilgrimageService.getPayments());

  // Reload data periodically or when stage changes
  const reloadPipelineData = () => {
    setOperators(pilgrimageService.getOperators());
    setPackages(pilgrimageService.getPackages());
    setBookings(pilgrimageService.getBookings());
    setPayments(pilgrimageService.getPayments());
  };

  useEffect(() => {
    reloadPipelineData();
  }, [currentStage]);

  // Filters
  const [operatorSearch, setOperatorSearch] = useState<string>("");
  const [bookingFilterCircuit, setBookingFilterCircuit] = useState<string>("all");
  const [bookingSearch, setBookingSearch] = useState<string>("");
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Weather Advisory Toggle
  const [weatherAlertActive, setWeatherAlertActive] = useState<boolean>(false);

  const handleToggleOperatorStatus = (opId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "accredited" ? "suspended" : "accredited";
    pilgrimageService.updateOperatorStatus(opId, nextStatus as any);
    setOperators(pilgrimageService.getOperators());
    setActionSuccessMsg(`Operator ${opId} status updated to ${nextStatus.toUpperCase()}.`);
  };

  const handleDisbursePayment = (paymentId: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.paymentId === paymentId ? { ...p, payoutStatus: "settled_to_bank" } : p))
    );
    setActionSuccessMsg(`Escrow payout for ${paymentId} settled to operator verified bank account via Razorpay.`);
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Navigation Header */}
      <div className="bg-gradient-to-r from-slate-900 via-orange-950/40 to-slate-900 border border-orange-500/30 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-orange-500/20 text-orange-300 border border-orange-500/30">
              <Sun className="w-6 h-6 text-orange-400" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-3xs font-extrabold uppercase bg-orange-500/20 text-orange-300 border border-orange-500/40">
                  Administrative Workflow Pipeline
                </span>
                <span className="text-2xs text-slate-400 font-mono">
                  Admin ➔ Pilgrimage Management ➔ Operators ➔ Packages ➔ Bookings ➔ Payments ➔ Reports
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                Pilgrimage Central Authority &amp; Shrine Ecosystem
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs font-mono text-orange-300">
              Active Stage: <strong className="text-white uppercase">{currentStage.replace("_", " ")}</strong>
            </span>
          </div>
        </div>

        {/* 7-Step Admin Pipeline Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2 border-t border-slate-800/80">
          {PIPELINE_STAGES.map((stg) => {
            const isActive = currentStage === stg.id;
            return (
              <button
                key={stg.id}
                onClick={() => {
                  setCurrentStage(stg.id);
                  if (onNavigateStage) onNavigateStage(stg.id);
                }}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? "bg-orange-500/20 border-orange-400 text-white shadow-lg shadow-orange-500/10"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isActive ? "bg-orange-500 text-slate-950" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {stg.number}
                  </span>
                  <span className={`text-xs font-bold truncate ${isActive ? "text-white" : "text-slate-300"}`}>
                    {stg.label}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block truncate">{stg.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-between">
          <span className="font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {actionSuccessMsg}
          </span>
          <button onClick={() => setActionSuccessMsg(null)} className="text-slate-400 hover:text-white text-2xs">
            Dismiss
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* STAGE 1: ADMIN (AUTHENTICATION & ROOT CONTEXT) */}
      {/* ===================================================================== */}
      {currentStage === "admin" && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded text-3xs font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Security &amp; Governance
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                Admin Master Session &amp; Authority Credentials
              </h3>
            </div>
            <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-emerald-400">
              Session: ACTIVE (256-bit TLS)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-3xs text-slate-400 block font-semibold">Admin Identifier</span>
              <span className="text-sm font-black text-white font-mono">yatra_director@bharatyatra.in</span>
              <span className="text-3xs text-emerald-400 block">Root Pilgrimage Operator Clearance</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-3xs text-slate-400 block font-semibold">Shrine Board GDS API Status</span>
              <span className="text-sm font-black text-emerald-400">4 Connected (BKTC, TTD, SMVDSB, KVT)</span>
              <span className="text-3xs text-slate-400 block">Sugam Darshan Pass sync 100% active</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-3xs text-slate-400 block font-semibold">High-Altitude Safety Protocol</span>
              <span className="text-sm font-black text-white">Level-1 Normal Clear Weather</span>
              <span className="text-3xs text-slate-400 block">IMD Uttarakhand mountain advisory green</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-300">
              Proceed to Pilgrimage Management to inspect active sacred circuits and advisory controls.
            </span>
            <button
              onClick={() => setCurrentStage("pilgrimage_management")}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Go to Pilgrimage Management</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* STAGE 2: PILGRIMAGE MANAGEMENT (CIRCUITS & ADVISORY) */}
      {/* ===================================================================== */}
      {currentStage === "pilgrimage_management" && (
        <div className="bg-slate-900/90 border border-orange-500/30 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded text-3xs font-extrabold uppercase bg-orange-500/20 text-orange-300 border border-orange-500/40">
                National Shrine Governance
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                Pilgrimage Management Desk
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Overview of sacred yatra circuits, devotee health telemetry, and emergency weather broadcasting.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setWeatherAlertActive(!weatherAlertActive)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  weatherAlertActive
                    ? "bg-rose-500 text-white border-rose-400 shadow-md animate-pulse"
                    : "bg-slate-950 text-slate-300 border-slate-700 hover:text-white"
                }`}
              >
                {weatherAlertActive ? "⚠️ High-Altitude Advisory ACTIVE" : "Broadcast Weather Alert"}
              </button>
            </div>
          </div>

          {/* Macro Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-3xs text-slate-400 block font-semibold">Active Yatra Circuits</span>
              <span className="text-base font-black text-white">6 Sacred Circuits</span>
              <span className="text-3xs text-emerald-400 block">Across 12 Indian States</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-3xs text-slate-400 block font-semibold">Accredited Operators</span>
              <span className="text-base font-black text-orange-400">{operators.length} Samitis</span>
              <span className="text-3xs text-slate-400 block">100% License Verified</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-3xs text-slate-400 block font-semibold">Devotees Served</span>
              <span className="text-base font-black text-emerald-400">85,950 Pilgrims</span>
              <span className="text-3xs text-slate-400 block">Zero safety incidents</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-3xs text-slate-400 block font-semibold">Cumulative GMV</span>
              <span className="text-base font-black text-sky-400">₹14.28 Crore</span>
              <span className="text-3xs text-slate-400 block">5% Platform Commission</span>
            </div>
          </div>

          {/* Connected Shrine Boards Status */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider">
              Connected Shrine Board Real-Time Connectors
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {[
                { name: "Badrinath-Kedarnath Temple Committee (BKTC)", quota: "350 VIP Sugam Passes / Day", status: "Operational" },
                { name: "Tirumala Tirupati Devasthanams (TTD)", quota: "500 Sheegra Darshan Slots / Day", status: "Operational" },
                { name: "Shri Mata Vaishno Devi Shrine Board (SMVDSB)", quota: "450 Helipad Passes / Day", status: "Operational" },
                { name: "Kashi Vishwanath Dham Nyas Board", quota: "300 Mangala Aarti Passes / Day", status: "Operational" },
              ].map((board, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-white text-xs block">{board.name}</span>
                  <span className="text-2xs text-orange-400 block">{board.quota}</span>
                  <span className="text-3xs text-emerald-400 font-mono block">● {board.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setCurrentStage("admin")}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Back to Admin
            </button>
            <button
              onClick={() => setCurrentStage("operators")}
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer"
            >
              <span>Proceed to Operators</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* STAGE 3: OPERATORS (DIRECTORY & APPROVAL) */}
      {/* ===================================================================== */}
      {currentStage === "operators" && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded text-3xs font-extrabold uppercase bg-orange-500/20 text-orange-300 border border-orange-500/40">
                Partner Directory
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                Pilgrimage Operators ({operators.length} Accredited Samitis)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit trusts, license numbers, fleet coaches, and Vedic guide credentials.
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search operator, priest..."
                value={operatorSearch}
                onChange={(e) => setOperatorSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {operators
              .filter(
                (op) =>
                  op.samitiName.toLowerCase().includes(operatorSearch.toLowerCase()) ||
                  op.headPriestName.toLowerCase().includes(operatorSearch.toLowerCase())
              )
              .map((op) => (
                <div
                  key={op.operatorId}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-mono text-3xs font-bold">
                          {op.operatorId}
                        </span>
                        <span className="text-3xs text-slate-400">{op.headquartersCity}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm mt-1">{op.samitiName}</h4>
                      <p className="text-2xs text-slate-400">Led by {op.headPriestName}</p>
                    </div>

                    <button
                      onClick={() => handleToggleOperatorStatus(op.operatorId, op.verificationStatus)}
                      className={`px-3 py-1 rounded-xl text-3xs font-mono font-bold border transition-all cursor-pointer ${
                        op.verificationStatus === "accredited"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-rose-500/20 hover:text-rose-300"
                          : "bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-emerald-500/20 hover:text-emerald-300"
                      }`}
                    >
                      {op.verificationStatus.toUpperCase()}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-900 text-2xs">
                    <div>
                      <span className="text-3xs text-slate-500 block">Fleet Capacity</span>
                      <span className="text-slate-300 font-semibold">{op.fleetBusesCount} Deluxe Buses</span>
                    </div>
                    <div>
                      <span className="text-3xs text-slate-500 block">Vedic Guides</span>
                      <span className="text-slate-300 font-semibold">{op.accreditedVedicGuidesCount} Certified</span>
                    </div>
                    <div>
                      <span className="text-3xs text-slate-500 block">Pilgrims Served</span>
                      <span className="text-emerald-400 font-bold">{op.totalPilgrimsServed.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-3xs font-mono text-slate-400">
                    <span>GSTIN: {op.gstin}</span>
                    <span>Rating: {op.rating} ★</span>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setCurrentStage("pilgrimage_management")}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Back to Management
            </button>
            <button
              onClick={() => setCurrentStage("packages")}
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer"
            >
              <span>Proceed to Packages</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* STAGE 4: PACKAGES (MASTER CATALOG & BATCH DATES) */}
      {/* ===================================================================== */}
      {currentStage === "packages" && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded text-3xs font-extrabold uppercase bg-orange-500/20 text-orange-300 border border-orange-500/40">
                Package Catalog Desk
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                Sacred Yatra Packages Master Catalog ({packages.length} Active Packages)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure prices, batch dates, seat quotas, and Sugam Darshan quotas.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {packages.map((pkg) => (
              <div
                key={pkg.packageId}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{pkg.packageName}</span>
                    <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-mono text-3xs font-extrabold">
                      {pkg.circuit}
                    </span>
                  </div>
                  <p className="text-2xs text-slate-400">
                    {pkg.duration} &bull; Route: {pkg.departureCity} ➔ {pkg.arrivalCity}
                  </p>
                  <div className="flex items-center gap-2 text-3xs text-slate-500">
                    <span>Batch Capacity: {pkg.totalSeatsPerBatch} seats</span>
                    <span>&bull;</span>
                    <span className="text-emerald-400">Remaining current batch: {pkg.remainingSeatsCurrentBatch} seats</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-3xs text-slate-400 block">Base Adult Fare</span>
                    <span className="text-base font-black text-orange-400">₹{pkg.basePriceAdult.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => alert(`Package ${pkg.packageId} settings updated.`)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-2xs cursor-pointer"
                  >
                    Edit Quota
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setCurrentStage("operators")}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Back to Operators
            </button>
            <button
              onClick={() => setCurrentStage("bookings")}
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer"
            >
              <span>Proceed to Bookings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* STAGE 5: BOOKINGS (DEVOTEE MANIFEST LEDGER) */}
      {/* ===================================================================== */}
      {currentStage === "bookings" && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded text-3xs font-extrabold uppercase bg-orange-500/20 text-orange-300 border border-orange-500/40">
                Devotee Registrations
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                Pilgrimage Bookings &amp; Passenger Manifests
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Central ledger of all pilgrim bookings, biometric status, and Shrine Board QR permits.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter booking ref, pilgrim name..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-400"
                />
              </div>

              <select
                value={bookingFilterCircuit}
                onChange={(e) => setBookingFilterCircuit(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-orange-400 font-semibold"
              >
                <option value="all">All Circuits</option>
                <option value="Char Dham">Char Dham</option>
                <option value="12 Jyotirlinga">12 Jyotirlinga</option>
                <option value="Vaishno Devi">Vaishno Devi</option>
                <option value="South Temple Circuit">Tirupati</option>
              </select>

              <button
                onClick={reloadPipelineData}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Refresh Bookings Manifest"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              {onSwitchToYatraBooking && (
                <button
                  onClick={onSwitchToYatraBooking}
                  className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Switch to Pilgrimage Yatra Booking Hub to create a new booking"
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>+ Book Devotee in Yatra</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {bookings
              .filter((b) => {
                const matchesCircuit = bookingFilterCircuit === "all" || b.circuit === bookingFilterCircuit;
                const matchesSearch =
                  b.bookingId.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                  b.customer.fullName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                  b.packageName.toLowerCase().includes(bookingSearch.toLowerCase());
                return matchesCircuit && matchesSearch;
              })
              .map((b) => (
                <div
                  key={b.bookingId}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{b.customer.fullName}</span>
                        <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-mono text-3xs font-extrabold">
                          {b.bookingId}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-3xs font-mono font-bold">
                          {b.bookingStatus.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-2xs text-slate-400 mt-0.5">
                        {b.packageName} &bull; Departure: {b.travelDate}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-3xs text-slate-400 block">Amount Collected</span>
                      <span className="text-base font-black text-emerald-400">₹{b.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Devotees Manifest */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-900 text-2xs">
                    {b.passengers.map((p, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                        <div>
                          <span className="font-semibold text-white block">{p.fullName} ({p.age}y)</span>
                          <span className="text-3xs text-slate-400 font-mono">{p.aadhaarToken}</span>
                        </div>
                        <span className="text-3xs text-orange-300 font-mono">{p.specialSeva}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setCurrentStage("packages")}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Back to Packages
            </button>
            <button
              onClick={() => setCurrentStage("payments")}
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer"
            >
              <span>Proceed to Payments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* STAGE 6: PAYMENTS (ESCROW & SETTLEMENTS) */}
      {/* ===================================================================== */}
      {currentStage === "payments" && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded text-3xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Financial Escrow Engine
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                Pilgrimage Multi-Party Payments &amp; Settlement Reconciliation
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated 90% operator escrow, 5% platform brokerage, and 5% temple trust seva disbursement.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs bg-slate-950">
              <thead className="bg-slate-900 text-slate-400 uppercase text-3xs font-mono border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Payment ID / Booking</th>
                  <th className="py-2.5 px-3">Customer &amp; Package</th>
                  <th className="py-2.5 px-3">Gross Total</th>
                  <th className="py-2.5 px-3">Operator 90%</th>
                  <th className="py-2.5 px-3">Platform 5%</th>
                  <th className="py-2.5 px-3">Seva 5%</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {payments.map((p) => (
                  <tr key={p.paymentId} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-mono text-orange-400 font-bold block">{p.paymentId}</span>
                      <span className="font-mono text-3xs text-slate-400">{p.bookingId}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-white block">{p.customerName}</span>
                      <span className="text-3xs text-slate-400 line-clamp-1">{p.packageName}</span>
                    </td>
                    <td className="py-3 px-3 font-bold text-white">
                      ₹{p.totalCollected.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-bold text-sky-400">
                      ₹{Math.round(p.operatorEscrowPayout).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-bold text-purple-400">
                      ₹{Math.round(p.platformCommission).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-bold text-amber-400">
                      ₹{Math.round(p.templeTrustSevaContribution).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-3xs font-mono font-bold ${
                          p.payoutStatus === "settled_to_bank"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        {p.payoutStatus.replace(/_/g, " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {p.payoutStatus === "escrow_held" ? (
                        <button
                          onClick={() => handleDisbursePayment(p.paymentId)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-3xs cursor-pointer"
                        >
                          Disburse Escrow
                        </button>
                      ) : (
                        <span className="text-3xs font-mono text-slate-500">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setCurrentStage("bookings")}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Back to Bookings
            </button>
            <button
              onClick={() => setCurrentStage("reports")}
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer"
            >
              <span>Proceed to Reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* STAGE 7: REPORTS (ANALYTICS & COMPLIANCE) */}
      {/* ===================================================================== */}
      {currentStage === "reports" && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded text-3xs font-extrabold uppercase bg-sky-500/20 text-sky-300 border border-sky-500/40">
                Business &amp; Statutory Analytics
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                Pilgrimage Ecosystem Reports &amp; Regulatory Compliance
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Demographics breakdown, GST filing statements, and high-altitude health clearance records.
              </p>
            </div>

            <button
              onClick={() => alert("Pilgrimage Compliance & Financial Ledger exported as PDF / CSV!")}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Reports Pack</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Circuit Popularity Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <span className="font-bold text-white text-xs block">
                Sacred Circuit Pilgrim Distribution
              </span>
              <div className="space-y-2 text-2xs">
                {[
                  { circuit: "Char Dham Yatra (Kedarnath/Badrinath)", share: "42%", count: "36,099 Devotees" },
                  { circuit: "Mata Vaishno Devi Shrine Circuit", share: "28%", count: "24,066 Devotees" },
                  { circuit: "Kashi Vishwanath & Ayodhya Ram Mandir", share: "18%", count: "15,471 Devotees" },
                  { circuit: "12 Jyotirlinga (Ujjain/Omkareshwar)", share: "12%", count: "10,314 Devotees" },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>{item.circuit}</span>
                      <span className="font-bold text-white">{item.share} ({item.count})</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-orange-500 h-full rounded-full"
                        style={{ width: item.share }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Demographics & Safety Metrics */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <span className="font-bold text-white text-xs block">
                Pilgrim Demographics &amp; Health Clearance
              </span>
              <div className="space-y-2 text-2xs">
                <div className="flex justify-between text-slate-300">
                  <span>Senior Citizen Pilgrims (&gt;60 Years)</span>
                  <span className="font-bold text-orange-400">46% (Special Seva Queue)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Biometric Aadhaar Authentication</span>
                  <span className="font-bold text-emerald-400">100% Verified</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>High-Altitude Medical Oxygen Escorts</span>
                  <span className="font-bold text-sky-400">100% Coverage at Kedarnath</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>GST Remittance Compliance</span>
                  <span className="font-bold text-emerald-400">GSTR-1 &amp; GSTR-3B Filed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setCurrentStage("payments")}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Back to Payments
            </button>
            <button
              onClick={() => setCurrentStage("admin")}
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer"
            >
              <span>Restart Admin Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
