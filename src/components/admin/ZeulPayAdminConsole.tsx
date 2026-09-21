// src/components/admin/ZeulPayAdminConsole.tsx
// CONFIDENTIAL & STRICTLY RESTRICTED: Admin Console Only.
// NEVER display or expose at frontend/customer view.
// Manages Zeul Pay Gateway, Smart Split Payment System with Multiple Vendors, and Add Aggregator Capabilities.

import React, { useState } from "react";
import {
  CreditCard,
  Plus,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Layers,
  ArrowUpRight,
  Server,
  Lock,
  Building2,
  Zap,
  Activity,
  Trash2,
  AlertCircle,
  Eye,
  EyeOff,
  Filter,
  Percent,
  Users,
  ChevronDown,
  ChevronRight,
  Check,
  Building,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  ZeulAggregatorPartner,
  ZeulVendorAccount,
  ZeulVendorSplitShare,
  ZeulSplitRuleConfig,
  ZeulSplitTransactionRecord,
  ZeulGatewayNodalMetrics,
  ZeulPaymentChannel,
  ZeulSplitExecutionMode,
} from "../../types/zeulPayGateway";
import {
  INITIAL_ZEUL_METRICS,
  INITIAL_ZEUL_AGGREGATORS,
  INITIAL_ZEUL_VENDORS,
  INITIAL_ZEUL_SPLIT_RULES,
  INITIAL_ZEUL_TRANSACTIONS,
} from "../../data/zeulPayGatewayData";

interface ZeulPayAdminConsoleProps {
  onNotify: (message: string) => void;
}

export const ZeulPayAdminConsole: React.FC<ZeulPayAdminConsoleProps> = ({ onNotify }) => {
  const [activeSubTab, setActiveSubTab] = useState<
    "aggregators" | "vendors" | "split_rules" | "transactions" | "nodal_config"
  >("aggregators");

  // Metrics & Core State
  const [metrics, setMetrics] = useState<ZeulGatewayNodalMetrics>(INITIAL_ZEUL_METRICS);
  const [aggregators, setAggregators] = useState<ZeulAggregatorPartner[]>(INITIAL_ZEUL_AGGREGATORS);
  const [vendors, setVendors] = useState<ZeulVendorAccount[]>(INITIAL_ZEUL_VENDORS);
  const [splitRules, setSplitRules] = useState<ZeulSplitRuleConfig[]>(INITIAL_ZEUL_SPLIT_RULES);
  const [transactions, setTransactions] = useState<ZeulSplitTransactionRecord[]>(INITIAL_ZEUL_TRANSACTIONS);

  // Modals & UI States
  const [showAddAggregatorModal, setShowAddAggregatorModal] = useState(false);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});
  const [expandedTxnId, setExpandedTxnId] = useState<string | null>("ZEUL-TXN-998201");

  // Filter states
  const [filterVertical, setFilterVertical] = useState<string>("ALL");
  const [filterVendorCategory, setFilterVendorCategory] = useState<string>("ALL");

  // New Aggregator Form State
  const [newAggName, setNewAggName] = useState("");
  const [newAggCode, setNewAggCode] = useState("");
  const [newMerchantId, setNewMerchantId] = useState("");
  const [newApiKey, setNewApiKey] = useState("");
  const [newPriorityWeight, setNewPriorityWeight] = useState<number>(20);
  const [newDailyLimitINR, setNewDailyLimitINR] = useState<number>(20000000);
  const [newFeePercent, setNewFeePercent] = useState<number>(1.2);
  const [newFixedFeeINR, setNewFixedFeeINR] = useState<number>(0);
  const [newSettlementTurnaround, setNewSettlementTurnaround] = useState<"T+0_INSTANT" | "T+1_RTGS" | "T+2_NEFT">("T+1_RTGS");
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [newPanMasked, setNewPanMasked] = useState("");
  const [newGstinMasked, setNewGstinMasked] = useState("");
  const [newEscrowAcc, setNewEscrowAcc] = useState("");
  const [newChannels, setNewChannels] = useState<ZeulPaymentChannel[]>([
    "UPI_AUTO_COLLECT",
    "NET_BANKING_MULTI_RAIL",
  ]);

  // New Vendor Form State
  const [newVendorName, setNewVendorName] = useState("");
  const [newVendorCategory, setNewVendorCategory] = useState<ZeulVendorAccount["vendorCategory"]>("HOTELS");
  const [newAccountHolder, setNewAccountHolder] = useState("");
  const [newBankName, setNewBankName] = useState("HDFC Bank");
  const [newAccountNum, setNewAccountNum] = useState("");
  const [newIfsc, setNewIfsc] = useState("");
  const [newPan, setNewPan] = useState("");
  const [newGstin, setNewGstin] = useState("");
  const [newContactPerson, setNewContactPerson] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newInstantSettlement, setNewInstantSettlement] = useState(true);

  // New Split Rule Form State (supporting multi-vendor allocation)
  const [ruleName, setRuleName] = useState("");
  const [ruleVertical, setRuleVertical] = useState<ZeulSplitRuleConfig["verticalCategory"]>("MULTI_VENDOR_COMBO");
  const [ruleAggregatorId, setRuleAggregatorId] = useState(aggregators[0]?.id || "ZEUL-AGG-001");
  const [ruleMode, setRuleMode] = useState<ZeulSplitExecutionMode>("AUTOMATIC_REALTIME");
  const [takeRate, setTakeRate] = useState<number>(10.0);
  const [vendorShare, setVendorShare] = useState<number>(90.0);
  const [agentIncentive, setAgentIncentive] = useState<number>(0.0);
  const [holdEvent, setHoldEvent] = useState<ZeulSplitRuleConfig["holdUntilEvent"]>("CHECK_IN_COMPLETED");
  const [holdHours, setHoldHours] = useState<number>(12);
  const [isMultiVendorRule, setIsMultiVendorRule] = useState(true);

  // Multi-vendor allocation builder inside rule modal
  const [multiVendorAllocations, setMultiVendorAllocations] = useState<
    Array<{
      vendorId: string;
      splitPercentage: number;
      settlementSchedule: "IMMEDIATE_T0" | "AFTER_CHECKIN" | "JOURNEY_END" | "T1_BATCH";
      escrowReleaseWindowHours: number;
    }>
  >([
    {
      vendorId: vendors[0]?.vendorId || "VND-HTL-KHYBER",
      splitPercentage: 60,
      settlementSchedule: "AFTER_CHECKIN",
      escrowReleaseWindowHours: 12,
    },
    {
      vendorId: vendors[2]?.vendorId || "VND-CAB-VALLEY",
      splitPercentage: 20,
      settlementSchedule: "IMMEDIATE_T0",
      escrowReleaseWindowHours: 0,
    },
    {
      vendorId: vendors[3]?.vendorId || "VND-EXP-SHIKARA",
      splitPercentage: 10,
      settlementSchedule: "IMMEDIATE_T0",
      escrowReleaseWindowHours: 0,
    },
  ]);

  const toggleChannelSelection = (ch: ZeulPaymentChannel) => {
    if (newChannels.includes(ch)) {
      setNewChannels(newChannels.filter((c) => c !== ch));
    } else {
      setNewChannels([...newChannels, ch]);
    }
  };

  const handleAddAggregatorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAggName.trim() || !newMerchantId.trim()) {
      onNotify("Please provide a valid Aggregator Name and Merchant ID.");
      return;
    }

    const generatedId = `ZEUL-AGG-00${aggregators.length + 1}`;
    const newAgg: ZeulAggregatorPartner = {
      id: generatedId,
      aggregatorName: newAggName.trim(),
      aggregatorCode: newAggCode.trim() || newAggName.trim().toUpperCase().replace(/\s+/g, "_"),
      merchantId: newMerchantId.trim(),
      clientIdMasked: newApiKey ? `${newApiKey.slice(0, 4)}••••••••${newApiKey.slice(-4)}` : "zeul_live_••••••••0091",
      status: "ACTIVE",
      supportedChannels: newChannels.length > 0 ? newChannels : ["UPI_AUTO_COLLECT", "NET_BANKING_MULTI_RAIL"],
      priorityWeight: Number(newPriorityWeight) || 10,
      dailyGmvLimitINR: Number(newDailyLimitINR) || 10000000,
      currentGmvTodayINR: 0,
      feePercentage: Number(newFeePercent) || 1.25,
      fixedFeeINR: Number(newFixedFeeINR) || 0,
      healthLatencyMs: Math.floor(45 + Math.random() * 25),
      successRatePercent: 99.5,
      settlementTurnaround: newSettlementTurnaround,
      webhookEndpointUrl: newWebhookUrl.trim() || `https://api.bharatyatra.internal/zeul/v1/webhook/${generatedId.toLowerCase()}`,
      contactEmail: `partner-desk@${newAggName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      panNumberMasked: newPanMasked || "AAACZ••••M",
      gstinMasked: newGstinMasked || "07AAACZ8819Q1Z8",
      escrowNodalAccount: newEscrowAcc || `HDFC-ESCROW-${Math.floor(1000 + Math.random() * 9000)}-ZEUL`,
      createdAt: new Date().toISOString(),
    };

    setAggregators((prev) => [newAgg, ...prev]);
    setMetrics((prev) => ({
      ...prev,
      totalAggregatorsCount: prev.totalAggregatorsCount + 1,
      activeAggregatorsCount: prev.activeAggregatorsCount + 1,
    }));

    // Reset Form
    setNewAggName("");
    setNewAggCode("");
    setNewMerchantId("");
    setNewApiKey("");
    setNewWebhookUrl("");
    setNewPanMasked("");
    setNewGstinMasked("");
    setNewEscrowAcc("");
    setShowAddAggregatorModal(false);

    onNotify(`Aggregator "${newAgg.aggregatorName}" (${generatedId}) successfully configured on Zeul Pay Gateway!`);
  };

  const handleAddVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorName.trim() || !newAccountHolder.trim() || !newAccountNum.trim()) {
      onNotify("Please provide complete vendor business name and banking details.");
      return;
    }

    const generatedVendorId = `VND-${newVendorCategory.slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newVendor: ZeulVendorAccount = {
      vendorId: generatedVendorId,
      businessName: newVendorName.trim(),
      vendorCategory: newVendorCategory,
      nodalVirtualAccountId: `VA_NODAL_ZEUL_${Math.floor(10000 + Math.random() * 89999)}`,
      bankAccountMasked: `${newBankName} •••• ${newAccountNum.slice(-4) || "8812"}`,
      ifscCode: newIfsc.trim().toUpperCase() || "HDFC0001892",
      accountHolderName: newAccountHolder.trim(),
      panMasked: newPan.trim().toUpperCase() || "AAACV••••K",
      gstinMasked: newGstin.trim().toUpperCase() || "07AAACV4401M1Z8",
      tdsApplicablePercent: 1.0,
      instantSettlementEnabled: newInstantSettlement,
      kycStatus: "VERIFIED",
      preferredAggregatorId: "ZEUL-AGG-001",
      totalGrossDisbursedINR: 0,
      pendingEscrowBalanceINR: 0,
      contactPerson: newContactPerson.trim() || "Operations Head",
      contactPhone: newContactPhone.trim() || "+91 98000 00000",
    };

    setVendors((prev) => [newVendor, ...prev]);
    setMetrics((prev) => ({
      ...prev,
      totalVendorsCount: prev.totalVendorsCount + 1,
      activeVendorsCount: prev.activeVendorsCount + 1,
    }));

    // Reset Form
    setNewVendorName("");
    setNewAccountHolder("");
    setNewAccountNum("");
    setNewIfsc("");
    setNewPan("");
    setNewGstin("");
    setNewContactPerson("");
    setNewContactPhone("");
    setShowAddVendorModal(false);

    onNotify(`Vendor "${newVendor.businessName}" (${generatedVendorId}) verified and onboarded for split disbursements.`);
  };

  const handleAddSplitRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) {
      onNotify("Please provide a name for the split payment rule.");
      return;
    }

    let allocatedVendorShares: ZeulVendorSplitShare[] | undefined = undefined;
    let computedVendorTotal = Number(vendorShare);

    if (isMultiVendorRule) {
      computedVendorTotal = multiVendorAllocations.reduce((acc, curr) => acc + curr.splitPercentage, 0);
      allocatedVendorShares = multiVendorAllocations.map((alloc) => {
        const found = vendors.find((v) => v.vendorId === alloc.vendorId);
        return {
          vendorId: alloc.vendorId,
          vendorName: found?.businessName || alloc.vendorId,
          vendorCategory: found?.vendorCategory || "OTHER",
          bankAccountMasked: found?.bankAccountMasked || "Verified Virtual Account",
          splitPercentage: alloc.splitPercentage,
          settlementSchedule: alloc.settlementSchedule,
          escrowReleaseWindowHours: alloc.escrowReleaseWindowHours,
        };
      });
    }

    const newRule: ZeulSplitRuleConfig = {
      id: `ZEUL-RULE-${ruleVertical}-${Math.floor(10 + Math.random() * 89)}`,
      ruleName: ruleName.trim(),
      verticalCategory: ruleVertical,
      aggregatorId: ruleAggregatorId,
      splitExecutionMode: ruleMode,
      platformTakeRatePercent: Number(takeRate),
      partnerVendorSharePercent: computedVendorTotal,
      agentIncentivePercent: Number(agentIncentive),
      tdsSec194OPercent: 1.0,
      gstOnCommissionPercent: 18.0,
      holdUntilEvent: holdEvent,
      escrowReleaseWindowHours: Number(holdHours),
      isActive: true,
      isMultiVendorSplit: isMultiVendorRule,
      vendorAllocations: allocatedVendorShares,
      notes: isMultiVendorRule
        ? `Multi-vendor atomic split across ${multiVendorAllocations.length} partners (Vendor total: ${computedVendorTotal}%, Platform: ${takeRate}%).`
        : `Single vendor nodal split with ${takeRate}% platform take-rate.`,
    };

    setSplitRules((prev) => [newRule, ...prev]);
    setRuleName("");
    setShowAddRuleModal(false);
    onNotify(`Split Rule "${newRule.ruleName}" activated on Zeul Pay Engine!`);
  };

  const toggleAggregatorStatus = (id: string) => {
    setAggregators((prev) =>
      prev.map((agg) => {
        if (agg.id === id) {
          const nextStatus = agg.status === "ACTIVE" ? "STANDBY" : "ACTIVE";
          return { ...agg, status: nextStatus };
        }
        return agg;
      })
    );
    onNotify(`Aggregator ${id} status updated.`);
  };

  const deleteAggregator = (id: string) => {
    setAggregators((prev) => prev.filter((a) => a.id !== id));
    onNotify(`Aggregator ${id} detached from Zeul Pay routing.`);
  };

  const toggleRuleActive = (id: string) => {
    setSplitRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
    onNotify(`Split rule status updated.`);
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filterVertical === "ALL") return true;
    return t.splitRuleId.includes(filterVertical);
  });

  const filteredVendors = vendors.filter((v) => {
    if (filterVendorCategory === "ALL") return true;
    return v.vendorCategory === filterVendorCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* SECURITY BANNER */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-950 to-slate-950 border border-amber-500/40 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                Admin Console Internal Engine
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-black uppercase">
                Never Displayed at Frontend
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Zeul Pay Gateway &bull; Multi-Vendor Split Payouts &bull; Multi-Aggregator Cascading &bull; RBI Nodal Escrow Compliance
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMetrics((prev) => ({
                ...prev,
                lastUpdated: new Date().toISOString(),
                avgGatewaySuccessRate: +(99.3 + Math.random() * 0.5).toFixed(2),
              }));
              onNotify("Zeul Pay Gateway telemetry and vendor nodal balances re-synchronized.");
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sync Rails &amp; Balances</span>
          </button>
        </div>
      </div>

      {/* TOP STATS STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Processed GMV</span>
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Zap className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-white font-mono mt-1">
            ₹{(metrics.totalProcessedGmvINR / 10000000).toFixed(2)} Cr
          </p>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            <span>Success Rate {metrics.avgGatewaySuccessRate}%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Connected Aggregators</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Server className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono mt-1">
            {metrics.activeAggregatorsCount} / {metrics.totalAggregatorsCount}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Auto-Failover Multi-Switch
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Onboarded Vendors</span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-purple-400 font-mono mt-1">
            {vendors.length} Vendors
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            RBI Virtual Accounts Linked
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today Split Payouts</span>
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Percent className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-cyan-400 font-mono mt-1">
            ₹{(metrics.totalSplitTransfersTodayINR / 100000).toFixed(2)} Lakhs
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Multiple Vendors &bull; TDS Sec 194-O
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Escrow Held Balance</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono mt-1">
            ₹{(metrics.escrowHeldBalanceINR / 10000000).toFixed(2)} Cr
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Milestone &amp; QR Check-in Release
          </p>
        </div>
      </div>

      {/* NAVIGATION SUB-TABS */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2 gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: "aggregators" as const, label: "Connected Aggregators & Rails", count: aggregators.length },
            { id: "vendors" as const, label: "Multiple Vendors Directory", count: vendors.length },
            { id: "split_rules" as const, label: "Multi-Vendor Split Rules", count: splitRules.length },
            { id: "transactions" as const, label: "Split Settlements Ledger", count: transactions.length },
            { id: "nodal_config" as const, label: "Nodal Escrow & Cascade Architecture" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeSubTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    activeSubTab === tab.id ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === "aggregators" && (
            <button
              onClick={() => setShowAddAggregatorModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-slate-950" />
              <span>Add Aggregator</span>
            </button>
          )}

          {activeSubTab === "vendors" && (
            <button
              onClick={() => setShowAddVendorModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-95 text-white font-black text-xs flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>Onboard New Vendor</span>
            </button>
          )}

          {activeSubTab === "split_rules" && (
            <button
              onClick={() => setShowAddRuleModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Multi-Vendor Rule</span>
            </button>
          )}
        </div>
      </div>

      {/* SUB-TAB 1: CONNECTED AGGREGATORS */}
      {activeSubTab === "aggregators" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-400" />
                Active Multi-Aggregator Switches on Zeul Pay
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Zeul dynamically balances checkout volumes and multi-vendor splits across these enterprise payment rails.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
                Primary Switch: <strong className="text-emerald-400">ZEUL-DIRECT-NODAL</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aggregators.map((agg) => {
              const isRevealed = revealedSecrets[agg.id] || false;
              return (
                <div
                  key={agg.id}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-sm relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {agg.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            agg.status === "ACTIVE"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {agg.status}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {agg.priorityWeight}% Traffic Weight
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-white flex items-center gap-2">
                        {agg.aggregatorName}
                      </h5>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleAggregatorStatus(agg.id)}
                        title="Toggle Active/Standby"
                        className={`p-1.5 rounded-lg border text-xs font-bold transition-colors ${
                          agg.status === "ACTIVE"
                            ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                            : "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500"
                        }`}
                      >
                        <Sliders className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteAggregator(agg.id)}
                        title="Delete aggregator"
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 border border-slate-700 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Negotiated MDR</span>
                      <strong className="text-amber-400 font-mono">{agg.feePercentage}%</strong>
                      {agg.fixedFeeINR > 0 && (
                        <span className="text-[10px] text-slate-400"> + ₹{agg.fixedFeeINR}</span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Settlement</span>
                      <strong className="text-indigo-300 font-mono">{agg.settlementTurnaround.replace("_", " ")}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Avg Latency</span>
                      <strong className="text-emerald-400 font-mono">{agg.healthLatencyMs}ms</strong>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center bg-slate-900/70 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[11px]">Merchant ID (MID):</span>
                      <span className="font-mono text-white font-bold text-[11px]">{agg.merchantId}</span>
                    </div>

                    <div className="flex justify-between items-center bg-slate-900/70 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[11px]">API Key / Secret:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-indigo-300 text-[11px]">
                          {isRevealed ? "zeul_live_sec_994108823" : agg.clientIdMasked}
                        </span>
                        <button
                          onClick={() =>
                            setRevealedSecrets((prev) => ({
                              ...prev,
                              [agg.id]: !isRevealed,
                            }))
                          }
                          className="text-slate-400 hover:text-slate-200"
                        >
                          {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-slate-900/70 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[11px]">Nodal Escrow Virtual A/C:</span>
                      <span className="font-mono text-cyan-300 text-[11px]">{agg.escrowNodalAccount}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                      Enabled Payment Channels on this Aggregator:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {agg.supportedChannels.map((ch) => (
                        <span
                          key={ch}
                          className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-mono"
                        >
                          {ch.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Daily GMV Cap: ₹{(agg.dailyGmvLimitINR / 10000000).toFixed(1)} Cr</span>
                    <button
                      onClick={() => onNotify(`Ping dispatched to ${agg.webhookEndpointUrl}. Status: 200 OK (38ms).`)}
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px] font-bold"
                    >
                      <Activity className="w-3 h-3" />
                      Test Webhook
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MULTIPLE VENDORS DIRECTORY */}
      {activeSubTab === "vendors" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                Multiple Vendors Nodal Disbursement Directory
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Every verified vendor receives a dedicated RBI Nodal Virtual Account. Zeul Pay calculates atomic split shares, withholds 1% TDS Sec 194-O, and disburses net amounts automatically.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterVendorCategory}
                onChange={(e) => setFilterVendorCategory(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-bold"
              >
                <option value="ALL">All Travel Verticals</option>
                <option value="HOTELS">Hotels &amp; Resorts</option>
                <option value="HOUSEBOATS">Houseboats</option>
                <option value="CABS">Cabs &amp; Fleets</option>
                <option value="SAFARI">Wildlife Safari</option>
                <option value="YATRAS">Spiritual Yatras</option>
                <option value="TOURS">Heritage Tours</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVendors.map((vnd) => (
              <div
                key={vnd.vendorId}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-3.5 shadow-sm relative"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {vnd.vendorCategory}
                    </span>
                    <h5 className="text-sm font-bold text-white mt-1.5">{vnd.businessName}</h5>
                    <span className="text-[10px] text-slate-400 font-mono">{vnd.vendorId}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold">
                    {vnd.kycStatus}
                  </span>
                </div>

                <div className="space-y-1 text-xs border-y border-slate-800/80 py-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">Nodal Virtual A/C:</span>
                    <strong className="text-cyan-300 font-mono text-[11px]">{vnd.nodalVirtualAccountId}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">Bank Account:</span>
                    <span className="text-white font-mono text-[11px]">{vnd.bankAccountMasked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">IFSC Code:</span>
                    <span className="text-slate-300 font-mono text-[11px]">{vnd.ifscCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">PAN / GSTIN:</span>
                    <span className="text-slate-300 font-mono text-[10px]">{vnd.panMasked} &bull; {vnd.gstinMasked}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Total Disbursed</span>
                    <strong className="text-emerald-400 font-mono text-sm">
                      ₹{(vnd.totalGrossDisbursedINR / 100000).toFixed(1)}L
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">In Escrow Lock</span>
                    <strong className="text-amber-400 font-mono text-sm">
                      ₹{(vnd.pendingEscrowBalanceINR / 1000).toFixed(0)}k
                    </strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Contact: {vnd.contactPerson}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{vnd.contactPhone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SPLIT PAYMENT RULES ENGINE (WITH MULTI-VENDOR ALLOCATION) */}
      {activeSubTab === "split_rules" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Percent className="w-4 h-4 text-cyan-400" />
                Zeul Multi-Vendor Split Formula Configurations
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure atomic split allocations across multiple vendors (e.g. Hotel + Cab + Guide), platform commission, and statutory TDS Sec 194-O.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
              Statutory TDS: <strong className="text-amber-400">1.0% Sec 194-O</strong>
            </span>
          </div>

          <div className="space-y-3">
            {splitRules.map((rule) => {
              const boundAgg = aggregators.find((a) => a.id === rule.aggregatorId);
              return (
                <div
                  key={rule.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {rule.verticalCategory}
                      </span>
                      {rule.isMultiVendorSplit && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          Multi-Vendor Split ({rule.vendorAllocations?.length || 3} Partners)
                        </span>
                      )}
                      <h5 className="text-sm font-bold text-white">{rule.ruleName}</h5>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleRuleActive(rule.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer uppercase ${
                          rule.isActive
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {rule.isActive ? "ACTIVE" : "PAUSED"}
                      </button>
                      <button
                        onClick={() => {
                          setSplitRules((prev) => prev.filter((r) => r.id !== rule.id));
                          onNotify(`Rule ${rule.id} deleted.`);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Multi-Vendor Allocation Breakdown */}
                  {rule.isMultiVendorSplit && rule.vendorAllocations && (
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                      <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                        Atomic Multi-Vendor Distribution Breakdown:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {rule.vendorAllocations.map((alloc) => (
                          <div
                            key={alloc.vendorId}
                            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-[11px] font-bold text-white truncate max-w-[160px]">
                                {alloc.vendorName}
                              </span>
                              <span className="text-xs font-mono font-black text-emerald-400">
                                {alloc.splitPercentage}%
                              </span>
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                              <span>{alloc.bankAccountMasked}</span>
                              <span className="text-amber-400">{alloc.settlementSchedule}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-slate-800/80">
                    <div className="flex flex-wrap items-center gap-4 text-slate-300 font-mono text-[11px]">
                      <span>
                        Platform Take: <strong className="text-amber-400">{rule.platformTakeRatePercent}%</strong>
                      </span>
                      <span>
                        Vendor Pool: <strong className="text-emerald-400">{rule.partnerVendorSharePercent}%</strong>
                      </span>
                      <span>
                        Agent Incentive: <strong>{rule.agentIncentivePercent}%</strong>
                      </span>
                      <span>
                        TDS (Sec 194-O): <strong className="text-cyan-400">{rule.tdsSec194OPercent}%</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="text-slate-400 font-mono">
                        Rail: <strong className="text-white">{boundAgg?.aggregatorName || rule.aggregatorId}</strong>
                      </span>
                      <span className="text-slate-400 font-mono">
                        Release: <strong className="text-indigo-300">{rule.holdUntilEvent.replace(/_/g, " ")}</strong> ({rule.escrowReleaseWindowHours}h)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: SPLIT SETTLEMENTS LEDGER (WITH MULTI-VENDOR EXPANSION) */}
      {activeSubTab === "transactions" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                Zeul Multi-Vendor Split Payouts &amp; Nodal Ledger
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time stream of collections and automated atomic disbursements across multiple vendors for individual bookings. Click any row to view granular vendor splits.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterVertical}
                onChange={(e) => setFilterVertical(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-bold"
              >
                <option value="ALL">All Categories</option>
                <option value="MULTI">Multi-Vendor Combos</option>
                <option value="HTL">Hotels &amp; Resorts</option>
                <option value="HB">Houseboats</option>
                <option value="SAFARI">Wildlife Safari</option>
                <option value="TOURS">Yatras &amp; Tours</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-[10px] text-slate-400 uppercase font-black tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 w-8"></th>
                  <th className="py-3 px-4">Txn / Zeul Ref</th>
                  <th className="py-3 px-4">Booking Ref &amp; Customer</th>
                  <th className="py-3 px-4">Gross Collected</th>
                  <th className="py-3 px-4">Vendor Pool Payout</th>
                  <th className="py-3 px-4">Platform Take</th>
                  <th className="py-3 px-4">TDS (194-O)</th>
                  <th className="py-3 px-4">Escrow Status</th>
                  <th className="py-3 px-4 text-right">Bank UTR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredTransactions.map((tx) => {
                  const isExpanded = expandedTxnId === tx.id;
                  return (
                    <React.Fragment key={tx.id}>
                      <tr
                        onClick={() => setExpandedTxnId(isExpanded ? null : tx.id)}
                        className="hover:bg-slate-900/40 transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4 text-slate-400">
                          {isExpanded ? <ChevronDown className="w-4 h-4 text-indigo-400" /> : <ChevronRight className="w-4 h-4" />}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-white font-bold block">{tx.id}</span>
                          <span className="text-[10px] font-mono text-indigo-400">{tx.zeulReferenceId}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white block">{tx.customerName}</span>
                            {tx.isMultiVendor && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30">
                                Multi-Vendor
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{tx.bookingRef}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-black text-white text-sm">
                            ₹{tx.totalGrossAmountINR.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-0.5">
                            <span className="font-mono font-black text-emerald-400 text-sm">
                              ₹{tx.partnerDisbursementINR.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[200px]">
                              {tx.partnerBeneficiaryName}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-indigo-400">
                            ₹{tx.platformFeeINR.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-amber-400">
                            ₹{tx.taxTdsINR.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              tx.status === "SPLIT_COMPLETED"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : tx.status === "ESCROW_HELD"
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {tx.status.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-[10px] text-slate-400">
                          {tx.nodalEscrowUtr || "Pending UTR"}
                        </td>
                      </tr>

                      {/* EXPANDED MULTI-VENDOR DISBURSEMENT BREAKDOWN */}
                      {isExpanded && tx.vendorBreakdown && (
                        <tr className="bg-slate-900/60 border-y border-indigo-500/30">
                          <td colSpan={9} className="p-4">
                            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                                  <Users className="w-3.5 h-3.5" />
                                  Multi-Vendor Settlement Breakdown for Booking {tx.bookingRef}
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  Disbursed via Nodal Rail: <strong>{tx.aggregatorName}</strong>
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {tx.vendorBreakdown.map((vb) => (
                                  <div
                                    key={vb.vendorId}
                                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <span className="text-xs font-bold text-white block">{vb.vendorName}</span>
                                        <span className="text-[10px] text-slate-400">{vb.vendorRole}</span>
                                      </div>
                                      <span
                                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                                          vb.status === "SETTLED"
                                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                        }`}
                                      >
                                        {vb.status}
                                      </span>
                                    </div>

                                    <div className="space-y-1 text-xs font-mono pt-1 border-t border-slate-800/80">
                                      <div className="flex justify-between text-slate-400">
                                        <span>Gross Allocated:</span>
                                        <span className="text-white">₹{vb.grossAllocatedINR.toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between text-slate-400">
                                        <span>TDS Sec 194-O (1%):</span>
                                        <span className="text-amber-400">-₹{vb.tdsDeductedINR.toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between text-slate-300 font-bold">
                                        <span>Net Payout:</span>
                                        <span className="text-emerald-400 font-black">
                                          ₹{vb.netDisbursedINR.toLocaleString()}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-1">
                                      <span>{vb.accountMasked}</span>
                                      <span className="text-indigo-300">{vb.nodalEscrowUtr}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: NODAL ESCROW & CASCADE ARCHITECTURE */}
      {activeSubTab === "nodal_config" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Zeul Pay Smart Cascading Architecture
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              When a traveler completes checkout on BharatYatra, the backend invokes Zeul Pay Nodal Switch. 
              Zeul evaluates aggregator latency, MDR fee, and active downtime health to automatically route 
              the intent through the optimal aggregator without exposing technical routing to the frontend.
            </p>
            <div className="space-y-2 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300 font-semibold">1. Primary Route: Zeul Direct Nodal</span>
                <span className="text-emerald-400 font-mono font-bold">45% Traffic &bull; 48ms</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300 font-semibold">2. Secondary Route: PayU Enterprise Hub</span>
                <span className="text-indigo-400 font-mono font-bold">30% Traffic &bull; 65ms</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300 font-semibold">3. Tertiary Rail: BillDesk Banking Rails</span>
                <span className="text-cyan-400 font-mono font-bold">25% Traffic &bull; 58ms</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300 font-semibold">4. Standby Failover: CCAvenue Global Rail</span>
                <span className="text-slate-400 font-mono font-bold">Cold Standby &bull; 82ms</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              RBI Nodal Escrow &amp; Multi-Vendor Withholding
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Under RBI Guidelines on Payment Aggregators (PA-PG) and Section 194-O of the Income Tax Act:
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Customer funds are settled directly into the designated RBI Nodal Escrow Account.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Multiple vendor shares are calculated atomically and segregated instantly upon booking confirmation.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>1% TDS under Section 194-O is automatically calculated on vendor gross and credited to the government portal.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Milestone verification unlocks escrow upon hotel QR check-in or chauffeur tour trip completion.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ADD AGGREGATOR MODAL */}
      {showAddAggregatorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-amber-400" />
                  Connect New Payment Aggregator Partner
                </h3>
                <p className="text-xs text-slate-400">
                  Integrate an external gateway aggregator into Zeul Pay smart routing.
                </p>
              </div>
              <button
                onClick={() => setShowAddAggregatorModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAggregatorSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Aggregator Partner Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Razorpay Route Hub, Juspay Switch"
                    value={newAggName}
                    onChange={(e) => setNewAggName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white placeholder:text-slate-600 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Internal Routing Code</label>
                  <input
                    type="text"
                    placeholder="e.g. RAZORPAY_ROUTE_01"
                    value={newAggCode}
                    onChange={(e) => setNewAggCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white placeholder:text-slate-600 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Merchant ID (MID) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MID_RZP_ENT_99812"
                    value={newMerchantId}
                    onChange={(e) => setNewMerchantId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white placeholder:text-slate-600 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Live API Secret / Key</label>
                  <input
                    type="password"
                    placeholder="rzp_live_••••••••••••••••"
                    value={newApiKey}
                    onChange={(e) => setNewApiKey(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white placeholder:text-slate-600 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Traffic Priority Weight (1 - 100)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newPriorityWeight}
                    onChange={(e) => setNewPriorityWeight(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-amber-400 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Negotiated MDR Fee (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newFeePercent}
                    onChange={(e) => setNewFeePercent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Settlement Turnaround</label>
                  <select
                    value={newSettlementTurnaround}
                    onChange={(e) => setNewSettlementTurnaround(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="T+0_INSTANT">T+0 Instant RTGS</option>
                    <option value="T+1_RTGS">T+1 Bank RTGS</option>
                    <option value="T+2_NEFT">T+2 NEFT Standard</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Daily GMV Limit (INR)</label>
                  <input
                    type="number"
                    value={newDailyLimitINR}
                    onChange={(e) => setNewDailyLimitINR(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">Webhook Listener Endpoint</label>
                <input
                  type="url"
                  placeholder="https://api.bharatyatra.internal/zeul/v1/webhook/..."
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white placeholder:text-slate-600 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddAggregatorModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg cursor-pointer"
                >
                  Deploy Aggregator to Zeul
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD VENDOR MODAL */}
      {showAddVendorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-purple-400" />
                  Onboard Vendor for Zeul Split Disbursements
                </h3>
                <p className="text-xs text-slate-400">
                  Provision an RBI Nodal Virtual Account for automated vendor payout splits.
                </p>
              </div>
              <button
                onClick={() => setShowAddVendorModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddVendorSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-300 font-bold block">Vendor Legal Business Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gulmarg Snow Adventure Guides Pvt Ltd"
                    value={newVendorName}
                    onChange={(e) => setNewVendorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white placeholder:text-slate-600 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Travel Vertical</label>
                  <select
                    value={newVendorCategory}
                    onChange={(e) => setNewVendorCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="HOTELS">Hotels &amp; Resorts</option>
                    <option value="HOUSEBOATS">Houseboats</option>
                    <option value="CABS">Cabs &amp; Chauffeur Fleet</option>
                    <option value="SAFARI">Wildlife Safari</option>
                    <option value="TOURS">Heritage &amp; Guides</option>
                    <option value="YATRAS">Spiritual Yatras</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Bank Beneficiary Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Account holder name"
                    value={newAccountHolder}
                    onChange={(e) => setNewAccountHolder(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white placeholder:text-slate-600 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Bank Name</label>
                  <input
                    type="text"
                    value={newBankName}
                    onChange={(e) => setNewBankName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Bank Account Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="Account Number"
                    value={newAccountNum}
                    onChange={(e) => setNewAccountNum(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">IFSC Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HDFC0001892"
                    value={newIfsc}
                    onChange={(e) => setNewIfsc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">PAN Number</label>
                  <input
                    type="text"
                    placeholder="e.g. AAACK4409L"
                    value={newPan}
                    onChange={(e) => setNewPan(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">GSTIN</label>
                  <input
                    type="text"
                    placeholder="e.g. 01AAACK4409J1Z9"
                    value={newGstin}
                    onChange={(e) => setNewGstin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Contact Person &amp; Phone</label>
                  <input
                    type="text"
                    placeholder="Manager Name, +91 98000 00000"
                    value={newContactPerson}
                    onChange={(e) => setNewContactPerson(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <input
                  type="checkbox"
                  id="instant-settlement"
                  checked={newInstantSettlement}
                  onChange={(e) => setNewInstantSettlement(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="instant-settlement" className="text-slate-300 cursor-pointer font-bold">
                  Enable Instant T+0 Nodal RTGS Settlement for this vendor
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddVendorModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black shadow-lg cursor-pointer"
                >
                  Onboard Vendor &amp; Generate Virtual A/C
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE MULTI-VENDOR SPLIT RULE MODAL */}
      {showAddRuleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Percent className="w-4 h-4 text-amber-400" />
                  Create Multi-Vendor Split Payment Rule
                </h3>
                <p className="text-xs text-slate-400">
                  Configure real-time automated split percentages across multiple vendors and platform take-rate.
                </p>
              </div>
              <button
                onClick={() => setShowAddRuleModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSplitRuleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">Rule Description / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kashmir All-Inclusive (Resort 60% + Cab 20% + Shikara 10% + Platform 10%)"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white placeholder:text-slate-600 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Vertical Category</label>
                  <select
                    value={ruleVertical}
                    onChange={(e) => setRuleVertical(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="MULTI_VENDOR_COMBO">Multi-Vendor Combo (Stay + Cab + Guide)</option>
                    <option value="HOTELS">Hotels &amp; Resorts</option>
                    <option value="HOUSEBOATS">Houseboats</option>
                    <option value="SAFARI">Wildlife Safari</option>
                    <option value="TOURS">Yatras &amp; Tours</option>
                    <option value="CABS">Cabs &amp; Fleets</option>
                    <option value="ALL">All Categories</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Bound Aggregator Rail</label>
                  <select
                    value={ruleAggregatorId}
                    onChange={(e) => setRuleAggregatorId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  >
                    {aggregators.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.aggregatorName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Platform Take-Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={takeRate}
                    onChange={(e) => setTakeRate(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-amber-400 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Escrow Release Event</label>
                  <select
                    value={holdEvent}
                    onChange={(e) => setHoldEvent(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="CHECK_IN_COMPLETED">Check-In Completed (QR Scanned)</option>
                    <option value="SERVICE_DELIVERED">Service Delivered (Trip Concluded)</option>
                    <option value="JOURNEY_CONCLUDED">Journey Concluded (Tour End)</option>
                    <option value="IMMEDIATE">Immediate (T+0)</option>
                  </select>
                </div>
              </div>

              {/* Multi-Vendor Allocation Switch & Builder */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    Configure Shares for Multiple Vendors
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Total Vendor Share: <strong className="text-emerald-400">
                      {multiVendorAllocations.reduce((acc, c) => acc + c.splitPercentage, 0)}%
                    </strong>
                  </span>
                </div>

                <div className="space-y-2">
                  {multiVendorAllocations.map((alloc, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-2"
                    >
                      <div className="flex-1 min-w-[180px]">
                        <label className="text-[10px] text-slate-400 block font-semibold">Vendor Partner {idx + 1}</label>
                        <select
                          value={alloc.vendorId}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMultiVendorAllocations((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, vendorId: val } : item))
                            );
                          }}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white text-xs font-bold"
                        >
                          {vendors.map((v) => (
                            <option key={v.vendorId} value={v.vendorId}>
                              {v.businessName} ({v.vendorCategory})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-24">
                        <label className="text-[10px] text-slate-400 block font-semibold">Share %</label>
                        <input
                          type="number"
                          step="1"
                          value={alloc.splitPercentage}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setMultiVendorAllocations((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, splitPercentage: val } : item))
                            );
                          }}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-emerald-400 font-bold text-xs"
                        />
                      </div>

                      <div className="w-32">
                        <label className="text-[10px] text-slate-400 block font-semibold">Release</label>
                        <select
                          value={alloc.settlementSchedule}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            setMultiVendorAllocations((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, settlementSchedule: val } : item))
                            );
                          }}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-slate-200 text-xs font-bold"
                        >
                          <option value="AFTER_CHECKIN">After Check-in</option>
                          <option value="IMMEDIATE_T0">Immediate T+0</option>
                          <option value="JOURNEY_END">Journey End</option>
                          <option value="T1_BATCH">T+1 Batch</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (multiVendorAllocations.length <= 1) {
                            onNotify("At least one vendor allocation must remain.");
                            return;
                          }
                          setMultiVendorAllocations((prev) => prev.filter((_, i) => i !== idx));
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 mt-3"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setMultiVendorAllocations((prev) => [
                        ...prev,
                        {
                          vendorId: vendors[0]?.vendorId || "VND-HTL-KHYBER",
                          splitPercentage: 10,
                          settlementSchedule: "AFTER_CHECKIN",
                          escrowReleaseWindowHours: 12,
                        },
                      ]);
                    }}
                    className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-dashed border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Add Another Vendor Share</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddRuleModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg cursor-pointer"
                >
                  Activate Multi-Vendor Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
