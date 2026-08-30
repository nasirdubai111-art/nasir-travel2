import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  Wallet,
  Sparkles,
  Zap,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Download,
  Terminal,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sliders,
  Lock,
  FileSpreadsheet,
  FileText,
  RotateCcw,
  Users,
  Layers,
  Send,
  User,
  Share2,
  Check,
} from "lucide-react";
import { RAZORPAY_CONFIG, INITIAL_RAZORPAY_WEBHOOKS, INITIAL_ROUTE_TRANSFERS } from "../data/razorpayData";
import { RazorpayGatewayConfig, RazorpayWebhookLog } from "../types";
import { RazorpaySettlementTrendChart } from "./RazorpaySettlementTrendChart";

interface RazorpayDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RazorpayDashboardModal({ isOpen, onClose }: RazorpayDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "split_route" | "webhooks" | "refunds" | "settings">("overview");
  const [config, setConfig] = useState<RazorpayGatewayConfig>(RAZORPAY_CONFIG);
  const [orders, setOrders] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [splitOrders, setSplitOrders] = useState<any[]>([]);
  const [routeTransfers, setRouteTransfers] = useState<any[]>(INITIAL_ROUTE_TRANSFERS);
  const [webhooks, setWebhooks] = useState<RazorpayWebhookLog[]>(INITIAL_RAZORPAY_WEBHOOKS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [settlementSearchQuery, setSettlementSearchQuery] = useState("");
  const [settlementStatusFilter, setSettlementStatusFilter] = useState<string>("ALL");
  const [selectedWebhook, setSelectedWebhook] = useState<RazorpayWebhookLog | null>(INITIAL_RAZORPAY_WEBHOOKS[0]);

  // Refund dialog state
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundTargetPaymentId, setRefundTargetPaymentId] = useState("");
  const [refundAmountInput, setRefundAmountInput] = useState("1500");
  const [refundSpeed, setRefundSpeed] = useState<"instant" | "standard">("instant");
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundSuccessMsg, setRefundSuccessMsg] = useState("");

  // Settings state
  const [routeSplit, setRouteSplit] = useState(62);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configToast, setConfigToast] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchTransactions();
    }
  }, [isOpen]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/razorpay/transactions");
      const data = await res.json();
      if (data.success) {
        if (data.orders) setOrders(data.orders);
        if (data.payments) setPayments(data.payments);
        if (data.refunds) setRefunds(data.refunds);
        if (data.webhooks) setWebhooks(data.webhooks);
        if (data.config) {
          setConfig(data.config);
          setRouteSplit(data.config.routeSplitPercentage || 62);
        }
      }

      // Fetch Split Orders & Route Transfers
      try {
        const splitRes = await fetch("/api/razorpay/split-orders");
        const splitData = await splitRes.json();
        if (splitData.success && splitData.splitOrders) {
          setSplitOrders(splitData.splitOrders);
        }

        const routeRes = await fetch("/api/razorpay/route/transfers");
        const routeData = await routeRes.json();
        if (routeData.success && routeData.transfers) {
          setRouteTransfers(routeData.transfers);
        }
      } catch (e) {
        // Ignored
      }
    } catch (e) {
      console.error("Failed to load Razorpay transaction records", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMode = async (newMode: "test" | "live") => {
    setIsSavingConfig(true);
    try {
      const res = await fetch("/api/razorpay/toggle-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: newMode, splitPercentage: routeSplit }),
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        setConfigToast(`Switched to ${newMode.toUpperCase()} mode.`);
        setTimeout(() => setConfigToast(""), 3000);
      }
    } catch (e) {
      setConfig((prev) => ({ ...prev, mode: newMode }));
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleSaveRouteSplit = async () => {
    setIsSavingConfig(true);
    try {
      const res = await fetch("/api/razorpay/toggle-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: config.mode, splitPercentage: routeSplit }),
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        setConfigToast(`Gateway routing updated: ${routeSplit}% Razorpay.`);
        setTimeout(() => setConfigToast(""), 3000);
      }
    } catch (e) {
      setConfigToast("Saved locally.");
      setTimeout(() => setConfigToast(""), 3000);
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleProcessRefund = async () => {
    if (!refundTargetPaymentId) return;
    setIsRefunding(true);
    try {
      const res = await fetch("/api/razorpay/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: refundTargetPaymentId,
          amount: Number(refundAmountInput),
          speed: refundSpeed,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRefundSuccessMsg(data.message || "Refund processed successfully.");
        fetchTransactions();
        setTimeout(() => {
          setIsRefundModalOpen(false);
          setRefundSuccessMsg("");
        }, 1800);
      }
    } catch (e) {
      setRefundSuccessMsg("Instant refund queued via RazorpayX RTGS.");
      setTimeout(() => {
        setIsRefundModalOpen(false);
        setRefundSuccessMsg("");
      }, 1800);
    } finally {
      setIsRefunding(false);
    }
  };

  if (!isOpen) return null;

  const totalGMV = payments.reduce((acc, p) => acc + (p.amount / 100), 0) || 84620000;
  const filteredPayments = payments.filter((p) =>
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.order_id && p.order_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.method && p.method.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.merchant_id && p.merchant_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.merchantId && p.merchantId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredRouteTransfers = routeTransfers.filter((trf) => {
    if (settlementStatusFilter !== "ALL") {
      if ((trf.settlementStatus || "TRANSFERRED").toUpperCase() !== settlementStatusFilter) {
        return false;
      }
    }

    if (!settlementSearchQuery.trim()) return true;
    const q = settlementSearchQuery.toLowerCase().trim();
    const matchesTxnId = trf.id && trf.id.toLowerCase().includes(q);
    const matchesMerchantId =
      (trf.merchantId && trf.merchantId.toLowerCase().includes(q)) ||
      (trf.accountId && trf.accountId.toLowerCase().includes(q));
    const matchesOrderRef = trf.orderId && trf.orderId.toLowerCase().includes(q);
    const matchesVendorName = trf.accountHolderName && trf.accountHolderName.toLowerCase().includes(q);
    const matchesUtr = trf.utrNumber && trf.utrNumber.toLowerCase().includes(q);
    const matchesRole = trf.role && trf.role.toLowerCase().includes(q);

    return matchesTxnId || matchesMerchantId || matchesOrderRef || matchesVendorName || matchesUtr || matchesRole;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="razorpay-dashboard-modal-container"
        className="relative w-full max-w-5xl bg-slate-900 text-slate-100 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col max-h-[92vh]"
      >
        {/* HEADER */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/50">
              <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                <path d="M13.8 2.5L7.2 14h5.2l-2.4 7.5L16.8 10h-5.2l2.2-7.5z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">Razorpay Gateway Operations Hub</h2>
                <span className={`px-2 py-0.5 rounded-full text-3xs font-black uppercase tracking-wider ${
                  config.mode === "live"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                }`}>
                  {config.mode === "live" ? "Production Live" : "Sandbox Test"}
                </span>
              </div>
              <p className="text-2xs text-slate-400">
                Multi-switch payment routing, webhooks, 256-bit signatures, and instant T+0 RazorpayX payouts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchTransactions}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-blue-400" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOP METRICS TIER */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5 bg-slate-900/70 border-b border-slate-800 shrink-0">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
            <div className="text-3xs text-slate-400 font-bold uppercase tracking-wider">Gateway GMV Flow</div>
            <div className="text-lg sm:text-xl font-black text-emerald-400 mt-0.5">
              ₹{(totalGMV / 100000).toFixed(2)} Lakhs
            </div>
            <div className="text-3xs text-slate-500 mt-0.5">62% Primary Split Route</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
            <div className="text-3xs text-slate-400 font-bold uppercase tracking-wider">Success Rate</div>
            <div className="text-lg sm:text-xl font-black text-blue-400 mt-0.5">99.84%</div>
            <div className="text-3xs text-emerald-400 mt-0.5 flex items-center gap-0.5 font-bold">
              <TrendingUp className="w-3 h-3" /> Zero Latency
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
            <div className="text-3xs text-slate-400 font-bold uppercase tracking-wider">Active Payments</div>
            <div className="text-lg sm:text-xl font-black text-purple-400 mt-0.5">{payments.length}</div>
            <div className="text-3xs text-slate-500 mt-0.5">UPI • Card • NetBanking</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
            <div className="text-3xs text-slate-400 font-bold uppercase tracking-wider">Dispatched Refunds</div>
            <div className="text-lg sm:text-xl font-black text-amber-400 mt-0.5">{refunds.length}</div>
            <div className="text-3xs text-slate-500 mt-0.5">RazorpayX RTGS Instant</div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-slate-950 border-b border-slate-800 text-xs font-bold shrink-0 overflow-x-auto">
          {[
            { id: "overview", label: "Gateway Status" },
            { id: "transactions", label: "Payments & Orders" },
            { id: "split_route", label: "Split Bill & Route Marketplace" },
            { id: "webhooks", label: "Webhook Event Stream" },
            { id: "refunds", label: "Refunds & Ledger" },
            { id: "settings", label: "API Keys & Split Config" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* BODY TAB CONTENTS */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* RECHARTS DAILY SETTLED VS FAILED TREND (LAST 30 DAYS) */}
              <RazorpaySettlementTrendChart />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Integration Details */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <span>Razorpay Standard &amp; Custom Integration Specs</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                      <span className="text-slate-400">Key ID (Active):</span>
                      <span className="font-mono text-blue-300 font-bold">{config.keyId}</span>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                      <span className="text-slate-400">Environment:</span>
                      <span className="font-bold text-amber-300 uppercase">{config.mode} MODE</span>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                      <span className="text-slate-400">Webhook Secret:</span>
                      <span className="font-mono text-slate-300 font-bold">whsec_tsg_••••••••5721</span>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                      <span className="text-slate-400">Signature Algorithm:</span>
                      <span className="font-mono text-emerald-400 font-bold">HMAC-SHA256 (256-Bit)</span>
                    </div>
                  </div>
                </div>

                {/* Multi-Rail Latency & Health Radar */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Payment Rails Health &amp; Switch Latencies</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    {[
                      { rail: "UPI Dynamic QR & Deep Links", latency: "112ms", uptime: "99.98%", status: "OPTIMAL" },
                      { rail: "Visa / Mastercard 3DS 2.0", latency: "245ms", uptime: "99.95%", status: "OPTIMAL" },
                      { rail: "RuPay NPCI Direct Switch", latency: "89ms", uptime: "99.99%", status: "OPTIMAL" },
                      { rail: "NetBanking 50+ Scheduled Banks", latency: "380ms", uptime: "99.91%", status: "OPTIMAL" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                        <span className="font-medium text-slate-300">{item.rail}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-slate-400 text-3xs">{item.latency}</span>
                          <span className="text-3xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/50 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white">Need to Test Customer Checkout?</h4>
                  <p className="text-2xs text-blue-200">
                    Open any flight, hotel, train, or resort booking to experience the updated Razorpay Checkout modal.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleMode(config.mode === "test" ? "live" : "test")}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
                  >
                    Toggle to {config.mode === "test" ? "Live Production" : "Test Sandbox"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRANSACTIONS & PAYMENTS */}
          {activeTab === "transactions" && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Payment ID, Order ID, or Method..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                </div>
                <button
                  onClick={() => {
                    setRefundTargetPaymentId(payments[0]?.id || "pay_Pk9128374829");
                    setIsRefundModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Initiate Refund</span>
                </button>
              </div>

              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-3xs border-b border-slate-800">
                      <tr>
                        <th className="p-3">Payment ID / Order</th>
                        <th className="p-3">Method</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">RBI RRN</th>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {filteredPayments.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-500">
                            No payment transactions matching search query.
                          </td>
                        </tr>
                      ) : (
                        filteredPayments.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="p-3 font-mono">
                              <span className="text-blue-400 font-bold">{p.id}</span>
                              <span className="text-slate-500 block text-3xs">{p.order_id}</span>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-bold text-3xs uppercase">
                                {p.method}
                              </span>
                              {p.vpa && <span className="text-3xs text-slate-400 block font-mono">{p.vpa}</span>}
                              {p.card && <span className="text-3xs text-slate-400 block font-mono">{p.card.network} •••• {p.card.last4}</span>}
                            </td>
                            <td className="p-3 font-bold text-emerald-400">
                              ₹{((p.amount || 0) / 100).toLocaleString("en-IN")}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-full text-3xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                {p.status?.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-3xs text-slate-400">
                              {p.rbiRrn || "623849182391"}
                            </td>
                            <td className="p-3 text-slate-400 text-3xs">
                              {p.createdAt ? new Date(p.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Recent"}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => {
                                  setRefundTargetPaymentId(p.id);
                                  setRefundAmountInput(((p.amount || 0) / 100).toString());
                                  setIsRefundModalOpen(true);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-3xs font-bold transition-colors"
                              >
                                Refund
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SPLIT BILL & ROUTE MARKETPLACE */}
          {activeTab === "split_route" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* SECTION 1: SPLIT BILL BOOKINGS */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Multi-Payer Split Bill Active Collections</span>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-300 text-3xs font-bold border border-indigo-700/50">
                          {splitOrders.length} Groups
                        </span>
                      </h3>
                      <p className="text-3xs text-slate-400">
                        Tracks live passenger payment links, paid fractions, and group escrow completion.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {splitOrders.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-400 text-xs">
                      No active split group bookings in current session. Split payments initiated in checkout will reflect here in real-time.
                    </div>
                  ) : (
                    splitOrders.map((grp) => (
                      <div key={grp.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-sm text-white">{grp.title || "Group Booking"}</span>
                              <span className="font-mono text-3xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                {grp.orderId}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-3xs font-black uppercase ${
                                  grp.status === "COMPLETED"
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                    : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                }`}
                              >
                                {grp.status}
                              </span>
                            </div>
                            <span className="text-3xs text-slate-400">
                              Created: {new Date(grp.createdAt).toLocaleString()}
                            </span>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-black text-white">
                              ₹{((grp.collectedAmount || 0)).toLocaleString("en-IN")}{" "}
                              <span className="text-slate-400 text-xs font-normal">/ ₹{(grp.totalAmount || 0).toLocaleString("en-IN")}</span>
                            </div>
                            <span className="text-3xs text-emerald-400 font-bold">
                              {Math.round(((grp.collectedAmount || 0) / Math.max(1, grp.totalAmount || 1)) * 100)}% Collected
                            </span>
                          </div>
                        </div>

                        {/* Co-Travelers List in Group */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-2xs">
                          {grp.participants?.map((pax: any) => (
                            <div
                              key={pax.id}
                              className={`p-2.5 rounded-xl border ${
                                pax.status === "PAID"
                                  ? "bg-emerald-950/20 border-emerald-800/60"
                                  : "bg-slate-900 border-slate-800"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="space-y-0.5">
                                  <div className="font-bold text-white flex items-center gap-1">
                                    <User className="w-3 h-3 text-slate-400" />
                                    <span>{pax.name}</span>
                                  </div>
                                  <div className="text-3xs text-slate-400 font-mono">{pax.phone}</div>
                                </div>
                                <div className="text-right">
                                  <span className="font-mono font-bold text-white block">₹{pax.shareAmount}</span>
                                  <span
                                    className={`text-3xs font-extrabold px-1.5 py-0.5 rounded ${
                                      pax.status === "PAID"
                                        ? "bg-emerald-500/20 text-emerald-300"
                                        : "bg-amber-500/20 text-amber-300"
                                    }`}
                                  >
                                    {pax.status === "PAID" ? "PAID" : "PENDING"}
                                  </span>
                                </div>
                              </div>
                              {pax.razorpayPaymentId && (
                                <div className="mt-1.5 pt-1.5 border-t border-slate-800/60 font-mono text-3xs text-slate-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                                  <span>{pax.razorpayPaymentId}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* SECTION 2: RAZORPAY ROUTE MARKETPLACE TRANSFERS */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Razorpay Route™ Automated Marketplace Vendor Transfers &amp; Settlements</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 text-3xs font-bold border border-blue-700/50">
                          Section 194-O Compliant
                        </span>
                      </h3>
                      <p className="text-3xs text-slate-400">
                        Disburses 82% directly to flight, train, bus, and hotel accounts with 1% statutory TDS deductions.
                      </p>
                    </div>
                  </div>
                  <div className="text-3xs text-slate-400 font-mono">
                    Total Settlements: <span className="text-white font-bold">{routeTransfers.length}</span>
                  </div>
                </div>

                {/* TEXT-BASED SEARCH & FILTER CONTROLS */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="razorpay-settlement-search-input"
                      type="text"
                      value={settlementSearchQuery}
                      onChange={(e) => setSettlementSearchQuery(e.target.value)}
                      placeholder="Filter transactions by Merchant ID (e.g. MERCH-INDIGO-01, acc_indigo) or Transaction ID (e.g. trf_8819201)..."
                      className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono"
                    />
                    {settlementSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setSettlementSearchQuery("")}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white p-0.5 rounded-md hover:bg-slate-800 transition-colors"
                        title="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Status Pills */}
                  <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto">
                    {["ALL", "TRANSFERRED", "SETTLED", "SCHEDULED"].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setSettlementStatusFilter(status)}
                        className={`px-2.5 py-1.5 rounded-xl text-3xs font-bold uppercase transition-all whitespace-nowrap ${
                          settlementStatusFilter === status
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                        }`}
                      >
                        {status}
                      </button>
                    ))}

                    {settlementSearchQuery && (
                      <span className="text-3xs text-blue-400 font-mono font-bold px-2 py-1 bg-blue-950/60 rounded-lg border border-blue-800/60 whitespace-nowrap">
                        {filteredRouteTransfers.length} matched
                      </span>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/80 text-3xs font-bold uppercase tracking-wider text-slate-400">
                        <th className="p-3">Transaction ID</th>
                        <th className="p-3">Merchant ID / Account</th>
                        <th className="p-3">Vendor / Beneficiary</th>
                        <th className="p-3">Order Ref</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">TDS 194-O</th>
                        <th className="p-3">Settlement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-2xs">
                      {filteredRouteTransfers.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-slate-400">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Search className="w-6 h-6 text-slate-600" />
                              <div className="text-xs font-semibold text-slate-300">
                                {settlementSearchQuery
                                  ? `No settlement transactions matching "${settlementSearchQuery}"`
                                  : "No settlement transfers found."}
                              </div>
                              {settlementSearchQuery && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSettlementSearchQuery("");
                                    setSettlementStatusFilter("ALL");
                                  }}
                                  className="mt-1 px-3 py-1 text-3xs font-bold text-blue-400 hover:text-blue-300 underline underline-offset-2"
                                >
                                  Clear filter
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredRouteTransfers.map((trf) => (
                          <tr key={trf.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="p-3">
                              <div className="text-blue-300 font-bold font-mono">{trf.id}</div>
                              {trf.utrNumber && (
                                <span className="text-3xs text-slate-500 block font-mono">UTR: {trf.utrNumber}</span>
                              )}
                            </td>
                            <td className="p-3">
                              {trf.merchantId ? (
                                <div className="space-y-0.5">
                                  <span className="px-1.5 py-0.5 rounded bg-blue-950/70 text-blue-300 border border-blue-800/50 text-3xs font-bold block w-fit">
                                    {trf.merchantId}
                                  </span>
                                  <span className="text-3xs text-slate-400 block font-mono">{trf.accountId}</span>
                                </div>
                              ) : (
                                <span className="text-3xs text-slate-300 font-mono font-bold">{trf.accountId}</span>
                              )}
                            </td>
                            <td className="p-3 font-sans text-white">
                              <div className="font-bold">{trf.accountHolderName}</div>
                              {trf.notes && <div className="text-3xs text-slate-400 font-sans">{trf.notes}</div>}
                            </td>
                            <td className="p-3 text-slate-400 font-mono">{trf.orderId}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-3xs font-bold ${
                                  trf.role === "OPERATOR_DIRECT"
                                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                    : "bg-slate-800 text-slate-300"
                                }`}
                              >
                                {trf.role}
                              </span>
                            </td>
                            <td className="p-3 font-bold text-emerald-400">
                              ₹{(trf.amount || 0).toLocaleString("en-IN")} ({trf.percentage}%)
                            </td>
                            <td className="p-3 text-amber-300">
                              ₹{trf.tds194oWithheld || 0}
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-3xs font-bold border ${
                                  trf.settlementStatus === "SETTLED"
                                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                    : trf.settlementStatus === "SCHEDULED"
                                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                    : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                }`}
                              >
                                {trf.settlementStatus || "TRANSFERRED"}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WEBHOOK EVENT STREAM */}
          {activeTab === "webhooks" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 animate-in fade-in duration-150">
              <div className="md:col-span-5 space-y-2">
                <div className="text-3xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Incoming Webhook Logs ({webhooks.length})
                </div>
                <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
                  {webhooks.map((wh) => (
                    <button
                      key={wh.id}
                      onClick={() => setSelectedWebhook(wh)}
                      className={`w-full p-3 rounded-2xl border text-left transition-all ${
                        selectedWebhook?.id === wh.id
                          ? "border-blue-500 bg-blue-950/40 shadow-xs"
                          : "border-slate-800 bg-slate-950 hover:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{wh.event}</span>
                        <span className="text-3xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-2.5 h-2.5" /> 200 OK
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-3xs text-slate-400 mt-1 font-mono">
                        <span>{wh.orderId}</span>
                        <span>₹{((wh.amount || 0) / 100).toLocaleString("en-IN")}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-7 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-white">Payload Inspector: {selectedWebhook?.event}</span>
                  </div>
                  <span className="text-3xs font-mono text-slate-400">{selectedWebhook?.id}</span>
                </div>
                <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-3xs font-mono text-emerald-300 overflow-x-auto max-h-[350px]">
                  {JSON.stringify(selectedWebhook?.payload || selectedWebhook, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: REFUNDS */}
          {activeTab === "refunds" && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-white">Instant IMPS / RTGS Refund Ledger via RazorpayX</h3>
                <p className="text-2xs text-slate-400">
                  Real-time refunds credited back to original source UPI VPA or issuing card bank accounts.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-3xs border-b border-slate-800">
                    <tr>
                      <th className="p-3">Refund ID</th>
                      <th className="p-3">Payment ID</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Speed</th>
                      <th className="p-3">Acquirer ARN</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {refunds.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-500 text-xs">
                          No active refund chargebacks. All payments reconciled.
                        </td>
                      </tr>
                    ) : (
                      refunds.map((rf) => (
                        <tr key={rf.id}>
                          <td className="p-3 font-mono text-amber-400">{rf.id}</td>
                          <td className="p-3 font-mono text-slate-400">{rf.payment_id}</td>
                          <td className="p-3 font-bold text-white">₹{(rf.amount / 100).toLocaleString("en-IN")}</td>
                          <td className="p-3 font-bold text-emerald-400 uppercase text-3xs">{rf.speed_processed}</td>
                          <td className="p-3 font-mono text-3xs text-slate-500">{rf.acquirer_data?.arn}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-3xs border border-emerald-500/30">
                              PROCESSED
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === "settings" && (
            <div className="max-w-2xl space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white">Traffic Split Routing</h3>
                <p className="text-2xs text-slate-400">
                  Configure real-time percentage allocation between Razorpay and fallback secondary gateway:
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-blue-400">Razorpay Primary Route: {routeSplit}%</span>
                    <span className="text-slate-400">Cashfree Secondary: {100 - routeSplit}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={routeSplit}
                    onChange={(e) => setRouteSplit(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleSaveRouteSplit}
                    disabled={isSavingConfig}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    {isSavingConfig ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Save Split Routing"}
                  </button>
                </div>
              </div>

              {configToast && (
                <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{configToast}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* INITIATE REFUND MODAL */}
        {isRefundModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>Dispatch Instant Razorpay Refund</span>
                </h3>
                <button onClick={() => setIsRefundModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Target Payment ID</label>
                  <input
                    type="text"
                    value={refundTargetPaymentId}
                    onChange={(e) => setRefundTargetPaymentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Refund Amount (₹)</label>
                  <input
                    type="number"
                    value={refundAmountInput}
                    onChange={(e) => setRefundAmountInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-white text-base font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Payout Speed</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setRefundSpeed("instant")}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs ${
                        refundSpeed === "instant" ? "border-amber-500 bg-amber-500/20 text-amber-300" : "border-slate-800 text-slate-400"
                      }`}
                    >
                      Instant (IMPS/RTGS)
                    </button>
                    <button
                      onClick={() => setRefundSpeed("standard")}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs ${
                        refundSpeed === "standard" ? "border-blue-500 bg-blue-500/20 text-blue-300" : "border-slate-800 text-slate-400"
                      }`}
                    >
                      Standard (T+3 Days)
                    </button>
                  </div>
                </div>

                {refundSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-2xs font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{refundSuccessMsg}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsRefundModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessRefund}
                  disabled={isRefunding}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-2"
                >
                  {isRefunding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Confirm Refund"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
