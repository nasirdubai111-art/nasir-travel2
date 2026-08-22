import React, { useState, useEffect } from "react";
import {
  X,
  Building2,
  Bus,
  Hotel,
  Palmtree,
  Compass,
  Sparkles,
  Car,
  UtensilsCrossed,
  Briefcase,
  Layers,
  Calendar,
  Tag,
  Ticket,
  Users,
  CreditCard,
  Percent,
  Landmark,
  BarChart3,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Download,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Edit3,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  ExternalLink,
  DollarSign,
  PieChart,
  SlidersHorizontal,
  FileSpreadsheet,
  Check,
  Star,
  Zap,
} from "lucide-react";
import {
  PartnerCategory,
  PartnerTab,
  PartnerProfile,
  PartnerInventoryItem,
  PartnerAvailabilitySlot,
  PartnerPricingRule,
  PartnerBookingRecord,
  PartnerCustomerRecord,
  PartnerTransaction,
  PartnerSettlementRecord,
  RevenueStreamId,
} from "../types";
import {
  PARTNER_CATEGORIES_META,
  INITIAL_PARTNER_PROFILES,
  INITIAL_PARTNER_INVENTORY,
  INITIAL_PARTNER_AVAILABILITY,
  INITIAL_PARTNER_PRICING_RULES,
  INITIAL_PARTNER_BOOKINGS,
  INITIAL_PARTNER_CUSTOMERS,
  INITIAL_PARTNER_TRANSACTIONS,
  PARTNER_COMMISSION_TIERS,
  INITIAL_PARTNER_SETTLEMENTS,
  PARTNER_MONTHLY_REPORTS,
} from "../data/partnerData";

interface PartnerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: PartnerCategory;
  onOpenBusinessModel?: (stream?: RevenueStreamId) => void;
}

export function PartnerPortalModal({
  isOpen,
  onClose,
  initialCategory = "travel_agents",
  onOpenBusinessModel,
}: PartnerPortalModalProps) {
  const [activeCategory, setActiveCategory] = useState<PartnerCategory>(initialCategory);
  const [activeTab, setActiveTab] = useState<PartnerTab>("overview");

  useEffect(() => {
    if (isOpen && initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [isOpen, initialCategory]);

  // Partner State Management
  const [profiles, setProfiles] = useState<Record<PartnerCategory, PartnerProfile>>(INITIAL_PARTNER_PROFILES);
  const [inventories, setInventories] = useState(INITIAL_PARTNER_INVENTORY);
  const [availabilities, setAvailabilities] = useState(INITIAL_PARTNER_AVAILABILITY);
  const [pricingRules, setPricingRules] = useState(INITIAL_PARTNER_PRICING_RULES);
  const [bookings, setBookings] = useState(INITIAL_PARTNER_BOOKINGS);
  const [customers, setCustomers] = useState(INITIAL_PARTNER_CUSTOMERS);
  const [transactions, setTransactions] = useState(INITIAL_PARTNER_TRANSACTIONS);
  const [settlements, setSettlements] = useState(INITIAL_PARTNER_SETTLEMENTS);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals inside Partner Portal
  const [isAddInventoryOpen, setIsAddInventoryOpen] = useState(false);
  const [isAddPricingRuleOpen, setIsAddPricingRuleOpen] = useState(false);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<PartnerBookingRecord | null>(null);

  // New Inventory Form State
  const [newInvName, setNewInvName] = useState("");
  const [newInvCategory, setNewInvCategory] = useState("");
  const [newInvCapacity, setNewInvCapacity] = useState("20");
  const [newInvPrice, setNewInvPrice] = useState("2500");
  const [newInvLocation, setNewInvLocation] = useState("Delhi NCR");

  // New Pricing Rule State
  const [newRuleTitle, setNewRuleTitle] = useState("");
  const [newRuleType, setNewRuleType] = useState<PartnerPricingRule["ruleType"]>("weekend_surge");
  const [newRuleAdjustment, setNewRuleAdjustment] = useState("15");

  if (!isOpen) return null;

  const currentMeta = PARTNER_CATEGORIES_META.find((m) => m.id === activeCategory) || PARTNER_CATEGORIES_META[0];
  const currentProfile = profiles[activeCategory];
  const currentInventory = inventories[activeCategory] || [];
  const currentAvailability = availabilities[activeCategory] || [];
  const currentPricing = pricingRules[activeCategory] || [];
  const currentBookings = bookings[activeCategory] || [];
  const currentCustomers = customers[activeCategory] || [];
  const currentTransactions = transactions[activeCategory] || [];
  const currentTiers = PARTNER_COMMISSION_TIERS[activeCategory] || [];
  const currentSettlements = settlements[activeCategory] || [];
  const currentReports = PARTNER_MONTHLY_REPORTS[activeCategory] || [];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const getPartnerIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case "Briefcase":
        return <Briefcase className={className} />;
      case "Bus":
        return <Bus className={className} />;
      case "Hotel":
        return <Hotel className={className} />;
      case "Palmtree":
        return <Palmtree className={className} />;
      case "Compass":
        return <Compass className={className} />;
      case "Sparkles":
        return <Sparkles className={className} />;
      case "Car":
        return <Car className={className} />;
      case "UtensilsCrossed":
        return <UtensilsCrossed className={className} />;
      default:
        return <Building2 className={className} />;
    }
  };

  // 1. Toggle Inventory Status
  const handleToggleInventoryStatus = (itemId: string) => {
    setInventories((prev) => ({
      ...prev,
      [activeCategory]: prev[activeCategory].map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: item.status === "active" ? "paused" : "active",
            }
          : item
      ),
    }));
    showToast("Inventory listing status updated successfully");
  };

  // 2. Add New Inventory Item
  const handleAddInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvName.trim()) return;

    const newItem: PartnerInventoryItem = {
      id: `INV-${activeCategory.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      partnerType: activeCategory,
      name: newInvName,
      subCategory: newInvCategory || "Standard Unit",
      capacityUnits: Number(newInvCapacity) || 10,
      availableUnits: Number(newInvCapacity) || 10,
      basePrice: Number(newInvPrice) || 2000,
      currentPrice: Number(newInvPrice) || 2000,
      status: "active",
      locationOrRoute: newInvLocation,
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
      rating: 5.0,
      tags: ["Instant Booking", "Partner Verified", "Live Sync"],
    };

    setInventories((prev) => ({
      ...prev,
      [activeCategory]: [newItem, ...prev[activeCategory]],
    }));

    setProfiles((prev) => ({
      ...prev,
      [activeCategory]: {
        ...prev[activeCategory],
        activeInventoryCount: prev[activeCategory].activeInventoryCount + 1,
      },
    }));

    setIsAddInventoryOpen(false);
    setNewInvName("");
    showToast(`Added "${newItem.name}" to active inventory`);
  };

  // 3. Toggle Availability Slot Status
  const handleToggleSlotStatus = (slotId: string) => {
    setAvailabilities((prev) => ({
      ...prev,
      [activeCategory]: prev[activeCategory].map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              status: slot.status === "blocked" ? "available" : "blocked",
            }
          : slot
      ),
    }));
    showToast("Availability slot status modified");
  };

  // 4. Toggle Pricing Rule Active State
  const handleTogglePricingRule = (ruleId: string) => {
    setPricingRules((prev) => ({
      ...prev,
      [activeCategory]: prev[activeCategory].map((r) =>
        r.id === ruleId ? { ...r, isActive: !r.isActive } : r
      ),
    }));
    showToast("Dynamic pricing rule updated");
  };

  // 5. Add Pricing Rule
  const handleAddPricingRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleTitle.trim()) return;

    const newRule: PartnerPricingRule = {
      id: `PRC-${activeCategory.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      partnerType: activeCategory,
      title: newRuleTitle,
      ruleType: newRuleType,
      adjustmentPercent: Number(newRuleAdjustment) || 10,
      applicableDays: "Custom Schedule",
      isActive: true,
      validFrom: "2026-08-22",
      validTo: "2026-12-31",
    };

    setPricingRules((prev) => ({
      ...prev,
      [activeCategory]: [newRule, ...prev[activeCategory]],
    }));

    setIsAddPricingRuleOpen(false);
    setNewRuleTitle("");
    showToast(`Created pricing rule: "${newRule.title}"`);
  };

  // 6. Update Booking Status (Confirm / Complete / Cancel)
  const handleUpdateBookingStatus = (bookingId: string, newStatus: PartnerBookingRecord["status"]) => {
    setBookings((prev) => ({
      ...prev,
      [activeCategory]: prev[activeCategory].map((b) =>
        b.id === bookingId ? { ...b, status: newStatus } : b
      ),
    }));
    showToast(`Booking ${bookingId} status changed to ${newStatus.toUpperCase()}`);
    if (selectedBookingDetails && selectedBookingDetails.id === bookingId) {
      setSelectedBookingDetails((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // 7. Request Instant Settlement Payout
  const handleRequestInstantSettlement = () => {
    if (currentProfile.pendingSettlement <= 0) {
      showToast("No pending balance eligible for instant settlement.");
      return;
    }

    const payoutAmount = currentProfile.pendingSettlement;
    const newSettlement: PartnerSettlementRecord = {
      id: `STL-${activeCategory.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`,
      settlementCycle: `Instant Payout ${new Date().toLocaleDateString("en-IN")}`,
      period: "Immediate Transfer",
      grossVolume: payoutAmount,
      commissionCut: Math.round(payoutAmount * 0.08),
      tdsDeducted: Math.round(payoutAmount * 0.01),
      netAmountTransferred: Math.round(payoutAmount * 0.91),
      bankRefNumber: `INSTANT${Math.floor(100000000 + Math.random() * 900000000)}`,
      payoutDate: "Today (Processed)",
      status: "transferred",
      invoiceUrl: "#",
    };

    setSettlements((prev) => ({
      ...prev,
      [activeCategory]: [newSettlement, ...prev[activeCategory]],
    }));

    setProfiles((prev) => ({
      ...prev,
      [activeCategory]: {
        ...prev[activeCategory],
        pendingSettlement: 0,
        walletBalance: prev[activeCategory].walletBalance + newSettlement.netAmountTransferred,
      },
    }));

    const newTx: PartnerTransaction = {
      id: `TX-STL-${Date.now().toString().slice(-4)}`,
      date: "Just now",
      type: "bank_settlement",
      description: `Instant payout transfer to ${currentProfile.bankAccountMasked}`,
      amount: newSettlement.netAmountTransferred,
      isCredit: false,
      status: "completed",
      referenceId: newSettlement.bankRefNumber,
    };

    setTransactions((prev) => ({
      ...prev,
      [activeCategory]: [newTx, ...prev[activeCategory]],
    }));

    showToast(`₹${newSettlement.netAmountTransferred.toLocaleString("en-IN")} transferred instantly to ${currentProfile.bankAccountMasked}!`);
  };

  const navTabs: { id: PartnerTab; label: string; icon: any; count?: number }[] = [
    { id: "overview", label: "Overview", icon: Layers },
    { id: "inventory", label: "Inventory", icon: Building2, count: currentInventory.length },
    { id: "availability", label: "Availability", icon: Calendar, count: currentAvailability.length },
    { id: "pricing", label: "Pricing", icon: Tag, count: currentPricing.length },
    { id: "bookings", label: "Bookings", icon: Ticket, count: currentBookings.length },
    { id: "customers", label: "Customers", icon: Users, count: currentCustomers.length },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "commissions", label: "Commissions", icon: Percent },
    { id: "settlements", label: "Settlements", icon: Landmark, count: currentSettlements.length },
    { id: "reports", label: "Reports", icon: BarChart3 },
  ];

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

        {/* 1. TOP HEADER & PARTNER PLATFORM SWITCHER */}
        <div className="bg-slate-950 border-b border-slate-800 p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Logo & Platform Info */}
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl bg-linear-to-br ${currentMeta.color} flex items-center justify-center shadow-lg text-white font-black`}>
                {getPartnerIcon(currentMeta.icon, "w-6 h-6")}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-extrabold border border-indigo-500/30">
                    Partner Ecosystem
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    GSTIN Verified
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5 tracking-tight flex items-center gap-2">
                  <span>{currentProfile.businessName}</span>
                </h1>
                <p className="text-xs text-slate-400">
                  {currentMeta.subtitle} • GSTIN: <span className="font-mono text-slate-300">{currentProfile.gstNumber}</span> • {currentProfile.city}, {currentProfile.state}
                </p>
              </div>
            </div>

            {/* Platform Quick Switcher & Controls */}
            <div className="flex items-center gap-2 flex-wrap justify-between lg:justify-end">
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
                <span className="text-[11px] font-bold text-slate-400 px-2 hidden sm:inline">Platform:</span>
                <select
                  aria-label="Switch Partner Platform"
                  value={activeCategory}
                  onChange={(e) => {
                    setActiveCategory(e.target.value as PartnerCategory);
                    showToast(`Switched workspace to ${PARTNER_CATEGORIES_META.find(m => m.id === e.target.value)?.name}`);
                  }}
                  className="bg-slate-800 border border-slate-700 text-xs font-bold text-white rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {PARTNER_CATEGORIES_META.map((meta) => (
                    <option key={meta.id} value={meta.id}>
                      {meta.name} ({meta.badge})
                    </option>
                  ))}
                </select>
              </div>

              {/* Instant Settlement Badge */}
              <button
                onClick={handleRequestInstantSettlement}
                className="px-3 py-1.5 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-black hover:opacity-95 transition-opacity flex items-center gap-1.5 shadow-xs"
                title="Instant T+0 Bank Settlement"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>Instant Payout (₹{currentProfile.pendingSettlement.toLocaleString("en-IN")})</span>
              </button>

              {/* View Monetization & Commission Architecture */}
              {onOpenBusinessModel && (
                <button
                  onClick={() => {
                    const streamMap: Record<PartnerCategory, RevenueStreamId> = {
                      travel_agents: "agent_commissions_markups",
                      bus_operators: "partner_commissions",
                      hotels: "partner_commissions",
                      resorts: "partner_commissions",
                      tour_operators: "booking_commissions",
                      pilgrimage_operators: "booking_commissions",
                      cab_operators: "partner_commissions",
                      restaurants: "partner_commissions",
                    };
                    onOpenBusinessModel(streamMap[activeCategory] || "partner_commissions");
                  }}
                  className="hidden sm:flex px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-300 border border-slate-700 text-xs font-bold items-center gap-1.5 transition-colors"
                  title="View Platform Financial Architecture & Commission Streams"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Platform Economics</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Close Partner Portal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 8 Platform Direct Quick Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-4 pb-1 scrollbar-none border-t border-slate-800/80 mt-3">
            {PARTNER_CATEGORIES_META.map((meta) => {
              const isSelected = meta.id === activeCategory;
              return (
                <button
                  key={meta.id}
                  onClick={() => setActiveCategory(meta.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? `bg-linear-to-r ${meta.color} text-white shadow-md ring-2 ring-white/20 scale-[1.02]`
                      : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {getPartnerIcon(meta.icon, "w-3.5 h-3.5")}
                  <span>{meta.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. SUB NAVIGATION TABS FOR 9 PILLARS */}
        <div className="bg-slate-950/60 border-b border-slate-800 px-4 flex items-center gap-1 overflow-x-auto scrollbar-none">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3.5 text-xs font-extrabold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? "bg-indigo-500/30 text-indigo-200" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 3. MAIN WORKSPACE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/50 space-y-6">

          {/* ======================================================== */}
          {/* TAB 1: OVERVIEW / DASHBOARD */}
          {/* ======================================================== */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Partner High-Level KPI Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Lifetime Gross Sales */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Total Lifetime GMV</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white mt-2">
                    ₹{currentProfile.totalLifetimeRevenue.toLocaleString("en-IN")}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1 font-medium">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+18.4% growth vs last month</span>
                  </div>
                </div>

                {/* Pending Payout / Bank Settlement */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Pending Settlement</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-amber-300 mt-2">
                    ₹{currentProfile.pendingSettlement.toLocaleString("en-IN")}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] text-slate-400">Next Payout: 24 Aug 2026</span>
                    <button
                      onClick={handleRequestInstantSettlement}
                      className="text-[11px] font-bold text-indigo-400 hover:underline"
                    >
                      Settle Now
                    </button>
                  </div>
                </div>

                {/* Active Commission Tier */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Partner Commission Rate</span>
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Percent className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-purple-300 mt-2">
                    {currentProfile.commissionRate}%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Tier: <span className="font-bold text-purple-400">{currentTiers.find(t => t.isCurrentTier)?.tierName || "Premier"}</span> (T+1 Daily Cycle)
                  </div>
                </div>

                {/* Active Units & Rating */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Active Inventory / Rating</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white mt-2 flex items-center gap-2">
                    <span>{currentInventory.length} Units</span>
                    <span className="text-sm font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                      ★ {currentProfile.rating}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Based on {currentProfile.totalReviews} verified guest reviews
                  </div>
                </div>
              </div>

              {/* Quick Actions & Live Operations Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left 2 Cols: Live Bookings & Quick Operations */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-indigo-400" />
                      <span>Recent Guest Reservations & Dispatch</span>
                    </h2>
                    <button
                      onClick={() => setActiveTab("bookings")}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <span>View All ({currentBookings.length})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {currentBookings.slice(0, 3).map((bk) => (
                      <div
                        key={bk.id}
                        className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-600 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-black text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-md">
                              {bk.bookingRef}
                            </span>
                            <span className="text-xs font-bold text-white">{bk.customerName}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              {bk.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300">{bk.itemName}</p>
                          <p className="text-[11px] text-slate-400">
                            Service Date: <span className="text-slate-200 font-medium">{bk.travelOrServiceDate}</span> • Units: {bk.unitsBooked}
                          </p>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-700">
                          <div className="text-right">
                            <span className="text-xs text-slate-400 block">Gross Fare</span>
                            <span className="text-sm font-black text-white">₹{bk.grossAmount.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="text-right mt-0.5">
                            <span className="text-[10px] text-emerald-400 font-bold">
                              Net: ₹{bk.netPayout.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Operational Shortcuts */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    <button
                      onClick={() => {
                        setActiveTab("inventory");
                        setIsAddInventoryOpen(true);
                      }}
                      className="p-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 hover:bg-indigo-600/30 text-indigo-300 text-xs font-bold text-left flex flex-col justify-between transition-colors"
                    >
                      <Plus className="w-4 h-4 mb-2 text-indigo-400" />
                      <span>+ Add New Inventory</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("pricing");
                        setIsAddPricingRuleOpen(true);
                      }}
                      className="p-3 rounded-2xl bg-amber-600/20 border border-amber-500/40 hover:bg-amber-600/30 text-amber-300 text-xs font-bold text-left flex flex-col justify-between transition-colors"
                    >
                      <Tag className="w-4 h-4 mb-2 text-amber-400" />
                      <span>+ Create Price Rule</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("availability")}
                      className="p-3 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold text-left flex flex-col justify-between transition-colors"
                    >
                      <Calendar className="w-4 h-4 mb-2 text-emerald-400" />
                      <span>Block / Open Dates</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("reports")}
                      className="p-3 rounded-2xl bg-purple-600/20 border border-purple-500/40 hover:bg-purple-600/30 text-purple-300 text-xs font-bold text-left flex flex-col justify-between transition-colors"
                    >
                      <BarChart3 className="w-4 h-4 mb-2 text-purple-400" />
                      <span>Analytics Reports</span>
                    </button>
                  </div>
                </div>

                {/* Right Col: Partner Account Profile & Settlement Quick Card */}
                <div className="space-y-4">
                  <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-4 space-y-3">
                    <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-emerald-400" />
                      <span>Payout & Bank Account</span>
                    </h2>
                    
                    <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-700/50 space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Bank Account:</span>
                        <span className="font-mono font-bold text-slate-200">{currentProfile.bankAccountMasked}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">IFSC Code:</span>
                        <span className="font-mono text-slate-300">{currentProfile.ifscCode}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">PAN Number:</span>
                        <span className="font-mono text-slate-300">{currentProfile.panNumber}</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Partner Wallet:</span>
                        <span className="font-bold text-emerald-400">₹{currentProfile.walletBalance.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Uncleared Escrow:</span>
                        <span className="font-bold text-amber-300">₹{currentProfile.pendingSettlement.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleRequestInstantSettlement}
                      className="w-full py-2 rounded-xl bg-linear-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white text-xs font-extrabold transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <ArrowDownRight className="w-4 h-4" />
                      <span>Withdraw to Bank Account</span>
                    </button>
                  </div>

                  {/* Partner Direct Help & Support */}
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-xs space-y-2">
                    <span className="font-extrabold text-slate-300 block">Dedicated Partner Support</span>
                    <p className="text-slate-400">
                      24x7 Priority Desk for {currentMeta.name}:
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <a
                        href="tel:18002008899"
                        className="flex items-center gap-1 text-indigo-400 hover:underline font-bold"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>1800-200-PARTNER</span>
                      </a>
                      <span className="text-slate-600">•</span>
                      <a
                        href={`mailto:${currentProfile.email}`}
                        className="flex items-center gap-1 text-slate-300 hover:underline"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>partner@bharatyatra.in</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: INVENTORY MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === "inventory" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-400" />
                    <span>{currentMeta.name} Inventory Management</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Control active stock, base fares, capacity, and online distribution status for {currentMeta.inventoryUnit}.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddInventoryOpen(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all self-start sm:self-auto shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add {currentMeta.name.slice(0, -1)} Inventory</span>
                </button>
              </div>

              {/* Inventory Table / Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentInventory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-800/90 border border-slate-700/80 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-slate-600 transition-all shadow-md"
                  >
                    <div>
                      {/* Image Banner with Status Badge */}
                      <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 flex gap-1">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                              item.status === "active"
                                ? "bg-emerald-500 text-slate-950"
                                : item.status === "paused"
                                ? "bg-amber-500 text-slate-950"
                                : "bg-rose-500 text-white"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-mono text-indigo-300 font-bold border border-slate-700">
                          {item.id}
                        </div>
                        <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-medium text-slate-200">
                          {item.subCategory}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{item.locationOrRoute}</span>
                        </p>

                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-700/60">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Total Capacity</span>
                            <span className="font-bold text-slate-200">{item.capacityUnits} units</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Available Now</span>
                            <span className="font-bold text-emerald-400">{item.availableUnits} units</span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-400 block text-[10px]">Base Tariff</span>
                            <span className="font-black text-white">₹{item.currentPrice.toLocaleString("en-IN")}</span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {item.tags.map((t, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-700/50 text-[9px] text-slate-300 font-medium">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Controls */}
                    <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleToggleInventoryStatus(item.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                          item.status === "active"
                            ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30"
                        }`}
                      >
                        {item.status === "active" ? (
                          <>
                            <ToggleRight className="w-4 h-4 text-emerald-400" />
                            <span>Pause Listing</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4 text-slate-400" />
                            <span>Activate Listing</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          const newPrice = prompt("Enter new price in INR:", item.currentPrice.toString());
                          if (newPrice && !isNaN(Number(newPrice))) {
                            setInventories((prev) => ({
                              ...prev,
                              [activeCategory]: prev[activeCategory].map((i) =>
                                i.id === item.id ? { ...i, currentPrice: Number(newPrice) } : i
                              ),
                            }));
                            showToast(`Price updated to ₹${Number(newPrice).toLocaleString("en-IN")}`);
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1"
                        title="Edit Price"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Edit Price</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: AVAILABILITY CALENDAR & SLOTS */}
          {/* ======================================================== */}
          {activeTab === "availability" && (
            <div className="space-y-4">
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                    <span>Availability Matrix & Date Lockouts</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Real-time scheduling grid. Block out dates for private maintenance or surge high-demand dates.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300">Live Status:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Channel Sync Active
                  </span>
                </div>
              </div>

              {/* Slot Table */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/80 text-[11px] font-extrabold uppercase text-slate-400 border-b border-slate-700">
                      <tr>
                        <th className="p-3.5">Inventory Unit</th>
                        <th className="p-3.5">Date & Slot</th>
                        <th className="p-3.5">Allocated / Booked</th>
                        <th className="p-3.5">Occupancy</th>
                        <th className="p-3.5">Surge Multiplier</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {currentAvailability.map((slot) => {
                        const occupancyPercent = Math.round((slot.bookedSlots / slot.totalSlots) * 100);
                        return (
                          <tr key={slot.id} className="hover:bg-slate-700/30 transition-colors">
                            <td className="p-3.5 font-bold text-white">
                              {slot.inventoryName}
                              <span className="block text-[10px] text-slate-400 font-mono">{slot.inventoryId}</span>
                            </td>
                            <td className="p-3.5">
                              <span className="font-semibold text-slate-200 block">{slot.date}</span>
                              {slot.timeSlot && (
                                <span className="text-[10px] text-indigo-300 font-medium">{slot.timeSlot}</span>
                              )}
                            </td>
                            <td className="p-3.5">
                              <span className="font-bold text-white">{slot.bookedSlots}</span> / {slot.totalSlots} slots
                            </td>
                            <td className="p-3.5">
                              <div className="w-28 space-y-1">
                                <div className="flex justify-between text-[10px]">
                                  <span>{occupancyPercent}%</span>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      occupancyPercent >= 90
                                        ? "bg-rose-500"
                                        : occupancyPercent >= 60
                                        ? "bg-amber-500"
                                        : "bg-emerald-500"
                                    }`}
                                    style={{ width: `${occupancyPercent}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <span className="font-mono font-bold text-amber-300">
                                {slot.surgeMultiplier}x
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                  slot.status === "available"
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : slot.status === "fast_filling"
                                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                    : slot.status === "booked_full"
                                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                    : "bg-slate-700 text-slate-400"
                                }`}
                              >
                                {slot.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => handleToggleSlotStatus(slot.id)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                                  slot.status === "blocked"
                                    ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                                    : "bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30"
                                }`}
                              >
                                {slot.status === "blocked" ? "Unblock Slot" : "Block Slot"}
                              </button>
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

          {/* ======================================================== */}
          {/* TAB 4: PRICING ENGINE & RULES */}
          {/* ======================================================== */}
          {activeTab === "pricing" && (
            <div className="space-y-4">
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Tag className="w-5 h-5 text-amber-400" />
                    <span>Dynamic Pricing & Tariff Engine</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Configure automated weekend multipliers, B2B wholesale discounts, and festive demand surges.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddPricingRuleOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition-all self-start sm:self-auto shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Pricing Rule</span>
                </button>
              </div>

              {/* Pricing Rules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentPricing.map((rule) => (
                  <div
                    key={rule.id}
                    className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase border border-amber-500/30">
                          {rule.ruleType.replace(/_/g, " ")}
                        </span>
                        <button
                          onClick={() => handleTogglePricingRule(rule.id)}
                          className="text-xs font-bold text-slate-300 flex items-center gap-1"
                        >
                          {rule.isActive ? (
                            <span className="text-emerald-400 flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Active
                            </span>
                          ) : (
                            <span className="text-slate-500 flex items-center gap-1 font-medium">
                              <X className="w-3.5 h-3.5" />
                              Paused
                            </span>
                          )}
                        </button>
                      </div>

                      <h3 className="text-base font-extrabold text-white">{rule.title}</h3>
                      <p className="text-xs text-slate-400">
                        Applicable Schedule: <span className="text-slate-200 font-medium">{rule.applicableDays}</span>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Tariff Adjustment</span>
                        <span
                          className={`text-lg font-black ${
                            rule.adjustmentPercent > 0 ? "text-amber-400" : "text-emerald-400"
                          }`}
                        >
                          {rule.adjustmentPercent > 0 ? `+${rule.adjustmentPercent}%` : `${rule.adjustmentPercent}%`}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Validity</span>
                        <span className="text-xs text-slate-300 font-medium">
                          {rule.validFrom} to {rule.validTo}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: BOOKINGS MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === "bookings" && (
            <div className="space-y-4">
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-indigo-400" />
                    <span>Customer Bookings & Digital Manifest</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Live feed of confirmed travelers, PNRs, contact info, check-in status, and ticket vouchers.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search PNR / Customer..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-xs text-white rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-44 sm:w-56"
                    />
                  </div>
                </div>
              </div>

              {/* Bookings Feed */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/80 text-[11px] font-extrabold uppercase text-slate-400 border-b border-slate-700">
                      <tr>
                        <th className="p-3.5">PNR / Ref</th>
                        <th className="p-3.5">Customer</th>
                        <th className="p-3.5">Service Details</th>
                        <th className="p-3.5">Travel Date</th>
                        <th className="p-3.5">Gross Amount</th>
                        <th className="p-3.5">Net Payout</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {currentBookings
                        .filter(
                          (b) =>
                            b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            b.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            b.itemName.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((b) => (
                          <tr key={b.id} className="hover:bg-slate-700/30 transition-colors">
                            <td className="p-3.5 font-mono font-bold text-indigo-300">
                              {b.bookingRef}
                              <span className="block text-[10px] text-slate-400 font-sans">{b.createdAt}</span>
                            </td>
                            <td className="p-3.5 font-bold text-white">
                              {b.customerName}
                              <span className="block text-[10px] text-slate-400 font-normal">{b.customerPhone}</span>
                            </td>
                            <td className="p-3.5">
                              <span className="font-semibold text-slate-200 block">{b.itemName}</span>
                              <span className="text-[10px] text-slate-400">{b.unitsBooked} units booked</span>
                            </td>
                            <td className="p-3.5 font-medium text-slate-200">{b.travelOrServiceDate}</td>
                            <td className="p-3.5 font-bold text-white">₹{b.grossAmount.toLocaleString("en-IN")}</td>
                            <td className="p-3.5 font-black text-emerald-400">₹{b.netPayout.toLocaleString("en-IN")}</td>
                            <td className="p-3.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                  b.status === "confirmed"
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : b.status === "completed"
                                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                    : "bg-rose-500/20 text-rose-400"
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right space-x-1.5">
                              <button
                                onClick={() => setSelectedBookingDetails(b)}
                                className="px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-bold"
                              >
                                Details
                              </button>
                              {b.status === "confirmed" && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(b.id, "completed")}
                                  className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold"
                                >
                                  Check-in
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: CUSTOMERS & CRM */}
          {/* ======================================================== */}
          {activeTab === "customers" && (
            <div className="space-y-4">
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span>Customer Relationship Management (CRM)</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Travel history, VIP loyalty tiers, spend analytics, and personalized passenger preferences.
                  </p>
                </div>
              </div>

              {/* Customer Directory */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentCustomers.map((cst) => (
                  <div
                    key={cst.id}
                    className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                            cst.vipTier.includes("Platinum")
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                              : cst.vipTier.includes("Gold")
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-slate-700 text-slate-300"
                          }`}
                        >
                          {cst.vipTier}
                        </span>
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-0.5">
                          ★ {cst.ratingScore}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-white">{cst.name}</h3>
                      <div className="space-y-1 text-xs text-slate-300">
                        <p className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{cst.phone}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{cst.email}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{cst.city}</span>
                        </p>
                      </div>

                      {cst.notes && (
                        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-700 text-[11px] text-indigo-300 font-medium">
                          Note: {cst.notes}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Total Bookings</span>
                        <span className="font-bold text-white">{cst.totalBookings} trips</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px]">Total Spend</span>
                        <span className="font-black text-emerald-400">₹{cst.totalSpent.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: PAYMENTS & TRANSACTIONS */}
          {/* ======================================================== */}
          {activeTab === "payments" && (
            <div className="space-y-4">
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-400" />
                    <span>Real-time Financial Ledger & Gateway Logs</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Automated line-item reconciliation across customer credits, platform commission deductions, TDS, and bank payouts.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Current Balance</span>
                  <span className="text-lg font-black text-emerald-400">₹{currentProfile.walletBalance.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/80 text-[11px] font-extrabold uppercase text-slate-400 border-b border-slate-700">
                      <tr>
                        <th className="p-3.5">Ref / ID</th>
                        <th className="p-3.5">Date & Time</th>
                        <th className="p-3.5">Description</th>
                        <th className="p-3.5">Type</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Amount (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {currentTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-slate-300">{tx.referenceId}</td>
                          <td className="p-3.5 text-slate-400">{tx.date}</td>
                          <td className="p-3.5 font-medium text-white">{tx.description}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-700 text-slate-300">
                              {tx.type.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {tx.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-black">
                            <span className={tx.isCredit ? "text-emerald-400" : "text-rose-400"}>
                              {tx.isCredit ? `+₹${tx.amount.toLocaleString("en-IN")}` : `-₹${tx.amount.toLocaleString("en-IN")}`}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 8: COMMISSIONS & TIERS */}
          {/* ======================================================== */}
          {activeTab === "commissions" && (
            <div className="space-y-4">
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Percent className="w-5 h-5 text-purple-400" />
                  <span>Partner Commission Tiers & Rebate Program</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Scale your monthly volume to unlock lower commission slabs, priority GDS seats, and instant zero-fee settlements.
                </p>
              </div>

              {/* Commission Tiers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentTiers.map((tier, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                      tier.isCurrentTier
                        ? "bg-slate-800/95 border-purple-500 shadow-xl ring-2 ring-purple-500/20"
                        : "bg-slate-800/60 border-slate-700/70 opacity-80"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-white">{tier.tierName}</span>
                        {tier.isCurrentTier && (
                          <span className="px-2 py-0.5 rounded-full bg-purple-500 text-white text-[10px] font-black uppercase">
                            Your Tier
                          </span>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 block uppercase">Commission Rate</span>
                        <div className="text-2xl font-black text-purple-300">
                          {tier.commissionPercentage}%
                        </div>
                        <span className="text-xs text-slate-400">Monthly GMV: {tier.monthlyGmvRange}</span>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-slate-700">
                        <span className="text-[11px] font-bold text-slate-300 block">Tier Privileges:</span>
                        {tier.perks.map((perk, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-1.5 text-xs text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-700">
                      <span className="text-[11px] text-emerald-400 font-bold block">
                        + {tier.agentRebate}% Cashback Bonus
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 9: SETTLEMENTS & PAYOUT SCHEDULES */}
          {/* ======================================================== */}
          {activeTab === "settlements" && (
            <div className="space-y-4">
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-emerald-400" />
                    <span>Bank Settlements & Tax Certificates (TDS / GST)</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    View automated NEFT/RTGS settlement cycles, TDS certificates, and instant payout records.
                  </p>
                </div>

                <button
                  onClick={handleRequestInstantSettlement}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition-all self-start sm:self-auto shrink-0"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Instant Settlement Transfer</span>
                </button>
              </div>

              {/* Settlement Cycles Grid */}
              <div className="space-y-3">
                {currentSettlements.map((stl) => (
                  <div
                    key={stl.id}
                    className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-black text-slate-300 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-700">
                          {stl.id}
                        </span>
                        <span className="text-sm font-bold text-white">{stl.settlementCycle}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            stl.status === "transferred"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {stl.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Period: <span className="text-slate-200">{stl.period}</span> • Bank Ref: <span className="font-mono text-slate-300">{stl.bankRefNumber}</span> • Payout: {stl.payoutDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap justify-between lg:justify-end text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Gross Volume</span>
                        <span className="font-bold text-slate-200">₹{stl.grossVolume.toLocaleString("en-IN")}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Commission ({currentProfile.commissionRate}%)</span>
                        <span className="font-bold text-rose-400">-₹{stl.commissionCut.toLocaleString("en-IN")}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">TDS (1%)</span>
                        <span className="font-bold text-amber-400">-₹{stl.tdsDeducted.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-700 text-right">
                        <span className="text-[10px] text-emerald-400 block font-bold">Net Payout Sent</span>
                        <span className="text-sm font-black text-emerald-300">
                          ₹{stl.netAmountTransferred.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 10: REPORTS & ANALYTICS */}
          {/* ======================================================== */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-400" />
                    <span>Executive Analytics & Performance Reports</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Monthly GMV trends, fill rates, cancellation ratios, and top grossing inventory blocks.
                  </p>
                </div>

                <button
                  onClick={() => showToast("Exporting Excel & GST Report PDF...")}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Download GST Statement</span>
                </button>
              </div>

              {/* Monthly Performance Data Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentReports.map((rpt, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">{rpt.period}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                        {rpt.occupancyOrUtilizationRate}% Occupancy
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 block">Gross Revenue</span>
                      <span className="text-xl font-black text-white">₹{rpt.grossRevenue.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-700/60 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Net Earnings:</span>
                        <span className="font-bold text-emerald-400">₹{rpt.netEarnings.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Bookings Count:</span>
                        <span className="font-bold text-slate-200">{rpt.totalBookings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Cancellation Rate:</span>
                        <span className="font-bold text-slate-300">{rpt.cancellationRate}%</span>
                      </div>
                      <div className="pt-1 text-[11px] text-indigo-300 truncate">
                        Top: {rpt.topPerformingItem}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Visual Performance Bars */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Revenue Trend Breakdown (Historical vs Projected)</span>
                </h3>

                <div className="space-y-3">
                  {[
                    { month: "May 2026", gmv: 680000, width: "68%" },
                    { month: "June 2026", gmv: 820000, width: "82%" },
                    { month: "July 2026", gmv: 750000, width: "75%" },
                    { month: "August 2026 (Projected)", gmv: 940000, width: "94%" },
                  ].map((bar, bIdx) => (
                    <div key={bIdx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-300">{bar.month}</span>
                        <span className="text-white">₹{bar.gmv.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-700/40">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-indigo-500 via-purple-500 to-emerald-400"
                          style={{ width: bar.width }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* 4. FOOTER STATUS BAR */}
        <div className="bg-slate-950 border-t border-slate-800 px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>BharatYatra Partner Core v4.8 • Connected to {currentProfile.businessName}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>IRCTC / OTA GDS Node #IND-9012</span>
            <span>•</span>
            <button
              onClick={() => showToast("Syncing all partner nodes in real-time...")}
              className="text-indigo-400 hover:underline font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Sync All</span>
            </button>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* SUB-MODAL 1: ADD INVENTORY FORM */}
      {/* ======================================================== */}
      {isAddInventoryOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Add {currentMeta.name.slice(0, -1)} Inventory</span>
              </h3>
              <button
                onClick={() => setIsAddInventoryOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddInventory} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Item Title / Route / Room</label>
                <input
                  type="text"
                  required
                  placeholder={`e.g. Deluxe Royal Suite / Volvo AC Sleeper`}
                  value={newInvName}
                  onChange={(e) => setNewInvName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Sub-Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Executive / Sleeper / Pool Villa"
                    value={newInvCategory}
                    onChange={(e) => setNewInvCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Capacity Units ({currentMeta.inventoryUnit})</label>
                  <input
                    type="number"
                    min="1"
                    value={newInvCapacity}
                    onChange={(e) => setNewInvCapacity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Base Price (₹ INR)</label>
                  <input
                    type="number"
                    min="100"
                    value={newInvPrice}
                    onChange={(e) => setNewInvPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">City / Highway / Route</label>
                  <input
                    type="text"
                    value={newInvLocation}
                    onChange={(e) => setNewInvLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddInventoryOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md"
                >
                  Publish Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-MODAL 2: ADD PRICING RULE FORM */}
      {/* ======================================================== */}
      {isAddPricingRuleOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400" />
                <span>Create Dynamic Pricing Rule</span>
              </h3>
              <button
                onClick={() => setIsAddPricingRuleOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPricingRule} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali Weekend Peak Multiplier"
                  value={newRuleTitle}
                  onChange={(e) => setNewRuleTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Rule Type</label>
                  <select
                    value={newRuleType}
                    onChange={(e) => setNewRuleType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="weekend_surge">Weekend Surge</option>
                    <option value="agent_b2b_discount">B2B Agent Discount</option>
                    <option value="early_bird">Early Bird Discount</option>
                    <option value="seasonal_hike">Seasonal Hike</option>
                    <option value="last_minute">Last-Minute Deal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Adjustment Percentage (%)</label>
                  <input
                    type="number"
                    placeholder="e.g. +15 or -10"
                    value={newRuleAdjustment}
                    onChange={(e) => setNewRuleAdjustment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPricingRuleOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md"
                >
                  Apply Pricing Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-MODAL 3: BOOKING DETAILS MODAL */}
      {/* ======================================================== */}
      {selectedBookingDetails && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-400">{selectedBookingDetails.bookingRef}</span>
                <h3 className="text-base font-extrabold text-white">Guest Reservation Manifest</h3>
              </div>
              <button
                onClick={() => setSelectedBookingDetails(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer Name:</span>
                  <span className="font-bold text-white">{selectedBookingDetails.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-medium text-slate-200">{selectedBookingDetails.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-medium text-slate-200">{selectedBookingDetails.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Units Booked:</span>
                  <span className="font-bold text-emerald-400">{selectedBookingDetails.unitsBooked}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Service:</span>
                  <span className="font-bold text-white">{selectedBookingDetails.itemName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date:</span>
                  <span className="font-medium text-slate-200">{selectedBookingDetails.travelOrServiceDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gross Total:</span>
                  <span className="font-black text-white">₹{selectedBookingDetails.grossAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Platform Commission:</span>
                  <span className="font-medium text-rose-400">-₹{selectedBookingDetails.commissionAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800 font-black">
                  <span className="text-emerald-400">Net Partner Payout:</span>
                  <span className="text-emerald-300">₹{selectedBookingDetails.netPayout.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedBookingDetails(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Close
              </button>
              {selectedBookingDetails.status === "confirmed" && (
                <button
                  onClick={() => handleUpdateBookingStatus(selectedBookingDetails.id, "completed")}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Mark as Checked-in
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
