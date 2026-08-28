import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  PhoneCall,
  FileText,
  Percent,
  Layers,
  ArrowUpRight,
  Filter,
  Download,
  Award,
  Sparkles,
  AlertOctagon,
  RefreshCw,
  Building2,
  Check,
  Zap,
  HelpCircle,
} from "lucide-react";
import {
  CategoryCommissionRate,
  B2BCommercialPlan,
  QualifiedLeadValidationCheck,
  B2BAttributedLeadConversion,
  TelesalesPerformanceSummary,
  CATEGORY_COMMISSION_RATES,
  B2B_COMMERCIAL_PLANS,
  QUALIFIED_LEAD_RULES,
  INITIAL_ATTRIBUTED_LEADS,
  INITIAL_TELESALES_PERFORMANCE,
} from "../../data/b2bCommissionTelesalesData";

interface B2bCommissionTelesalesViewProps {
  onToast: (msg: string) => void;
}

export function B2bCommissionTelesalesView({ onToast }: B2bCommissionTelesalesViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<
    "commercial_plans" | "commission_matrix" | "telesales_dashboard" | "lead_attribution_ledger" | "lead_qualification_rules" | "settlement_payouts"
  >("commercial_plans");

  const [attributedLeads, setAttributedLeads] = useState<B2BAttributedLeadConversion[]>(INITIAL_ATTRIBUTED_LEADS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("growth");

  // Calculate live platform commercials
  const totalGMV = attributedLeads.reduce((acc, l) => acc + (l.bookingValueINR || 0), 0);
  const totalPlatformGrossCommission = attributedLeads.reduce((acc, l) => acc + l.grossCommissionINR, 0);
  const totalTelesalesIncentivesPaid = attributedLeads.reduce((acc, l) => acc + l.telesalesIncentiveINR, 0);
  const totalNetPlatformRevenue = totalPlatformGrossCommission - totalTelesalesIncentivesPaid;
  const totalPartnerSettled = attributedLeads.reduce((acc, l) => acc + l.partnerSettlementAmountINR, 0);

  // Handle Mark as Settled action
  const handleSettleLead = (leadId: string) => {
    setAttributedLeads((prev) =>
      prev.map((l) => (l.leadId === leadId ? { ...l, settlementStatus: "Settled" } : l))
    );
    onToast(`Marked Lead ${leadId} as Settled to Partner account via UPI/Escrow! 💳`);
  };

  // Handle Refund / Cancellation Reversal
  const handleReverseRefund = (leadId: string) => {
    setAttributedLeads((prev) =>
      prev.map((l) =>
        l.leadId === leadId
          ? {
              ...l,
              stage: "Cancelled / Refunded",
              settlementStatus: "Reversed_Refund",
              telesalesIncentiveINR: 0,
              netPlatformRevenueINR: 0,
              partnerSettlementAmountINR: 0,
            }
          : l
      )
    );
    onToast(`Processed Booking Cancellation & Commission Reversal for ${leadId}! 🔄`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-white">
                B2B Lead-Conversion &amp; Telesales Commercial Engine
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                Performance-Based Payouts
              </span>
              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold">
                Zero Financial Risk
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Dual Revenue Model: Agency Retainers + 5%–20% Conversion Commission + WFH Telesales Incentives.
            </p>
          </div>
        </div>

        {/* Financial Badges */}
        <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-700/80 text-xs shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Total Attributed GMV</span>
            <strong className="text-emerald-400 font-mono text-sm">₹{(totalGMV / 100000).toFixed(2)} Lakhs</strong>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Net Platform Margin</span>
            <strong className="text-white font-mono text-sm">₹{(totalNetPlatformRevenue / 1000).toFixed(1)}k</strong>
          </div>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-thin">
        {[
          { id: "commercial_plans", label: "B2B Commercial Plans", icon: Building2 },
          { id: "commission_matrix", label: "Category Commission Matrix", icon: Percent },
          { id: "telesales_dashboard", label: "Telesales Executive Terminal", icon: PhoneCall },
          { id: "lead_attribution_ledger", label: "Lead-to-Settlement Ledger", icon: Layers },
          { id: "lead_qualification_rules", label: "Qualified Lead Rulebook", icon: ShieldCheck },
          { id: "settlement_payouts", label: "Partner Settlements & Refunds", icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          const isAct = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isAct
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. B2B COMMERCIAL PLANS */}
      {activeSubTab === "commercial_plans" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-black text-white">Performance-Based Hybrid B2B Commercial Plans</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Partners pay only when qualified leads convert, with optional recurring listing and digital agency retainers.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              Contract Enforced • Escrow Protected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {B2B_COMMERCIAL_PLANS.map((plan) => {
              const isSel = selectedPlanId === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    isSel
                      ? "bg-emerald-950/40 border-emerald-500 shadow-xl shadow-emerald-900/20"
                      : "bg-slate-800/80 border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                        {plan.id.toUpperCase()}
                      </span>
                      {plan.recommendedBadge && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-black">
                          {plan.recommendedBadge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-base font-black text-white">{plan.name}</h4>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{plan.bestFor}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Monthly Fee:</span>
                        <strong className="text-white font-mono">
                          {plan.monthlyFeeINR === 0 ? "₹0 / mo" : `₹${plan.monthlyFeeINR.toLocaleString("en-IN")}/mo`}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Qualified Lead Fee:</span>
                        <strong className="text-indigo-300 font-mono">{plan.qualifiedLeadFeeRange}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Conversion Comm.:</span>
                        <strong className="text-emerald-400 font-mono">{plan.conversionCommissionRange}</strong>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Key Deliverables:</span>
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToast(`Selected ${plan.name} configuration for active travel vendor contracts! 📝`);
                    }}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSel
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
                        : "bg-slate-900 hover:bg-slate-700 text-slate-300"
                    }`}
                  >
                    {isSel ? "Active Plan Selected" : "Apply Commercial Plan"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. CATEGORY COMMISSION MATRIX */}
      {activeSubTab === "commission_matrix" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-black text-white">Travel Category Lead-Conversion Commission Matrix</h4>
                <p className="text-xs text-slate-400">
                  Standardized take-rate percentages calculated strictly upon confirmed payment and booking fulfillment.
                </p>
              </div>
              <span className="text-xs text-emerald-400 font-bold">13 Travel Verticals</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/90 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-700">
                  <tr>
                    <th className="p-3">Travel Category</th>
                    <th className="p-3">Take-Rate Range</th>
                    <th className="p-3">Platform Default %</th>
                    <th className="p-3">Avg Booking Value</th>
                    <th className="p-3">Platform Take-Rate (INR)</th>
                    <th className="p-3">Category Coverage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {CATEGORY_COMMISSION_RATES.map((cat) => (
                    <tr key={cat.category} className="hover:bg-slate-800/60 transition-colors">
                      <td className="p-3 font-bold text-white">{cat.category}</td>
                      <td className="p-3 font-mono text-indigo-300">
                        {cat.minCommissionPercent}% – {cat.maxCommissionPercent}%
                      </td>
                      <td className="p-3 font-mono">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                          {cat.defaultCommissionPercent}%
                        </span>
                      </td>
                      <td className="p-3 font-mono text-white">₹{cat.averageBookingValueINR.toLocaleString("en-IN")}</td>
                      <td className="p-3 font-mono font-bold text-emerald-400">
                        ₹{cat.averageCommissionINR.toLocaleString("en-IN")}
                      </td>
                      <td className="p-3 text-[11px] text-slate-400 max-w-xs">{cat.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. TELESALES EXECUTIVE TERMINAL */}
      {activeSubTab === "telesales_dashboard" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-black text-white">Telesales Conversion &amp; Executive Incentive Terminal</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Telesales incentives are tied directly to collected bookings (10% of platform gross commission).
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 text-xs font-bold">
              3 WFH Executives Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {INITIAL_TELESALES_PERFORMANCE.map((exec) => (
              <div key={exec.executiveId} className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <img
                    src={exec.avatar}
                    alt={exec.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/50"
                  />
                  <div>
                    <h4 className="text-sm font-black text-white">{exec.name}</h4>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">{exec.executiveId}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Leads / Calls:</span>
                    <strong className="text-white font-mono">{exec.assignedLeads} / {exec.callsMade}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Quotations Sent:</span>
                    <strong className="text-indigo-300 font-mono">{exec.quotationsSent}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Confirmed Conversions:</span>
                    <strong className="text-emerald-400 font-mono">{exec.conversions} Bookings ({exec.conversionRatePercent}%)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Converted GMV:</span>
                    <strong className="text-white font-mono font-bold">₹{(exec.totalBookingValueINR / 100000).toFixed(2)}L</strong>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1.5">
                    <span className="text-emerald-400 font-bold">Executive Incentive Earned:</span>
                    <strong className="text-emerald-400 font-mono font-bold text-sm">
                      ₹{exec.executiveIncentiveEarnedINR.toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>

                <button
                  onClick={() => onToast(`Generated Incentive Payout Slip for ${exec.name}! 💸`)}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>View Monthly Incentive Ledger</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. LEAD ATTRIBUTION LEDGER */}
      {activeSubTab === "lead_attribution_ledger" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-black text-white">Full-Chain Lead &amp; Booking Attribution Ledger</h4>
                <p className="text-xs text-slate-400">
                  Lead ID → Campaign ID → Partner ID → Sales Executive → Booking ID → Commission Amount → Payout Status.
                </p>
              </div>
              <button
                onClick={() => onToast("Exported RFC-4180 Attribution Ledger CSV! 📊")}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export Ledger
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/90 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-700">
                  <tr>
                    <th className="p-3">Lead &amp; Attribution ID</th>
                    <th className="p-3">Campaign Source</th>
                    <th className="p-3">Partner &amp; Category</th>
                    <th className="p-3">Customer &amp; Pax</th>
                    <th className="p-3">Telesales Exec</th>
                    <th className="p-3">Booking GMV</th>
                    <th className="p-3">Commission (INR)</th>
                    <th className="p-3">Exec Incentive</th>
                    <th className="p-3">Settlement</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {attributedLeads.map((lead) => (
                    <tr key={lead.leadId} className="hover:bg-slate-800/60 transition-colors">
                      <td className="p-3">
                        <span className="font-mono text-emerald-400 font-bold block">{lead.leadId}</span>
                        <span className="text-[10px] text-slate-400 block">{lead.bookingId || "Pending Booking"}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-[10px] font-bold">
                          {lead.campaignSource}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{lead.campaignName}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-white block">{lead.partnerName}</span>
                        <span className="text-[10px] text-indigo-300">{lead.partnerCategory}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-white block">{lead.customerName}</span>
                        <span className="text-[10px] text-slate-400">{lead.customerDestination} ({lead.paxCount} Pax)</span>
                      </td>
                      <td className="p-3 text-slate-300">{lead.telesalesExecutiveName}</td>
                      <td className="p-3 font-mono font-bold text-white">
                        {lead.bookingValueINR ? `₹${lead.bookingValueINR.toLocaleString("en-IN")}` : "₹0"}
                      </td>
                      <td className="p-3 font-mono text-emerald-400 font-bold">
                        ₹{lead.grossCommissionINR.toLocaleString("en-IN")} ({lead.commissionPercent}%)
                      </td>
                      <td className="p-3 font-mono text-amber-300">
                        ₹{lead.telesalesIncentiveINR.toLocaleString("en-IN")}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            lead.settlementStatus === "Settled"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : lead.settlementStatus === "Reversed_Refund"
                              ? "bg-rose-500/20 text-rose-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {lead.settlementStatus.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {lead.settlementStatus === "Pending_Payment" && (
                            <button
                              onClick={() => handleSettleLead(lead.leadId)}
                              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold cursor-pointer"
                            >
                              Settle Escrow
                            </button>
                          )}
                          {lead.settlementStatus === "Settled" && (
                            <button
                              onClick={() => handleReverseRefund(lead.leadId)}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-rose-200 text-[10px] font-semibold cursor-pointer"
                              title="Reverse Commission if customer cancels"
                            >
                              Refund Reversal
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. QUALIFIED LEAD RULEBOOK */}
      {activeSubTab === "lead_qualification_rules" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <div>
              <h4 className="text-sm font-black text-white">Qualified Lead Verification Standards (8 Rules)</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                To protect travel partners from spam or bogus entries, leads become billable only when passing all 8 validation criteria.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {QUALIFIED_LEAD_RULES.map((rule) => (
                <div key={rule.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <strong className="text-xs text-white font-bold">{rule.label}</strong>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[9px] font-bold border border-emerald-800">
                      MANDATORY
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{rule.description}</p>
                  <div className="text-[10px] text-indigo-300 font-mono bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                    Rule: {rule.validationRule}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. SETTLEMENT PAYOUTS & REFUNDS */}
      {activeSubTab === "settlement_payouts" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-white">Partner Settlement Ledger &amp; Escrow Reconciliation</h4>
                <p className="text-xs text-slate-400">
                  Formula: Partner Payout = Total Booking Collected − Platform Conversion Commission.
                </p>
              </div>
              <button
                onClick={() => onToast("Triggered Instant Escrow UPI/IMPS Batch Payouts! 💳")}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
              >
                Execute Batch Payouts
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Total Net Partner Payouts Settled:</span>
                <strong className="text-emerald-400 text-sm font-mono font-bold">
                  ₹{totalPartnerSettled.toLocaleString("en-IN")}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Protected Reversals on Cancelled Trips:</span>
                <strong className="text-rose-400 text-sm font-mono font-bold">₹5,700 Reversed</strong>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
                ⚠️ Protection Clause: Platform commissions and sales incentives are paid out strictly post-trip or on confirmed non-refundable booking deposit receipt. In case of customer cancellation or refund, the commission and telesales incentive are automatically reversed.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
