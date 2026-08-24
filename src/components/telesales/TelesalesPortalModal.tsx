import React, { useState } from "react";
import {
  X,
  Phone,
  PhoneCall,
  PhoneForwarded,
  PhoneOff,
  Users,
  Target,
  DollarSign,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Send,
  MessageSquare,
  FileText,
  CreditCard,
  Building2,
  MapPin,
  Flame,
  Zap,
  Layers,
  Lock,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  UserCheck,
  Activity,
  Plus,
} from "lucide-react";
import {
  TelesalesExecutive,
  TelesalesLead,
  TelesalesIncentiveTierConfig,
  ServiceCategory,
} from "../../types";
import {
  TELESALES_EXECUTIVES_LIST,
  TELESALES_LEADS_DATABASE,
  TELESALES_INCENTIVE_TIERS_CONFIG,
  TELESALES_CALL_LOGS_STREAM,
  TELESALES_FRAUD_ALERTS,
} from "../../data/telesalesData";

interface TelesalesPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBookingDetails?: (item: any) => void;
}

export function TelesalesPortalModal({
  isOpen,
  onClose,
  onOpenBookingDetails,
}: TelesalesPortalModalProps) {
  const [executives, setExecutives] = useState<TelesalesExecutive[]>(TELESALES_EXECUTIVES_LIST);
  const [selectedExecId, setSelectedExecId] = useState<string>("EXEC-WFH-101");
  const [leads, setLeads] = useState<TelesalesLead[]>(TELESALES_LEADS_DATABASE);
  const [incentiveTiers, setIncentiveTiers] = useState<TelesalesIncentiveTierConfig[]>(TELESALES_INCENTIVE_TIERS_CONFIG);
  
  const [activeTab, setActiveTab] = useState<"dashboard" | "call_list" | "incentives" | "backend_engine">("dashboard");
  const [selectedLead, setSelectedLead] = useState<TelesalesLead | null>(null);
  
  // Call in progress simulation state
  const [activeCallingLead, setActiveCallingLead] = useState<TelesalesLead | null>(null);
  const [callTimerSeconds, setCallTimerSeconds] = useState(0);
  const [isCallingActive, setIsCallingActive] = useState(false);
  
  // Lead action form
  const [callStatusInput, setCallStatusInput] = useState<string>("Connected - High Interest");
  const [noteInput, setNoteInput] = useState<string>("");
  const [followUpDateInput, setFollowUpDateInput] = useState<string>("2026-08-24 11:00");
  const [quoteInput, setQuoteInput] = useState<string>("");
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");

  if (!isOpen) return null;

  const currentExec = executives.find((e) => e.id === selectedExecId) || executives[0];

  const handleStartCall = (lead: TelesalesLead) => {
    setActiveCallingLead(lead);
    setIsCallingActive(true);
    setCallTimerSeconds(0);
    setSelectedLead(lead);
  };

  const handleEndCall = () => {
    setIsCallingActive(false);
    setActionSuccessMsg(`Call logged with ${activeCallingLead?.customerName} (${Math.floor(callTimerSeconds / 60)}m ${callTimerSeconds % 60}s)`);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  const handleSaveLeadProgress = () => {
    if (!selectedLead) return;

    const newNote = noteInput.trim()
      ? {
          id: `n-${Date.now()}`,
          timestamp: "Just now",
          author: currentExec.fullName,
          text: noteInput,
          nextAction: followUpDateInput ? `Follow-up set for ${followUpDateInput}` : undefined,
        }
      : null;

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === selectedLead.id) {
          const updatedNotes = newNote ? [newNote, ...l.notes] : l.notes;
          return {
            ...l,
            callStatus: callStatusInput as any,
            followUpDateTime: followUpDateInput || l.followUpDateTime,
            quoteAmountINR: quoteInput ? parseInt(quoteInput, 10) : l.quoteAmountINR,
            notes: updatedNotes,
            lastUpdatedDate: "Just now",
            stage:
              callStatusInput === "Booking Completed"
                ? "CONVERTED"
                : callStatusInput === "Payment Link Generated"
                ? "PAYMENT_LINK_SENT"
                : callStatusInput === "Quotation Shared on WhatsApp"
                ? "QUOTATION_SENT"
                : l.stage,
          };
        }
        return l;
      })
    );

    // If converted, increment executive conversion
    if (callStatusInput === "Booking Completed" && selectedLead.stage !== "CONVERTED") {
      setExecutives((prev) =>
        prev.map((e) => {
          if (e.id === currentExec.id) {
            const newAchieved = e.monthlyAchievedBookings + 1;
            const newTier = newAchieved > 150 ? 4 : newAchieved > 100 ? 3 : newAchieved > 50 ? 2 : 1;
            return {
              ...e,
              monthlyAchievedBookings: newAchieved,
              todayConversionsCount: e.todayConversionsCount + 1,
              currentIncentiveTier: newTier as any,
              earnedBookingIncentiveINR: e.earnedBookingIncentiveINR + (newTier === 4 ? 600 : newTier === 3 ? 425 : newTier === 2 ? 275 : 150),
              totalMonthlyEarningsINR: e.totalMonthlyEarningsINR + (newTier === 4 ? 600 : newTier === 3 ? 425 : newTier === 2 ? 275 : 150),
            };
          }
          return e;
        })
      );
    }

    setActionSuccessMsg(`Lead ${selectedLead.leadNumber} updated successfully!`);
    setNoteInput("");
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.customerPhone.includes(searchQuery) ||
      lead.leadNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.destinationRequested.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "all" || lead.serviceCategory === categoryFilter;
    const matchesStage = stageFilter === "all" || lead.stage === stageFilter;

    return matchesSearch && matchesCategory && matchesStage;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95">
        
        {/* ========================================================================= */}
        {/* MODAL TOP BAR: TELESALES WFH EXECUTIVE SUITE */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-5 text-white flex flex-wrap items-center justify-between gap-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-wider border border-indigo-500/30">
                  WFH Executive Portal
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{currentExec.currentShiftStatus.replace(/_/g, " ")}</span>
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Telesales &amp; Work-From-Home Sales Suite
              </h2>
            </div>
          </div>

          {/* Switch Executive / Work Mode Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-xs">
              <Users className="w-3.5 h-3.5 text-indigo-300" />
              <select
                value={selectedExecId}
                onChange={(e) => setSelectedExecId(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                {executives.map((ex) => (
                  <option key={ex.id} value={ex.id} className="bg-slate-900 text-white">
                    {ex.fullName} ({ex.role.split(" ")[0]} • Tier {ex.currentIncentiveTier})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LIVE IN-CALL BANNER (WHEN CALL IS SIMULATED) */}
        {/* ========================================================================= */}
        {isCallingActive && activeCallingLead && (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-3 text-white flex items-center justify-between shadow-inner px-6 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full animate-bounce">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-100">
                  Call In Progress with {activeCallingLead.customerName}
                </span>
                <p className="text-[11px] text-emerald-100 font-mono">
                  Number: {activeCallingLead.customerPhone} • Destination: {activeCallingLead.destinationRequested}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleEndCall}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>End Call &amp; Log Summary</span>
              </button>
            </div>
          </div>
        )}

        {/* Feedback alert toast */}
        {actionSuccessMsg && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 flex items-center gap-2 text-xs font-bold text-emerald-800 animate-in slide-in-from-top">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: "dashboard", label: "Executive Dashboard", icon: Target },
            { id: "call_list", label: "Active Lead Queue & Dialer", icon: PhoneCall, count: leads.length },
            { id: "incentives", label: "Commission & Target Incentive", icon: Award },
            { id: "backend_engine", label: "Backend AI Routing & Audit", icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 border-b-2 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px] font-black">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: EXECUTIVE DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === "dashboard" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Top KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-black">Today&apos;s Calls Dialed</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-slate-900">{currentExec.todayCallsDialed}</span>
                  <span className="text-xs text-emerald-600 font-bold">{currentExec.todayConnectedCalls} Connected</span>
                </div>
                <p className="text-[10px] text-slate-500">Avg Talk Time: {currentExec.averageTalkTimeMinutes} mins</p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-black">Today&apos;s Conversions</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-indigo-600">{currentExec.todayConversionsCount}</span>
                  <span className="text-xs text-slate-500 font-bold">₹{(currentExec.todayConvertedGMV / 1000).toFixed(0)}k GMV</span>
                </div>
                <p className="text-[10px] text-emerald-600 font-bold">Conv. Rate: {currentExec.conversionRatePercent}%</p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-black">Monthly Target Bookings</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-slate-900">
                    {currentExec.monthlyAchievedBookings} / {currentExec.monthlyTargetBookings}
                  </span>
                  <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Tier {currentExec.currentIncentiveTier}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-1.5 rounded-full"
                    style={{
                      width: `${Math.min(100, (currentExec.monthlyAchievedBookings / currentExec.monthlyTargetBookings) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-4 text-white shadow-md space-y-1">
                <span className="text-[10px] text-indigo-300 uppercase font-black">Total Month Earnings</span>
                <div className="text-2xl font-black text-amber-400">
                  ₹{currentExec.totalMonthlyEarningsINR.toLocaleString("en-IN")}
                </div>
                <p className="text-[10px] text-slate-300">
                  Salary ₹{currentExec.baseFixedSalaryINR.toLocaleString()} + Incentives ₹{currentExec.earnedBookingIncentiveINR.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Target Accelerator Progress Banner */}
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/60 rounded-3xl p-5 border border-amber-200 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#FF8A00] text-white text-[10px] font-black uppercase">
                    Configurable Target Incentive Ladder
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1">
                    Monthly Performance Tier:{" "}
                    <strong className="text-indigo-700">
                      Tier {currentExec.currentIncentiveTier} (₹
                      {currentExec.currentIncentiveTier === 4
                        ? 600
                        : currentExec.currentIncentiveTier === 3
                        ? 425
                        : currentExec.currentIncentiveTier === 2
                        ? 275
                        : 150}
                      /booking payout)
                    </strong>
                  </h3>
                </div>

                <div className="text-xs text-amber-900 font-bold bg-white/80 px-3 py-1.5 rounded-xl border border-amber-300">
                  Target: 100 bookings • Current: {currentExec.monthlyAchievedBookings} bookings
                </div>
              </div>

              {/* Tier steps */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2">
                {incentiveTiers.map((tier) => {
                  const isCurrent = currentExec.currentIncentiveTier === tier.tierNumber;
                  return (
                    <div
                      key={tier.tierNumber}
                      className={`p-3 rounded-2xl border text-xs transition-all ${
                        isCurrent
                          ? "bg-white border-indigo-600 shadow-md ring-2 ring-indigo-600/20"
                          : "bg-white/60 border-slate-200 text-slate-600"
                      }`}
                    >
                      <div className="flex items-center justify-between font-black">
                        <span>Tier {tier.tierNumber}</span>
                        <span className="text-indigo-600">₹{tier.perBookingIncentiveINR}/bk</span>
                      </div>
                      <span className="text-[10px] block font-bold text-slate-700 mt-0.5">
                        {tier.minBookings}–{tier.maxBookings === 9999 ? "150+" : tier.maxBookings} bookings
                      </span>
                      {tier.milestoneTargetBonusINR > 0 && (
                        <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold">
                          +₹{tier.milestoneTargetBonusINR.toLocaleString()} Bonus
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hot Inbound Leads Priority Queue */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#FF8A00]" />
                  <h3 className="font-black text-slate-900 text-base">
                    High Priority Leads Awaiting Contact
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab("call_list")}
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <span>Open Full Dialer Queue ({leads.length})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {leads.slice(0, 4).map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-indigo-500 shadow-sm space-y-3 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase">
                          {lead.serviceCategory}
                        </span>
                        <h4 className="font-black text-slate-900 text-sm mt-1">{lead.customerName}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{lead.city} • Budget: ₹{lead.budgetEstimateINR.toLocaleString("en-IN")}</span>
                        </p>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          lead.priority === "HOT"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {lead.priority}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded-xl line-clamp-2">
                      {lead.destinationRequested}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-[11px] text-slate-400 font-medium">Source: {lead.source}</span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            handleStartCall(lead);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call Lead</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ACTIVE LEAD QUEUE & DIALER WITH CONVERSION TOOL */}
        {/* ========================================================================= */}
        {activeTab === "call_list" && (
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Left Column: Leads Filter & List */}
            <div className="w-full md:w-1/2 border-r border-slate-200 flex flex-col overflow-hidden">
              {/* Search & Category Filter */}
              <div className="p-3 border-b border-slate-200 bg-slate-50 space-y-2 shrink-0">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by customer name, phone, or destination..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-indigo-600"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
                  {["all", "pilgrimage", "lodges", "corporate", "trains", "flights"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-colors whitespace-nowrap ${
                        categoryFilter === cat
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable Leads List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {filteredLeads.map((lead) => {
                  const isSelected = selectedLead?.id === lead.id;
                  return (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-indigo-50/70 border-indigo-600 shadow-sm"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-slate-900">{lead.customerName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({lead.leadNumber})</span>
                          </div>
                          <span className="text-xs font-mono text-indigo-700 font-bold block mt-0.5">
                            {lead.customerPhone}
                          </span>
                        </div>

                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${
                            lead.stage === "CONVERTED"
                              ? "bg-emerald-100 text-emerald-800"
                              : lead.stage === "PAYMENT_LINK_SENT"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {lead.stage.replace(/_/g, " ")}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                        📍 {lead.destinationRequested}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 mt-2 border-t border-slate-100">
                        <span>Est: ₹{lead.budgetEstimateINR.toLocaleString("en-IN")}</span>
                        <span className="font-bold text-slate-700">{lead.callStatus || "New Lead"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Lead Interaction / CRM Action Panel */}
            <div className="w-full md:w-1/2 flex-1 flex flex-col overflow-y-auto p-4 sm:p-5 bg-white space-y-4">
              {selectedLead ? (
                <>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-black text-slate-400">Lead Dossier</span>
                        <h3 className="text-lg font-black text-slate-900">{selectedLead.customerName}</h3>
                        <p className="text-xs text-slate-500">
                          {selectedLead.customerEmail} • {selectedLead.city}
                        </p>
                      </div>

                      <button
                        onClick={() => handleStartCall(selectedLead)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition-all"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Dial Customer</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Category</span>
                        <strong className="text-slate-800 capitalize">{selectedLead.serviceCategory}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Travel Date</span>
                        <strong className="text-slate-800">{selectedLead.travelDate}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Pax Count</span>
                        <strong className="text-slate-800">{selectedLead.paxCount} Travelers</strong>
                      </div>
                    </div>
                  </div>

                  {/* Call Outcome & Status Updater */}
                  <div className="space-y-3">
                    <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                      Update Call Status &amp; Quotation
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Call Disposition / Outcome
                        </label>
                        <select
                          value={callStatusInput}
                          onChange={(e) => setCallStatusInput(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-indigo-600"
                        >
                          <option value="Connected - High Interest">Connected - High Interest</option>
                          <option value="Quotation Shared on WhatsApp">Quotation Shared on WhatsApp</option>
                          <option value="Payment Link Generated">Payment Link Generated</option>
                          <option value="Booking Completed">Booking Completed (Instant Conversion)</option>
                          <option value="Call Later / Follow-up">Call Later / Follow-up</option>
                          <option value="Ringing / No Answer">Ringing / No Answer</option>
                          <option value="Not Interested">Not Interested</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Follow-up Date &amp; Time
                        </label>
                        <input
                          type="text"
                          value={followUpDateInput}
                          onChange={(e) => setFollowUpDateInput(e.target.value)}
                          placeholder="e.g. 2026-08-24 11:00 AM"
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-indigo-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Quotation Amount (INR)
                      </label>
                      <input
                        type="number"
                        value={quoteInput}
                        onChange={(e) => setQuoteInput(e.target.value)}
                        placeholder="e.g. 58500"
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Call Notes &amp; Next Action Items
                      </label>
                      <textarea
                        rows={2}
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Log notes about preferences, special food requests, room requirements, or payment terms..."
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-indigo-600"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        onClick={handleSaveLeadProgress}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Save Notes &amp; Conversion Status</span>
                      </button>
                    </div>
                  </div>

                  {/* Conversation & Activity History */}
                  <div className="space-y-2 pt-3 border-t border-slate-200">
                    <span className="text-[10px] uppercase font-black text-slate-400">Activity Log</span>
                    {selectedLead.notes.map((note) => (
                      <div key={note.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                          <span>{note.author}</span>
                          <span>{note.timestamp}</span>
                        </div>
                        <p className="text-slate-800">{note.text}</p>
                        {note.nextAction && (
                          <span className="inline-block text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                            ↳ {note.nextAction}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center p-6 space-y-2">
                  <PhoneCall className="w-10 h-10 text-slate-300" />
                  <p className="text-sm font-bold text-slate-600">Select a lead from the queue to start dialing</p>
                  <p className="text-xs text-slate-400">View customer requirements, log conversations, and trigger instant booking links.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: COMMISSION & TARGET INCENTIVE DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === "incentives" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="bg-gradient-to-br from-indigo-950 to-slate-900 rounded-3xl p-6 text-white space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-900 text-[10px] font-black uppercase">
                    Incentive Statement: August 2026
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black mt-1">
                    {currentExec.fullName}&apos;s Compensation &amp; Payout
                  </h3>
                  <p className="text-xs text-indigo-200 mt-0.5">
                    Model: Fixed Base Salary + Per-Booking Incentive + Milestone Target Bonus
                  </p>
                </div>

                <div className="bg-white/10 p-4 rounded-2xl border border-white/20 text-right">
                  <span className="text-[10px] text-indigo-300 uppercase block font-black">Net Total Payable</span>
                  <span className="text-3xl font-black text-amber-400">
                    ₹{currentExec.totalMonthlyEarningsINR.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* 3 Pillars Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/15">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/15">
                  <span className="text-[10px] text-slate-300 uppercase font-black block">1. Fixed Base Salary</span>
                  <span className="text-xl font-black text-white">₹{currentExec.baseFixedSalaryINR.toLocaleString("en-IN")}</span>
                  <p className="text-[10px] text-slate-400 mt-1">Monthly guaranteed compensation for full-time WFH shift.</p>
                </div>

                <div className="bg-white/10 p-4 rounded-2xl border border-white/15">
                  <span className="text-[10px] text-indigo-300 uppercase font-black block">2. Booking Incentives</span>
                  <span className="text-xl font-black text-emerald-400">₹{currentExec.earnedBookingIncentiveINR.toLocaleString("en-IN")}</span>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Calculated over {currentExec.monthlyAchievedBookings} converted bookings under Tier {currentExec.currentIncentiveTier}.
                  </p>
                </div>

                <div className="bg-white/10 p-4 rounded-2xl border border-white/15">
                  <span className="text-[10px] text-amber-300 uppercase font-black block">3. Milestone Target Bonus</span>
                  <span className="text-xl font-black text-amber-400">₹{currentExec.earnedMilestoneBonusINR.toLocaleString("en-IN")}</span>
                  <p className="text-[10px] text-slate-400 mt-1">Achieved upon crossing 100+ monthly bookings target.</p>
                </div>
              </div>
            </div>

            {/* Incentive Tiers Table */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-black text-slate-900 text-base">
                Configurable Monthly Incentive Rules
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-3">Tier</th>
                      <th className="py-3 px-3">Bookings Target Window</th>
                      <th className="py-3 px-3">Incentive Per Booking</th>
                      <th className="py-3 px-3">Target Milestone Bonus</th>
                      <th className="py-3 px-3">Current Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {incentiveTiers.map((tier) => {
                      const isCurrent = currentExec.currentIncentiveTier === tier.tierNumber;
                      return (
                        <tr key={tier.tierNumber} className={isCurrent ? "bg-indigo-50/70 font-bold" : ""}>
                          <td className="py-3 px-3 font-black text-slate-900">Tier {tier.tierNumber}</td>
                          <td className="py-3 px-3 text-slate-700">
                            {tier.minBookings} – {tier.maxBookings === 9999 ? "150+" : tier.maxBookings} bookings
                          </td>
                          <td className="py-3 px-3 text-indigo-700 font-black">₹{tier.perBookingIncentiveINR}</td>
                          <td className="py-3 px-3 text-amber-700">
                            {tier.milestoneTargetBonusINR > 0 ? `₹${tier.milestoneTargetBonusINR.toLocaleString()}` : "—"}
                          </td>
                          <td className="py-3 px-3">
                            {isCurrent ? (
                              <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-black text-[10px]">
                                Active Tier
                              </span>
                            ) : (
                              <span className="text-slate-400 font-normal">Eligible</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: BACKEND AI ENGINE & AUDIT LOGS (ADMIN ONLY ENGINE) */}
        {/* ========================================================================= */}
        {activeTab === "backend_engine" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4 border border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <h3 className="font-black text-lg text-white">
                  Backend Lead Assignment &amp; Anti-Fraud Inspection Engine
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Autonomous background engine managing Round-Robin skill routing, duplicate lead suppression, call duration audit, and executive commission escrow calculation.
              </p>
            </div>

            {/* Anti-Fraud Alerts Feed */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <h4 className="font-black text-slate-900 text-base">
                    Fraud &amp; Duplicate-Lead Detection Logs
                  </h4>
                </div>
                <span className="text-xs text-slate-400">Real-time Rule Scanner</span>
              </div>

              <div className="space-y-3">
                {TELESALES_FRAUD_ALERTS.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-rose-900 uppercase tracking-wider text-[10px]">
                        ⚠️ {alert.flagType.replace(/_/g, " ")} ({alert.severity})
                      </span>
                      <span className="text-slate-500 text-[10px]">{alert.flaggedAt}</span>
                    </div>
                    <p className="text-slate-800 font-medium">{alert.description}</p>
                    <div className="text-[10px] text-slate-500 flex items-center gap-3 pt-1">
                      <span>Customer: {alert.customerPhone}</span>
                      <span>•</span>
                      <span>Flagged Rep: {alert.executiveName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
