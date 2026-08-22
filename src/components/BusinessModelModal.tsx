import React, { useState } from "react";
import {
  X,
  TrendingUp,
  Percent,
  CreditCard,
  Building2,
  Ticket,
  Briefcase,
  Megaphone,
  Gem,
  Landmark,
  Share2,
  Gift,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  CheckCircle2,
  DollarSign,
  PieChart,
  BarChart3,
  SlidersHorizontal,
  Download,
  Copy,
  ChevronRight,
  Layers,
  Sparkles,
  Award,
  Info,
  RefreshCw,
  ExternalLink,
  Users,
  Calendar,
  Check,
  FileSpreadsheet,
} from "lucide-react";
import {
  RevenueStreamId,
  ServiceCategory,
} from "../types";
import {
  REVENUE_STREAMS_META,
  BOOKING_COMMISSION_RATES,
  CONVENIENCE_FEES_DATA,
  ADVERTISING_SLOTS_DATA,
  PREMIUM_PARTNER_PLANS,
  AFFILIATE_PRODUCTS_DATA,
  CORPORATE_TIERS_DATA,
  PROMO_CAMPAIGNS_DATA,
  UNIT_ECONOMICS_SUMMARY,
} from "../data/businessModelData";

interface BusinessModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStream?: RevenueStreamId;
}

export function BusinessModelModal({
  isOpen,
  onClose,
  initialStream = "booking_commissions",
}: BusinessModelModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "streams" | "simulator" | "unit_economics">("overview");
  const [selectedStreamId, setSelectedStreamId] = useState<RevenueStreamId>(initialStream);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // =========================================================================
  // INTERACTIVE REVENUE SIMULATOR STATE
  // =========================================================================
  const [simMonthlyUsers, setSimMonthlyUsers] = useState<number>(450000); // 4.5 Lakh MAU
  const [simConversionRate, setSimConversionRate] = useState<number>(4.2); // 4.2% conversion
  const [simAverageOrderValue, setSimAverageOrderValue] = useState<number>(4800); // ₹4,800 AOV
  const [simBlendedTakeRate, setSimBlendedTakeRate] = useState<number>(11.5); // 11.5% take rate
  const [simAncillaryAttachRate, setSimAncillaryAttachRate] = useState<number>(28); // 28% attach
  const [simActiveSaaSPartners, setSimActiveSaaSPartners] = useState<number>(650); // 650 subscribed partners
  const [simCorporateAccounts, setSimCorporateAccounts] = useState<number>(85); // 85 enterprise clients

  // Derived Calculations
  const simMonthlyBookings = Math.round((simMonthlyUsers * simConversionRate) / 100);
  const simMonthlyGMV = simMonthlyBookings * simAverageOrderValue;
  const simAnnualGMV = simMonthlyGMV * 12;

  // Revenue Streams Calculation
  const simCommissionRevenue = Math.round(simMonthlyGMV * (simBlendedTakeRate / 100));
  const simConvenienceFeeRevenue = Math.round(simMonthlyBookings * (simAncillaryAttachRate / 100) * 145);
  const simSaaSMRR = simActiveSaaSPartners * 3499;
  const simCorporateMonthlyFee = simCorporateAccounts * 35000;
  const simAdvertisingMonthly = Math.round(simMonthlyUsers * 0.45); // ₹0.45 ad yield per MAU
  const simAffiliateMonthly = Math.round(simMonthlyBookings * 0.22 * 180); // 22% attach at ₹180 CPA

  const simTotalMonthlyNetRevenue =
    simCommissionRevenue +
    simConvenienceFeeRevenue +
    simSaaSMRR +
    simCorporateMonthlyFee +
    simAdvertisingMonthly +
    simAffiliateMonthly;

  const simTotalAnnualNetRevenue = simTotalMonthlyNetRevenue * 12;
  const simRealizedTakeRate = ((simTotalMonthlyNetRevenue / simMonthlyGMV) * 100).toFixed(2);
  const simMonthlyEbitda = Math.round(simTotalMonthlyNetRevenue * 0.284);
  const simAnnualEbitda = simMonthlyEbitda * 12;

  // Agent Markup Interactive State
  const [agentBasePrice, setAgentBasePrice] = useState<number>(6500);
  const [agentMarkupAmount, setAgentMarkupAmount] = useState<number>(850);

  // Ad Placement CPC Calculator State
  const [selectedAdCpc, setSelectedAdCpc] = useState<number>(18);
  const [selectedAdClicks, setSelectedAdClicks] = useState<number>(2500);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getStreamIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case "Ticket":
        return <Ticket className={className} />;
      case "Building2":
        return <Building2 className={className} />;
      case "CreditCard":
        return <CreditCard className={className} />;
      case "Briefcase":
        return <Briefcase className={className} />;
      case "Megaphone":
        return <Megaphone className={className} />;
      case "Gem":
        return <Gem className={className} />;
      case "Landmark":
        return <Landmark className={className} />;
      case "Share2":
        return <Share2 className={className} />;
      case "Gift":
        return <Gift className={className} />;
      default:
        return <DollarSign className={className} />;
    }
  };

  const selectedStreamMeta =
    REVENUE_STREAMS_META.find((s) => s.id === selectedStreamId) || REVENUE_STREAMS_META[0];

  const handleCopyFinancials = () => {
    const summary = `
=== BHARATYATRA (INDIA TRAVEL) BUSINESS MODEL & FINANCIAL SUMMARY ===
Annual GMV Run-Rate: ₹${(simAnnualGMV / 10000000).toFixed(2)} Cr
Annual Net Revenue: ₹${(simTotalAnnualNetRevenue / 10000000).toFixed(2)} Cr
Annual EBITDA Profit: ₹${(simAnnualEbitda / 10000000).toFixed(2)} Cr
Blended Realized Take-Rate: ${simRealizedTakeRate}%
Monthly Active Users (MAU): ${simMonthlyUsers.toLocaleString("en-IN")}
Monthly Bookings: ${simMonthlyBookings.toLocaleString("en-IN")}
Average Order Value (AOV): ₹${simAverageOrderValue.toLocaleString("en-IN")}

9 Monetization Streams:
1. Direct Booking Commissions (38.5% share)
2. B2B Partner Commissions (16.2% share)
3. Service & Convenience Fees (14.8% share)
4. Agent Commissions & Markups (9.4% share)
5. Advertising & Sponsored Listings (7.1% share)
6. Premium Partner SaaS Subscriptions (5.3% share)
7. Corporate Travel Services (4.2% share)
8. Affiliate & Ancillary Partnerships (2.8% share)
9. Co-Branded Promotional Campaigns (1.7% share)
    `.trim();

    navigator.clipboard.writeText(summary);
    showToast("Financial summary copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-7xl max-h-[96vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* TOAST ALERT */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-60 bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs sm:text-sm animate-in slide-in-from-top-4 duration-300">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. TOP HEADER */}
        <div className="bg-slate-950 border-b border-slate-800 p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 via-purple-500 to-emerald-500 flex items-center justify-center shadow-lg text-white font-black">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-extrabold border border-indigo-500/30">
                    Monetization & Financial Architecture
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    9 Active Revenue Streams
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5 tracking-tight flex items-center gap-2">
                  <span>India Travel (BharatYatra) Business Model</span>
                </h1>
                <p className="text-xs text-slate-400">
                  Full-stack monetization engine spanning direct commissions, vendor tiers, convenience fees, SaaS subscriptions, corporate desks & advertising.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap justify-between lg:justify-end">
              <button
                onClick={handleCopyFinancials}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
                title="Copy Financial Summary"
              >
                <Copy className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export P&L Summary</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("simulator");
                  showToast("Opened interactive live revenue simulator");
                }}
                className="px-3.5 py-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-black hover:opacity-95 transition-opacity flex items-center gap-1.5 shadow-xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 fill-slate-950" />
                <span>Live Revenue Simulator</span>
              </button>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 4 Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-1 scrollbar-none border-t border-slate-800/80 mt-3">
            {[
              { id: "overview", label: "Financial Architecture & Mix", icon: PieChart },
              { id: "streams", label: "9 Dedicated Revenue Streams", icon: Layers },
              { id: "simulator", label: "Interactive Revenue Simulator", icon: SlidersHorizontal },
              { id: "unit_economics", label: "Unit Economics & Margins", icon: BarChart3 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/30 scale-[1.02]"
                      : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. MAIN BODY CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/50 space-y-6">

          {/* ======================================================== */}
          {/* TAB 1: OVERVIEW & 9-STREAM FINANCIAL MIX */}
          {/* ======================================================== */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* High-Level Headline Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Annual GMV Run-Rate */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Annualized GMV Run-Rate</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white mt-2">
                    ₹485.4 Cr
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-400 mt-1 font-medium">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>3.8M annual bookings fulfilled</span>
                  </div>
                </div>

                {/* Net Platform Revenue */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Annual Net Platform Revenue</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-emerald-300 mt-2">
                    ₹54.98 Cr
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Blended Net Take Rate: <span className="text-white font-bold">11.33%</span>
                  </div>
                </div>

                {/* EBITDA Operating Profit */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Operating EBITDA Profit</span>
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Percent className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-purple-300 mt-2">
                    ₹15.61 Cr
                  </div>
                  <div className="text-[11px] text-purple-400 font-bold mt-1">
                    28.4% EBITDA Operating Margin
                  </div>
                </div>

                {/* Diversification Index */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Non-Commission Revenue Share</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Zap className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-amber-300 mt-2">
                    45.3%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    From SaaS, Ads, Ancillaries & B2B Fees
                  </div>
                </div>
              </div>

              {/* 9 Revenue Streams Matrix Visual Breakdown */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-indigo-400" />
                      <span>Revenue Stream Contribution & Mix</span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Multi-engine monetization model ensuring high margin resilience against seasonal fluctuations.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("streams")}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>Deep-dive into 9 streams</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Multi-Segment Stacked Progress Bar */}
                <div className="w-full h-4 rounded-full bg-slate-950 overflow-hidden flex shadow-inner">
                  {REVENUE_STREAMS_META.map((stream) => (
                    <div
                      key={stream.id}
                      className={`h-full bg-linear-to-r ${stream.color} transition-all`}
                      style={{ width: `${stream.contributionPercent}%` }}
                      title={`${stream.name}: ${stream.contributionPercent}% (₹${(stream.projectedAnnualRevenue / 10000000).toFixed(2)} Cr)`}
                    ></div>
                  ))}
                </div>

                {/* 9 Stream Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                  {REVENUE_STREAMS_META.map((stream, idx) => (
                    <div
                      key={stream.id}
                      onClick={() => {
                        setSelectedStreamId(stream.id);
                        setActiveTab("streams");
                      }}
                      className="bg-slate-900/80 hover:bg-slate-850 border border-slate-700/70 hover:border-indigo-500/60 rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01] group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className={`w-8 h-8 rounded-xl bg-linear-to-br ${stream.color} flex items-center justify-center text-white font-bold shadow-md`}>
                            {getStreamIcon(stream.icon, "w-4 h-4")}
                          </div>
                          <span className="font-mono text-xs font-black text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-lg border border-indigo-500/30">
                            {stream.contributionPercent}%
                          </span>
                        </div>

                        <div>
                          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                            0{idx + 1}. {stream.category}
                          </div>
                          <h3 className="text-sm font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                            {stream.name}
                          </h3>
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {stream.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Projected Run-rate:</span>
                        <span className="font-mono font-bold text-emerald-400">
                          ₹{(stream.projectedAnnualRevenue / 10000000).toFixed(2)} Cr/yr
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Advantages / Business Moat */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                    <Zap className="w-4 h-4" />
                    <span>High-Margin Ancillaries</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Zero-inventory risk revenue from convenience charges, express Tatkal automation, and insurance partnerships providing 85%+ gross profit margins.
                  </p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <Gem className="w-4 h-4" />
                    <span>Sticky SaaS Partner Lock-in</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Hotels and fleet operators subscribe to BharatYatra Pro & Enterprise SaaS tiers to unlock zero-commission quotas, driving high-predictability recurring MRR.
                  </p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                    <Gift className="w-4 h-4" />
                    <span>Bank & Merchant Co-Funding</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Over 75% of customer promotional discounts are funded directly by banking partners (HDFC, ICICI, SBI) preserving our gross margins.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: 9 DEDICATED STREAM EXPLORERS */}
          {/* ======================================================== */}
          {activeTab === "streams" && (
            <div className="space-y-6">
              
              {/* Stream Selector Horizontal Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {REVENUE_STREAMS_META.map((stream, idx) => {
                  const isSelected = stream.id === selectedStreamId;
                  return (
                    <button
                      key={stream.id}
                      onClick={() => setSelectedStreamId(stream.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                        isSelected
                          ? `bg-linear-to-r ${stream.color} text-white shadow-md ring-2 ring-white/20 scale-[1.02]`
                          : "bg-slate-800 text-slate-400 hover:bg-slate-750 hover:text-slate-200 border border-slate-700"
                      }`}
                    >
                      {getStreamIcon(stream.icon, "w-3.5 h-3.5")}
                      <span>0{idx + 1}. {stream.shortName}</span>
                    </button>
                  );
                })}
              </div>

              {/* Stream Header Banner */}
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-5 sm:p-6 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-linear-to-br ${selectedStreamMeta.color} flex items-center justify-center text-white shadow-lg font-black`}>
                      {getStreamIcon(selectedStreamMeta.icon, "w-6 h-6")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-400">{selectedStreamMeta.category}</span>
                        <span className="px-2 py-0.2 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                          {selectedStreamMeta.badge}
                        </span>
                      </div>
                      <h2 className="text-xl font-black text-white mt-0.5">
                        {selectedStreamMeta.name}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-slate-900/80 p-3 rounded-2xl border border-slate-700/60">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Formula / Basis</span>
                      <span className="font-mono text-xs font-bold text-white">{selectedStreamMeta.takeRateFormula}</span>
                    </div>
                    <div className="h-6 w-px bg-slate-700"></div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Annual Volume Est.</span>
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        ₹{(selectedStreamMeta.projectedAnnualRevenue / 10000000).toFixed(2)} Cr
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
                  {selectedStreamMeta.description}
                </p>

                {/* Key Growth Drivers */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-700/60">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Core Drivers:</span>
                  {selectedStreamMeta.keyDrivers.map((driver, dIdx) => (
                    <span
                      key={dIdx}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 text-xs font-medium border border-slate-700/60 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{driver}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* STREAM SPECIFIC DETAILS & CALCULATORS */}

              {/* STREAM 1: DIRECT BOOKING COMMISSIONS TABLE */}
              {selectedStreamId === "booking_commissions" && (
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-md space-y-4 p-4">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-indigo-400" />
                    <span>Category Take-Rate & Unit Margin Schedule</span>
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950/80 text-[11px] font-extrabold uppercase text-slate-400 border-b border-slate-700">
                        <tr>
                          <th className="p-3">Service Category</th>
                          <th className="p-3">Base Commission %</th>
                          <th className="p-3">Average Order Value (AOV)</th>
                          <th className="p-3">Platform Net / Order</th>
                          <th className="p-3">Supplier Source</th>
                          <th className="p-3">Settlement Term</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60">
                        {BOOKING_COMMISSION_RATES.map((rate) => (
                          <tr key={rate.serviceCategory} className="hover:bg-slate-700/30 transition-colors">
                            <td className="p-3 font-bold text-white">
                              {rate.serviceName}
                            </td>
                            <td className="p-3 font-mono font-extrabold text-indigo-300">
                              {rate.baseCommissionPercent}%
                            </td>
                            <td className="p-3 font-semibold text-slate-200">
                              ₹{rate.averageOrderValue.toLocaleString("en-IN")}
                            </td>
                            <td className="p-3 font-mono font-extrabold text-emerald-400">
                              ₹{rate.netRevenuePerBooking.toFixed(1)}
                            </td>
                            <td className="p-3 text-slate-400 text-[11px]">
                              {rate.supplierType}
                            </td>
                            <td className="p-3 text-slate-300 text-[11px]">
                              {rate.paymentCycle}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* STREAM 2: PARTNER COMMISSIONS */}
              {selectedStreamId === "partner_commissions" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      <span>B2B Supplier Tier Progression</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Merchants and fleet operators scale their volume to unlock preferential commission slabs and channel manager integration.
                    </p>
                    <div className="space-y-2 pt-2">
                      {[
                        { tier: "Starter Merchant", gmv: "< ₹2 Lakhs / mo", rate: "20.0% standard take-rate" },
                        { tier: "Silver Verified", gmv: "₹2 - ₹10 Lakhs / mo", rate: "16.0% commission + 1% rebate" },
                        { tier: "Gold Partner", gmv: "₹10 - ₹25 Lakhs / mo", rate: "12.5% commission + 2% rebate" },
                        { tier: "Titanium Guild", gmv: "> ₹25 Lakhs / mo", rate: "9.0% commission + Instant Payout" },
                      ].map((t, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs">
                          <span className="font-bold text-white">{t.tier}</span>
                          <span className="text-slate-400">{t.gmv}</span>
                          <span className="font-mono font-bold text-emerald-400">{t.rate}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-400" />
                      <span>Direct Inventory Wholesaling</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Exclusive room-nights and coach blockouts purchased at 35% wholesale discounts during off-peak seasons, yielding 25%+ retail realization during holidays.
                    </p>
                    <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-3 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Contracted Wholesale Rooms:</span>
                        <span className="font-bold text-white">4,800+ Room-Nights</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Average Gross Wholesale Margin:</span>
                        <span className="font-bold text-emerald-400">26.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Yatra Pilgrimage Block Quotas:</span>
                        <span className="font-bold text-amber-300">12,500 seats / season</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STREAM 3: SERVICE & CONVENIENCE FEES */}
              {selectedStreamId === "service_convenience_fees" && (
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-4">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    <span>Transparent Service Fee Matrix</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {CONVENIENCE_FEES_DATA.map((fee) => (
                      <div key={fee.id} className="bg-slate-900/80 border border-slate-700/70 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-purple-300 font-bold bg-purple-500/20 px-2 py-0.5 rounded">
                            {fee.id}
                          </span>
                          <span className="font-mono text-xs font-black text-emerald-400">
                            {fee.feeType === "fixed" ? `₹${fee.rate}` : `${fee.rate}%`}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{fee.feeName}</h4>
                        <p className="text-[11px] text-slate-400">{fee.description}</p>
                        <div className="pt-2 border-t border-slate-800 flex justify-between text-[10px]">
                          <span className="text-slate-400">Annual Bookings:</span>
                          <span className="font-bold text-slate-200">{fee.annualVolumeEst.toLocaleString("en-IN")} orders</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STREAM 4: AGENT COMMISSIONS & MARKUPS */}
              {selectedStreamId === "agent_commissions_markups" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4">
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-amber-400" />
                      <span>Interactive Agent Custom Markup Calculator</span>
                    </h3>
                    <p className="text-xs text-slate-300">
                      Travel agents set custom profit markups for their retail walk-in clients. BharatYatra retains a 15% platform clearing fee.
                    </p>

                    <div className="space-y-3 pt-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">Net Wholesale Base Price:</span>
                          <span className="font-mono font-bold text-white">₹{agentBasePrice}</span>
                        </div>
                        <input
                          type="range"
                          min="1000"
                          max="25000"
                          step="500"
                          value={agentBasePrice}
                          onChange={(e) => setAgentBasePrice(Number(e.target.value))}
                          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">Agent Custom Added Markup:</span>
                          <span className="font-mono font-bold text-amber-300">₹{agentMarkupAmount}</span>
                        </div>
                        <input
                          type="range"
                          min="100"
                          max="3000"
                          step="50"
                          value={agentMarkupAmount}
                          onChange={(e) => setAgentMarkupAmount(Number(e.target.value))}
                          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-700/60 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Client Final Ticket Fare:</span>
                        <span className="font-mono font-black text-white text-sm">₹{(agentBasePrice + agentMarkupAmount).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Agent Net Profit:</span>
                        <span className="font-mono font-bold text-emerald-400">₹{Math.round(agentMarkupAmount * 0.85).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">BharatYatra Software Fee (15%):</span>
                        <span className="font-mono font-bold text-indigo-400">₹{Math.round(agentMarkupAmount * 0.15).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-400" />
                      <span>B2B Agent Network Power</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Over 22,000 retail travel agents in Tier 2, 3 and 4 towns rely on BharatYatra Agent Hub for instant Tatkal IRCTC ticketing, group flights, and holiday package white-label invoicing.
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700/60">
                        <span className="text-slate-400 block text-[10px]">Active Agents</span>
                        <span className="font-mono font-black text-white text-base">22,450+</span>
                      </div>
                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700/60">
                        <span className="text-slate-400 block text-[10px]">Agent Wallet Float</span>
                        <span className="font-mono font-black text-emerald-400 text-base">₹14.2 Cr</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STREAM 5: ADVERTISING & SPONSORED ADS */}
              {selectedStreamId === "advertising" && (
                <div className="space-y-4">
                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3">
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-pink-400" />
                      <span>Sponsored Ads Inventory & Live Bidding Marketplace</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {ADVERTISING_SLOTS_DATA.map((ad) => (
                        <div key={ad.id} className="bg-slate-900/90 border border-slate-700/70 rounded-xl p-3.5 space-y-2">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-mono font-bold text-pink-400 bg-pink-500/20 px-2 py-0.5 rounded">
                              {ad.pricingModel}
                            </span>
                            <span className="text-slate-400">CTR: <strong className="text-emerald-400">{ad.ctr}</strong></span>
                          </div>
                          <h4 className="text-xs font-bold text-white line-clamp-2">{ad.title}</h4>
                          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                            <span className="text-slate-400">Rate:</span>
                            <span className="font-mono font-black text-white">₹{ad.priceINR.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex justify-between">
                            <span>Active Brands:</span>
                            <span className="text-slate-200 font-medium">{ad.activeAdvertisers} sponsors</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CPC Click Yield Calculator */}
                  <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-white">Search CPC Campaign Simulator</span>
                      <p className="text-[11px] text-slate-400">
                        Calculate advertiser cost and BharatYatra advertising revenue based on keyword bids.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400">Bid CPC:</span>
                        <select
                          value={selectedAdCpc}
                          onChange={(e) => setSelectedAdCpc(Number(e.target.value))}
                          className="bg-slate-900 border border-slate-700 text-xs font-bold text-white rounded-lg px-2 py-1"
                        >
                          <option value={12}>₹12 / click (Budget Hotel)</option>
                          <option value={18}>₹18 / click (Metro Flight)</option>
                          <option value={28}>₹28 / click (Luxury Resort)</option>
                          <option value={45}>₹45 / click (Yatra Charter)</option>
                        </select>
                      </div>
                      <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-right">
                        <span className="text-[10px] text-slate-400 block">Yield on 5,000 clicks</span>
                        <span className="font-mono font-black text-pink-300">₹{(selectedAdCpc * 5000).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STREAM 6: PREMIUM PARTNER SAAS PLANS */}
              {selectedStreamId === "premium_partner_subscriptions" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {PREMIUM_PARTNER_PLANS.map((plan) => (
                      <div
                        key={plan.id}
                        className={`bg-slate-800/90 border rounded-2xl p-4 flex flex-col justify-between transition-all ${
                          plan.popular
                            ? "border-indigo-500 shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/30"
                            : "border-slate-700/80"
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-700/60 text-slate-300">
                              {plan.badge}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-base font-black text-white">{plan.planName}</h4>
                            <div className="mt-2 flex items-baseline gap-1">
                              <span className="text-2xl font-black text-white">
                                {plan.monthlyPrice === 0 ? "Free" : `₹${plan.monthlyPrice.toLocaleString("en-IN")}`}
                              </span>
                              {plan.monthlyPrice > 0 && <span className="text-xs text-slate-400">/ month</span>}
                            </div>
                          </div>

                          <ul className="space-y-1.5 pt-2 border-t border-slate-700/60 text-xs text-slate-300">
                            {plan.features.map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <button
                          onClick={() => showToast(`Simulated subscription to ${plan.planName} plan!`)}
                          className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition-all ${
                            plan.popular
                              ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md"
                              : "bg-slate-700 hover:bg-slate-600 text-slate-200"
                          }`}
                        >
                          {plan.monthlyPrice === 0 ? "Included by Default" : "Select SaaS Plan"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STREAM 7: CORPORATE TRAVEL SERVICES */}
              {selectedStreamId === "corporate_travel_services" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4">
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-indigo-400" />
                      <span>Corporate Travel Desk & GST Input Credit</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Enterprises save up to 18% on their corporate travel tax bills with automated GST credit reconciliation, automated flight approvals, and centralized monthly billing.
                    </p>

                    <div className="space-y-2 pt-1">
                      {CORPORATE_TIERS_DATA.map((tier, idx) => (
                        <div key={idx} className="bg-slate-900/90 p-3 rounded-xl border border-slate-700/60 text-xs flex justify-between items-center">
                          <div>
                            <span className="font-bold text-white block">{tier.tierName}</span>
                            <span className="text-[11px] text-slate-400">{tier.minEmployees}+ employee organizations</span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-black text-indigo-300">₹{tier.platformFeePerUserMonthly} / user / mo</span>
                            <span className="block text-[10px] text-emerald-400">{tier.creditPeriodDays} Days Credit</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4">
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span>Corporate Credit Line Financing</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      We offer pre-approved 15-45 day travel credit lines for verified companies, generating a 1.5% monthly financing margin (18% annualized return) backed by corporate guarantees.
                    </p>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-700/70 text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Corporate Credit Disbursed:</span>
                        <span className="font-bold text-white">₹8.5 Cr / mo</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Financing Spread (1.5%/mo):</span>
                        <span className="font-bold text-emerald-400">₹12.75 Lakhs / mo</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Default / Delinquency Rate:</span>
                        <span className="font-bold text-slate-300">&lt; 0.12% (AAA Rated)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STREAM 8: AFFILIATE PARTNERSHIPS */}
              {selectedStreamId === "affiliate_partnerships" && (
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-4">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-emerald-400" />
                    <span>High-Margin Ancillary Affiliate Integrations</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {AFFILIATE_PRODUCTS_DATA.map((aff) => (
                      <div key={aff.id} className="bg-slate-900/90 border border-slate-700/70 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-emerald-400">{aff.partnerBrand}</span>
                          <span className="font-mono text-xs font-black text-white bg-slate-800 px-2 py-0.5 rounded">
                            {aff.commissionType === "rev_share" ? `${aff.payoutAmount}% Rev-Share` : `₹${aff.payoutAmount} CPA`}
                          </span>
                        </div>
                        <h4 className="text-sm font-extrabold text-white">{aff.name}</h4>
                        <p className="text-xs text-slate-400">{aff.description}</p>
                        <div className="pt-2 border-t border-slate-800 flex justify-between text-xs">
                          <span className="text-slate-400">Attachment Rate:</span>
                          <span className="font-bold text-indigo-300">{aff.attachmentRate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STREAM 9: PROMOTIONAL CAMPAIGNS & BANK CO-FUNDING */}
              {selectedStreamId === "promotional_campaigns" && (
                <div className="space-y-4">
                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3">
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <Gift className="w-4 h-4 text-red-400" />
                      <span>Bank Co-Branded Marketing & Sponsorship Deals</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {PROMO_CAMPAIGNS_DATA.map((camp) => (
                        <div key={camp.id} className="bg-slate-900/90 border border-slate-700/70 rounded-xl p-4 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-amber-400">{camp.sponsorBrand}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400">
                              {camp.status}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-white">{camp.campaignTitle}</h4>
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                            <div>
                              <span className="text-slate-400 block text-[10px]">Bank Funded Share</span>
                              <span className="font-bold text-emerald-400">{camp.sponsorContributionPercent}% of discount</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">Campaign ROAS</span>
                              <span className="font-bold text-purple-300">{camp.roiMultiplier}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: INTERACTIVE REVENUE SIMULATOR */}
          {/* ======================================================== */}
          {activeTab === "simulator" && (
            <div className="space-y-6">
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 sm:p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
                      <span>Live Financial & Scale Simulator</span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Adjust operational volume, conversion rates, and monetization parameters to forecast real-time GMV and Net Revenue run-rate.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSimMonthlyUsers(450000);
                      setSimConversionRate(4.2);
                      setSimAverageOrderValue(4800);
                      setSimBlendedTakeRate(11.5);
                      setSimAncillaryAttachRate(28);
                      setSimActiveSaaSPartners(650);
                      setSimCorporateAccounts(85);
                      showToast("Reset simulation to baseline metrics");
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 self-start sm:self-auto border border-slate-700"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>
                </div>

                {/* 6 Interactive Sliders Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
                  
                  {/* Slider 1: MAU */}
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/60 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-bold">Monthly Active Users (MAU)</span>
                      <span className="font-mono font-black text-indigo-400">{simMonthlyUsers.toLocaleString("en-IN")}</span>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max="3000000"
                      step="25000"
                      value={simMonthlyUsers}
                      onChange={(e) => setSimMonthlyUsers(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>50k</span>
                      <span>1.5M</span>
                      <span>3M</span>
                    </div>
                  </div>

                  {/* Slider 2: Conversion Rate */}
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/60 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-bold">Booking Conversion Rate</span>
                      <span className="font-mono font-black text-emerald-400">{simConversionRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="10.0"
                      step="0.1"
                      value={simConversionRate}
                      onChange={(e) => setSimConversionRate(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>1.0%</span>
                      <span>5.0%</span>
                      <span>10.0%</span>
                    </div>
                  </div>

                  {/* Slider 3: Average Order Value */}
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/60 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-bold">Average Order Value (AOV)</span>
                      <span className="font-mono font-black text-amber-300">₹{simAverageOrderValue.toLocaleString("en-IN")}</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="20000"
                      step="250"
                      value={simAverageOrderValue}
                      onChange={(e) => setSimAverageOrderValue(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>₹1,000</span>
                      <span>₹10,000</span>
                      <span>₹20,000</span>
                    </div>
                  </div>

                  {/* Slider 4: Base Take Rate % */}
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/60 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-bold">Direct Take Rate %</span>
                      <span className="font-mono font-black text-purple-300">{simBlendedTakeRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="4.0"
                      max="20.0"
                      step="0.2"
                      value={simBlendedTakeRate}
                      onChange={(e) => setSimBlendedTakeRate(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>4%</span>
                      <span>12%</span>
                      <span>20%</span>
                    </div>
                  </div>

                  {/* Slider 5: SaaS Subscribed Partners */}
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/60 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-bold">Subscribed SaaS Merchants</span>
                      <span className="font-mono font-black text-cyan-300">{simActiveSaaSPartners} Partners</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="3000"
                      step="25"
                      value={simActiveSaaSPartners}
                      onChange={(e) => setSimActiveSaaSPartners(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>50</span>
                      <span>1,500</span>
                      <span>3,000</span>
                    </div>
                  </div>

                  {/* Slider 6: Corporate Accounts */}
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/60 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-bold">Active Corporate Desks</span>
                      <span className="font-mono font-black text-rose-300">{simCorporateAccounts} Enterprises</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="300"
                      step="5"
                      value={simCorporateAccounts}
                      onChange={(e) => setSimCorporateAccounts(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>5</span>
                      <span>150</span>
                      <span>300</span>
                    </div>
                  </div>
                </div>

                {/* SIMULATED RESULTS SCOREBOARD */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-700/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Forecasted Real-Time P&L Run-Rate</span>
                    </h3>
                    <span className="text-xs text-slate-400">
                      Monthly Bookings: <strong className="text-white">{simMonthlyBookings.toLocaleString("en-IN")}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">Annual GMV</span>
                      <span className="text-xl font-black text-white">₹{(simAnnualGMV / 10000000).toFixed(1)} Cr</span>
                      <span className="text-[10px] text-slate-500 block">₹{(simMonthlyGMV / 10000000).toFixed(2)} Cr / mo</span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">Net Revenue</span>
                      <span className="text-xl font-black text-emerald-400">₹{(simTotalAnnualNetRevenue / 10000000).toFixed(2)} Cr</span>
                      <span className="text-[10px] text-emerald-500 block">₹{(simTotalMonthlyNetRevenue / 100000).toFixed(1)} L / mo</span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">Realized Take Rate</span>
                      <span className="text-xl font-black text-indigo-300">{simRealizedTakeRate}%</span>
                      <span className="text-[10px] text-indigo-400 block">+2.3% via ancillaries</span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">EBITDA Profit</span>
                      <span className="text-xl font-black text-purple-300">₹{(simAnnualEbitda / 10000000).toFixed(2)} Cr</span>
                      <span className="text-[10px] text-purple-400 block">28.4% Net Margin</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: UNIT ECONOMICS WATERFALL */}
          {/* ======================================================== */}
          {activeTab === "unit_economics" && (
            <div className="space-y-6">
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 sm:p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-400" />
                    <span>Unit Economics Waterfall (Per ₹1,000 GMV)</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Transparent profitability dissection across direct marketplace commissions, ancillary attach rates, cost of sales, and EBITDA realization.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  {[
                    { label: "Gross Merchandise Value (GMV)", amount: "+ ₹1,000.00", color: "text-white font-black", pct: "100.0%" },
                    { label: "Direct Booking Commissions Take", amount: "+ ₹78.50", color: "text-indigo-400 font-bold", pct: "+ 7.85%" },
                    { label: "Convenience & Service Fees", amount: "+ ₹18.20", color: "text-purple-400 font-bold", pct: "+ 1.82%" },
                    { label: "Advertising & Search Bids", amount: "+ ₹8.60", color: "text-pink-400 font-bold", pct: "+ 0.86%" },
                    { label: "Affiliate Ancillaries (Insurance/Forex)", amount: "+ ₹4.80", color: "text-emerald-400 font-bold", pct: "+ 0.48%" },
                    { label: "B2B SaaS Subscriptions", amount: "+ ₹3.20", color: "text-cyan-400 font-bold", pct: "+ 0.32%" },
                    { label: "Total Gross Platform Revenue", amount: "₹113.30", color: "text-emerald-300 font-black border-t border-slate-700 pt-1", pct: "11.33% Take Rate" },
                    { label: "Payment Gateway & Cloud Infra Cost", amount: "- ₹14.20", color: "text-rose-400", pct: "- 1.42%" },
                    { label: "Customer Operations & Support", amount: "- ₹18.50", color: "text-rose-400", pct: "- 1.85%" },
                    { label: "Blended Customer Acquisition Cost (CAC)", amount: "- ₹36.00", color: "text-rose-400", pct: "- 3.60%" },
                    { label: "Net Operating EBITDA Margin", amount: "+ ₹32.20", color: "text-emerald-400 font-black text-sm border-t border-slate-700 pt-1.5", pct: "28.4% on Net Rev" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                      <span className="text-slate-300 font-medium">{item.label}</span>
                      <div className="flex items-center gap-4">
                        <span className={`font-mono ${item.color}`}>{item.amount}</span>
                        <span className="font-mono text-slate-400 w-24 text-right text-[11px]">{item.pct}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* 3. MODAL FOOTER */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>BharatYatra Financial & Compliance Systems • GSTIN & IRCTC Audited</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyFinancials}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
            >
              Copy Metrics
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
