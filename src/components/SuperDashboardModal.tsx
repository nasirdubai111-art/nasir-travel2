import React, { useState, useMemo } from "react";
import {
  X,
  Bus,
  Train,
  Hotel,
  Home,
  Palmtree,
  Sun,
  Compass,
  Building2,
  Car,
  Utensils,
  Ship,
  Shield,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Layers,
  FileText,
  CheckCircle2,
  Star,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  CreditCard,
  Calendar,
  Award,
  Search,
  Check,
  AlertTriangle,
  Server,
  Database,
  Key,
  Cpu,
  TrendingUp,
  RefreshCw,
  Users,
  QrCode,
  Ticket,
  ChevronRight,
  Info,
  DollarSign,
  Activity,
  Image as ImageIcon,
  Sliders,
  Briefcase,
  Zap,
} from "lucide-react";
import {
  SUPER_DASHBOARD_MODULES,
  OperatorModuleDetail,
} from "../data/superDashboardData";
import {
  OPERATOR_DEEP_SPECS,
  OperatorDeepSpecification,
} from "../data/superDashboardExtendedData";

interface SuperDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOperatorId?: string;
}

type DashboardTab = "frontend_modules" | "partner_dashboard" | "backend_isolation";

export function SuperDashboardModal({
  isOpen,
  onClose,
  initialOperatorId = "lodge",
}: SuperDashboardModalProps) {
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>(initialOperatorId);
  const [activeTab, setActiveTab] = useState<DashboardTab>("frontend_modules");
  
  // Interactive simulator states
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState<"select" | "details" | "confirmed">("select");
  const [guestName, setGuestName] = useState("Rajesh Kumar");
  const [guestEmail, setGuestEmail] = useState("rajesh.kumar@example.com");
  const [guestPhone, setGuestPhone] = useState("+91 98765 43210");
  const [selectedCheckInDate, setSelectedCheckInDate] = useState("2026-09-12");
  const [selectedCheckOutDate, setSelectedCheckOutDate] = useState("2026-09-15");
  const [guestCount, setGuestCount] = useState(2);
  const [roomCount, setRoomCount] = useState(1);
  const [cancellationSimulated, setCancellationSimulated] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [partnerSubTab, setPartnerSubTab] = useState<"manage_overview" | "listing_plan" | "commission_plan" | "inventory_rates">("manage_overview");

  const currentOperator: OperatorModuleDetail = useMemo(() => {
    return (
      SUPER_DASHBOARD_MODULES.find((op) => op.id === selectedOperatorId) ||
      SUPER_DASHBOARD_MODULES[0]
    );
  }, [selectedOperatorId]);

  const deepSpec: OperatorDeepSpecification | undefined = useMemo(() => {
    return OPERATOR_DEEP_SPECS[selectedOperatorId];
  }, [selectedOperatorId]);

  if (!isOpen) return null;

  const renderIcon = (iconName: string, className: string = "w-5 h-5") => {
    switch (iconName) {
      case "Bus":
        return <Bus className={className} />;
      case "Train":
        return <Train className={className} />;
      case "Hotel":
        return <Hotel className={className} />;
      case "Home":
        return <Home className={className} />;
      case "Palmtree":
        return <Palmtree className={className} />;
      case "Sun":
        return <Sun className={className} />;
      case "Compass":
        return <Compass className={className} />;
      case "Building2":
        return <Building2 className={className} />;
      case "Car":
        return <Car className={className} />;
      case "Utensils":
        return <Utensils className={className} />;
      case "Ship":
        return <Ship className={className} />;
      default:
        return <Layers className={className} />;
    }
  };

  const handleSimulateBooking = (itemId: string) => {
    setSelectedInventoryItem(itemId);
    setBookingStep("details");
    setCancellationSimulated(false);
  };

  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStep("confirmed");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-7xl h-[95vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* ========================================================================= */}
        {/* TOP HEADER & PILL BAR */}
        {/* ========================================================================= */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">
                  India Travel Super Dashboard
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  11 Profile Modules Active
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hidden sm:inline-flex">
                  Zero Frontend Leakage
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Frontend Modules (Displayed) • Operator Partner Dashboard • Strictly Hidden Backend Services
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setActiveTab("frontend_modules");
                setBookingStep("select");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "frontend_modules"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>1. Frontend Modules (Displayed)</span>
            </button>

            <button
              onClick={() => setActiveTab("partner_dashboard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "partner_dashboard"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>2. Operator Dashboard (Frontend)</span>
            </button>

            <button
              onClick={() => setActiveTab("backend_isolation")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "backend_isolation"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-emerald-200" />
              <span>3. Backend Modules (NEVER DISPLAYED)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            title="Close Dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* OPERATOR HORIZONTAL SELECTOR STRIP (11 MODULES) */}
        {/* ========================================================================= */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-2 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-2xs font-extrabold uppercase text-slate-500 px-2 shrink-0">
            Select Module:
          </span>
          {SUPER_DASHBOARD_MODULES.map((op) => {
            const isSelected = op.id === selectedOperatorId;
            return (
              <button
                key={op.id}
                onClick={() => {
                  setSelectedOperatorId(op.id);
                  setBookingStep("select");
                  setSelectedInventoryItem(null);
                  setCancellationSimulated(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-xs"
                    : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800"
                }`}
              >
                {renderIcon(op.icon, `w-3.5 h-3.5 ${isSelected ? "text-amber-400" : "text-slate-400"}`)}
                <span>{op.categoryName}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* MAIN BODY CONTENT AREA */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/70">
          
          {/* ======================================================================= */}
          {/* TAB 1: FRONTEND MODULES — DISPLAYED */}
          {/* ======================================================================= */}
          {activeTab === "frontend_modules" && (
            <div className="space-y-6 max-w-6xl mx-auto">
              
              {/* Operator Hero Banner */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl">
                <div className="h-44 sm:h-56 relative w-full overflow-hidden">
                  <img
                    src={currentOperator.heroImage}
                    alt={currentOperator.name}
                    className="w-full h-full object-cover brightness-75 hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500 text-slate-950 shadow-md">
                      {currentOperator.badge}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-900/90 text-slate-200 border border-slate-700">
                      {currentOperator.categoryName}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        {currentOperator.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 max-w-2xl line-clamp-2">
                        {currentOperator.tagline}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700 shrink-0">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold text-white">
                        {currentOperator.starRating}
                      </span>
                      <span className="text-2xs text-slate-400">
                        ({currentOperator.totalReviews.toLocaleString()} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 bg-slate-950 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs border-t border-slate-800">
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="truncate">{currentOperator.operatingBase}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{currentOperator.supportContact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{currentOperator.supportContact.hours}</span>
                  </div>
                </div>
              </div>

              {/* 1. Official Frontend Modules Table */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-amber-400" />
                      <h4 className="text-base sm:text-lg font-bold text-white">
                        1. Frontend Modules — Displayed Features Matrix
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Customer-facing verified data rendered in the user interface (No backend internals exposed)
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-2xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                    {deepSpec?.frontendModulesTable?.length || 13} Modules Live
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-300">
                        <th className="py-2.5 px-3 font-extrabold w-44">Frontend Module</th>
                        <th className="py-2.5 px-3 font-extrabold w-80">Frontend Features</th>
                        <th className="py-2.5 px-3 font-extrabold">Active Display Output</th>
                        <th className="py-2.5 px-3 font-extrabold w-24 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {(deepSpec?.frontendModulesTable || []).map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-amber-300 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{row.moduleName}</span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-300 font-medium">
                            {row.features}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400 font-mono text-2xs">
                            {row.demoValue}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="px-2 py-0.5 rounded-full text-3xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Live Interactive Booking & Discovery Engine */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left 2 Cols: Interactive Inventory / Options */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-amber-400" />
                          <span>Interactive Booking &amp; Date Selection</span>
                        </h4>
                        <p className="text-2xs text-slate-400">
                          Select dates, occupancy &amp; room / villa / package / berth options
                        </p>
                      </div>

                      {/* Date & Guest controls */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg text-2xs">
                          <span className="text-slate-500 font-bold">In:</span>
                          <input
                            type="date"
                            value={selectedCheckInDate}
                            onChange={(e) => setSelectedCheckInDate(e.target.value)}
                            className="bg-transparent text-slate-200 focus:outline-hidden"
                          />
                        </div>
                        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg text-2xs">
                          <span className="text-slate-500 font-bold">Out:</span>
                          <input
                            type="date"
                            value={selectedCheckOutDate}
                            onChange={(e) => setSelectedCheckOutDate(e.target.value)}
                            className="bg-transparent text-slate-200 focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Inventory Items List */}
                    <div className="space-y-3">
                      {currentOperator.mockInventoryItems.map((item) => {
                        const isSelected = selectedInventoryItem === item.id;
                        return (
                          <div
                            key={item.id}
                            className={`p-4 rounded-2xl border transition-all ${
                              isSelected
                                ? "bg-amber-500/10 border-amber-500/70 shadow-md"
                                : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h5 className="font-bold text-white text-sm">
                                    {item.title}
                                  </h5>
                                  <span className="px-2 py-0.5 rounded-full text-3xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    {item.availableCount} Available
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400">{item.subtitle}</p>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {item.amenityHighlights.map((a, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-0.5 rounded-md text-3xs bg-slate-800 text-slate-300 border border-slate-700/60"
                                    >
                                      {a}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                                <div className="text-right">
                                  <div className="text-lg font-black text-amber-400">
                                    ₹{item.price.toLocaleString()}
                                  </div>
                                  <div className="text-3xs text-slate-400">
                                    {currentOperator.frontendAllowed.publicPricing.priceUnit}
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleSimulateBooking(item.id)}
                                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                                >
                                  <span>Select &amp; Book</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Policies & Inclusions / Exclusions */}
                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3 text-xs">
                    <h4 className="font-bold text-white flex items-center gap-2 text-sm border-b border-slate-800 pb-2">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      <span>Policies, Inclusions &amp; Cancellation Slabs</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                      <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800 space-y-1">
                        <div className="font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Cancellation &amp; Refund Policy</span>
                        </div>
                        <p className="text-2xs text-slate-300">
                          {currentOperator.frontendAllowed.policies.cancellation}
                        </p>
                      </div>

                      <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800 space-y-1">
                        <div className="font-bold text-amber-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Check-In / Departure Guidelines</span>
                        </div>
                        <p className="text-2xs text-slate-300">
                          {currentOperator.frontendAllowed.policies.checkInOrBoarding}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Col: Instant Booking & Cancellation Simulator */}
                <div className="space-y-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-emerald-400" />
                        <span>Live Booking Simulator</span>
                      </h4>
                      <span className="text-3xs font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                        {bookingStep === "select" && "Step 1: Choose Option"}
                        {bookingStep === "details" && "Step 2: Guest Details"}
                        {bookingStep === "confirmed" && "Step 3: Confirmed Voucher"}
                      </span>
                    </div>

                    {bookingStep === "select" && (
                      <div className="text-center py-8 space-y-3">
                        <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-amber-400">
                          <Search className="w-6 h-6" />
                        </div>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto">
                          Click <strong>Select &amp; Book</strong> on any of the inventory options on the left to test the real-time guest checkout and cancellation flow.
                        </p>
                      </div>
                    )}

                    {bookingStep === "details" && (
                      <form onSubmit={handleCompleteBooking} className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-2xs font-bold text-slate-400">Lead Guest / Traveller Name</label>
                          <input
                            type="text"
                            required
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium focus:outline-hidden focus:border-amber-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-2xs font-bold text-slate-400">Mobile Number</label>
                          <input
                            type="text"
                            required
                            value={guestPhone}
                            onChange={(e) => setGuestPhone(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium focus:outline-hidden focus:border-amber-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-2xs font-bold text-slate-400">Official Email (for E-Voucher)</label>
                          <input
                            type="email"
                            required
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium focus:outline-hidden focus:border-amber-500"
                          />
                        </div>

                        {/* Price Breakdown Calculation */}
                        <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-1 text-2xs">
                          <div className="flex justify-between text-slate-400">
                            <span>Base Price</span>
                            <span>₹{currentOperator.mockInventoryItems[0].price.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>GST &amp; Taxes ({currentOperator.frontendAllowed.publicPricing.taxPercentage}%)</span>
                            <span>₹{Math.round(currentOperator.mockInventoryItems[0].price * (currentOperator.frontendAllowed.publicPricing.taxPercentage / 100)).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Platform Booking Fee</span>
                            <span className="text-emerald-400">₹0 (Free)</span>
                          </div>
                          <div className="flex justify-between font-bold text-white text-xs border-t border-slate-800 pt-1.5">
                            <span>Final Total Payable</span>
                            <span className="text-amber-400">
                              ₹{(
                                currentOperator.mockInventoryItems[0].price +
                                Math.round(currentOperator.mockInventoryItems[0].price * (currentOperator.frontendAllowed.publicPricing.taxPercentage / 100))
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Pay &amp; Generate Instant Voucher</span>
                        </button>
                      </form>
                    )}

                    {bookingStep === "confirmed" && (
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-emerald-950/80 to-slate-950 border border-emerald-500/50 p-4 rounded-2xl space-y-2">
                          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Booking Confirmed &amp; Voucher Issued!</span>
                          </div>
                          <div className="font-mono text-2xs text-slate-300 space-y-0.5">
                            <div>PNR / Booking Ref: <span className="text-amber-400 font-bold">IND-TRV-{Math.floor(100000 + Math.random() * 900000)}</span></div>
                            <div>Lead Guest: <span className="text-white font-bold">{guestName}</span></div>
                            <div>Check-In: <span className="text-white">{selectedCheckInDate}</span></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-center p-3 bg-slate-900 border border-slate-800 rounded-2xl gap-3">
                          <QrCode className="w-10 h-10 text-amber-400" />
                          <div className="text-2xs text-slate-300">
                            <div className="font-bold text-white">Digital Check-In QR Pass</div>
                            <div>Ready to scan at arrival counter</div>
                          </div>
                        </div>

                        {/* Cancellation Test Trigger */}
                        <div className="border-t border-slate-800 pt-3">
                          {!cancellationSimulated ? (
                            <button
                              onClick={() => setCancellationSimulated(true)}
                              className="w-full py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all"
                            >
                              Simulate Cancellation &amp; Refund Request
                            </button>
                          ) : (
                            <div className="bg-rose-950/50 border border-rose-500/40 p-3 rounded-2xl text-2xs space-y-1">
                              <div className="font-bold text-rose-300 flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Cancellation Eligibility Confirmed</span>
                              </div>
                              <p className="text-slate-300">
                                Refund of ₹{(currentOperator.mockInventoryItems[0].price).toLocaleString()} initiated to original UPI source within 5 business days.
                              </p>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            setBookingStep("select");
                            setSelectedInventoryItem(null);
                          }}
                          className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                        >
                          Reset Simulator
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Reviews Summary */}
                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
                    <h4 className="font-bold text-white text-xs flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>Verified Customer Ratings</span>
                    </h4>
                    <div className="space-y-2 text-2xs">
                      <div className="flex justify-between text-slate-300">
                        <span>Cleanliness &amp; Sanitisation</span>
                        <span className="font-bold text-amber-400">4.9 / 5.0</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Staff Hospitality &amp; Service</span>
                        <span className="font-bold text-amber-400">4.9 / 5.0</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Value for Money</span>
                        <span className="font-bold text-amber-400">4.8 / 5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB 2: OPERATOR DASHBOARD — FRONTEND */}
          {/* ======================================================================= */}
          {activeTab === "partner_dashboard" && (
            <div className="space-y-6 max-w-6xl mx-auto">
              
              {/* Partner Overview Stats Banner */}
              <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border border-indigo-500/40 rounded-3xl p-6 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-amber-500 text-slate-950">
                        {currentOperator.partnerListingPlans.currentPlan} Tier Partner
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Status: {currentOperator.partnerListingPlans.planStatus}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {currentOperator.name} — Partner Console
                    </h3>
                    <p className="text-xs text-slate-300">
                      Authorized operator management portal for inventory, reservations, listing plans, commissions &amp; bank settlement status.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-slate-900/90 border border-slate-700/80 px-4 py-2.5 rounded-2xl text-center">
                      <div className="text-2xs uppercase tracking-wider text-slate-400 font-bold">
                        Gross MTD Bookings
                      </div>
                      <div className="text-lg font-black text-amber-400">
                        ₹{currentOperator.partnerListingPlans.grossBookingsThisMonth.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-700/80 px-4 py-2.5 rounded-2xl text-center">
                      <div className="text-2xs uppercase tracking-wider text-slate-400 font-bold">
                        Net Payout (Disbursed)
                      </div>
                      <div className="text-lg font-black text-emerald-400">
                        ₹{currentOperator.partnerListingPlans.netPayoutThisMonth.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub Tab Navigation inside Partner Console */}
                <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-800/80">
                  <button
                    onClick={() => setPartnerSubTab("manage_overview")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      partnerSubTab === "manage_overview"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    1. Authorized Management Controls ({deepSpec?.operatorDashboardManageList.length || 14})
                  </button>
                  <button
                    onClick={() => setPartnerSubTab("listing_plan")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      partnerSubTab === "listing_plan"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    2. Listing Plan Breakdown
                  </button>
                  <button
                    onClick={() => setPartnerSubTab("commission_plan")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      partnerSubTab === "commission_plan"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    3. Commission &amp; Settlements
                  </button>
                </div>
              </div>

              {/* Sub Tab 1: Authorized Management Controls List */}
              {partnerSubTab === "manage_overview" && (
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-indigo-400" />
                      <h4 className="text-base font-bold text-white">
                        Authorized Partner Management Functions
                      </h4>
                    </div>
                    <span className="text-2xs font-extrabold text-slate-400">
                      Zero server credentials or internal rate logic exposed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(deepSpec?.operatorDashboardManageList || []).map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex items-start gap-3 hover:border-slate-700 transition-colors"
                      >
                        <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-white">
                            {item.split("(")[0]}
                          </div>
                          {item.includes("(") && (
                            <div className="text-2xs text-slate-400">
                              {item.substring(item.indexOf("("))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub Tab 2: Listing Plan Breakdown */}
              {partnerSubTab === "listing_plan" && (
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-400" />
                        <span>LISTING PLAN — Partner Frontend View</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Active tier subscription, visibility parameters, package limits &amp; lead access privileges
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-2xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {deepSpec?.listingPlan.planStatus || "Active"}
                    </span>
                  </div>

                  {/* Visual Structure Tree Box */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                        <div className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Plan Name</div>
                        <div className="text-sm font-extrabold text-amber-300">
                          {deepSpec?.listingPlan.planName || currentOperator.partnerListingPlans.currentPlan + " Partner"}
                        </div>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                        <div className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Listing Duration</div>
                        <div className="text-sm font-extrabold text-white">
                          {deepSpec?.listingPlan.listingDuration || "12 Months (Auto-Renewing)"}
                        </div>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                        <div className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Package / Listing Limit</div>
                        <div className="text-sm font-extrabold text-emerald-400">
                          {deepSpec?.listingPlan.packageOrListingLimit || `${currentOperator.partnerListingPlans.inventorySlotsTotal} Allowed (${currentOperator.partnerListingPlans.inventorySlotsUsed} Active)`}
                        </div>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                        <div className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Package Visibility</div>
                        <div className="text-xs font-semibold text-slate-200">
                          {deepSpec?.listingPlan.packageVisibility || currentOperator.partnerListingPlans.searchVisibilityBoost}
                        </div>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                        <div className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Featured Listing Status</div>
                        <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{deepSpec?.listingPlan.featuredListingOption || deepSpec?.listingPlan.featuredListingEligibility || "Eligible & Badged"}</span>
                        </div>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                        <div className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Lead / Booking Access</div>
                        <div className="text-xs font-semibold text-slate-200">
                          {deepSpec?.listingPlan.leadBookingAccess || currentOperator.partnerListingPlans.leadAccess}
                        </div>
                      </div>
                    </div>

                    {/* Listing Plan Tree Diagram */}
                    <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                        <Layers className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Listing Plan Hierarchy</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-2xs text-amber-300 whitespace-pre overflow-x-auto leading-relaxed">
{`LISTING PLAN
├── Plan name
├── Listing duration
├── ${selectedOperatorId === "cab" ? "Vehicle/listing limit" : selectedOperatorId === "restaurant" ? "Menu/profile listing limits" : selectedOperatorId === "houseboat" ? "Houseboat listing limit" : "Package/service listing limit"}
├── Profile visibility / Search visibility
├── Featured listing option
└── Plan status`}
                      </div>
                      <div className="text-3xs text-slate-400">
                        Zero backend pricing algorithms or tier underwriting rules exposed to client.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub Tab 3: Commission & Settlements */}
              {partnerSubTab === "commission_plan" && (
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                        <span>COMMISSION &amp; SETTLEMENT — Partner Frontend View</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Authorized commission rates, payable balances &amp; banking settlement schedule
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-2xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Settlement Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <div className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Applicable Commission Plan</div>
                        <div className="text-sm font-bold text-white">
                          {deepSpec?.commission.applicableCommissionPlan || `${currentOperator.categoryName} Standard Plan`}
                        </div>
                        <div className="text-2xs text-indigo-300">
                          Booking Commission Rate: <strong>{deepSpec?.commission.bookingCommission || `${currentOperator.partnerListingPlans.commissionRatePercentage}% on Gross Value`}</strong>
                        </div>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <div className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Commission Deducted / Status</div>
                        <div className="text-sm font-bold text-amber-400">
                          {deepSpec?.commission.commissionAmountStatus || `Reconciled against ₹${currentOperator.partnerListingPlans.grossBookingsThisMonth.toLocaleString()} Gross`}
                        </div>
                        <div className="text-2xs text-slate-400">
                          Fully compliant with GST &amp; Section 194O TDS deductions
                        </div>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <div className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Net Operator Payable Amount</div>
                        <div className="text-lg font-black text-emerald-400">
                          {deepSpec?.commission.netOperatorAmount || `₹${currentOperator.partnerListingPlans.netPayoutThisMonth.toLocaleString()}`}
                        </div>
                        <div className="text-2xs text-slate-400">
                          Disbursed via automated NEFT / RTGS / Instant UPI batch
                        </div>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <div className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Settlement Status &amp; Next Batch</div>
                        <div className="text-sm font-bold text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>{deepSpec?.commission.settlementStatus || currentOperator.partnerListingPlans.nextPayoutDate}</span>
                        </div>
                        <div className="text-2xs text-slate-400">
                          Cycle: {currentOperator.partnerListingPlans.settlementCycle}
                        </div>
                      </div>
                    </div>

                    {/* Commission Tree Diagram */}
                    <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Commission Hierarchy</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-2xs text-emerald-300 whitespace-pre overflow-x-auto leading-relaxed">
{`COMMISSION
├── Applicable commission plan
├── ${selectedOperatorId === "restaurant" ? "Booking/order commission" : "Booking commission"}
├── Commission status
├── ${selectedOperatorId === "corporate" ? "Net payable/receivable amount" : "Net operator amount"}
└── Settlement status`}
                      </div>
                      <div className="text-3xs text-slate-400">
                        Commission calculation logic &amp; escrow accounts strictly secluded on backend.
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-2xs text-amber-200 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Strict Security Rule:</strong> Only authorized business summary information is shown. Internal commission rules, dynamic algorithmic pricing triggers, and backend settlement banking tokens remain backend-controlled and are never exposed to the frontend.
                    </span>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB 3: BACKEND MODULES — NEVER DISPLAYED & ARCHITECTURE */}
          {/* ======================================================================= */}
          {activeTab === "backend_isolation" && (
            <div className="space-y-6 max-w-6xl mx-auto">
              
              {/* Security Shield Banner */}
              <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 border border-emerald-500/40 rounded-3xl p-6 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-emerald-500 text-slate-950 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Zero Frontend Leakage</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                        {currentOperator.categoryName} Security Shield
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      3. Backend Modules — NEVER DISPLAYED
                    </h3>
                    <p className="text-xs text-slate-300 max-w-3xl">
                      {deepSpec?.architectureNotes || "Frontend shows only authorized profile, availability, pricing and booking information. Backend modules remain server-side and are never displayed or exposed to the frontend."}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-4 py-3 rounded-2xl shrink-0">
                    <Lock className="w-6 h-6 text-emerald-400" />
                    <div>
                      <div className="text-xs font-black text-white">100% Server Encrypted</div>
                      <div className="text-3xs text-slate-400">PostgreSQL • RBAC • AES-256 Vault</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3-Column Architecture Matrix */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Col 1: Backend Microservices Tree */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-indigo-400" />
                      <h4 className="text-sm font-bold text-white">
                        {currentOperator.categoryName.toUpperCase()} BACKEND SERVICES
                      </h4>
                    </div>
                    <span className="text-3xs font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      Hidden Server-Side
                    </span>
                  </div>

                  <div className="space-y-1.5 font-mono text-2xs text-slate-300">
                    {(deepSpec?.backendModulesNeverDisplayed || currentOperator.backendHiddenNeverDisplayed.backendServices).map((service, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center gap-2"
                      >
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        <span className="truncate">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Col 2: 🔐 Backend Data Never Displayed */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-400" />
                      <h4 className="text-sm font-bold text-white">
                        🔐 Concealed Data &amp; Secrets
                      </h4>
                    </div>
                    <span className="text-3xs font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Never Exposed
                    </span>
                  </div>

                  <div className="space-y-1.5 text-2xs text-slate-300">
                    {(deepSpec?.backendDataNeverDisplayed || currentOperator.backendHiddenNeverDisplayed.databaseTables).map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-start gap-2 text-slate-300"
                      >
                        <EyeOff className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span className="font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Col 3: Architecture Diagram */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-sm font-bold text-white">
                        System Architecture Topology
                      </h4>
                    </div>
                    <span className="text-3xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Secured via Port 3000
                    </span>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 font-mono text-2xs text-emerald-300 whitespace-pre overflow-x-auto leading-relaxed">
                    {deepSpec?.architectureAscii || `FRONTEND
   │
   ▼
SECURE API LAYER
   │
   ▼
BACKEND SERVICES
   │
   ├── Database
   ├── Payment Gateway
   └── External APIs`}
                  </div>

                  <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1 text-2xs text-slate-400">
                    <div className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Security Guarantee</span>
                    </div>
                    <p>
                      No database schemas, internal partner IDs, payment gateway private keys, raw KYC certificates, or commission formulas are accessible from the browser client.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* FOOTER BAR */}
        {/* ========================================================================= */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-2xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Selected Profile: <strong className="text-white">{currentOperator.name}</strong> ({currentOperator.categoryName})
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span>Secure Port: <strong className="text-slate-200">3000</strong></span>
            <span>Auth: <strong className="text-slate-200">RBAC Token Bearer</strong></span>
            <button
              onClick={onClose}
              className="px-4 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              Close Super Dashboard
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
