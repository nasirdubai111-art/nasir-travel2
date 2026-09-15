import React, { useState } from "react";
import {
  CATEGORY_COMMISSION_RATES,
  B2B_COMMERCIAL_PLANS,
  INITIAL_ATTRIBUTED_LEADS,
  B2BAttributedLeadConversion,
} from "../../data/b2bCommissionTelesalesData";
import {
  Percent,
  PhoneCall,
  Coins,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

export function B2bTelesalesCommissionHub() {
  const [leads, setLeads] = useState<B2BAttributedLeadConversion[]>(INITIAL_ATTRIBUTED_LEADS);
  const [selectedLead, setSelectedLead] = useState<B2BAttributedLeadConversion | null>(null);
  const [simulatingDisbursement, setSimulatingDisbursement] = useState(false);
  const [disbursementMessage, setDisbursementMessage] = useState<string | null>(null);

  const totalCommissionEarned = leads.reduce(
    (sum, l) => sum + (l.netPlatformRevenueINR || 0),
    0
  );

  const handleDisburse = (leadId: string) => {
    setSimulatingDisbursement(true);
    setDisbursementMessage(`Executing Razorpay Route Instant Split Transfer for Lead #${leadId}...`);
    setTimeout(() => {
      setDisbursementMessage(
        `Split settlement completed: Partner commission disbursed into linked nodal escrow account. Razorpay transfer_id: tr_99214781.`
      );
      setSimulatingDisbursement(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-amber-950/60 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">B2B Commission &amp; Telesales Conversion Engine</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                5% - 20% Tier Matrix
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Razorpay Route automated split payment • Zero vendor default risk • Live telesales agent attribution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div>
            <span className="text-slate-500 block">Total Attributed Revenue</span>
            <span className="text-white font-bold">₹{(totalCommissionEarned / 1000).toFixed(0)}k</span>
          </div>
          <div>
            <span className="text-slate-500 block">Escrow Split</span>
            <span className="text-emerald-400 font-bold">T+0 Instant</span>
          </div>
        </div>
      </div>

      {disbursementMessage && (
        <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs font-mono text-emerald-300 animate-in fade-in flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{disbursementMessage}</span>
        </div>
      )}

      {/* Commission Rate Cards across 13 Verticals */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Category Commission Tiers (13 Verticals)
          </h4>
          <span className="text-xs text-slate-400">Standard Platform Policy</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORY_COMMISSION_RATES.slice(0, 6).map((cat, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 hover:border-slate-700 transition-all"
            >
              <span className="text-xs font-bold text-white block truncate">{cat.category}</span>
              <div className="flex items-baseline gap-1 text-emerald-400 font-black text-sm">
                <span>{cat.defaultCommissionPercent}%</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  ({cat.minCommissionPercent}-{cat.maxCommissionPercent}%)
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate">
                Avg: ₹{cat.averageBookingValueINR.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Attributed Telesales Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">
          Live Telesales Queue &amp; Commission Disbursal
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 border-b border-slate-800 uppercase text-[10px] font-mono">
              <tr>
                <th className="pb-3">Lead ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Campaign Source</th>
                <th className="pb-3">Partner Destination</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Booking Value</th>
                <th className="pb-3 text-right">Platform Fee</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {leads.map((lead) => (
                <tr key={lead.leadId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-mono text-indigo-400 font-bold">{lead.leadId}</td>
                  <td className="py-3">
                    <span className="text-white font-bold block">{lead.customerName}</span>
                    <span className="text-[10px] text-slate-500">{lead.customerPhone}</span>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                      {lead.campaignSource}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-slate-200 block">{lead.partnerName}</span>
                    <span className="text-[10px] text-slate-500">{lead.partnerCategory}</span>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      {lead.stage}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-white">
                    ₹{lead.bookingValueINR?.toLocaleString() || "Pending"}
                  </td>
                  <td className="py-3 text-right font-mono text-emerald-400 font-bold">
                    ₹{lead.netPlatformRevenueINR?.toLocaleString() || "0"}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDisburse(lead.leadId)}
                      disabled={simulatingDisbursement}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold transition-all cursor-pointer"
                    >
                      Disburse Split
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
