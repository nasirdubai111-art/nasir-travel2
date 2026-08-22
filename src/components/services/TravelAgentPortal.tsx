import React, { useState } from "react";
import {
  Briefcase,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  CreditCard,
  Building2,
  Users,
  FileText,
  Percent,
  Download,
  Filter,
  ShieldCheck,
  Zap,
  ArrowRight,
  Plane,
  Train,
  Bus,
  Hotel,
  MapPin,
  Calendar,
  Wallet,
  Landmark,
  UserCheck,
  Send,
  Eye,
  Settings,
  Sparkles,
  Phone,
  Mail,
  Receipt,
  Printer,
  Share2,
} from "lucide-react";
import {
  INITIAL_AGENT_KYC,
  INITIAL_AGENT_CUSTOMERS,
  INITIAL_AGENT_SUB_ACCOUNTS,
  INITIAL_AGENT_MARKUP_RULES,
  AGENT_WHOLESALE_INVENTORY,
  TravelAgentKYC,
  AgentCustomerProfile,
  AgentSubAccount,
  AgentMarkupRule,
  AgentWholesaleInventoryItem,
} from "../../data/agentData";
import { BookingItem } from "../../types";

interface TravelAgentPortalProps {
  onBookItem: (booking: BookingItem) => void;
  onOpenAIDrawer: () => void;
}

export function TravelAgentPortal({ onBookItem, onOpenAIDrawer }: TravelAgentPortalProps) {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "wholesale_booking" | "markup_engine" | "wallet_settlement" | "customers_crm" | "sub_agents" | "reports" | "kyc_profile"
  >("dashboard");

  // State
  const [kycProfile, setKycProfile] = useState<TravelAgentKYC>(INITIAL_AGENT_KYC);
  const [customers, setCustomers] = useState<AgentCustomerProfile[]>(INITIAL_AGENT_CUSTOMERS);
  const [subAccounts, setSubAccounts] = useState<AgentSubAccount[]>(INITIAL_AGENT_SUB_ACCOUNTS);
  const [markupRules, setMarkupRules] = useState<AgentMarkupRule[]>(INITIAL_AGENT_MARKUP_RULES);
  const [inventoryList, setInventoryList] = useState<AgentWholesaleInventoryItem[]>(AGENT_WHOLESALE_INVENTORY);

  // Financial Wallet State
  const [walletBalance, setWalletBalance] = useState<number>(148500);
  const [creditLimitTotal, setCreditLimitTotal] = useState<number>(500000);
  const [creditLimitUsed, setCreditLimitUsed] = useState<number>(120000);
  const [rechargeAmount, setRechargeAmount] = useState<number>(50000);
  const [isRecharging, setIsRecharging] = useState<boolean>(false);
  const [rechargeSuccess, setRechargeSuccess] = useState<boolean>(false);

  // Quick Wholesale Search
  const [searchCategory, setSearchCategory] = useState<string>("all");
  const [bookingClientName, setBookingClientName] = useState<string>("Dr. Vikramaditya Joshi");
  const [bookingSuccessBanner, setBookingSuccessBanner] = useState<string | null>(null);

  // New Sub-Agent Modal State
  const [showAddSubAgentModal, setShowAddSubAgentModal] = useState<boolean>(false);
  const [newSubName, setNewSubName] = useState("");
  const [newSubEmail, setNewSubEmail] = useState("");
  const [newSubPhone, setNewSubPhone] = useState("");
  const [newSubBranch, setNewSubBranch] = useState("MG Road Branch, Pune");

  // New Client Modal State
  const [showAddClientModal, setShowAddClientModal] = useState<boolean>(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientCity, setNewClientCity] = useState("Pune");
  const [newClientPassport, setNewClientPassport] = useState("");

  const handleBookWholesale = (item: AgentWholesaleInventoryItem) => {
    const markup = markupRules.find((m) => m.serviceCategory === item.serviceCategory);
    let extraMarkup = 0;
    if (markup && markup.isActive) {
      if (markup.markupType === "flat_inr") {
        extraMarkup = markup.markupValue;
      } else {
        extraMarkup = Math.round((item.wholesaleNetAgentPrice * markup.markupValue) / 100);
      }
    }
    const customerBillAmount = item.wholesaleNetAgentPrice + extraMarkup;
    const totalAgencyProfit = item.commissionEarned + extraMarkup;

    const newBooking: BookingItem = {
      id: `B2B-${Date.now()}`,
      serviceCategory: item.serviceCategory,
      title: `${item.title} (B2B Agent Ticket: ${bookingClientName})`,
      provider: item.provider,
      fromLocation: item.route.split("→")[0]?.trim() || "Source",
      toLocation: item.route.split("→")[1]?.trim() || "Destination",
      date: item.date,
      time: "Confirmed B2B Seat",
      status: "confirmed",
      amountPaid: customerBillAmount,
      pnr: `AGT-${Math.floor(100000 + Math.random() * 900000)}`,
      passengersCount: 1,
      seatOrRoomInfo: `${item.seatOrRoomAvailable} • Net Wholesale Rate: ₹${item.wholesaleNetAgentPrice} (Agency Profit: ₹${totalAgencyProfit})`,
    };

    // Deduct net price from wallet
    setWalletBalance((prev) => Math.max(0, prev - item.wholesaleNetAgentPrice));
    onBookItem(newBooking);
    setBookingSuccessBanner(
      `Booking Confirmed for ${bookingClientName}! Voucher PNR: ${newBooking.pnr}. Agent Profit ₹${totalAgencyProfit} added to ledger.`
    );
    setTimeout(() => setBookingSuccessBanner(null), 6000);
  };

  const handleRechargeWallet = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRecharging(true);
    setTimeout(() => {
      setWalletBalance((prev) => prev + Number(rechargeAmount));
      setIsRecharging(false);
      setRechargeSuccess(true);
      setTimeout(() => setRechargeSuccess(false), 4000);
    }, 900);
  };

  const handleAddSubAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName) return;
    const newSub: AgentSubAccount = {
      id: `sub-${Date.now()}`,
      name: newSubName,
      email: newSubEmail || `${newSubName.toLowerCase().replace(/\s+/g, ".")}@swastiktravels.in`,
      phone: newSubPhone || "+91 98000 00000",
      branchLocation: newSubBranch,
      role: "Counter Booking Executive",
      permissions: {
        canBookFlights: true,
        canBookTrains: true,
        canBookHotels: true,
        canModifyMarkup: false,
        canWithdrawCommission: false,
      },
      dailyBookingCap: 200000,
      todayBookedAmount: 0,
      status: "Active",
    };
    setSubAccounts([...subAccounts, newSub]);
    setShowAddSubAgentModal(false);
    setNewSubName("");
    setNewSubEmail("");
    setNewSubPhone("");
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName) return;
    const newCust: AgentCustomerProfile = {
      id: `cust-${Date.now()}`,
      name: newClientName,
      phone: newClientPhone || "+91 98000 00000",
      email: newClientEmail || "client@gmail.com",
      city: newClientCity,
      totalBookingsCount: 1,
      totalSpent: 0,
      passportNumber: newClientPassport,
      mealPreference: "Vegetarian",
      seatPreference: "Aisle",
    };
    setCustomers([newCust, ...customers]);
    setShowAddClientModal(false);
    setNewClientName("");
    setNewClientPhone("");
    setNewClientEmail("");
    setNewClientPassport("");
  };

  const handleToggleMarkup = (id: string) => {
    setMarkupRules(
      markupRules.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m))
    );
  };

  const handleUpdateMarkupVal = (id: string, newVal: number) => {
    setMarkupRules(
      markupRules.map((m) => (m.id === id ? { ...m, markupValue: newVal } : m))
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-blue-900/50">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Briefcase className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black">{kycProfile.agencyName}</h1>
                  <span className="px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {kycProfile.agentTier}
                  </span>
                </div>
                <p className="text-xs text-blue-200 mt-0.5">
                  IATA: {kycProfile.iataNumber} • IRCTC B2B Principal ID: {kycProfile.irctcPrincipalAgentId} • GSTIN: {kycProfile.gstin}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Balance Pills */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 min-w-[140px]">
              <span className="text-[10px] text-blue-200 uppercase font-bold tracking-wider block">Wallet Balance</span>
              <span className="text-lg font-black text-amber-300">₹{walletBalance.toLocaleString("en-IN")}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 min-w-[140px]">
              <span className="text-[10px] text-blue-200 uppercase font-bold tracking-wider block">Available Credit Line</span>
              <span className="text-lg font-black text-emerald-300">
                ₹{(creditLimitTotal - creditLimitUsed).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {bookingSuccessBanner && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-between shadow-lg animate-in slide-in-from-top">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{bookingSuccessBanner}</span>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex items-center gap-1 overflow-x-auto shadow-2xs">
        {[
          { id: "dashboard", label: "Agent Dashboard", icon: TrendingUp },
          { id: "wholesale_booking", label: "Wholesale B2B Booking", icon: Search },
          { id: "markup_engine", label: "Markup & Commission", icon: Percent },
          { id: "wallet_settlement", label: "Wallet & Instant Settlement", icon: Wallet },
          { id: "customers_crm", label: "Customer CRM", icon: Users },
          { id: "sub_agents", label: "Sub-Agents & Branches", icon: Building2 },
          { id: "reports", label: "Ledger & TDS Reports", icon: FileText },
          { id: "kyc_profile", label: "KYC & Licenses", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: AGENT DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">This Month Gross Turnover</span>
              <div className="text-2xl font-black text-slate-900">₹14,80,500</div>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +18.4% vs last month
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Net Commission Earned</span>
              <div className="text-2xl font-black text-blue-600">₹1,12,480</div>
              <span className="text-[10px] text-slate-500 font-semibold">TDS Deducted @ 5% u/s 194H: ₹5,920</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Client Base</span>
              <div className="text-2xl font-black text-slate-900">{customers.length} Accounts</div>
              <span className="text-[10px] text-purple-600 font-bold">14 Corporate Clients Enrolled</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sub-Agents / Branches</span>
              <div className="text-2xl font-black text-slate-900">{subAccounts.length} Active</div>
              <span className="text-[10px] text-emerald-600 font-bold">All 3 Branches In Good Standing</span>
            </div>
          </div>

          {/* Quick Actions & High Demand B2B Inventory */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">High Commission B2B Wholesale Inventory</h3>
                  <p className="text-xs text-slate-500">Live wholesale seats with guaranteed commission payouts</p>
                </div>
                <button
                  onClick={() => setActiveTab("wholesale_booking")}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {inventoryList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                          {item.serviceCategory}
                        </span>
                        <span className="font-extrabold text-xs text-slate-900">{item.title}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{item.route} • {item.date}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-600 mt-1">
                        <span>Retail: <del>₹{item.retailPrice}</del></span>
                        <span className="font-bold text-slate-900">Wholesale Net: ₹{item.wholesaleNetAgentPrice}</span>
                        <span className="font-extrabold text-emerald-600">Profit: +₹{item.commissionEarned}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBookWholesale(item)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 shadow-xs"
                    >
                      Instant Book for Client
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Agent Actions Card */}
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-6 space-y-5 border border-slate-800 shadow-xl">
              <div>
                <h3 className="text-sm font-extrabold text-amber-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Agent Quick Toolkit
                </h3>
                <p className="text-xs text-slate-300 mt-1">Direct access to frequent distributor operations.</p>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => setActiveTab("wholesale_booking")}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-left text-xs font-bold transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-blue-300" />
                    Wholesale Train / Flight Search
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveTab("markup_engine")}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-left text-xs font-bold transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-amber-300" />
                    Configure Dynamic Markups
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveTab("wallet_settlement")}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-left text-xs font-bold transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-emerald-300" />
                    Recharge Instant Agent Wallet
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => setShowAddClientModal(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-left text-xs font-bold transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-pink-300" />
                    Add Customer Profile (CRM)
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-900/40 border border-blue-700/40 text-[11px] text-blue-200">
                <span className="font-bold text-white block mb-0.5">Need Priority GDS Desk Support?</span>
                Dedicated 24/7 Agent Desk: <span className="font-mono text-amber-300">+91 1800 200 9944</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WHOLESALE B2B BOOKING */}
      {activeTab === "wholesale_booking" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Wholesale B2B Inventory Search</h3>
                <p className="text-xs text-slate-500">Book at net supplier rates with instant agency margin</p>
              </div>

              {/* Select Client for booking */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Booking For Client:</span>
                <select
                  value={bookingClientName}
                  onChange={(e) => setBookingClientName(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 text-slate-800"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {["all", "flights", "trains", "hotels", "tours"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSearchCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${
                    searchCategory === cat
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Inventory Listing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {inventoryList
                .filter((item) => searchCategory === "all" || item.serviceCategory === searchCategory)
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-3xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-900 text-[10px] font-bold uppercase">
                          {item.serviceCategory} • {item.provider}
                        </span>
                        <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                          PNR Hold: {item.supplierPnrCode}
                        </span>
                      </div>

                      <h4 className="font-black text-slate-900 text-sm mt-2">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{item.route} • {item.date}</p>
                      <p className="text-xs text-emerald-700 font-bold mt-1">{item.seatOrRoomAvailable}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Net Agent Wholesale</div>
                        <div className="text-lg font-black text-slate-900">₹{item.wholesaleNetAgentPrice}</div>
                        <div className="text-[10px] text-emerald-600 font-bold">
                          Client MRP: ₹{item.retailPrice} (Margin +₹{item.commissionEarned})
                        </div>
                      </div>

                      <button
                        onClick={() => handleBookWholesale(item)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                      >
                        Book for {bookingClientName.split(" ")[0]}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DYNAMIC MARKUP & COMMISSION ENGINE */}
      {activeTab === "markup_engine" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-2xs">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Dynamic Agency Markup &amp; Commission Rules</h3>
              <p className="text-xs text-slate-500">
                Set custom flat or percentage margins added automatically to client invoices and vouchers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {markupRules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-5 rounded-3xl border transition-all space-y-3 ${
                    rule.isActive ? "border-blue-300 bg-blue-50/30" : "border-slate-200 bg-slate-50 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 uppercase text-xs tracking-wider">
                      {rule.serviceCategory} Markup
                    </span>
                    <button
                      onClick={() => handleToggleMarkup(rule.id)}
                      className={`px-3 py-1 rounded-xl text-[10px] font-black transition-colors ${
                        rule.isActive ? "bg-emerald-600 text-white" : "bg-slate-300 text-slate-700"
                      }`}
                    >
                      {rule.isActive ? "Active Rule" : "Paused"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Markup Type</label>
                      <span className="text-xs font-bold text-slate-800">
                        {rule.markupType === "flat_inr" ? "Flat INR (₹) per Ticket" : "Percentage (%) on Base"}
                      </span>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Configured Margin</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={rule.markupValue}
                          onChange={(e) => handleUpdateMarkupVal(rule.id, parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 rounded-lg border border-slate-200 font-black text-xs bg-white"
                        />
                        <span className="text-xs font-bold text-slate-600">
                          {rule.markupType === "flat_inr" ? "₹" : "%"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span>Apply to Sub-Agent Portals:</span>
                    <span className="font-bold text-slate-800">{rule.applyToSubAgents ? "Yes (Enforced)" : "Branch Custom"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WALLET & SETTLEMENT */}
      {activeTab === "wallet_settlement" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Wallet Balance & Recharge Card */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-2xs">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">B2B Agent Instant Wallet</h3>
                <p className="text-xs text-slate-500">Auto-deductions for instant ticketing without payment gateway drop-offs.</p>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-blue-200 font-bold uppercase">Pre-Funded Wallet Balance</span>
                    <div className="text-3xl font-black mt-1">₹{walletBalance.toLocaleString("en-IN")}</div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
                    Instant Clearing Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20 text-xs">
                  <div>
                    <span className="text-blue-200 block text-[10px] uppercase font-bold">Bank Virtual Account</span>
                    <span className="font-mono font-bold">HDFC-AGT-90210</span>
                  </div>
                  <div>
                    <span className="text-blue-200 block text-[10px] uppercase font-bold">UPI VPA Handle</span>
                    <span className="font-mono font-bold">swastik.b2b@hdfcbank</span>
                  </div>
                </div>
              </div>

              {/* Quick Recharge Form */}
              <form onSubmit={handleRechargeWallet} className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-800 text-xs">Recharge Wallet via NetBanking / UPI / NEFT:</h4>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(Number(e.target.value))}
                    className="px-4 py-2.5 rounded-2xl border border-slate-200 font-bold text-xs w-48"
                    placeholder="Amount in ₹"
                  />
                  <button
                    type="submit"
                    disabled={isRecharging}
                    className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all"
                  >
                    {isRecharging ? "Adding Funds..." : "Top-up Wallet"}
                  </button>
                </div>
                {rechargeSuccess && (
                  <span className="text-xs font-bold text-emerald-600 block">
                    ✓ Wallet successfully topped up with ₹{rechargeAmount.toLocaleString("en-IN")}!
                  </span>
                )}
              </form>
            </div>

            {/* Instant Bank Payout & Settlement */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-emerald-600" />
                Verified Settlement Account
              </h3>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Beneficiary Name</span>
                  <div className="font-bold text-slate-900">{kycProfile.beneficiaryName}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Bank &amp; Account Number</span>
                  <div className="font-mono font-bold text-slate-900">
                    {kycProfile.bankName} • {kycProfile.bankAccountNumber}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">IFSC Code</span>
                  <div className="font-mono font-bold text-slate-900">{kycProfile.ifscCode}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                <span className="font-bold block">T+0 Automated Payouts</span>
                <p className="text-[11px] leading-relaxed">
                  Earned commissions above ₹5,000 are settled automatically to your registered bank every Monday morning.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CUSTOMER MANAGEMENT CRM */}
      {activeTab === "customers_crm" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Customer CRM &amp; Saved Profiles</h3>
                <p className="text-xs text-slate-500">Store passport details, frequent flyer &amp; IRCTC IDs for 1-click booking</p>
              </div>
              <button
                onClick={() => setShowAddClientModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Client Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {customers.map((cust) => (
                <div
                  key={cust.id}
                  className="p-5 rounded-3xl border border-slate-200 bg-white hover:border-blue-300 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-slate-900 text-sm">{cust.name}</h4>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {cust.city}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{cust.phone}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{cust.email}</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] space-y-1 text-slate-700">
                    {cust.passportNumber && <div>Passport: <span className="font-mono font-bold">{cust.passportNumber}</span></div>}
                    {cust.irctcUserHandle && <div>IRCTC User: <span className="font-mono font-bold">{cust.irctcUserHandle}</span></div>}
                    <div>Meal Pref: <span className="font-semibold text-emerald-700">{cust.mealPreference}</span></div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-semibold">{cust.totalBookingsCount} Bookings Made</span>
                    <button
                      onClick={() => {
                        setBookingClientName(cust.name);
                        setActiveTab("wholesale_booking");
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      Book for Client →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SUB-AGENT & BRANCH MANAGEMENT */}
      {activeTab === "sub_agents" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Branch Sub-Agents &amp; Booking Counters</h3>
                <p className="text-xs text-slate-500">Configure counter staff permissions, daily quotas, and branch oversight</p>
              </div>
              <button
                onClick={() => setShowAddSubAgentModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Sub-Agent Login</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {subAccounts.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 rounded-3xl border border-slate-200 bg-white space-y-3 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-sm">{sub.name}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {sub.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500">
                    <p className="font-semibold text-slate-700">{sub.role}</p>
                    <p>{sub.branchLocation}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] space-y-1.5">
                    <div className="font-bold text-slate-800">Permissions:</div>
                    <div className="flex flex-wrap gap-1">
                      {sub.permissions.canBookFlights && (
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px]">Flights</span>
                      )}
                      {sub.permissions.canBookTrains && (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold text-[10px]">Trains</span>
                      )}
                      {sub.permissions.canBookHotels && (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px]">Hotels</span>
                      )}
                      {sub.permissions.canModifyMarkup && (
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold text-[10px]">Edit Markup</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Daily Cap:</span>
                      <span className="font-bold text-slate-900">₹{sub.dailyBookingCap.toLocaleString("en-IN")}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Today Booked:</span>
                      <span className="font-bold text-blue-600">₹{sub.todayBookedAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: REPORTS, LEDGER & TDS CERTIFICATES */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Financial Ledger &amp; Tax Compliance Reports</h3>
                <p className="text-xs text-slate-500">Download audited statements, Form 16A TDS certificates, and sales analytics</p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV / Excel Ledger</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Form 16A (Q1 TDS)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Generated</span>
                </div>
                <p className="text-[11px] text-slate-500">Section 194H Commission TDS Certificate FY 2026-27</p>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <Download className="w-3 h-3" /> Download Signed PDF
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">GST B2B Inward Register</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">GSTR-2B Ready</span>
                </div>
                <p className="text-[11px] text-slate-500">ITC Claim Report for Airlines &amp; Hotel invoices</p>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <Download className="w-3 h-3" /> Download Excel
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Daily Sales Audit Trail</span>
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">Live Synced</span>
                </div>
                <p className="text-[11px] text-slate-500">Counter-wise tickets, cancellations and margin summaries</p>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <Download className="w-3 h-3" /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: KYC & LICENSES */}
      {activeTab === "kyc_profile" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Agent KYC &amp; Regulatory Accreditations</h3>
                <p className="text-xs text-slate-500">Verified credentials enabling instant IRCTC &amp; IATA ticketing quotas</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Fully Verified
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">PAN Card (Entity)</span>
                <div className="font-mono font-bold text-slate-900">{kycProfile.panNumber} (Verified NSDL)</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">GSTIN Registration</span>
                <div className="font-mono font-bold text-slate-900">{kycProfile.gstin} (Active Regular)</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">IATA Accreditation ID</span>
                <div className="font-mono font-bold text-slate-900">{kycProfile.iataNumber}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">IRCTC Principal Agent Code</span>
                <div className="font-mono font-bold text-slate-900">{kycProfile.irctcPrincipalAgentId}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Sub-Agent */}
      {showAddSubAgentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900">Create New Sub-Agent Account</h3>
            <form onSubmit={handleAddSubAgent} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Executive Name</label>
                <input
                  type="text"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={newSubEmail}
                  onChange={(e) => setNewSubEmail(e.target.value)}
                  placeholder="e.g. ramesh.p@swastiktravels.in"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Mobile (+91)</label>
                <input
                  type="text"
                  value={newSubPhone}
                  onChange={(e) => setNewSubPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Branch Location</label>
                <input
                  type="text"
                  value={newSubBranch}
                  onChange={(e) => setNewSubBranch(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSubAgentModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Create Sub-Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Client Profile */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900">Add Customer CRM Profile</h3>
            <form onSubmit={handleAddClient} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Customer Full Name</label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="e.g. Ramesh Kulkarni"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="client@gmail.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">City</label>
                  <input
                    type="text"
                    value={newClientCity}
                    onChange={(e) => setNewClientCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Passport No.</label>
                  <input
                    type="text"
                    value={newClientPassport}
                    onChange={(e) => setNewClientPassport(e.target.value)}
                    placeholder="M1049281"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
