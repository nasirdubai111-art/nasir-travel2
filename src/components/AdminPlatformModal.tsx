import React, { useState } from "react";
import {
  X,
  LayoutDashboard,
  Users,
  Briefcase,
  Ticket,
  CreditCard,
  Percent,
  Layers,
  MapPin,
  Tag,
  Headphones,
  ShieldCheck,
  Activity,
  Settings,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  TrendingUp,
  DollarSign,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Filter,
  RefreshCw,
  Building,
  UserCheck,
  Car,
  UtensilsCrossed,
  Plane,
  Train,
  Check,
  Clock,
  Sparkles,
  Lock,
} from "lucide-react";
import {
  ADMIN_STATS_DATA,
  LIVE_BOOKING_RECORDS,
  CUSTOMER_DATABASE,
  AGENT_B2B_RECORDS,
  PARTNER_ECOSYSTEM_RECORDS,
  SUPPORT_TICKETS_QUEUE,
  AUDIT_LOGS_STREAM,
  API_HEALTH_METRICS,
  LiveBookingRecord,
  CustomerRecord,
  AgentRecord,
  PartnerRecord,
  SupportTicket,
} from "../data/adminData";

interface AdminPlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBookingDetails?: (item: any) => void;
}

type AdminTab =
  | "operations"
  | "bookings"
  | "customers"
  | "agents"
  | "partners"
  | "finance"
  | "commissions"
  | "inventory"
  | "content"
  | "offers"
  | "crm"
  | "audit"
  | "monitoring"
  | "config";

export function AdminPlatformModal({
  isOpen,
  onClose,
  onOpenBookingDetails,
}: AdminPlatformModalProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("operations");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingsList, setBookingsList] = useState<LiveBookingRecord[]>(LIVE_BOOKING_RECORDS);
  const [customersList, setCustomersList] = useState<CustomerRecord[]>(CUSTOMER_DATABASE);
  const [agentsList, setAgentsList] = useState<AgentRecord[]>(AGENT_B2B_RECORDS);
  const [partnersList, setPartnersList] = useState<PartnerRecord[]>(PARTNER_ECOSYSTEM_RECORDS);
  const [ticketsList, setTicketsList] = useState<SupportTicket[]>(SUPPORT_TICKETS_QUEUE);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerToast = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleResolveTicket = (id: string) => {
    setTicketsList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "resolved" } : t))
    );
    triggerToast(`Support ticket ${id} marked as resolved!`);
  };

  const handleAdjustCustomerWallet = (id: string, amount: number) => {
    setCustomersList((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, walletBalance: c.walletBalance + amount } : c
      )
    );
    triggerToast(`Credited ₹${amount} to customer ${id} wallet!`);
  };

  const handleApprovePartner = (id: string) => {
    setPartnersList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, verificationStatus: "verified" } : p))
    );
    triggerToast(`Partner ${id} verification approved with 100% compliance!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 text-slate-100 w-full max-w-7xl h-[94vh] rounded-2xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden">
        {/* Top Control Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-indigo-500 to-emerald-500 p-0.5 shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-white font-black text-sm">
                ADMIN
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  BharatYatra Master Admin Platform
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                  Production Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Unified Operations, Finance, Inventory, Partner & Multi-Service Orchestrator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {actionSuccessMsg && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {actionSuccessMsg}
              </div>
            )}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span>API Health: 99.94% Normal</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Master Admin Body: Sidebar Navigation + Main Viewport */}
        <div className="flex-1 flex overflow-hidden">
          {/* Admin Sidebar Navigation */}
          <aside className="w-64 bg-slate-950/60 border-r border-slate-800 flex flex-col justify-between p-3 shrink-0 overflow-y-auto">
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Operational Control
              </div>

              <button
                onClick={() => setActiveTab("operations")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "operations"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Operations Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab("bookings")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "bookings"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Ticket className="w-4 h-4 shrink-0" />
                <span>Bookings & PNR Stream</span>
                <span className="ml-auto px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                  {bookingsList.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("customers")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "customers"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>Customer Registry & KYC</span>
              </button>

              <button
                onClick={() => setActiveTab("agents")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "agents"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <UserCheck className="w-4 h-4 shrink-0" />
                <span>Travel Agents (B2B)</span>
              </button>

              <button
                onClick={() => setActiveTab("partners")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "partners"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Building className="w-4 h-4 shrink-0" />
                <span>Partner Ecosystem (8)</span>
              </button>

              <div className="pt-3 px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Financials & Yield
              </div>

              <button
                onClick={() => setActiveTab("finance")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "finance"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <span>Payment & Reconciliation</span>
              </button>

              <button
                onClick={() => setActiveTab("commissions")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "commissions"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Percent className="w-4 h-4 shrink-0" />
                <span>Commission & Markups</span>
              </button>

              <button
                onClick={() => setActiveTab("inventory")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "inventory"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                <span>Central Inventory Locks</span>
              </button>

              <div className="pt-3 px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Marketing & Support
              </div>

              <button
                onClick={() => setActiveTab("content")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "content"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Destinations & Guides</span>
              </button>

              <button
                onClick={() => setActiveTab("offers")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "offers"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Tag className="w-4 h-4 shrink-0" />
                <span>Promo & Coupon Engine</span>
              </button>

              <button
                onClick={() => setActiveTab("crm")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "crm"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Headphones className="w-4 h-4 shrink-0" />
                <span>Support & Escalations</span>
                <span className="ml-auto px-1.5 py-0.5 rounded bg-amber-500/20 text-[10px] text-amber-400 border border-amber-500/30">
                  {ticketsList.filter((t) => t.status !== "resolved").length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("monitoring")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "monitoring"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Activity className="w-4 h-4 shrink-0" />
                <span>API Health & Latency</span>
              </button>

              <button
                onClick={() => setActiveTab("audit")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "audit"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Security & Audit Logs</span>
              </button>
            </div>

            {/* Admin Profile Footer */}
            <div className="pt-4 border-t border-slate-800/80 mt-2">
              <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
                  SA
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-200 truncate">Super Admin</p>
                  <p className="text-[10px] text-slate-500 truncate">admin@bharatyatra.in</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Dynamic Workspace */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/90">
            {/* 1. OPERATIONS DASHBOARD */}
            {activeTab === "operations" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-xl font-extrabold text-white">Operations & Executive Dashboard</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time ecosystem metrics across Flights, Trains, Buses, Hotels, Yatras, Cabs, Dhabas & Corporate
                  </p>
                </div>

                {/* 6 Key Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ADMIN_STATS_DATA.map((st, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-md hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{st.title}</span>
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                          <TrendingUp className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-white">{st.value}</span>
                        <span className="text-[11px] font-bold text-emerald-400">{st.change}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{st.subtext}</p>
                    </div>
                  ))}
                </div>

                {/* Live Activity Matrix & Real-time Feeds */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left 2 Cols: Live PNR Stream */}
                  <div className="lg:col-span-2 rounded-2xl bg-slate-950/80 border border-slate-800 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-indigo-400" />
                        <h4 className="text-sm font-bold text-white">Live Booking & Ticketing Stream</h4>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 animate-pulse">
                        ● Auto-Syncing (0.8s)
                      </span>
                    </div>

                    <div className="divide-y divide-slate-800/80">
                      {bookingsList.slice(0, 5).map((bk) => (
                        <div key={bk.id} className="py-3 flex items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-indigo-300 font-bold">
                                {bk.pnr}
                              </span>
                              <span className="text-xs font-bold text-white">{bk.title}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {bk.customerName} • {bk.route} • {bk.timestamp} via {bk.device}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-black text-emerald-400">₹{bk.amount.toLocaleString("en-IN")}</p>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                              {bk.bookingStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Col: Microservices & Gateways Health */}
                  <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-sm font-bold text-white">API & GDS Gateway Health</h4>
                      </div>
                      <button
                        onClick={() => triggerToast("All external APIs pinged successfully!")}
                        className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Re-test
                      </button>
                    </div>

                    <div className="space-y-3">
                      {API_HEALTH_METRICS.map((api, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-200">{api.service}</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {api.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                            <span>Latency: {api.latencyMs}ms</span>
                            <span>Uptime: {api.uptime24h}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. BOOKINGS & PNR STREAM */}
            {activeTab === "bookings" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Universal Booking & PNR Management</h3>
                    <p className="text-xs text-slate-400">Search, re-issue, cancel, or inspect tax invoices across all categories</p>
                  </div>
                  <div className="relative w-full max-w-xs">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search PNR, Name, Phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-950/80 border border-slate-800 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">PNR / ID</th>
                        <th className="p-3.5">Service & Details</th>
                        <th className="p-3.5">Passenger</th>
                        <th className="p-3.5">Amount & Comm</th>
                        <th className="p-3.5">Gateway & Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {bookingsList
                        .filter(
                          (b) =>
                            b.pnr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            b.customerName.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((bk) => (
                          <tr key={bk.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="p-3.5 font-mono text-indigo-300 font-bold">
                              {bk.pnr}
                              <p className="text-[10px] text-slate-500 font-normal">{bk.id}</p>
                            </td>
                            <td className="p-3.5">
                              <p className="font-bold text-white">{bk.title}</p>
                              <p className="text-[10px] text-slate-400">{bk.route}</p>
                            </td>
                            <td className="p-3.5">
                              <p className="font-semibold text-slate-200">{bk.customerName}</p>
                              <p className="text-[10px] text-slate-500">{bk.customerPhone}</p>
                            </td>
                            <td className="p-3.5">
                              <p className="font-bold text-emerald-400">₹{bk.amount.toLocaleString("en-IN")}</p>
                              <p className="text-[10px] text-amber-400">Comm: +₹{bk.commissionEarned}</p>
                            </td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                                {bk.paymentStatus.toUpperCase()}
                              </span>
                              <p className="text-[10px] text-slate-500 mt-0.5">{bk.paymentGateway}</p>
                            </td>
                            <td className="p-3.5 text-right space-x-2">
                              <button
                                onClick={() => triggerToast(`Tax Invoice sent for PNR ${bk.pnr}`)}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors"
                              >
                                Invoice
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. CUSTOMER MANAGEMENT */}
            {activeTab === "customers" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">Customer CRM & KYC Registry</h3>
                    <p className="text-xs text-slate-400">Verify KYC, modify loyalty tiers, and adjust wallet balances</p>
                  </div>
                  <button
                    onClick={() => triggerToast("Customer data exported to CSV successfully!")}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Export CRM
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {customersList.map((cust) => (
                    <div
                      key={cust.id}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                          {cust.loyaltyTier} Tier
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          KYC {cust.kycStatus.toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-white text-sm">{cust.name}</h4>
                        <p className="text-xs text-slate-400">{cust.email}</p>
                        <p className="text-xs text-slate-500">{cust.phone} • {cust.city}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                        <div>
                          <span className="text-slate-500">Wallet:</span>{" "}
                          <span className="font-bold text-emerald-400">₹{cust.walletBalance}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Lifetime GMV:</span>{" "}
                          <span className="font-bold text-indigo-300">₹{(cust.lifetimeValue / 1000).toFixed(0)}k</span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() => handleAdjustCustomerWallet(cust.id, 500)}
                          className="flex-1 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold"
                        >
                          +₹500 Bonus
                        </button>
                        <button
                          onClick={() => triggerToast(`Sent notification to ${cust.name}`)}
                          className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold"
                        >
                          Send Alert
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. AGENTS B2B MANAGEMENT */}
            {activeTab === "agents" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">Travel Agents B2B Principal Network</h3>
                    <p className="text-xs text-slate-400">IATA & IRCTC accreditations, credit limits, and margin tiers</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {agentsList.map((agent) => (
                    <div key={agent.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
                          {agent.commissionTier}
                        </span>
                        <span className="text-amber-400 font-bold text-xs">★ {agent.rating}</span>
                      </div>

                      <div>
                        <h4 className="font-bold text-white text-sm">{agent.agencyName}</h4>
                        <p className="text-xs text-slate-400">{agent.ownerName}</p>
                        <p className="text-[10px] text-slate-500">{agent.city}, {agent.state}</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">IRCTC Agent ID:</span>
                          <span className="font-mono text-indigo-300 font-bold">{agent.irctcAgentId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Credit Limit:</span>
                          <span className="text-emerald-400 font-bold">₹{agent.creditLimit.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Monthly GMV:</span>
                          <span className="text-slate-200 font-bold">₹{(agent.monthlyGMV / 100000).toFixed(1)} Lakhs</span>
                        </div>
                      </div>

                      <button
                        onClick={() => triggerToast(`Refreshed credit limits for ${agent.agencyName}`)}
                        className="w-full py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                      >
                        Adjust Credit Line
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. PARTNERS ECOSYSTEM */}
            {activeTab === "partners" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">Partner Ecosystem Directory (8 Portals)</h3>
                    <p className="text-xs text-slate-400">Bus, Hotel, Resort, Lodge, Tour, Pilgrimage, Cab & Highway Dhaba operators</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {partnersList.map((ptr) => (
                    <div key={ptr.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          {ptr.category}
                        </span>
                        <span className="text-xs font-bold text-indigo-400">SLA: {ptr.slaScore}%</span>
                      </div>

                      <div>
                        <h4 className="font-bold text-white text-sm">{ptr.businessName}</h4>
                        <p className="text-xs text-slate-400">{ptr.ownerName} • {ptr.contactNumber}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-[10px] p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <div>
                          <p className="text-slate-500">Live Inventory</p>
                          <p className="font-bold text-white">{ptr.inventoryCount}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Monthly Bookings</p>
                          <p className="font-bold text-indigo-300">{ptr.totalBookingsMonth}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Pending Payout</p>
                          <p className="font-bold text-amber-400">₹{(ptr.payoutPending / 1000).toFixed(0)}k</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprovePartner(ptr.id)}
                          className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                        >
                          Approve Payout
                        </button>
                        <button
                          onClick={() => triggerToast(`Inspecting inventory for ${ptr.businessName}`)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                        >
                          Audit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. PAYMENT & FINANCE HUB */}
            {activeTab === "finance" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-lg font-bold text-white">Payment Gateway & Financial Reconciliation</h3>
                  <p className="text-xs text-slate-400">
                    Automated multi-switch PG routing, GST input tax credits, and partner payout escrow
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <p className="text-xs text-slate-400">Gateway GMV Flow</p>
                    <p className="text-xl font-bold text-emerald-400 mt-1">₹84.62 Cr</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Razorpay 62% • Cashfree 38%</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <p className="text-xs text-slate-400">Platform Commissions</p>
                    <p className="text-xl font-bold text-indigo-400 mt-1">₹4.89 Cr</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Avg Take-Rate 5.78%</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <p className="text-xs text-slate-400">GST Collected Payable</p>
                    <p className="text-xl font-bold text-amber-400 mt-1">₹1.16 Cr</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Form GSTR-1 & 3B Ready</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <p className="text-xs text-slate-400">TDS u/s 194-O (1%)</p>
                    <p className="text-xl font-bold text-cyan-400 mt-1">₹76.24 Lakhs</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">E-Commerce Operator TDS</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-white">Automated Reconciliation Health</h4>
                  <div className="flex items-center gap-4 text-xs text-slate-300">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> 99.8% Matched Transactions
                    </span>
                    <span className="text-slate-500">|</span>
                    <span>14 Unsettled Pending Verification (Auto-retrying in 5 mins)</span>
                  </div>
                </div>
              </div>
            )}

            {/* 7. COMMISSIONS & DYNAMIC MARKUPS */}
            {activeTab === "commissions" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-lg font-bold text-white">Commission & Dynamic Markup Rules</h3>
                  <p className="text-xs text-slate-400">Manage route-wise profit margins, festive markups, and B2B agent sharing</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <h4 className="font-bold text-white text-sm">Domestic Flights (IndiGo, Air India, Akasa)</h4>
                    <p className="text-xs text-slate-400">Base Commission: ₹180 to ₹350 per sector + GDS pass-through markup</p>
                    <div className="p-2.5 rounded-xl bg-slate-900 text-[11px] text-emerald-300 font-semibold">
                      Active: Tier-1 Hubs (DEL-BOM, BLR-DEL) flat ₹249 convenience fee
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <h4 className="font-bold text-white text-sm">Pilgrimage & Helicopter Packages</h4>
                    <p className="text-xs text-slate-400">Base Commission: 10.0% to 15.0% on full package value</p>
                    <div className="p-2.5 rounded-xl bg-slate-900 text-[11px] text-amber-300 font-semibold">
                      Active: Char Dham & Kedarnath Heli Early-bird surge protection active
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 8. CENTRAL INVENTORY LOCKS */}
            {activeTab === "inventory" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-lg font-bold text-white">Central Inventory Locks & Seat Allotment</h3>
                  <p className="text-xs text-slate-400">Multi-GDS, IRCTC CRS, and Bus Operator seat pool synchronization</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <p className="text-xs text-slate-400">Vande Bharat Train Seats</p>
                    <p className="text-xl font-bold text-white mt-1">42,000 Seats / Day</p>
                    <p className="text-[10px] text-emerald-400 mt-1">Live IRCTC 2-way sync</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <p className="text-xs text-slate-400">Hotel & Resort Rooms</p>
                    <p className="text-xl font-bold text-white mt-1">118,500 Rooms</p>
                    <p className="text-[10px] text-emerald-400 mt-1">Instant Auto-Confirmation</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <p className="text-xs text-slate-400">Intercity Bus Berths</p>
                    <p className="text-xl font-bold text-white mt-1">84,000 Berths</p>
                    <p className="text-[10px] text-emerald-400 mt-1">VRL / SRS / Zingbus API</p>
                  </div>
                </div>
              </div>
            )}

            {/* 9. CONTENT & DESTINATIONS */}
            {activeTab === "content" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-lg font-bold text-white">Content & Destination Management</h3>
                  <p className="text-xs text-slate-400">Manage 500+ Indian tourist attractions, temple darshan timings, and guides</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <p className="text-xs text-slate-300">
                    Verified destination itineraries, dress codes, high-resolution media galleries, and food specialties active.
                  </p>
                  <button
                    onClick={() => triggerToast("New destination content draft created!")}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white"
                  >
                    + Add New Destination
                  </button>
                </div>
              </div>
            )}

            {/* 10. OFFERS & PROMO ENGINE */}
            {activeTab === "offers" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-lg font-bold text-white">Offers, Coupons & Campaign Analytics</h3>
                  <p className="text-xs text-slate-400">Create bank partnerships, promo codes, and discount thresholds</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">Active Promo: HDFCFLY (15% Instant Off)</span>
                    <span className="text-xs text-emerald-400 font-bold">48,200 Redemptions</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">Active Promo: VANDEZERO (Zero Convenience Fee)</span>
                    <span className="text-xs text-emerald-400 font-bold">124,000 Redemptions</span>
                  </div>
                </div>
              </div>
            )}

            {/* 11. CRM & SUPPORT ESCALATIONS */}
            {activeTab === "crm" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">Live Support & Escalation Desk</h3>
                    <p className="text-xs text-slate-400">Emergency passenger assistance, flight reschedule, and refund disputes</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {ticketsList.map((tck) => (
                    <div
                      key={tck.id}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold font-mono">
                            {tck.id}
                          </span>
                          <span className="text-xs font-bold text-white">{tck.category}</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
                            {tck.pnr}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">{tck.lastMessage}</p>
                        <p className="text-[10px] text-slate-500">
                          Passenger: {tck.customerName} • Assigned: {tck.assignedTo} • SLA: {tck.slaDeadline}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {tck.status !== "resolved" ? (
                          <button
                            onClick={() => handleResolveTicket(tck.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                          >
                            Mark Resolved
                          </button>
                        ) : (
                          <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Resolved
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 12. SECURITY & AUDIT */}
            {activeTab === "audit" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-lg font-bold text-white">Security & Administrative Audit Logs</h3>
                  <p className="text-xs text-slate-400">Immutable audit trails for pricing overrides, payouts, and role changes</p>
                </div>

                <div className="rounded-2xl bg-slate-950 border border-slate-800 divide-y divide-slate-800">
                  {AUDIT_LOGS_STREAM.map((log) => (
                    <div key={log.id} className="p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-200">{log.action}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Admin: {log.adminUser} ({log.role}) • IP: {log.ipAddress} • {log.timestamp}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        {log.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 13. API HEALTH MONITORING */}
            {activeTab === "monitoring" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-lg font-bold text-white">Microservices & Gateway Latency Radar</h3>
                  <p className="text-xs text-slate-400">Live health telemetry across IRCTC, Amadeus, NPCI UPI, and WhatsApp APIs</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {API_HEALTH_METRICS.map((api, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{api.service}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          {api.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">Provider: {api.provider}</p>
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                        <div>
                          <span className="text-slate-500">Latency:</span>{" "}
                          <span className="font-bold text-indigo-400">{api.latencyMs}ms</span>
                        </div>
                        <div>
                          <span className="text-slate-500">24h Uptime:</span>{" "}
                          <span className="font-bold text-emerald-400">{api.uptime24h}%</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Error Rate:</span>{" "}
                          <span className="font-bold text-slate-300">{api.errorRate}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
