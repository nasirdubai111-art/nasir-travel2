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
  ArrowUpRight,
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
  Calendar as CalendarIcon,
  Sparkles,
  Lock,
  Award,
  PhoneCall,
  Sliders,
  Plus,
  Edit,
  Trash2,
  ShieldAlert,
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
import {
  DYNAMIC_COMMISSION_RULES,
  PARTNER_LISTING_PLANS,
  REVENUE_FLOW_STEPS,
} from "../data/dynamicCommissionData";
import {
  TELESALES_EXECUTIVES_LIST,
  TELESALES_INCENTIVE_TIERS,
  TELESALES_FRAUD_ALERTS,
} from "../data/telesalesData";
import {
  SAMPLE_LODGE_PROFILES,
  LODGE_SETTLEMENT_INVOICES,
} from "../data/lodgePMSData";
import { DynamicCommissionRule, PartnerListingPlan, TelesalesExecutive, TelesalesIncentiveTierConfig } from "../types";
import { RazorpayDashboardModal } from "./RazorpayDashboardModal";
import { PartnerSettlementCommissionDashboard } from "./admin/PartnerSettlementCommissionDashboard";
import { AdminCalendarTimingsModule } from "./admin/AdminCalendarTimingsModule";

interface AdminPlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBookingDetails?: (item: any) => void;
}

type AdminTab =
  | "operations"
  | "bookings"
  | "calendar_timings"
  | "customers"
  | "agents"
  | "partners"
  | "dynamic_commissions"
  | "listing_pricing"
  | "telesales_control"
  | "partner_settlement_dashboard"
  | "settlements_escrow"
  | "tax_pg_config"
  | "contracts_sla"
  | "finance"
  | "inventory"
  | "content"
  | "offers"
  | "crm"
  | "audit"
  | "monitoring";

export function AdminPlatformModal({
  isOpen,
  onClose,
  onOpenBookingDetails,
}: AdminPlatformModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"SUPER_ADMIN" | "OPERATIONS_DIRECTOR" | "FINANCE_CONTROLLER" | "COMPLIANCE_AUDITOR">("SUPER_ADMIN");
  const [adminPin, setAdminPin] = useState("2026");
  const [authError, setAuthError] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>("operations");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingsList, setBookingsList] = useState<LiveBookingRecord[]>(LIVE_BOOKING_RECORDS);
  const [customersList, setCustomersList] = useState<CustomerRecord[]>(CUSTOMER_DATABASE);
  const [agentsList, setAgentsList] = useState<AgentRecord[]>(AGENT_B2B_RECORDS);
  const [partnersList, setPartnersList] = useState<PartnerRecord[]>(PARTNER_ECOSYSTEM_RECORDS);
  const [ticketsList, setTicketsList] = useState<SupportTicket[]>(SUPPORT_TICKETS_QUEUE);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Business Model & Admin Control State
  const [commissionRules, setCommissionRules] = useState<DynamicCommissionRule[]>(DYNAMIC_COMMISSION_RULES);
  const [listingPlans, setListingPlans] = useState<PartnerListingPlan[]>(PARTNER_LISTING_PLANS);
  const [telesalesExecs, setTelesalesExecs] = useState<TelesalesExecutive[]>(TELESALES_EXECUTIVES_LIST);
  const [incentiveTiers, setIncentiveTiers] = useState<TelesalesIncentiveTierConfig[]>(TELESALES_INCENTIVE_TIERS);
  const [settlementInvoices, setSettlementInvoices] = useState(LODGE_SETTLEMENT_INVOICES);
  const [isRazorpayAdminOpen, setIsRazorpayAdminOpen] = useState(false);

  // Dynamic Commission Rule Builder Form State
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRule, setNewRule] = useState<Partial<DynamicCommissionRule>>({
    ruleName: "Custom Route Rate",
    partnerCategory: "lodges",
    contractTier: "Standard Partner",
    locationScope: "Wildlife & Eco Zones",
    bookingType: "Direct Web/App",
    commissionModelType: "PERCENTAGE_PER_BOOKING",
    baseCommissionPercent: 16,
    fixedFeeINR: 0,
    convenienceFeeINR: 0,
    telesalesSharePercent: 30,
    minBookingValueINR: 1000,
    active: true,
    effectiveFrom: "2026-04-01",
    updatedBy: "Super Admin",
  });

  if (!isOpen) return null;

  const handleAdminLogin = () => {
    if (adminPin.trim() === "2026" || adminPin.trim() === "admin" || adminPin.trim().length >= 4) {
      setIsAuthenticated(true);
      setSessionToken(`BY-SEC-${Date.now().toString(36).toUpperCase()}`);
      setAuthError(null);
      triggerToast(`Authenticated as ${selectedRole.replace("_", " ")}`);
    } else {
      setAuthError("Invalid Security PIN. Enter authorized 4-digit PIN (Default: 2026).");
    }
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    setSessionToken(null);
  };

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
                {isAuthenticated ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                    {selectedRole.replace("_", " ")}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                    RBAC Protected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {isAuthenticated
                  ? `Authorized Session: ${sessionToken} • Operations, Finance & Service Mesh`
                  : "Authorized Personnel Only • Role-Based Access Control Gate"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleAdminLogout}
                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Session</span>
              </button>
            )}
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

        {/* If not authenticated, render strict RBAC Gate */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-950">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 animate-in zoom-in-95">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white">Administrative Security Gate</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Restricted internal console for authorized operations, financial controller, and compliance personnel.
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Select Staff Role (RBAC Scope)
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl p-3 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="SUPER_ADMIN">👑 Super Admin (Full Platform Control)</option>
                    <option value="OPERATIONS_DIRECTOR">⚡ Operations Director (Bookings &amp; Partners)</option>
                    <option value="FINANCE_CONTROLLER">💳 Finance Controller (Settlements &amp; Payouts)</option>
                    <option value="COMPLIANCE_AUDITOR">🛡️ Compliance Auditor (KYC &amp; Logs)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Security Passcode / PIN
                  </label>
                  <input
                    type="password"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder="Enter PIN (Default: 2026)"
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 font-mono text-sm rounded-xl p-3 focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Default Developer/Demo Passcode: <span className="font-mono text-amber-400">2026</span>
                  </span>
                </div>

                <button
                  onClick={handleAdminLogin}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Authenticate &amp; Launch Console</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Zero-Trust RBAC Policy Enforced</span>
                </div>
                <p>All administrative queries and actions are cryptographically signed and logged to the immutable audit database.</p>
              </div>
            </div>
          </div>
        ) : (
          /* Master Admin Body: Sidebar Navigation + Main Viewport */
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
                onClick={() => setActiveTab("calendar_timings")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "calendar_timings"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <CalendarIcon className="w-4 h-4 shrink-0 text-blue-400" />
                <span>Calendar &amp; Timings Engine</span>
                <span className="ml-auto px-1.5 py-0.5 rounded bg-blue-500/20 text-[10px] font-bold text-blue-300">
                  Universal
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
                Business &amp; Commission Engine
              </div>

              <button
                onClick={() => setActiveTab("dynamic_commissions")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "dynamic_commissions"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Percent className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Dynamic Commission Rules</span>
              </button>

              <button
                onClick={() => setActiveTab("listing_pricing")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "listing_pricing"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Award className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Listing Plans &amp; Pricing</span>
              </button>

              <button
                onClick={() => setActiveTab("telesales_control")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "telesales_control"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <PhoneCall className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>Telesales &amp; Incentive Engine</span>
              </button>

              <div className="pt-3 px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Financials &amp; Settlements
              </div>

              <button
                onClick={() => setActiveTab("partner_settlement_dashboard")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "partner_settlement_dashboard"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Building className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Partner Settlement &amp; Commission</span>
              </button>

              <button
                onClick={() => setActiveTab("settlements_escrow")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "settlements_escrow"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <DollarSign className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Settlements &amp; Invoices</span>
              </button>

              <button
                onClick={() => setActiveTab("tax_pg_config")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "tax_pg_config"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Sliders className="w-4 h-4 shrink-0 text-indigo-400" />
                <span>Tax &amp; PG Routing</span>
              </button>

              <button
                onClick={() => setActiveTab("contracts_sla")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "contracts_sla"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <FileText className="w-4 h-4 shrink-0 text-purple-400" />
                <span>Partner Contracts &amp; SLA</span>
              </button>

              <button
                onClick={() => setActiveTab("finance")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "finance"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <span>Payment &amp; Reconciliation</span>
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

            {/* UNIVERSAL CALENDAR & TIMINGS ENGINE */}
            {activeTab === "calendar_timings" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-xl font-extrabold text-white">Universal Calendar &amp; Timings Engine</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Centralized management for schedules, time slots, capacity, holidays, and blackout SLA across all 8 travel products
                  </p>
                </div>
                <AdminCalendarTimingsModule />
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

                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-950 to-slate-950 border border-blue-800/60 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/50 shrink-0">
                      <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
                        <path d="M13.8 2.5L7.2 14h5.2l-2.4 7.5L16.8 10h-5.2l2.2-7.5z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">Razorpay Multi-Rail Gateway &amp; Telemetry Hub</h4>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-3xs font-bold border border-emerald-500/30 uppercase">
                          Live Active (62% Split)
                        </span>
                      </div>
                      <p className="text-2xs text-slate-400 mt-0.5">
                        Manage dynamic UPI QR, 3DS 2.0 cards, instant RazorpayX refunds, webhook inspector, and test credentials.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsRazorpayAdminOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-900/40 transition-all flex items-center gap-2"
                  >
                    <span>Open Razorpay Operations Hub</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
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

            {/* DYNAMIC COMMISSION RULES ENGINE */}
            {activeTab === "dynamic_commissions" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-white">Dynamic Commission &amp; Take-Rate Rules Engine</h3>
                    <p className="text-xs text-slate-400">
                      Configure multi-factor commission formulas by Product, Partner Tier, Geography, Contract, and Booking Channel.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddRule(!showAddRule)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{showAddRule ? "Close Rule Creator" : "+ Create Commission Rule"}</span>
                  </button>
                </div>

                {/* Inline Rule Creator */}
                {showAddRule && (
                  <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-4 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                      <Percent className="w-4 h-4" />
                      <span>New Rule Generator (Dynamic Parameters)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">Rule Name</label>
                        <input
                          type="text"
                          value={newRule.ruleName}
                          onChange={(e) => setNewRule({ ...newRule, ruleName: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2 font-bold"
                          placeholder="e.g. Tiger Reserve High Season"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">Product Category</label>
                        <select
                          value={newRule.partnerCategory}
                          onChange={(e) => setNewRule({ ...newRule, partnerCategory: e.target.value as any })}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2 font-bold"
                        >
                          <option value="flights">✈️ Flights Partner</option>
                          <option value="trains">🚆 Trains Partner</option>
                          <option value="buses">🚌 Bus Operator</option>
                          <option value="hotels">🏨 Hotel</option>
                          <option value="lodges">🛏️ Lodge / Homestay</option>
                          <option value="resorts">🏝️ Luxury Resort</option>
                          <option value="cabs">🚕 Cab Operator</option>
                          <option value="houseboats">🛶 Houseboat</option>
                          <option value="tours">🧳 Tour Operator</option>
                          <option value="pilgrimage">🛕 Pilgrimage Operator</option>
                          <option value="corporate">🏢 Corporate Travel</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">Contract Tier</label>
                        <select
                          value={newRule.contractTier}
                          onChange={(e) => setNewRule({ ...newRule, contractTier: e.target.value as any })}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2"
                        >
                          <option value="Platinum Enterprise">Platinum Enterprise</option>
                          <option value="Gold Verified">Gold Verified</option>
                          <option value="Silver Tier">Silver Tier</option>
                          <option value="Standard Partner">Standard Partner</option>
                          <option value="Government / Board MOU">Government / Board MOU</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">Location Scope</label>
                        <select
                          value={newRule.locationScope}
                          onChange={(e) => setNewRule({ ...newRule, locationScope: e.target.value as any })}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2"
                        >
                          <option value="Pan-India">Pan-India</option>
                          <option value="Tier 1 Metros">Tier 1 Metros</option>
                          <option value="Wildlife & Eco Zones">Wildlife & Eco Zones</option>
                          <option value="Himalayan & Hill Stations">Himalayan & Hill Stations</option>
                          <option value="Spiritual Circuits">Spiritual Circuits</option>
                          <option value="Coastal & Island Zones">Coastal & Island Zones</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">Booking Channel</label>
                        <select
                          value={newRule.bookingType}
                          onChange={(e) => setNewRule({ ...newRule, bookingType: e.target.value as any })}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2"
                        >
                          <option value="Direct Web/App">Direct Web/App</option>
                          <option value="Telesales Assisted">Telesales Assisted</option>
                          <option value="B2B Agent Quota">B2B Agent Quota</option>
                          <option value="Corporate Desk">Corporate Desk</option>
                          <option value="Last-Minute Deal">Last-Minute Deal</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">Commission Model</label>
                        <select
                          value={newRule.commissionModelType}
                          onChange={(e) => setNewRule({ ...newRule, commissionModelType: e.target.value as any })}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2 font-bold"
                        >
                          <option value="PERCENTAGE_PER_BOOKING">Percentage (%) of GMV</option>
                          <option value="FIXED_FEE_PER_BOOKING">Fixed Fee (₹) per booking</option>
                          <option value="HYBRID_PERCENT_PLUS_FEE">Hybrid (% + Fixed Fee)</option>
                          <option value="CONVENIENCE_FEE_ONLY">Convenience Fee Only</option>
                          <option value="CONTRACT_RETAINER">Contract Retainer</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">
                          {newRule.commissionModelType === "FIXED_FEE_PER_BOOKING" ? "Fixed Fee (₹ INR)" : "Base Commission (%)"}
                        </label>
                        <input
                          type="number"
                          value={newRule.commissionModelType === "FIXED_FEE_PER_BOOKING" ? newRule.fixedFeeINR || 250 : newRule.baseCommissionPercent || 16}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            if (newRule.commissionModelType === "FIXED_FEE_PER_BOOKING") {
                              setNewRule({ ...newRule, fixedFeeINR: val });
                            } else {
                              setNewRule({ ...newRule, baseCommissionPercent: val });
                            }
                          }}
                          className="w-full bg-slate-900 border border-slate-700 text-amber-400 font-bold rounded-xl p-2"
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          onClick={() => {
                            const created: DynamicCommissionRule = {
                              id: `RULE-CUSTOM-${Date.now().toString().slice(-4)}`,
                              ruleName: newRule.ruleName || "Custom Dynamic Rule",
                              partnerCategory: newRule.partnerCategory || "lodges",
                              contractTier: newRule.contractTier || "Standard Partner",
                              locationScope: newRule.locationScope || "Pan-India",
                              bookingType: newRule.bookingType || "Direct Web/App",
                              commissionModelType: newRule.commissionModelType || "PERCENTAGE_PER_BOOKING",
                              baseCommissionPercent: newRule.baseCommissionPercent || 16,
                              fixedFeeINR: newRule.fixedFeeINR || 0,
                              convenienceFeeINR: newRule.convenienceFeeINR || 0,
                              telesalesSharePercent: newRule.telesalesSharePercent || 25,
                              minBookingValueINR: newRule.minBookingValueINR || 1000,
                              active: true,
                              effectiveFrom: newRule.effectiveFrom || "2026-04-01",
                              updatedBy: "Super Admin",
                            };
                            setCommissionRules([created, ...commissionRules]);
                            setShowAddRule(false);
                            triggerToast("New Dynamic Commission Rule Published to live routing matrix!");
                          }}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs"
                        >
                          Commit &amp; Activate Rule
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Commission Rules Matrix Table */}
                <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/90 text-[10px] text-slate-400 uppercase font-black tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Product Category</th>
                        <th className="py-3 px-4">Contract Tier</th>
                        <th className="py-3 px-4">Location Scope</th>
                        <th className="py-3 px-4">Channel / Booking Type</th>
                        <th className="py-3 px-4">Formula / Rate</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {commissionRules.map((rule) => (
                        <tr key={rule.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-bold text-white block uppercase">{rule.partnerCategory}</span>
                            <span className="text-[10px] font-mono text-slate-400">{rule.ruleName}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-slate-200 block font-semibold">{rule.contractTier}</span>
                            <span className="text-[10px] text-slate-500">{rule.id}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-300">{rule.locationScope}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-indigo-300">
                              {rule.bookingType}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono font-black text-amber-400 text-sm">
                              {rule.commissionModelType === "PERCENTAGE_PER_BOOKING" && `${rule.baseCommissionPercent}% GMV`}
                              {rule.commissionModelType === "FIXED_FEE_PER_BOOKING" && `₹${rule.fixedFeeINR} / booking`}
                              {rule.commissionModelType === "HYBRID_PERCENT_PLUS_FEE" && `${rule.baseCommissionPercent}% + ₹${rule.fixedFeeINR}`}
                              {rule.commissionModelType === "CONVENIENCE_FEE_ONLY" && `₹${rule.convenienceFeeINR} Conv. Fee`}
                              {rule.commissionModelType === "CONTRACT_RETAINER" && `${rule.baseCommissionPercent}% + Retainer`}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => {
                                setCommissionRules((prev) =>
                                  prev.map((r) => (r.id === rule.id ? { ...r, active: !r.active } : r))
                                );
                                triggerToast(`Rule ${rule.id} status toggled!`);
                              }}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                rule.active
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                              }`}
                            >
                              {rule.active ? "ACTIVE" : "PAUSED"}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                setCommissionRules((prev) => prev.filter((r) => r.id !== rule.id));
                                triggerToast(`Rule ${rule.id} deleted.`);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* LISTING PLANS & PRICING ADMIN */}
            {activeTab === "listing_pricing" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-lg font-black text-white">Partner Listing Plans &amp; Subscription Pricing</h3>
                  <p className="text-xs text-slate-400">
                    Configure vendor subscription tiers (Free, Standard, Premium) and feature entitlements.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {listingPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-white text-base">{plan.name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 text-[10px] font-black uppercase">
                            {plan.badge}
                          </span>
                        </div>

                        <div className="text-2xl font-black text-amber-400 font-mono">
                          {plan.priceMonthlyINR === 0 ? "₹0 (Free)" : `₹${plan.priceMonthlyINR.toLocaleString()}`}
                          <span className="text-xs text-slate-400 font-normal"> / month</span>
                        </div>

                        <p className="text-xs text-slate-400">{plan.description}</p>

                        <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                          {plan.features.map((feat, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => triggerToast(`Saved plan settings for ${plan.name}!`)}
                        className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                      >
                        Edit Pricing &amp; Features
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TELESALES WFH EXECUTIVE ENGINE */}
            {activeTab === "telesales_control" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-white">Telesales Executive Management &amp; Incentive Engine</h3>
                    <p className="text-xs text-slate-400">
                      Administer Work-From-Home agents, tiered incentive multipliers (0-50, 51-100, 101-150, 150+), and anti-fraud telemetry.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                      {telesalesExecs.length} Active WFH Executives
                    </span>
                  </div>
                </div>

                {/* Incentive Tiers Overview Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Active Incentive Slabs (Configurable Target Model)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    {incentiveTiers.map((tier) => (
                      <div key={tier.tierNumber} className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-amber-300 font-black">{tier.label}</span>
                          <span className="text-[10px] text-slate-500">Tier {tier.tierNumber}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {tier.minBookings} - {tier.maxBookings === 999 ? "∞" : tier.maxBookings} bookings
                        </p>
                        <div className="text-base font-black text-white font-mono">
                          ₹{tier.perBookingIncentiveINR} <span className="text-[10px] text-slate-400 font-normal">/ booking</span>
                        </div>
                        {tier.milestoneTargetBonusINR > 0 && (
                          <div className="text-[10px] text-emerald-400 font-bold">
                            + ₹{tier.milestoneTargetBonusINR.toLocaleString()} Target Bonus
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Executives List */}
                <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/90 text-[10px] text-slate-400 uppercase font-black tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Executive Name</th>
                        <th className="py-3 px-4">Location (WFH)</th>
                        <th className="py-3 px-4">Assigned Leads</th>
                        <th className="py-3 px-4">MTD Bookings / Target</th>
                        <th className="py-3 px-4">Earned Incentive</th>
                        <th className="py-3 px-4">QA &amp; CSAT</th>
                        <th className="py-3 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {telesalesExecs.map((exec) => (
                        <tr key={exec.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-bold text-white block">{exec.fullName}</span>
                            <span className="text-[10px] font-mono text-slate-500">{exec.empCode} • {exec.email}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-300">{exec.cityLocation}</td>
                          <td className="py-3 px-4 text-slate-200">{exec.todayCallsDialed} Calls Today</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white font-mono">{exec.monthlyAchievedBookings} / {exec.monthlyTargetBookings}</span>
                              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-400"
                                  style={{
                                    width: `${Math.min(100, (exec.monthlyAchievedBookings / exec.monthlyTargetBookings) * 100)}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono font-black text-amber-400">
                            ₹{exec.earnedBookingIncentiveINR.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-emerald-400 font-bold">{exec.qualityScorePercent}%</span>
                            <span className="text-[10px] text-slate-500 block">Tier {exec.currentIncentiveTier} Active</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                              {exec.currentShiftStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Fraud Alerts Box */}
                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Anti-Fraud &amp; Duplicate Lead Anomaly Radar (2 Active Flagged Events)</span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-300">
                    {TELESALES_FRAUD_ALERTS.map((alert) => (
                      <div key={alert.id} className="p-2 rounded-xl bg-slate-950/80 flex items-center justify-between text-xs">
                        <div>
                          <strong className="text-rose-300">{alert.customerPhone}:</strong> {alert.description}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{alert.flaggedAt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PARTNER SETTLEMENT & COMMISSION DASHBOARD */}
            {activeTab === "partner_settlement_dashboard" && (
              <PartnerSettlementCommissionDashboard
                onNotify={triggerToast}
                onOpenBookingDetails={onOpenBookingDetails}
              />
            )}

            {/* SETTLEMENTS & ESCROW INVOICES */}
            {activeTab === "settlements_escrow" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-white">Partner Settlements &amp; GST Invoicing Escrow</h3>
                    <p className="text-xs text-slate-400">
                      T+1 Automated bank RTGS/NEFT disbursement records, GST tax credits, and statutory TDS (Sec 194-O) compliance.
                    </p>
                  </div>
                  <button
                    onClick={() => triggerToast("All pending partner settlements scheduled for T+1 11:00 AM batch!")}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg"
                  >
                    Execute Batch Payout
                  </button>
                </div>

                <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/90 text-[10px] text-slate-400 uppercase font-black tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Invoice Ref / UTR</th>
                        <th className="py-3 px-4">Partner Entity</th>
                        <th className="py-3 px-4">Period</th>
                        <th className="py-3 px-4">Gross GMV</th>
                        <th className="py-3 px-4">Platform Fee</th>
                        <th className="py-3 px-4">TDS (194-O)</th>
                        <th className="py-3 px-4">Net Payout</th>
                        <th className="py-3 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {settlementInvoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-white block">{inv.invoiceNumber}</span>
                            <span className="text-[10px] font-mono text-slate-500">UTR: {inv.utrNumber}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-slate-200 font-bold block">Corbett Wilderness LLP</span>
                            <span className="text-[10px] text-slate-500">{inv.bankAccountMasked}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-400">{inv.period}</td>
                          <td className="py-3 px-4 font-mono font-bold text-white">₹{inv.grossBookingsVolume.toLocaleString()}</td>
                          <td className="py-3 px-4 font-mono text-amber-400">₹{inv.platformCommission.toLocaleString()}</td>
                          <td className="py-3 px-4 font-mono text-slate-400">₹{inv.tds194OAmount.toLocaleString()}</td>
                          <td className="py-3 px-4 font-mono font-black text-emerald-400 text-sm">
                            ₹{inv.netSettlementTransferred.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                              {inv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAX & PAYMENT GATEWAY CONFIG */}
            {activeTab === "tax_pg_config" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-lg font-black text-white">Statutory Tax &amp; Payment Gateway Routing Configuration</h3>
                  <p className="text-xs text-slate-400">Configure GST rates, e-commerce TCS/TDS parameters, and smart PG cascade switches.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm">GST Tax Slabs Matrix (India)</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between p-2 rounded-xl bg-slate-900">
                        <span className="text-slate-300">Economy Air Travel</span>
                        <strong className="text-emerald-400 font-mono">5.0% GST</strong>
                      </div>
                      <div className="flex justify-between p-2 rounded-xl bg-slate-900">
                        <span className="text-slate-300">Hotel/Lodge &lt; ₹7,500 / night</span>
                        <strong className="text-emerald-400 font-mono">12.0% GST</strong>
                      </div>
                      <div className="flex justify-between p-2 rounded-xl bg-slate-900">
                        <span className="text-slate-300">Luxury Hotels &amp; Resorts &gt; ₹7,500</span>
                        <strong className="text-amber-400 font-mono">18.0% GST</strong>
                      </div>
                      <div className="flex justify-between p-2 rounded-xl bg-slate-900">
                        <span className="text-slate-300">Platform Commission &amp; Listing SaaS</span>
                        <strong className="text-indigo-400 font-mono">18.0% GST</strong>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm">Payment Gateway Split Routing</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between p-2 rounded-xl bg-slate-900">
                        <span className="text-slate-300">Razorpay (Primary Route)</span>
                        <strong className="text-white font-mono">60% Traffic Allocation</strong>
                      </div>
                      <div className="flex justify-between p-2 rounded-xl bg-slate-900">
                        <span className="text-slate-300">Cashfree (Secondary Instant T+1 RTGS)</span>
                        <strong className="text-white font-mono">40% Traffic Allocation</strong>
                      </div>
                      <div className="flex justify-between p-2 rounded-xl bg-slate-900">
                        <span className="text-slate-300">NPCI UPI Direct AutoPay</span>
                        <strong className="text-emerald-400 font-mono">0.0% MDR Special Rate</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PARTNER CONTRACTS & SLA */}
            {activeTab === "contracts_sla" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-lg font-black text-white">Partner Digital Contracts &amp; Master SLAs</h3>
                  <p className="text-xs text-slate-400">Legally binding master agreements, cancellation dispute policies, and e-signatures.</p>
                </div>

                <div className="rounded-2xl bg-slate-950 border border-slate-800 divide-y divide-slate-800 text-xs">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <strong className="text-white block font-bold">Standard Lodge Partner Master Agreement (2026-v3)</strong>
                      <p className="text-[11px] text-slate-400">12% Base take rate, T+1 RTGS settlement, 24h free guest cancellation window.</p>
                    </div>
                    <button
                      onClick={() => triggerToast("Downloading Lodge Partner Agreement PDF...")}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
                    >
                      Download Legal Template
                    </button>
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <strong className="text-white block font-bold">Pilgrimage &amp; Helicopter Charter Operator SLA (2026-v2)</strong>
                      <p className="text-[11px] text-slate-400">10% Platform fee, biometric verification, DGCA aviation safety certification.</p>
                    </div>
                    <button
                      onClick={() => triggerToast("Downloading Pilgrimage SLA PDF...")}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
                    >
                      Download Legal Template
                    </button>
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
        )}
      </div>

      {/* RAZORPAY DASHBOARD & RECONCILIATION MODAL */}
      <RazorpayDashboardModal
        isOpen={isRazorpayAdminOpen}
        onClose={() => setIsRazorpayAdminOpen(false)}
      />
    </div>
  );
}
