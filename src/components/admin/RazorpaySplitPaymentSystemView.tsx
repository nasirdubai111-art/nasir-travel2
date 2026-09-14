import React, { useState, useMemo } from "react";
import {
  CreditCard,
  Split,
  Building,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Search,
  Filter,
  Plus,
  Sliders,
  DollarSign,
  Copy,
  ExternalLink,
  Percent,
  Layers,
  Banknote,
  Send,
  Code2,
  Hash,
  Activity,
  Check,
  RefreshCw,
  X,
  FileSpreadsheet,
} from "lucide-react";
import {
  RazorpayLinkedAccount,
  RazorpaySplitRule,
  RazorpaySplitTransaction,
  RazorpaySplitTransferItem,
} from "../../types";
import {
  RAZORPAY_NODAL_METRICS,
  RAZORPAY_LINKED_ACCOUNTS,
  RAZORPAY_SPLIT_RULES,
  RAZORPAY_SPLIT_TRANSACTIONS,
} from "../../data/razorpaySplitPaymentData";

export function RazorpaySplitPaymentSystemView() {
  const [activeSubTab, setActiveSubTab] = useState<
    "transactions" | "accounts" | "rules" | "simulator" | "reversals"
  >("transactions");

  // State for data
  const [transactions, setTransactions] = useState<RazorpaySplitTransaction[]>(
    RAZORPAY_SPLIT_TRANSACTIONS
  );
  const [accounts, setAccounts] = useState<RazorpayLinkedAccount[]>(
    RAZORPAY_LINKED_ACCOUNTS
  );
  const [rules, setRules] = useState<RazorpaySplitRule[]>(RAZORPAY_SPLIT_RULES);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTxn, setSelectedTxn] = useState<RazorpaySplitTransaction | null>(
    null
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Simulator State
  const [simAmount, setSimAmount] = useState<number>(18500);
  const [simCategory, setSimCategory] = useState<string>("Hotels & Lodges");
  const [simAccountId, setSimAccountId] = useState<string>("acc_CorbettLodge55");
  const [simVendorPct, setSimVendorPct] = useState<number>(82);
  const [simPlatformPct, setSimPlatformPct] = useState<number>(12);
  const [simAgentPct, setSimAgentPct] = useState<number>(4);
  const [simHoldSettlement, setSimHoldSettlement] = useState<boolean>(true);
  const [simResult, setSimResult] = useState<{
    orderId: string;
    paymentId: string;
    signature: string;
    transfers: RazorpaySplitTransferItem[];
    rawJson: string;
  } | null>(null);

  // Add Account Modal State
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [newAccName, setNewAccName] = useState("");
  const [newAccLegal, setNewAccLegal] = useState("");
  const [newAccCategory, setNewAccCategory] = useState<RazorpayLinkedAccount["category"]>("hotel");
  const [newAccEmail, setNewAccEmail] = useState("");
  const [newAccPhone, setNewAccPhone] = useState("");
  const [newAccPan, setNewAccPan] = useState("");
  const [newAccGstin, setNewAccGstin] = useState("");
  const [newAccBank, setNewAccBank] = useState("");
  const [newAccIfsc, setNewAccIfsc] = useState("");
  const [newAccNumber, setNewAccNumber] = useState("");
  const [newAccHoldDays, setNewAccHoldDays] = useState(1);
  const [newAccSchedule, setNewAccSchedule] = useState<RazorpayLinkedAccount["settlementSchedule"]>("t_plus_1");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast(`Copied ${text} to clipboard`);
  };

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.serviceCategory.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "held" && t.transfers.some((tr) => tr.onHold)) ||
        (statusFilter === "reversed" &&
          (t.status === "partially_reversed" || t.status === "fully_reversed")) ||
        t.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [transactions, searchQuery, statusFilter]);

  // Release held escrow funds
  const handleReleaseEscrow = (txnId: string, transferId: string) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id !== txnId) return t;
        const updatedTransfers = t.transfers.map((tr) => {
          if (tr.id === transferId) {
            return {
              ...tr,
              onHold: false,
              settledAt: new Date().toISOString(),
            };
          }
          return tr;
        });
        return {
          ...t,
          transfers: updatedTransfers,
          status: "split_processed",
        };
      })
    );
    showToast(`Escrow funds for ${transferId} released and disbursed to partner account.`);
  };

  // Trigger partial or full reversal
  const handleTriggerReversal = (txnId: string, transferId: string, amount: number) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id !== txnId) return t;
        const updatedTransfers: RazorpaySplitTransferItem[] = t.transfers.map((tr) => {
          if (tr.id === transferId) {
            return {
              ...tr,
              reversalStatus: "partial" as const,
              reversedAmountINR: (tr.reversedAmountINR || 0) + amount,
            };
          }
          return tr;
        });
        return {
          ...t,
          transfers: updatedTransfers,
          status: "partially_reversed",
        };
      })
    );
    showToast(`Reversal of ₹${amount.toLocaleString()} triggered on ${transferId} back to nodal customer refund pool.`);
  };

  // Run simulator
  const handleRunSimulator = () => {
    const total = simAmount;
    const vendorAmt = Math.round((total * simVendorPct) / 100 * 100) / 100;
    const platformAmt = Math.round((total * simPlatformPct) / 100 * 100) / 100;
    const agentAmt = Math.round((total * simAgentPct) / 100 * 100) / 100;
    const tdsAmt = Math.round((total * 1) / 100 * 100) / 100; // 1%

    const linkedAcc = accounts.find((a) => a.id === simAccountId) || accounts[0];
    const newOrderId = `order_sim_${Date.now().toString(36)}`;
    const newPayId = `pay_sim_${Math.random().toString(36).substring(2, 11)}`;
    const sig = `sig_${Math.random().toString(36).substring(2, 16)}8f01`;

    const transfersList: RazorpaySplitTransferItem[] = [
      {
        id: `trf_${Math.random().toString(36).substring(2, 9)}`,
        recipientAccountId: linkedAcc.id,
        recipientName: `${linkedAcc.businessName} (${simVendorPct}%)`,
        recipientRole: "vendor",
        amountINR: vendorAmt,
        currency: "INR",
        onHold: simHoldSettlement,
        settledAt: simHoldSettlement ? undefined : new Date().toISOString(),
        reversalStatus: "none",
      },
      {
        id: `trf_${Math.random().toString(36).substring(2, 9)}`,
        recipientAccountId: "acc_BY_Nodal_HDFC01",
        recipientName: `BharatYatra Take-Rate (${simPlatformPct}%)`,
        recipientRole: "platform",
        amountINR: platformAmt,
        currency: "INR",
        onHold: false,
        settledAt: new Date().toISOString(),
        reversalStatus: "none",
      },
      {
        id: `trf_${Math.random().toString(36).substring(2, 9)}`,
        recipientAccountId: "acc_AgentDelhiDesk09",
        recipientName: `Agent/Channel Commission (${simAgentPct}%)`,
        recipientRole: "agent",
        amountINR: agentAmt,
        currency: "INR",
        onHold: simHoldSettlement,
        settledAt: simHoldSettlement ? undefined : new Date().toISOString(),
        reversalStatus: "none",
      },
      {
        id: `trf_${Math.random().toString(36).substring(2, 9)}`,
        recipientAccountId: "acc_BY_TaxEscrow_SBI01",
        recipientName: "Statutory TDS Sec 194-O Escrow (1%)",
        recipientRole: "tax_escrow",
        amountINR: tdsAmt,
        currency: "INR",
        onHold: false,
        settledAt: new Date().toISOString(),
        reversalStatus: "none",
      },
    ];

    const rawPayload = {
      amount: total * 100, // paise
      currency: "INR",
      receipt: `RCPT-SPLIT-${Date.now()}`,
      transfers: transfersList.map((tr) => ({
        account: tr.recipientAccountId,
        amount: Math.round(tr.amountINR * 100),
        currency: "INR",
        on_hold: tr.onHold,
        notes: {
          role: tr.recipientRole,
          category: simCategory,
          platform: "BharatYatra_Travel_SuperApp",
        },
      })),
    };

    setSimResult({
      orderId: newOrderId,
      paymentId: newPayId,
      signature: sig,
      transfers: transfersList,
      rawJson: JSON.stringify(rawPayload, null, 2),
    });

    showToast("Razorpay Route Order with Split Transfers generated successfully!");
  };

  // Add new linked account
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName || !newAccLegal || !newAccPan || !newAccIfsc) {
      showToast("Please fill in required fields.");
      return;
    }

    const newAcc: RazorpayLinkedAccount = {
      id: `acc_${newAccName.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10)}_${Math.floor(10 + Math.random() * 90)}`,
      businessName: newAccName,
      legalEntityName: newAccLegal,
      category: newAccCategory,
      email: newAccEmail || "finance@partner.com",
      phone: newAccPhone || "+91 98765 43210",
      panNumber: newAccPan.toUpperCase(),
      gstin: newAccGstin.toUpperCase(),
      bankName: newAccBank || "HDFC Bank",
      ifsc: newAccIfsc.toUpperCase(),
      accountNumberMasked: `••••••••${newAccNumber ? newAccNumber.slice(-4) : "1234"}`,
      status: "activated",
      settlementSchedule: newAccSchedule,
      holdingPeriodDays: newAccHoldDays,
      totalSettledAmountINR: 0,
      currentEscrowBalanceINR: 0,
      createdAt: new Date().toISOString(),
    };

    setAccounts([newAcc, ...accounts]);
    setShowAddAccountModal(false);
    showToast(`Linked Account ${newAcc.id} successfully registered on Razorpay Route!`);

    // Reset form
    setNewAccName("");
    setNewAccLegal("");
    setNewAccEmail("");
    setNewAccPhone("");
    setNewAccPan("");
    setNewAccGstin("");
    setNewAccBank("");
    setNewAccIfsc("");
    setNewAccNumber("");
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-indigo-600 text-white font-medium text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2 border border-indigo-400/40">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
              <Split className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">
                  Razorpay Route • Split Payment &amp; Escrow Engine
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  Nodal Switch Active
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                  Admin Console Only
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated multi-party payment splits, sub-merchant settlements, deferred escrow holds, and proportional refund clawbacks
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddAccountModal(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Link New Sub-Merchant</span>
          </button>
          <button
            onClick={() => {
              showToast("Refreshing Razorpay Route Webhook sync...");
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Refresh Nodal Sync"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Processed GMV</span>
          <span className="text-base font-black text-white mt-1 block">
            ₹{(RAZORPAY_NODAL_METRICS.totalProcessedGMV / 10000000).toFixed(2)} Cr
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3" /> 100% Routed
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Vendor Payouts Split</span>
          <span className="text-base font-black text-emerald-400 mt-1 block">
            ₹{(RAZORPAY_NODAL_METRICS.totalTransfersVolume / 10000000).toFixed(2)} Cr
          </span>
          <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">
            88.5% of gross GMV
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Escrow / On-Hold Funds</span>
          <span className="text-base font-black text-amber-400 mt-1 block">
            ₹{(RAZORPAY_NODAL_METRICS.escrowHeldBalance / 10000000).toFixed(2)} Cr
          </span>
          <span className="text-[10px] text-amber-400/90 font-semibold flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3" /> Trip Lock Active
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Platform Commission</span>
          <span className="text-base font-black text-indigo-400 mt-1 block">
            ₹{(RAZORPAY_NODAL_METRICS.platformCommissionRetained / 10000000).toFixed(2)} Cr
          </span>
          <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">
            Avg Take-Rate 5.78%
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">TDS Sec 194-O (1%)</span>
          <span className="text-base font-black text-cyan-400 mt-1 block">
            ₹{(RAZORPAY_NODAL_METRICS.tdsDeducted194O / 100000).toFixed(2)} L
          </span>
          <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">
            E-Commerce Operator Tax
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Linked Sub-Merchants</span>
          <span className="text-base font-black text-white mt-1 block">
            {RAZORPAY_NODAL_METRICS.activeLinkedSubAccounts} Verified
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3 h-3" /> KYC Compliant
          </span>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab("transactions")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === "transactions"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Split Transactions Ledger ({transactions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("accounts")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === "accounts"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Linked Sub-Merchant Accounts ({accounts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("rules")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === "rules"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Category Split Rules ({rules.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("simulator")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === "simulator"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Route API Split Simulator</span>
        </button>

        <button
          onClick={() => setActiveSubTab("reversals")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === "reversals"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`}
        >
          <RotateCcw className="w-4 h-4 text-pink-400" />
          <span>Automated Refund Reversals</span>
        </button>
      </div>

      {/* 1. TRANSACTIONS LEDGER TAB */}
      {activeSubTab === "transactions" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search by Pay ID, Order, Booking Ref, Guest..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Split Transactions</option>
                <option value="split_processed">Split Processed</option>
                <option value="held">Escrow Held (Trip Lock)</option>
                <option value="reversed">Refund Reversals</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-[10px] text-slate-400 uppercase font-black tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Payment ID / Order</th>
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Split Breakdown Flow</th>
                    <th className="py-3 px-4">Settlement Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredTransactions.map((txn) => {
                    const isHeld = txn.transfers.some((tr) => tr.onHold);
                    const vendorTransfer = txn.transfers.find(
                      (tr) => tr.recipientRole === "vendor"
                    );
                    const platformTransfer = txn.transfers.find(
                      (tr) => tr.recipientRole === "platform"
                    );

                    return (
                      <tr
                        key={txn.id}
                        className="hover:bg-slate-900/40 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-white">
                              {txn.id}
                            </span>
                            <button
                              onClick={() => copyToClipboard(txn.id, txn.id)}
                              className="text-slate-500 hover:text-slate-300"
                              title="Copy ID"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 block">
                            {txn.orderId}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-indigo-400">
                            {txn.bookingRef}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            Rail: {txn.paymentRail.toUpperCase()}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-white font-medium block">
                            {txn.customerName}
                          </span>
                          <span className="text-[10px] text-slate-500 truncate max-w-[140px] block">
                            {txn.customerEmail}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-medium">
                            {txn.serviceCategory}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-white text-sm">
                            ₹{txn.totalAmountINR.toLocaleString()}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="space-y-1 text-[10px]">
                            {vendorTransfer && (
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-slate-400 truncate max-w-[120px]">
                                  Vendor:
                                </span>
                                <span className="font-mono font-bold text-emerald-400">
                                  ₹{vendorTransfer.amountINR.toLocaleString()}
                                </span>
                              </div>
                            )}
                            {platformTransfer && (
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-slate-400">Platform:</span>
                                <span className="font-mono font-bold text-indigo-400">
                                  ₹{platformTransfer.amountINR.toLocaleString()}
                                </span>
                              </div>
                            )}
                            <div className="text-[9px] text-slate-500">
                              {txn.transfers.length} split transfers
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {isHeld ? (
                            <div>
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1 w-fit">
                                <Clock className="w-3 h-3" /> Escrow Held
                              </span>
                              {txn.holdUntil && (
                                <span className="text-[9px] text-slate-500 block mt-0.5">
                                  Release: {new Date(txn.holdUntil).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          ) : txn.status === "partially_reversed" ? (
                            <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[10px] font-bold flex items-center gap-1 w-fit">
                              <RotateCcw className="w-3 h-3" /> Partial Reversal
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3 h-3" /> Split Processed
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedTxn(txn)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Inspect Splits
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

      {/* 2. LINKED SUB-MERCHANT ACCOUNTS TAB */}
      {activeSubTab === "accounts" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                Linked Sub-Merchant Accounts (Razorpay Route)
              </h3>
              <p className="text-xs text-slate-400">
                Verified partner bank accounts, automated daily payout schedules, and active escrow balances
              </p>
            </div>
            <button
              onClick={() => setShowAddAccountModal(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Link New Account</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-indigo-400">
                      {acc.category}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1">
                      {acc.businessName}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      {acc.id}
                    </span>
                  </div>

                  {acc.status === "activated" ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Under Review
                    </span>
                  )}
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bank Details:</span>
                    <span className="text-slate-200 font-medium font-mono">
                      {acc.bankName} ({acc.accountNumberMasked})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">IFSC / PAN:</span>
                    <span className="text-slate-200 font-mono font-medium">
                      {acc.ifsc} • {acc.panNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Settlement Cycle:</span>
                    <span className="text-emerald-400 font-bold uppercase">
                      {acc.settlementSchedule.replace("_", "+")}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="p-2 rounded-xl bg-slate-900">
                    <span className="text-slate-400 block text-[10px]">Total Settled</span>
                    <span className="font-mono font-bold text-white">
                      ₹{(acc.totalSettledAmountINR / 100000).toFixed(1)} L
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900">
                    <span className="text-slate-400 block text-[10px]">Held in Escrow</span>
                    <span className="font-mono font-bold text-amber-400">
                      ₹{(acc.currentEscrowBalanceINR / 100000).toFixed(1)} L
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px] text-slate-500">
                  <span>Hold: {acc.holdingPeriodDays} days after trip</span>
                  <button
                    onClick={() =>
                      showToast(`Dispatched Razorpay Route ping to ${acc.id}`)
                    }
                    className="text-indigo-400 hover:text-indigo-300 font-bold"
                  >
                    Test Webhook
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CATEGORY SPLIT RULES TAB */}
      {activeSubTab === "rules" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                Category Split Rules &amp; Escrow Policies
              </h3>
              <p className="text-xs text-slate-400">
                Automated multi-party split formulas applied when orders are created via Razorpay Route
              </p>
            </div>
            <button
              onClick={() => showToast("Split rule saved to central settlement database.")}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              Save Rule Configuration
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {rule.serviceCategory}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1">
                      {rule.name}
                    </h4>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.active}
                      onChange={() => {
                        setRules((prev) =>
                          prev.map((r) =>
                            r.id === rule.id ? { ...r, active: !r.active } : r
                          )
                        );
                        showToast(`Rule ${rule.id} status updated.`);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {/* Percentage Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Allocation Distribution:</span>
                    <span className="text-slate-300 font-bold font-mono">
                      {rule.vendorSharePercent}% + {rule.platformTakeRatePercent}% + {rule.agentSharePercent}% + {rule.tdsDeductionPercent}% = 100%
                    </span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden flex bg-slate-800">
                    <div
                      style={{ width: `${rule.vendorSharePercent}%` }}
                      className="bg-emerald-500 h-full"
                      title={`Vendor Share: ${rule.vendorSharePercent}%`}
                    />
                    <div
                      style={{ width: `${rule.platformTakeRatePercent}%` }}
                      className="bg-indigo-500 h-full"
                      title={`Platform Commission: ${rule.platformTakeRatePercent}%`}
                    />
                    <div
                      style={{ width: `${rule.agentSharePercent}%` }}
                      className="bg-amber-500 h-full"
                      title={`Agent Share: ${rule.agentSharePercent}%`}
                    />
                    <div
                      style={{ width: `${rule.tdsDeductionPercent}%` }}
                      className="bg-cyan-500 h-full"
                      title={`TDS Sec 194-O: ${rule.tdsDeductionPercent}%`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" /> Vendor ({rule.vendorSharePercent}%)
                    </span>
                    <span className="flex items-center gap-1 text-indigo-400 font-semibold">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" /> Platform ({rule.platformTakeRatePercent}%)
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <div className="w-2 h-2 rounded-full bg-amber-500" /> Agent ({rule.agentSharePercent}%)
                    </span>
                    <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                      <div className="w-2 h-2 rounded-full bg-cyan-500" /> TDS ({rule.tdsDeductionPercent}%)
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Escrow Release Trigger:</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-mono font-bold text-[10px]">
                      {rule.settlementHoldUntilEvent.replace(/_/g, " ").toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">GST on Convenience/Platform Fee:</span>
                    <span className="text-white font-mono font-bold">
                      {rule.gstOnPlatformFeePercent}% (Form GSTR-1)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ROUTE API SPLIT SIMULATOR TAB */}
      {activeSubTab === "simulator" && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/50 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Razorpay Route API Workbench &amp; Testbed
              </h3>
              <p className="text-xs text-slate-400">
                Simulate `POST /v1/orders` payloads with split transfers, HMAC-SHA256 signatures, and escrow parameters
              </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
              API v2 Sandbox
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Input parameters */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                Configure Test Split Order
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">
                    Booking Gross Amount (INR):
                  </label>
                  <input
                    type="number"
                    value={simAmount}
                    onChange={(e) => setSimAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">
                      Service Category:
                    </label>
                    <select
                      value={simCategory}
                      onChange={(e) => setSimCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Hotels & Lodges">Hotels &amp; Lodges</option>
                      <option value="Flights">Flights</option>
                      <option value="Bus Tickets">Bus Tickets</option>
                      <option value="Pilgrimage Helicopter">Pilgrimage Helicopter</option>
                      <option value="Cabs & Rentals">Cabs &amp; Rentals</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">
                      Target Linked Sub-Merchant:
                    </label>
                    <select
                      value={simAccountId}
                      onChange={(e) => setSimAccountId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                    >
                      {accounts.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.businessName} ({a.id})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-400 mb-1">
                      Vendor Share %:
                    </label>
                    <input
                      type="number"
                      value={simVendorPct}
                      onChange={(e) => setSimVendorPct(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">
                      Platform Fee %:
                    </label>
                    <input
                      type="number"
                      value={simPlatformPct}
                      onChange={(e) => setSimPlatformPct(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">
                      Agent / TDS %:
                    </label>
                    <input
                      type="number"
                      value={simAgentPct}
                      onChange={(e) => setSimAgentPct(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={simHoldSettlement}
                      onChange={(e) => setSimHoldSettlement(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0 w-4 h-4"
                    />
                    <span className="text-slate-300 font-medium">
                      Enable Escrow Hold (`on_hold: true` until check-out / completion)
                    </span>
                  </label>
                </div>

                <button
                  onClick={handleRunSimulator}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer mt-4"
                >
                  <Zap className="w-4 h-4" />
                  <span>Execute Razorpay Route Split API Call</span>
                </button>
              </div>
            </div>

            {/* Simulated Output and JSON */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  API Response &amp; Transfers Array
                </h4>
                {simResult && (
                  <button
                    onClick={() => copyToClipboard(simResult.rawJson, "sim_json")}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON</span>
                  </button>
                )}
              </div>

              {simResult ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Simulated Order ID:</span>
                      <span className="font-mono font-bold text-indigo-400">
                        {simResult.orderId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Payment ID:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {simResult.paymentId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">HMAC Signature:</span>
                      <span className="font-mono text-slate-400 truncate max-w-[200px]">
                        {simResult.signature}
                      </span>
                    </div>
                  </div>

                  {/* Visual Split Cards */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 block">
                      Generated Transfers ({simResult.transfers.length}):
                    </span>
                    {simResult.transfers.map((tr) => (
                      <div
                        key={tr.id}
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-medium text-white block">
                            {tr.recipientName}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {tr.recipientAccountId} • Ref: {tr.id}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-white text-sm block">
                            ₹{tr.amountINR.toLocaleString()}
                          </span>
                          {tr.onHold ? (
                            <span className="text-[10px] text-amber-400 font-bold">
                              Escrow Held
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-400 font-bold">
                              Instant Routed
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Raw JSON viewer */}
                  <pre className="p-3 rounded-xl bg-slate-900 text-[10px] font-mono text-emerald-400 overflow-x-auto max-h-48 border border-slate-800">
                    {simResult.rawJson}
                  </pre>
                </div>
              ) : (
                <div className="p-8 text-center rounded-xl bg-slate-900/50 border border-dashed border-slate-800 text-xs text-slate-500 space-y-2">
                  <Split className="w-8 h-8 mx-auto text-slate-600" />
                  <p>Click "Execute Razorpay Route Split API Call" to simulate multi-party split payloads</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. AUTOMATED REFUND REVERSALS TAB */}
      {activeSubTab === "reversals" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 rounded-2xl bg-pink-950/30 border border-pink-800/40 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-pink-400" />
                Automated Split Refund &amp; Transfer Reversals
              </h3>
              <p className="text-xs text-slate-400">
                When a passenger cancels or amends a trip, Razorpay Route automatically claws back transfers from the vendor account and refunds the customer from the nodal pool
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-pink-500/20 text-pink-300 text-[10px] font-bold border border-pink-500/30">
              Clawback Rule Active
            </span>
          </div>

          <div className="space-y-3">
            {transactions
              .filter(
                (t) =>
                  t.status === "partially_reversed" ||
                  t.transfers.some((tr) => tr.reversalStatus === "partial")
              )
              .map((txn) => (
                <div
                  key={txn.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-mono font-bold text-white text-sm">
                        {txn.id} ({txn.bookingRef})
                      </span>
                      <p className="text-xs text-slate-400">
                        Passenger: {txn.customerName} • {txn.serviceCategory} • Gross ₹{txn.totalAmountINR.toLocaleString()}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[10px] font-bold">
                      Reversal Processed
                    </span>
                  </div>

                  <div className="divide-y divide-slate-800/60 rounded-xl bg-slate-900 border border-slate-800/80">
                    {txn.transfers.map((tr) => (
                      <div
                        key={tr.id}
                        className="p-3 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="text-white font-medium block">
                            {tr.recipientName}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            Transfer ID: {tr.id}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-white block">
                            Original: ₹{tr.amountINR.toLocaleString()}
                          </span>
                          {tr.reversalStatus === "partial" && (
                            <span className="font-mono text-pink-400 font-bold text-[11px] block">
                              Clawed Back: -₹{(tr.reversedAmountINR || 0).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Customer refund dispatched via NPCI UPI direct rails</span>
                    <button
                      onClick={() =>
                        showToast(`Re-synchronized ledger entries for ${txn.id}`)
                      }
                      className="text-indigo-400 hover:text-indigo-300 font-bold"
                    >
                      Audit Ledger Match
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* INSPECT TRANSACTION MODAL */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-5 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Split className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    Razorpay Route Split Breakdown
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedTxn.id} • {selectedTxn.bookingRef}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                className="p-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Order &amp; Customer</span>
                <span className="font-bold text-white block">{selectedTxn.customerName}</span>
                <span className="font-mono text-slate-400 text-[10px] block">{selectedTxn.orderId}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Total Transaction Amount</span>
                <span className="font-mono font-black text-emerald-400 text-lg block">
                  ₹{selectedTxn.totalAmountINR.toLocaleString()}
                </span>
                <span className="text-slate-400 text-[10px] block">Nodal Bank: HDFC Nariman Point</span>
              </div>
            </div>

            {/* Split Transfers List */}
            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                Multi-Party Split Transfers ({selectedTxn.transfers.length})
              </h4>
              <div className="space-y-2">
                {selectedTxn.transfers.map((tr) => (
                  <div
                    key={tr.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">
                        {tr.recipientName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 block">
                        Target Account: {tr.recipientAccountId} • Transfer Ref: {tr.id}
                      </span>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <div>
                        <span className="font-mono font-bold text-white text-sm block">
                          ₹{tr.amountINR.toLocaleString()}
                        </span>
                        {tr.onHold ? (
                          <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1 justify-end">
                            <Clock className="w-3 h-3" /> On Hold (Escrow)
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 justify-end">
                            <CheckCircle2 className="w-3 h-3" /> Settled
                          </span>
                        )}
                      </div>

                      {tr.onHold && (
                        <button
                          onClick={() => {
                            handleReleaseEscrow(selectedTxn.id, tr.id);
                            setSelectedTxn(null);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-colors cursor-pointer"
                        >
                          Release Now
                        </button>
                      )}

                      {!tr.onHold && tr.recipientRole === "vendor" && (
                        <button
                          onClick={() => {
                            handleTriggerReversal(selectedTxn.id, tr.id, 1000);
                            setSelectedTxn(null);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold text-[10px] transition-colors cursor-pointer"
                        >
                          Clawback ₹1,000
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTxn(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE LINKED ACCOUNT MODAL */}
      {showAddAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4 text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  Link New Sub-Merchant on Razorpay Route
                </h3>
              </div>
              <button
                onClick={() => setShowAddAccountModal(false)}
                className="p-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">
                  Business / Brand Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kedarnath Heli Flights LLP"
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">
                    Legal Entity Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Registered legal company"
                    value={newAccLegal}
                    onChange={(e) => setNewAccLegal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">
                    Service Category
                  </label>
                  <select
                    value={newAccCategory}
                    onChange={(e) =>
                      setNewAccCategory(
                        e.target.value as RazorpayLinkedAccount["category"]
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="hotel">Hotels &amp; Lodges</option>
                    <option value="airline">Airlines</option>
                    <option value="bus">Intercity Buses</option>
                    <option value="tour">Tour &amp; Helicopter</option>
                    <option value="cab">Cabs</option>
                    <option value="guide">Spiritual Guides</option>
                    <option value="agent">Travel Agent Sub-Desk</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">
                    PAN Number *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="e.g. AAACD1234F"
                    value={newAccPan}
                    onChange={(e) => setNewAccPan(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white uppercase font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">
                    GSTIN (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="15-digit GSTIN"
                    value={newAccGstin}
                    onChange={(e) => setNewAccGstin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white uppercase font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC Bank"
                    value={newAccBank}
                    onChange={(e) => setNewAccBank(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">
                    IFSC Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HDFC0000182"
                    value={newAccIfsc}
                    onChange={(e) => setNewAccIfsc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white uppercase font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">
                    Bank Account No.
                  </label>
                  <input
                    type="text"
                    placeholder="Account Number"
                    value={newAccNumber}
                    onChange={(e) => setNewAccNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">
                    Settlement Schedule
                  </label>
                  <select
                    value={newAccSchedule}
                    onChange={(e) =>
                      setNewAccSchedule(
                        e.target.value as RazorpayLinkedAccount["settlementSchedule"]
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="t_plus_1">T+1 (Default Next-Day)</option>
                    <option value="instant">T+0 Instant (Platinum Partners)</option>
                    <option value="t_plus_2">T+2 (High-Value Charters)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">
                    Escrow Holding Period (Days)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={newAccHoldDays}
                    onChange={(e) => setNewAccHoldDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddAccountModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 cursor-pointer"
                >
                  Register on Razorpay Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
