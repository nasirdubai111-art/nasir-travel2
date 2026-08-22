import React, { useState } from "react";
import {
  X,
  LayoutDashboard,
  Users,
  MessageSquare,
  Ticket,
  Plane,
  Train,
  Bus,
  Hotel,
  Compass,
  Package,
  Wallet,
  Percent,
  CreditCard,
  Building2,
  ShieldCheck,
  BarChart3,
  Terminal,
  Settings,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Download,
  FileText,
  Phone,
  Mail,
  MapPin,
  Star,
  ArrowUpRight,
  Printer,
  ChevronRight,
  Sparkles,
  Lock,
  RefreshCw,
  Eye,
  Send,
  Sliders,
  DollarSign,
  Briefcase,
  Key,
  Radio,
  Server,
  Zap,
} from "lucide-react";
import {
  TravelAgentPublicProfile,
  AgentCustomerEnquiry,
  AgentBookingRecord,
  AgentTechnicalApiEndpoint,
  AgentTourPackageSummary,
} from "../../types";
import {
  TRAVEL_AGENTS_DATABASE,
  INITIAL_AGENT_ENQUIRIES,
  INITIAL_AGENT_BOOKINGS,
  TECHNICAL_API_ENDPOINTS,
} from "../../data/agentProfileData";
import {
  INITIAL_AGENT_CUSTOMERS,
  INITIAL_AGENT_SUB_ACCOUNTS,
  INITIAL_AGENT_MARKUP_RULES,
  AGENT_WHOLESALE_INVENTORY,
  AgentCustomerProfile,
  AgentSubAccount,
  AgentMarkupRule,
  AgentWholesaleInventoryItem,
} from "../../data/agentData";

interface AgentBackendDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AgentBackendDashboardModal({
  isOpen,
  onClose,
}: AgentBackendDashboardModalProps) {
  if (!isOpen) return null;

  // Selected Agent ID
  const [selectedAgentId, setSelectedAgentId] = useState<string>("agent-swastik");

  // Active Management Tab
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "customers_crm"
    | "enquiries"
    | "bookings"
    | "packages"
    | "commission_markup"
    | "wallet_settlement"
    | "sub_agents"
    | "reports"
    | "kyc_profile"
    | "technical_backend"
  >("dashboard");

  // Filter inside Bookings Tab
  const [bookingServiceFilter, setBookingServiceFilter] = useState<string>("all");
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>("all");
  const [bookingSearchQuery, setBookingSearchQuery] = useState<string>("");

  // Local State
  const [bookingsList, setBookingsList] = useState<AgentBookingRecord[]>(INITIAL_AGENT_BOOKINGS);
  const [enquiriesList, setEnquiriesList] = useState<AgentCustomerEnquiry[]>(INITIAL_AGENT_ENQUIRIES);
  const [customersList, setCustomersList] = useState<AgentCustomerProfile[]>(INITIAL_AGENT_CUSTOMERS);
  const [subAgentsList, setSubAgentsList] = useState<AgentSubAccount[]>(INITIAL_AGENT_SUB_ACCOUNTS);
  const [markupRules, setMarkupRules] = useState<AgentMarkupRule[]>(INITIAL_AGENT_MARKUP_RULES);

  // Financial Wallet State
  const [walletBalance, setWalletBalance] = useState<number>(248500);
  const [creditLimitTotal, setCreditLimitTotal] = useState<number>(1000000);
  const [creditLimitUsed, setCreditLimitUsed] = useState<number>(320000);
  const [payoutSuccessNotice, setPayoutSuccessNotice] = useState<string | null>(null);

  // New Sub-Agent Modal
  const [showAddSubAgentModal, setShowAddSubAgentModal] = useState<boolean>(false);
  const [newSubName, setNewSubName] = useState("");
  const [newSubEmail, setNewSubEmail] = useState("");
  const [newSubPhone, setNewSubPhone] = useState("");
  const [newSubBranch, setNewSubBranch] = useState("FC Road Head Office, Pune");

  // New Package Creation Modal
  const [showCreatePackageModal, setShowCreatePackageModal] = useState<boolean>(false);
  const [newPackageTitle, setNewPackageTitle] = useState("");
  const [newPackageDest, setNewPackageDest] = useState("Kashmir Backwaters & Valleys");
  const [newPackageDuration, setNewPackageDuration] = useState("6 Days / 5 Nights");
  const [newPackagePrice, setNewPackagePrice] = useState(28500);

  // New Customer Enquiry Quotation Modal
  const [selectedEnquiryForQuote, setSelectedEnquiryForQuote] = useState<AgentCustomerEnquiry | null>(null);
  const [quotePrice, setQuotePrice] = useState<number>(38000);
  const [quoteNotes, setQuoteNotes] = useState("Includes 4-Star hotel, Innova Crysta, and VIP Darshan.");

  const currentAgent =
    TRAVEL_AGENTS_DATABASE.find((a) => a.id === selectedAgentId) || TRAVEL_AGENTS_DATABASE[0];

  // Financial Metrics
  const totalGmv = bookingsList.reduce((sum, b) => sum + b.totalPayable, 0);
  const totalCommissionEarned = bookingsList.reduce((sum, b) => sum + b.agentCommission, 0);
  const totalPassengersHandled = bookingsList.reduce((sum, b) => sum + b.travellers.length, 0);

  const handleStatusChange = (bookingId: string, newStatus: AgentBookingRecord["bookingStatus"]) => {
    setBookingsList((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: newStatus } : b))
    );
  };

  const handleEnquiryStatusChange = (enquiryId: string, newStatus: AgentCustomerEnquiry["status"]) => {
    setEnquiriesList((prev) =>
      prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
    );
  };

  const handleSendQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiryForQuote) return;

    setEnquiriesList((prev) =>
      prev.map((item) =>
        item.id === selectedEnquiryForQuote.id
          ? {
              ...item,
              status: "QUOTED",
              notes: `Quotation sent for ₹${quotePrice.toLocaleString("en-IN")}. ${quoteNotes}`,
            }
          : item
      )
    );

    setPayoutSuccessNotice(
      `Quotation of ₹${quotePrice.toLocaleString("en-IN")} sent to ${selectedEnquiryForQuote.customerName} (${selectedEnquiryForQuote.customerPhone}) via SMS/WhatsApp!`
    );
    setSelectedEnquiryForQuote(null);
    setTimeout(() => setPayoutSuccessNotice(null), 6000);
  };

  const handleRequestWalletPayout = () => {
    setPayoutSuccessNotice(
      `Instant settlement of ₹${walletBalance.toLocaleString(
        "en-IN"
      )} requested to ${currentAgent.officeDetails.headOffice.city} HDFC Bank A/C (ending in 20491). NEFT UTR will be generated within 10 mins.`
    );
    setTimeout(() => setPayoutSuccessNotice(null), 7000);
  };

  const handleCreateSubAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName || !newSubEmail) return;

    const newSub: AgentSubAccount = {
      id: `sub-${Date.now()}`,
      name: newSubName,
      email: newSubEmail,
      phone: newSubPhone || "+91 98220 00000",
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

    setSubAgentsList([...subAgentsList, newSub]);
    setShowAddSubAgentModal(false);
    setNewSubName("");
    setNewSubEmail("");
    setNewSubPhone("");
  };

  const filteredBookings = bookingsList.filter((b) => {
    if (bookingServiceFilter !== "all" && b.serviceCategory !== bookingServiceFilter) return false;
    if (bookingStatusFilter !== "all" && b.bookingStatus !== bookingStatusFilter) return false;
    if (
      bookingSearchQuery &&
      !b.leadCustomer.name.toLowerCase().includes(bookingSearchQuery.toLowerCase()) &&
      !b.bookingRef.toLowerCase().includes(bookingSearchQuery.toLowerCase()) &&
      !b.serviceTitle.toLowerCase().includes(bookingSearchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in">
      <div className="bg-slate-950 text-slate-100 rounded-3xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl border border-slate-800 animate-in zoom-in-95">
        {/* Top Management Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-indigo-400" />
                  Travel Agent Enterprise Console
                </span>
                <span className="text-[11px] text-slate-400">
                  IATA ID: <strong>{currentAgent.accreditations.iata || "14-3-90214"}</strong> • GST: <strong>{currentAgent.accreditations.gstin}</strong>
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight mt-0.5">
                {currentAgent.businessName} (Backend Terminal)
              </h2>
            </div>
          </div>

          {/* Agency Switcher & Close */}
          <div className="flex items-center gap-2.5">
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-indigo-500"
            >
              {TRAVEL_AGENTS_DATABASE.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.businessName} ({agent.officeDetails.headOffice.city})
                </option>
              ))}
            </select>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 11 Enterprise Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-6 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-bold overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "dashboard"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("customers_crm")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "customers_crm"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customers CRM ({customersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("enquiries")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "enquiries"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Leads &amp; Enquiries ({enquiriesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "bookings"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Multi-Service Bookings ({bookingsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("packages")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "packages"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Package Manager</span>
          </button>

          <button
            onClick={() => setActiveTab("commission_markup")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "commission_markup"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>Markup &amp; Commission</span>
          </button>

          <button
            onClick={() => setActiveTab("wallet_settlement")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "wallet_settlement"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Wallet &amp; Settlements</span>
          </button>

          <button
            onClick={() => setActiveTab("sub_agents")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "sub_agents"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Sub-Agents &amp; Staff</span>
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "reports"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Reports &amp; GSTR-1</span>
          </button>

          <button
            onClick={() => setActiveTab("kyc_profile")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "kyc_profile"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>KYC &amp; Licenses</span>
          </button>

          <button
            onClick={() => setActiveTab("technical_backend")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "technical_backend"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>API &amp; Tech Engine</span>
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {payoutSuccessNotice && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{payoutSuccessNotice}</span>
            </div>
          )}

          {/* ----------------- TAB 1: EXECUTIVE DASHBOARD ----------------- */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-1">
                  <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-wider">Gross Booking Value</span>
                  <div className="text-xl sm:text-2xl font-black text-white">₹{totalGmv.toLocaleString("en-IN")}</div>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +24.8% this month
                  </span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-1">
                  <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-wider">Agent Commission Earned</span>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400">₹{totalCommissionEarned.toLocaleString("en-IN")}</div>
                  <span className="text-[10px] text-slate-400">Direct wallet payout ready</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-1">
                  <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-wider">Wallet Balance</span>
                  <div className="text-xl sm:text-2xl font-black text-indigo-400">₹{walletBalance.toLocaleString("en-IN")}</div>
                  <span className="text-[10px] text-slate-400">Credit Limit: ₹{(creditLimitTotal / 100000).toFixed(1)}L</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-1">
                  <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-wider">Active Travellers</span>
                  <div className="text-xl sm:text-2xl font-black text-cyan-400">{totalPassengersHandled} Passengers</div>
                  <span className="text-[10px] text-slate-400">{enquiriesList.filter((e) => e.status === "NEW").length} Urgent Leads Pending</span>
                </div>
              </div>

              {/* Quick Operation Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Multi-Service Bookings */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Recent Multi-Service Bookings &amp; Tickets</h3>
                      <p className="text-xs text-slate-400">Flights, IRCTC Trains, Hotels, and Tours</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("bookings")}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {bookingsList.slice(0, 3).map((b) => (
                      <div
                        key={b.id}
                        className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-black text-[10px] uppercase">
                              {b.serviceCategory}
                            </span>
                            <span className="font-bold text-white">{b.leadCustomer.name}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-0.5">{b.serviceTitle}</p>
                          <span className="text-[10px] text-slate-400">PNR: {b.ticketOrPnr} • {b.issuedAt}</span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-sm font-black text-white block">₹{b.totalPayable.toLocaleString("en-IN")}</span>
                          <span className="text-[10px] text-emerald-400 font-bold">+₹{b.agentCommission.toLocaleString("en-IN")} Comm</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inbound Leads & Quick Actions */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white">Lead Inbox &amp; Quick Dispatch</h3>

                  <div className="space-y-2.5">
                    {enquiriesList.slice(0, 2).map((enq) => (
                      <div
                        key={enq.id}
                        className="p-3 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <strong className="text-white">{enq.customerName}</strong>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                            {enq.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300">{enq.serviceRequested} ({enq.destination})</p>
                        <button
                          onClick={() => {
                            setSelectedEnquiryForQuote(enq);
                            setActiveTab("enquiries");
                          }}
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                        >
                          <span>Send Quotation</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
                    <button
                      onClick={handleRequestWalletPayout}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Instant Wallet Payout (₹{walletBalance.toLocaleString("en-IN")})</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------- TAB 2: CUSTOMERS & CRM ----------------- */}
          {activeTab === "customers_crm" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Customer Database &amp; Lifetime Value</h3>
                  <p className="text-xs text-slate-400">Frequent flyers, IRCTC handles, passport records, and dietary preferences.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customersList.map((cust) => (
                  <div key={cust.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <h4 className="text-sm font-bold text-white">{cust.name}</h4>
                        <span className="text-[10px] text-slate-400">{cust.city}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                        {cust.totalBookingsCount} Trips
                      </span>
                    </div>

                    <div className="space-y-1.5 text-slate-300 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Phone</span>
                        <strong className="text-white">{cust.phone}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Email</span>
                        <strong className="text-white truncate max-w-[150px]">{cust.email}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Total Spend</span>
                        <strong className="text-emerald-400">₹{cust.totalSpent.toLocaleString("en-IN")}</strong>
                      </div>
                      {cust.passportNumber && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Passport</span>
                          <strong className="text-white">{cust.passportNumber} (Exp: {cust.passportExpiry})</strong>
                        </div>
                      )}
                      {cust.irctcUserHandle && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">IRCTC User</span>
                          <strong className="text-cyan-300">{cust.irctcUserHandle}</strong>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-500">Diet &amp; Seat</span>
                        <strong className="text-amber-300">{cust.mealPreference} • {cust.seatPreference}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ----------------- TAB 3: LEADS & ENQUIRIES ----------------- */}
          {activeTab === "enquiries" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Inbound Customer Enquiries &amp; Lead Pipeline</h3>
                  <p className="text-xs text-slate-400">Direct inquiries submitted by travelers on your public profile</p>
                </div>
              </div>

              {selectedEnquiryForQuote && (
                <div className="bg-indigo-950/60 border border-indigo-800 rounded-3xl p-5 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">
                      Build &amp; Send Custom Quotation to {selectedEnquiryForQuote.customerName}
                    </h4>
                    <button onClick={() => setSelectedEnquiryForQuote(null)} className="text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSendQuotation} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">Quotation Total Price (₹) *</label>
                      <input
                        type="number"
                        required
                        value={quotePrice}
                        onChange={(e) => setQuotePrice(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-slate-300 font-bold block mb-1">Inclusions &amp; Notes</label>
                      <input
                        type="text"
                        value={quoteNotes}
                        onChange={(e) => setQuoteNotes(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>

                    <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedEnquiryForQuote(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5"
                      >
                        <Send className="w-4 h-4" />
                        <span>Send Quotation to Customer</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-3">
                {enquiriesList.map((enq) => (
                  <div key={enq.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] text-indigo-400 font-bold uppercase block">{enq.serviceRequested}</span>
                        <h4 className="text-sm font-bold text-white">{enq.customerName} ({enq.customerPhone})</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={enq.status}
                          onChange={(e) => handleEnquiryStatusChange(enq.id, e.target.value as any)}
                          className="bg-slate-800 border border-slate-700 text-xs text-white font-bold rounded-xl px-2.5 py-1"
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="QUOTED">QUOTED</option>
                          <option value="CONVERTED">CONVERTED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                        <button
                          onClick={() => setSelectedEnquiryForQuote(enq)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
                        >
                          Quote
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
                      <div>
                        <span className="text-slate-500 block">Destination</span>
                        <strong className="text-white">{enq.destination}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Travel Date</span>
                        <strong className="text-white">{enq.travelDate}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Travellers</span>
                        <strong className="text-white">{enq.travellersCount} Guests</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Budget / Person</span>
                        <strong className="text-emerald-400">₹{enq.budgetPerPerson.toLocaleString("en-IN")}</strong>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 italic bg-slate-800/40 p-2 rounded-xl">
                      "{enq.message}"
                    </p>

                    {enq.notes && (
                      <p className="text-[11px] text-emerald-400 font-medium">
                        <strong>Quotation Log:</strong> {enq.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ----------------- TAB 4: MULTI-SERVICE BOOKINGS ----------------- */}
          {activeTab === "bookings" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Multi-Service Bookings &amp; Manifest</h3>
                  <p className="text-xs text-slate-400">Real-time GDS flights, IRCTC train vouchers, hotel confirmations</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={bookingServiceFilter}
                    onChange={(e) => setBookingServiceFilter(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-xl px-2.5 py-1.5"
                  >
                    <option value="all">All Services</option>
                    <option value="flights">Flights</option>
                    <option value="trains">Trains</option>
                    <option value="hotels">Hotels</option>
                    <option value="tours">Tours</option>
                  </select>

                  <select
                    value={bookingStatusFilter}
                    onChange={(e) => setBookingStatusFilter(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-xl px-2.5 py-1.5"
                  >
                    <option value="all">All Status</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredBookings.map((b) => (
                  <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">
                          Ref: {b.bookingRef} • PNR: {b.ticketOrPnr}
                        </span>
                        <h4 className="text-sm font-bold text-white">{b.leadCustomer.name} ({b.travellers.length} Travellers)</h4>
                      </div>

                      <select
                        value={b.bookingStatus}
                        onChange={(e) => handleStatusChange(b.id, e.target.value as any)}
                        className="bg-slate-800 border border-slate-700 text-xs text-white font-bold rounded-xl px-2.5 py-1"
                      >
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="RESCHEDULED">RESCHEDULED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
                      <div>
                        <span className="text-slate-500 block">Service / Provider</span>
                        <strong className="text-white truncate block">{b.serviceTitle}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Dates</span>
                        <strong className="text-white">{b.travelDates.start}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Client Paid</span>
                        <strong className="text-white">₹{b.totalPayable.toLocaleString("en-IN")}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Your Commission</span>
                        <strong className="text-emerald-400">₹{b.agentCommission.toLocaleString("en-IN")}</strong>
                      </div>
                    </div>

                    {/* Travellers Manifest */}
                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Manifest List</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {b.travellers.map((t, idx) => (
                          <div key={idx} className="p-2 bg-slate-800/40 rounded-xl text-[11px] flex justify-between text-slate-300">
                            <span>{t.name} ({t.age}y, {t.gender})</span>
                            <span className="text-cyan-300 font-semibold">{t.seatOrRoom}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ----------------- TAB 5: PACKAGE MANAGER ----------------- */}
          {activeTab === "packages" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Published Packages &amp; Inventory Allocations</h3>
                  <p className="text-xs text-slate-400">Manage holidays, hotel allotments, and private cab circuits</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentAgent.packages.map((pkg) => (
                  <div key={pkg.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                    <div className="flex gap-3">
                      <img src={pkg.image} alt={pkg.title} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-indigo-400 font-bold uppercase block">{pkg.category} Circuit</span>
                        <h4 className="text-sm font-bold text-white truncate">{pkg.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{pkg.duration} • {pkg.destination}</p>
                        <div className="text-sm font-black text-emerald-400 mt-1">₹{pkg.price.toLocaleString("en-IN")} / adult</div>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-300 pt-2 border-t border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Inclusions</span>
                      {pkg.inclusions.slice(0, 2).map((inc, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ----------------- TAB 6: COMMISSION & MARKUP ENGINE ----------------- */}
          {activeTab === "commission_markup" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Dynamic Markup Rules &amp; Commission Matrix</h3>
                  <p className="text-xs text-slate-400">Configure auto markup rules applied on wholesale B2B net rates</p>
                </div>
              </div>

              <div className="space-y-3">
                {markupRules.map((rule) => (
                  <div key={rule.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase">
                        {rule.serviceCategory}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">
                        Markup: {rule.markupType === "percentage" ? `${rule.markupValue}% on Net Rate` : `+₹${rule.markupValue} Flat per Ticket/Room`}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        {rule.applyToSubAgents ? "Applied across all branch counters" : "Applies to Head Office bookings only"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${rule.isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-400"}`}>
                        {rule.isActive ? "ACTIVE RULE" : "PAUSED"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ----------------- TAB 7: WALLET & SETTLEMENTS ----------------- */}
          {activeTab === "wallet_settlement" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-800/40 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider block">Total Ready for Bank Transfer</span>
                  <div className="text-2xl sm:text-3xl font-black text-white mt-1">₹{walletBalance.toLocaleString("en-IN")}</div>
                  <span className="text-xs text-slate-400">Direct Bank NEFT/RTGS Transfer (HDFC Bank)</span>
                </div>

                <button
                  onClick={handleRequestWalletPayout}
                  className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Request Instant Settlement</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* Bank Mandate */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 text-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Settlement Bank Account</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-800/60 rounded-xl">
                    <span className="text-[10px] text-slate-500 block">Bank Name</span>
                    <strong className="text-white">HDFC Bank Ltd., FC Road Pune</strong>
                  </div>
                  <div className="p-3 bg-slate-800/60 rounded-xl">
                    <span className="text-[10px] text-slate-500 block">Account Number</span>
                    <strong className="text-white">50200081920491</strong>
                  </div>
                  <div className="p-3 bg-slate-800/60 rounded-xl">
                    <span className="text-[10px] text-slate-500 block">IFSC Code</span>
                    <strong className="text-white">HDFC0000104</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------- TAB 8: SUB-AGENTS & STAFF ----------------- */}
          {activeTab === "sub_agents" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Branch Sub-Accounts &amp; Counter Staff</h3>
                  <p className="text-xs text-slate-400">Assign booking permissions, daily caps, and monitor branches</p>
                </div>
                <button
                  onClick={() => setShowAddSubAgentModal(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Counter Executive</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subAgentsList.map((sub) => (
                  <div key={sub.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <h4 className="text-sm font-bold text-white">{sub.name}</h4>
                        <span className="text-[10px] text-slate-400">{sub.branchLocation}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        {sub.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-slate-300 text-[11px]">
                      <p>Role: <strong className="text-white">{sub.role}</strong></p>
                      <p>Daily Booking Cap: <strong className="text-cyan-300">₹{sub.dailyBookingCap.toLocaleString("en-IN")}</strong></p>
                      <p>Today Booked: <strong className="text-emerald-400">₹{sub.todayBookedAmount.toLocaleString("en-IN")}</strong></p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Add Sub-Agent */}
              {showAddSubAgentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
                  <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">Create Counter Staff Account</h3>
                      <button onClick={() => setShowAddSubAgentModal(false)} className="text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateSubAgent} className="space-y-3 text-xs">
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">Staff Full Name *</label>
                        <input
                          type="text"
                          required
                          value={newSubName}
                          onChange={(e) => setNewSubName(e.target.value)}
                          placeholder="e.g. Kunal Deshmukh"
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold block mb-1">Official Email *</label>
                        <input
                          type="email"
                          required
                          value={newSubEmail}
                          onChange={(e) => setNewSubEmail(e.target.value)}
                          placeholder="kunal.d@swastiktravels.in"
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold block mb-1">Branch Location</label>
                        <input
                          type="text"
                          value={newSubBranch}
                          onChange={(e) => setNewSubBranch(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium"
                        />
                      </div>

                      <div className="pt-3 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddSubAgentModal(false)}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                        >
                          Add Counter Executive
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ----------------- TAB 9: REPORTS & GSTR-1 ----------------- */}
          {activeTab === "reports" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Statutory Tax Reports &amp; Financial Statements</h3>
                  <p className="text-xs text-slate-400">GSTR-1 outward supplies, 194H TDS certificates, Commission statements</p>
                </div>

                <button
                  onClick={() => alert("GSTR-1 Excel Tax Statement exported successfully!")}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700"
                >
                  <Download className="w-4 h-4 text-indigo-400" />
                  <span>Export GSTR-1 CSV</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Total Invoiced Volume</span>
                  <div className="text-xl font-black text-white">₹{totalGmv.toLocaleString("en-IN")}</div>
                  <span className="text-[10px] text-slate-500">Across 4 verified client invoices</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Total GST Output (5% &amp; 12%)</span>
                  <div className="text-xl font-black text-amber-400">₹4,866</div>
                  <span className="text-[10px] text-slate-500">Ready for GSTR-3B offset</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">TDS Withheld (Sec 194H)</span>
                  <div className="text-xl font-black text-emerald-400">₹{(totalCommissionEarned * 0.05).toFixed(0)}</div>
                  <span className="text-[10px] text-slate-500">Credit reflected in Form 26AS</span>
                </div>
              </div>
            </div>
          )}

          {/* ----------------- TAB 10: KYC & LICENSES ----------------- */}
          {activeTab === "kyc_profile" && (
            <div className="space-y-5">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white">Accredited Agent Regulatory Profile</h3>
                    <span className="text-slate-400">Statutory certifications under Ministry of Tourism (Govt of India)</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Fully Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-800/70 rounded-2xl space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">PAN Number</span>
                    <p className="text-sm font-bold text-white">{currentAgent.accreditations.pan}</p>
                  </div>

                  <div className="p-3.5 bg-slate-800/70 rounded-2xl space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">GSTIN Registration</span>
                    <p className="text-sm font-bold text-white">{currentAgent.accreditations.gstin}</p>
                  </div>

                  <div className="p-3.5 bg-slate-800/70 rounded-2xl space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">IATA Accreditation ID</span>
                    <p className="text-sm font-bold text-white">{currentAgent.accreditations.iata}</p>
                  </div>

                  <div className="p-3.5 bg-slate-800/70 rounded-2xl space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">IRCTC Principal Agent License</span>
                    <p className="text-sm font-bold text-white">{currentAgent.accreditations.irctc}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------- TAB 11: TECHNICAL BACKEND ENGINE ----------------- */}
          {activeTab === "technical_backend" && (
            <div className="space-y-5">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      Live Technical API Gateway &amp; Engine Connectivity
                    </h3>
                    <span className="text-slate-400">Real-time GDS switches, IRCTC XML terminal, and webhook subscriptions</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                    ALL SYSTEMS NOMINAL
                  </span>
                </div>

                <div className="space-y-3">
                  {TECHNICAL_API_ENDPOINTS.map((api, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-800/70 border border-slate-700/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{api.service}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono">
                            {api.providerGds}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono mt-1">{api.endpointUrl}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-emerald-400 block">{api.latencyMs}ms Latency</span>
                        <span className="text-[10px] text-slate-400">{api.todayCalls.toLocaleString("en-IN")} calls today • {api.errorRate} errors</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
